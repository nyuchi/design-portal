import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Read registry.json at module level (cached between requests in production)
function getRegistry() {
  const registryPath = path.join(process.cwd(), "registry.json")
  const raw = fs.readFileSync(registryPath, "utf-8")
  return JSON.parse(raw)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

  try {
    const registry = getRegistry()
    const item = registry.items.find(
      (i: { name: string }) => i.name === name
    )

    if (!item) {
      return NextResponse.json(
        { error: `Component "${name}" not found in registry` },
        { status: 404 }
      )
    }

    // Build the registry-item response
    const registryItem: Record<string, unknown> = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      description: item.description || "",
      dependencies: item.dependencies || [],
      registryDependencies: item.registryDependencies || [],
      files: [] as Array<{ path: string; type: string; content: string }>,
    }

    // Read each file and embed its content
    for (const file of item.files) {
      const filePath = path.join(process.cwd(), file.path)

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`)
        continue
      }

      const content = fs.readFileSync(filePath, "utf-8")
      ;(registryItem.files as Array<{ path: string; type: string; content: string }>).push({
        path: file.path,
        type: file.type,
        content,
      })
    }

    return NextResponse.json(registryItem, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Registry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Search } from "lucide-react"

const components = [
  { name: "accordion", category: "layout" },
  { name: "alert", category: "feedback" },
  { name: "alert-dialog", category: "overlay" },
  { name: "aspect-ratio", category: "layout" },
  { name: "avatar", category: "data" },
  { name: "badge", category: "data" },
  { name: "breadcrumb", category: "navigation" },
  { name: "button", category: "action" },
  { name: "button-group", category: "action" },
  { name: "calendar", category: "input" },
  { name: "card", category: "layout" },
  { name: "carousel", category: "layout" },
  { name: "chart", category: "data" },
  { name: "checkbox", category: "input" },
  { name: "collapsible", category: "layout" },
  { name: "combobox", category: "input" },
  { name: "command", category: "input" },
  { name: "context-menu", category: "overlay" },
  { name: "dialog", category: "overlay" },
  { name: "direction", category: "utility" },
  { name: "drawer", category: "overlay" },
  { name: "dropdown-menu", category: "overlay" },
  { name: "empty", category: "feedback" },
  { name: "field", category: "input" },
  { name: "form", category: "input" },
  { name: "hover-card", category: "overlay" },
  { name: "input", category: "input" },
  { name: "input-group", category: "input" },
  { name: "input-otp", category: "input" },
  { name: "item", category: "layout" },
  { name: "kbd", category: "data" },
  { name: "label", category: "input" },
  { name: "menubar", category: "navigation" },
  { name: "native-select", category: "input" },
  { name: "navigation-menu", category: "navigation" },
  { name: "pagination", category: "navigation" },
  { name: "popover", category: "overlay" },
  { name: "progress", category: "feedback" },
  { name: "radio-group", category: "input" },
  { name: "resizable", category: "layout" },
  { name: "scroll-area", category: "layout" },
  { name: "select", category: "input" },
  { name: "separator", category: "layout" },
  { name: "sheet", category: "overlay" },
  { name: "sidebar", category: "navigation" },
  { name: "skeleton", category: "feedback" },
  { name: "slider", category: "input" },
  { name: "sonner", category: "feedback" },
  { name: "spinner", category: "feedback" },
  { name: "switch", category: "input" },
  { name: "table", category: "data" },
  { name: "tabs", category: "navigation" },
  { name: "textarea", category: "input" },
  { name: "toast", category: "feedback" },
  { name: "toaster", category: "feedback" },
  { name: "toggle", category: "action" },
  { name: "toggle-group", category: "action" },
  { name: "tooltip", category: "overlay" },
  { name: "use-mobile", category: "utility" },
  { name: "use-toast", category: "utility" },
  { name: "utils", category: "utility" },
]

const categories = [
  "all",
  "input",
  "action",
  "data",
  "feedback",
  "layout",
  "navigation",
  "overlay",
  "utility",
]

function CatalogItem({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  const installCmd = `npx shadcn@latest add https://registry.mukoko.com/api/r/${name}`

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(installCmd)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="group flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition-colors hover:border-accent/30 hover:bg-card/80"
    >
      <span className="font-mono text-sm text-foreground">{name}</span>
      <span className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:text-foreground">
        {copied ? (
          <Check className="size-3.5 text-accent" />
        ) : (
          <Copy className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </span>
    </button>
  )
}

export function ComponentCatalog() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filtered = components.filter((c) => {
    const matchesSearch = c.name.includes(search.toLowerCase())
    const matchesCategory = activeCategory === "all" || c.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <section id="catalog" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-medium text-accent">Full catalog</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            All {components.length} components
          </h2>
          <p className="mt-4 text-muted-foreground">
            Click any component to copy its install command.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  activeCategory === cat
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((c) => (
            <CatalogItem key={c.name} name={c.name} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-sm text-muted-foreground">No components match your filter.</p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Badge variant="outline" className="gap-1.5 text-muted-foreground">
            <span className="font-mono">{filtered.length}</span> of {components.length} shown
          </Badge>
        </div>
      </div>
    </section>
  )
}

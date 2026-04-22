import { getArchitectureFrontendAxes, getArchitectureFrontendLayers } from "@/lib/db"
// Direct import is fine: `architecture-canvas.tsx` carries `"use client"`,
// so Next.js evaluates it only in the browser. Three.js never runs during
// SSR. Next.js automatically code-splits the client bundle.
import { ArchitectureCanvas } from "./architecture-canvas"

/**
 * Server wrapper for the interactive 3D architecture explorer.
 *
 * Fetches layer + axis rows from Supabase via `getArchitectureFrontend*`
 * (which transparently falls back to the canonical seed-equivalent
 * dataset until issue #46's tables are populated). Hands the data to the
 * client-side three.js canvas, which lets the user rotate the model and
 * click any axis or layer to see its description, covenant, and
 * implementation rules in an HTML overlay tooltip.
 */
export async function ArchitectureExplorer() {
  const [axes, layers] = await Promise.all([
    getArchitectureFrontendAxes(),
    getArchitectureFrontendLayers(),
  ])

  return <ArchitectureCanvas axes={axes} layers={layers} />
}

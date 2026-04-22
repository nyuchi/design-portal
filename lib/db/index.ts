/**
 * Nyuchi Design Portal Document Store — Supabase Backend
 *
 * Replaces hardcoded JSON files (registry.json, component-docs.ts) with
 * Supabase Postgres. All registry data lives in three tables:
 *
 *   components       — Component metadata (name, deps, files, category)
 *   component_docs   — Documentation (use cases, variants, features)
 *   component_demos  — Demo configuration
 *
 * Architecture:
 *   Browser  →  Next.js API routes  →  Supabase (Postgres + RLS)
 *                                         ↑
 *                                    Public read (anon key)
 *                                    Write via service_role key
 *
 * Env vars:
 *   NEXT_PUBLIC_SUPABASE_URL      — Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY — Public anon key (read-only via RLS)
 *   SUPABASE_SERVICE_ROLE_KEY     — Service role key (write access, server only)
 *
 * Usage:
 *   import { getComponent, getAllComponents } from "@/lib/db"
 *   const button = await getComponent("button")
 */

import { createClient } from "@supabase/supabase-js"
import type {
  ComponentRow,
  ComponentDocRow,
  ComponentDemoRow,
  ComponentWithDocs,
  ComponentInsert,
  ComponentDocInsert,
  ComponentDemoInsert,
  DatabaseInfo,
  BrandMineralRow,
  BrandMineralInsert,
  BrandSemanticColorRow,
  BrandSemanticColorInsert,
  BrandTypographyRow,
  BrandTypographyInsert,
  BrandSpacingRow,
  BrandSpacingInsert,
  BrandEcosystemRow,
  BrandEcosystemInsert,
  BrandMetaRow,
  BrandMetaInsert,
  ArchitecturePrincipleRow,
  ArchitecturePrincipleInsert,
  ArchitectureFrameworkRow,
  ArchitectureFrameworkInsert,
  ArchitectureDataLayerRow,
  ArchitectureDataLayerInsert,
  ArchitectureCloudLayerRow,
  ArchitectureCloudLayerInsert,
  ArchitecturePipelineRow,
  ArchitecturePipelineInsert,
  ArchitectureDataOwnershipRow,
  ArchitectureDataOwnershipInsert,
  ArchitectureSovereigntyRow,
  ArchitectureSovereigntyInsert,
  ArchitectureRemovedRow,
  ArchitectureRemovedInsert,
  AiInstructionRow,
  AiInstructionInsert,
  DocumentationPageRow,
  DocumentationPageInsert,
  ChangelogRow,
  ChangelogInsert,
  ComponentVersionRow,
  FundiIssueRow,
  FundiIssueInsert,
  FundiIssueFilters,
  DesignTokens,
  ArchitectureFrontendAxisRow,
  ArchitectureFrontendLayerRow,
} from "./types"

// ── Supabase clients ────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

type SupabaseClient = ReturnType<typeof createClient>

/**
 * Public client (uses anon key, respects RLS).
 * Safe for client-side and server-side reads.
 */
let _publicClient: SupabaseClient | null = null

export function getPublicClient(): SupabaseClient {
  if (!_publicClient) {
    _publicClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _publicClient
}

/**
 * Admin client (uses service_role key, bypasses RLS).
 * Server-only — for seed scripts and write operations.
 */
let _adminClient: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  if (!_adminClient) {
    _adminClient = createClient(supabaseUrl, supabaseServiceKey)
  }
  return _adminClient
}

/**
 * Check if Supabase is configured.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// ── Component queries ───────────────────────────────────────────────

/**
 * Get a single component by name.
 */
export async function getComponent(name: string): Promise<ComponentRow | null> {
  const { data, error } = await getPublicClient()
    .from("components")
    .select("*")
    .eq("name", name)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null // not found
    throw new Error(error.message)
  }
  return data as unknown as ComponentRow
}

/**
 * Get all components, sorted by name.
 */
export async function getAllComponents(): Promise<ComponentRow[]> {
  const { data, error } = await getPublicClient().from("components").select("*").order("name")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ComponentRow[]
}

/**
 * Get components by category.
 */
export async function getComponentsByCategory(category: string): Promise<ComponentRow[]> {
  const { data, error } = await getPublicClient()
    .from("components")
    .select("*")
    .eq("category", category)
    .order("name")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ComponentRow[]
}

/**
 * Get components by layer.
 */
export async function getComponentsByLayer(layer: string): Promise<ComponentRow[]> {
  const { data, error } = await getPublicClient()
    .from("components")
    .select("*")
    .eq("layer", layer)
    .order("name")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ComponentRow[]
}

/**
 * Search components by name or description (case-insensitive).
 */
export async function searchComponents(query: string): Promise<ComponentRow[]> {
  const { data, error } = await getPublicClient()
    .from("components")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("name")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ComponentRow[]
}

// ── Component documentation queries ─────────────────────────────────

/**
 * Get documentation for a component.
 */
export async function getComponentDoc(name: string): Promise<ComponentDocRow | null> {
  const { data, error } = await getPublicClient()
    .from("component_docs")
    .select("*")
    .eq("component_name", name)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data as unknown as ComponentDocRow
}

/**
 * Get all component documentation.
 */
export async function getAllComponentDocs(): Promise<ComponentDocRow[]> {
  const { data, error } = await getPublicClient().from("component_docs").select("*")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ComponentDocRow[]
}

// ── Demo queries ────────────────────────────────────────────────────

/**
 * Check if a component has a demo.
 */
export async function hasDemoFor(name: string): Promise<boolean> {
  const { data } = await getPublicClient()
    .from("component_demos")
    .select("has_demo")
    .eq("component_name", name)
    .single()

  return (data as unknown as { has_demo: boolean } | null)?.has_demo ?? false
}

/**
 * Get all component names that have demos.
 */
export async function getDemoNames(): Promise<string[]> {
  const { data, error } = await getPublicClient()
    .from("component_demos")
    .select("component_name")
    .eq("has_demo", true)

  if (error) throw new Error(error.message)
  return ((data ?? []) as unknown as Array<{ component_name: string }>).map((d) => d.component_name)
}

// ── Enriched queries ────────────────────────────────────────────────

/**
 * Get a component with its documentation and demo info.
 */
export async function getComponentWithDocs(name: string): Promise<ComponentWithDocs | null> {
  const component = await getComponent(name)
  if (!component) return null

  const [docs, demo] = await Promise.all([
    getComponentDoc(name),
    getPublicClient()
      .from("component_demos")
      .select("*")
      .eq("component_name", name)
      .single()
      .then(({ data }) => data as unknown as ComponentDemoRow | null),
  ])

  return { ...component, docs, demo }
}

/**
 * Get all components with their docs (for catalog pages).
 */
export async function getAllComponentsWithDocs(): Promise<ComponentWithDocs[]> {
  const [components, docs, demos] = await Promise.all([
    getAllComponents(),
    getAllComponentDocs(),
    getPublicClient()
      .from("component_demos")
      .select("*")
      .eq("has_demo", true)
      .then(({ data }) => (data ?? []) as unknown as ComponentDemoRow[]),
  ])

  const docMap = new Map(docs.map((d) => [d.component_name, d]))
  const demoMap = new Map(demos.map((d) => [d.component_name, d]))

  return components.map((component) => ({
    ...component,
    docs: docMap.get(component.name) ?? null,
    demo: demoMap.get(component.name) ?? null,
  }))
}

// ── Write operations (server-only, uses service_role) ───────────────

/**
 * Upsert a component (insert or update on conflict).
 */
export async function upsertComponent(component: ComponentInsert): Promise<ComponentRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("components")
    .upsert(component, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ComponentRow
}

/**
 * Upsert component documentation.
 */
export async function upsertComponentDoc(doc: ComponentDocInsert): Promise<ComponentDocRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("component_docs")
    .upsert(doc, { onConflict: "component_name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ComponentDocRow
}

/**
 * Upsert a component demo.
 */
export async function upsertComponentDemo(demo: ComponentDemoInsert): Promise<ComponentDemoRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("component_demos")
    .upsert(demo, { onConflict: "component_name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ComponentDemoRow
}

/**
 * Delete a component and its docs/demos (cascade).
 */
export async function deleteComponent(name: string): Promise<void> {
  const { error } = await getAdminClient().from("components").delete().eq("name", name)

  if (error) throw new Error(error.message)
}

// ── Registry count queries ──────────────────────────────────────────

export interface RegistryCounts {
  total: number
  ui: number
  blocks: number
  hooks: number
  lib: number
}

/**
 * Get live component counts from the database, grouped by registry_type.
 * Used to replace hardcoded numbers in landing page components.
 * Returns zeros if database is not configured or not seeded.
 */
export async function getRegistryCounts(): Promise<RegistryCounts> {
  if (!isSupabaseConfigured()) {
    return { total: 0, ui: 0, blocks: 0, hooks: 0, lib: 0 }
  }

  try {
    const [total, ui, blocks, hooks, lib] = await Promise.all([
      getPublicClient().from("components").select("*", { count: "exact", head: true }),
      getPublicClient()
        .from("components")
        .select("*", { count: "exact", head: true })
        .eq("registry_type", "registry:ui"),
      getPublicClient()
        .from("components")
        .select("*", { count: "exact", head: true })
        .eq("registry_type", "registry:block"),
      getPublicClient()
        .from("components")
        .select("*", { count: "exact", head: true })
        .eq("registry_type", "registry:hook"),
      getPublicClient()
        .from("components")
        .select("*", { count: "exact", head: true })
        .eq("registry_type", "registry:lib"),
    ])

    return {
      total: total.count ?? 0,
      ui: ui.count ?? 0,
      blocks: blocks.count ?? 0,
      hooks: hooks.count ?? 0,
      lib: lib.count ?? 0,
    }
  } catch {
    return { total: 0, ui: 0, blocks: 0, hooks: 0, lib: 0 }
  }
}

// ── Database info ───────────────────────────────────────────────────

/**
 * Get database status and counts.
 */
export async function getDatabaseInfo(): Promise<DatabaseInfo> {
  try {
    const [components, docs, demos] = await Promise.all([
      getPublicClient().from("components").select("*", { count: "exact", head: true }),
      getPublicClient().from("component_docs").select("*", { count: "exact", head: true }),
      getPublicClient().from("component_demos").select("*", { count: "exact", head: true }),
    ])

    return {
      provider: "supabase",
      components: components.count ?? 0,
      docs: docs.count ?? 0,
      demos: demos.count ?? 0,
      status: "connected",
    }
  } catch {
    return {
      provider: "supabase",
      components: 0,
      docs: 0,
      demos: 0,
      status: "error",
    }
  }
}

// ── Brand queries ──────────────────────────────────────────────────

/**
 * Get all brand minerals, sorted by sort_order.
 */
export async function getMinerals(): Promise<BrandMineralRow[]> {
  const { data, error } = await getPublicClient()
    .from("brand_minerals")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BrandMineralRow[]
}

/**
 * Get all semantic colors.
 */
export async function getSemanticColors(): Promise<BrandSemanticColorRow[]> {
  const { data, error } = await getPublicClient()
    .from("brand_semantic_colors")
    .select("*")
    .order("name")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BrandSemanticColorRow[]
}

/**
 * Get semantic colors filtered by type (e.g. 'semantic' or 'background').
 */
export async function getSemanticColorsByType(colorType: string): Promise<BrandSemanticColorRow[]> {
  const { data, error } = await getPublicClient()
    .from("brand_semantic_colors")
    .select("*")
    .eq("color_type", colorType)
    .order("name")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BrandSemanticColorRow[]
}

/**
 * Get all typography entries, sorted by sort_order.
 */
export async function getTypography(): Promise<BrandTypographyRow[]> {
  const { data, error } = await getPublicClient()
    .from("brand_typography")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BrandTypographyRow[]
}

/**
 * Get typography entries by type ('font' or 'scale').
 */
export async function getTypographyByType(entryType: string): Promise<BrandTypographyRow[]> {
  const { data, error } = await getPublicClient()
    .from("brand_typography")
    .select("*")
    .eq("entry_type", entryType)
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BrandTypographyRow[]
}

/**
 * Get all spacing tokens, sorted by sort_order.
 */
export async function getSpacing(): Promise<BrandSpacingRow[]> {
  const { data, error } = await getPublicClient()
    .from("brand_spacing")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BrandSpacingRow[]
}

/**
 * Get all ecosystem brands, sorted by sort_order.
 */
export async function getEcosystemBrands(): Promise<BrandEcosystemRow[]> {
  const { data, error } = await getPublicClient()
    .from("brand_ecosystem")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BrandEcosystemRow[]
}

/**
 * Get brand metadata (single row).
 */
export async function getBrandMeta(): Promise<BrandMetaRow | null> {
  const { data, error } = await getPublicClient().from("brand_meta").select("*").limit(1).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data as unknown as BrandMetaRow
}

/**
 * Get the full brand system from DB, assembled into the same shape as BRAND_SYSTEM.
 */
export async function getBrandSystem(): Promise<{
  minerals: BrandMineralRow[]
  semanticColors: BrandSemanticColorRow[]
  backgrounds: BrandSemanticColorRow[]
  typography: BrandTypographyRow[]
  spacing: BrandSpacingRow[]
  ecosystem: BrandEcosystemRow[]
  meta: BrandMetaRow | null
} | null> {
  try {
    const [minerals, semanticColors, backgrounds, typography, spacing, ecosystem, meta] =
      await Promise.all([
        getMinerals(),
        getSemanticColorsByType("semantic"),
        getSemanticColorsByType("background"),
        getTypography(),
        getSpacing(),
        getEcosystemBrands(),
        getBrandMeta(),
      ])

    if (minerals.length === 0 && !meta) return null

    return { minerals, semanticColors, backgrounds, typography, spacing, ecosystem, meta }
  } catch {
    return null
  }
}

// ── Architecture queries ───────────────────────────────────────────

/**
 * Get all architecture principles, sorted by sort_order.
 */
export async function getArchitecturePrinciples(): Promise<ArchitecturePrincipleRow[]> {
  const { data, error } = await getPublicClient()
    .from("architecture_principles")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ArchitecturePrincipleRow[]
}

/**
 * Get the framework decision (single row).
 */
export async function getFrameworkDecision(): Promise<ArchitectureFrameworkRow | null> {
  const { data, error } = await getPublicClient()
    .from("architecture_framework")
    .select("*")
    .limit(1)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data as unknown as ArchitectureFrameworkRow
}

/**
 * Get local data layer technologies, sorted by sort_order.
 */
export async function getLocalDataLayer(): Promise<ArchitectureDataLayerRow[]> {
  const { data, error } = await getPublicClient()
    .from("architecture_data_layer")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ArchitectureDataLayerRow[]
}

/**
 * Get cloud layer services, sorted by sort_order.
 */
export async function getCloudLayer(): Promise<ArchitectureCloudLayerRow[]> {
  const { data, error } = await getPublicClient()
    .from("architecture_cloud_layer")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ArchitectureCloudLayerRow[]
}

/**
 * Get pipeline stages, sorted by sort_order.
 */
export async function getPipeline(): Promise<ArchitecturePipelineRow[]> {
  const { data, error } = await getPublicClient()
    .from("architecture_pipeline")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ArchitecturePipelineRow[]
}

/**
 * Get data ownership rules, sorted by sort_order.
 */
export async function getDataOwnership(): Promise<ArchitectureDataOwnershipRow[]> {
  const { data, error } = await getPublicClient()
    .from("architecture_data_ownership")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ArchitectureDataOwnershipRow[]
}

/**
 * Get sovereignty assessments, sorted by sort_order.
 */
export async function getSovereignty(): Promise<ArchitectureSovereigntyRow[]> {
  const { data, error } = await getPublicClient()
    .from("architecture_sovereignty")
    .select("*")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ArchitectureSovereigntyRow[]
}

/**
 * Get removed technologies.
 */
export async function getRemovedTechnologies(): Promise<ArchitectureRemovedRow[]> {
  const { data, error } = await getPublicClient()
    .from("architecture_removed")
    .select("*")
    .order("name")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ArchitectureRemovedRow[]
}

// ── Brand write operations (server-only) ───────────────────────────

/**
 * Upsert a brand mineral.
 */
export async function upsertBrandMineral(mineral: BrandMineralInsert): Promise<BrandMineralRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("brand_minerals")
    .upsert(mineral, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BrandMineralRow
}

/**
 * Upsert a semantic color.
 */
export async function upsertBrandSemanticColor(
  color: BrandSemanticColorInsert
): Promise<BrandSemanticColorRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("brand_semantic_colors")
    .upsert(color, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BrandSemanticColorRow
}

/**
 * Upsert a typography entry.
 */
export async function upsertBrandTypography(
  entry: BrandTypographyInsert
): Promise<BrandTypographyRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("brand_typography")
    .upsert(entry, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BrandTypographyRow
}

/**
 * Upsert a spacing token.
 */
export async function upsertBrandSpacing(spacing: BrandSpacingInsert): Promise<BrandSpacingRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("brand_spacing")
    .upsert(spacing, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BrandSpacingRow
}

/**
 * Upsert an ecosystem brand.
 */
export async function upsertBrandEcosystem(
  brand: BrandEcosystemInsert
): Promise<BrandEcosystemRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("brand_ecosystem")
    .upsert(brand, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BrandEcosystemRow
}

/**
 * Upsert brand metadata (single row — deletes existing then inserts).
 */
export async function upsertBrandMeta(meta: BrandMetaInsert): Promise<BrandMetaRow> {
  const admin = getAdminClient()

  // Delete existing rows (single row table)
  await admin.from("brand_meta").delete().neq("id", 0)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any).from("brand_meta").insert(meta).select().single()

  if (error) throw new Error(error.message)
  return data as BrandMetaRow
}

// ── Architecture write operations (server-only) ────────────────────

/**
 * Upsert an architecture principle.
 */
export async function upsertArchitecturePrinciple(
  principle: ArchitecturePrincipleInsert
): Promise<ArchitecturePrincipleRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("architecture_principles")
    .upsert(principle, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ArchitecturePrincipleRow
}

/**
 * Upsert the framework decision.
 */
export async function upsertArchitectureFramework(
  framework: ArchitectureFrameworkInsert
): Promise<ArchitectureFrameworkRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("architecture_framework")
    .upsert(framework, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ArchitectureFrameworkRow
}

/**
 * Upsert a data layer technology.
 */
export async function upsertArchitectureDataLayer(
  tech: ArchitectureDataLayerInsert
): Promise<ArchitectureDataLayerRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("architecture_data_layer")
    .upsert(tech, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ArchitectureDataLayerRow
}

/**
 * Upsert a cloud layer service.
 */
export async function upsertArchitectureCloudLayer(
  service: ArchitectureCloudLayerInsert
): Promise<ArchitectureCloudLayerRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("architecture_cloud_layer")
    .upsert(service, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ArchitectureCloudLayerRow
}

/**
 * Upsert a pipeline stage.
 */
export async function upsertArchitecturePipeline(
  stage: ArchitecturePipelineInsert
): Promise<ArchitecturePipelineRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("architecture_pipeline")
    .upsert(stage, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ArchitecturePipelineRow
}

/**
 * Upsert a data ownership rule.
 */
export async function upsertArchitectureDataOwnership(
  rule: ArchitectureDataOwnershipInsert
): Promise<ArchitectureDataOwnershipRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("architecture_data_ownership")
    .upsert(rule, { onConflict: "category" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ArchitectureDataOwnershipRow
}

/**
 * Upsert a sovereignty assessment.
 */
export async function upsertArchitectureSovereignty(
  assessment: ArchitectureSovereigntyInsert
): Promise<ArchitectureSovereigntyRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("architecture_sovereignty")
    .upsert(assessment, { onConflict: "technology" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ArchitectureSovereigntyRow
}

/**
 * Upsert a removed technology.
 */
export async function upsertArchitectureRemoved(
  removed: ArchitectureRemovedInsert
): Promise<ArchitectureRemovedRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("architecture_removed")
    .upsert(removed, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ArchitectureRemovedRow
}

// ── AI instruction queries ─────────────────────────────────────────

/**
 * Get an AI instruction by name (e.g., "nyuchi-mcp-system-prompt").
 */
export async function getAiInstruction(name: string): Promise<AiInstructionRow | null> {
  const { data, error } = await getPublicClient()
    .from("ai_instructions")
    .select("*")
    .eq("name", name)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data as unknown as AiInstructionRow
}

/**
 * Get an AI instruction by target audience (mcp-server, claude, github-copilot, cursor).
 */
export async function getAiInstructionByTarget(target: string): Promise<AiInstructionRow | null> {
  const { data, error } = await getPublicClient()
    .from("ai_instructions")
    .select("*")
    .eq("target", target)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data as unknown as AiInstructionRow
}

/**
 * Get all AI instructions.
 */
export async function getAllAiInstructions(): Promise<AiInstructionRow[]> {
  const { data, error } = await getPublicClient().from("ai_instructions").select("*").order("name")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as AiInstructionRow[]
}

/**
 * Upsert an AI instruction (admin only).
 */
export async function upsertAiInstruction(
  instruction: AiInstructionInsert
): Promise<AiInstructionRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("ai_instructions")
    .upsert(instruction, { onConflict: "name" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as AiInstructionRow
}

// ── Documentation page queries ──────────────────────────────────────

/**
 * Get a documentation page by slug.
 */
export async function getDocumentationPage(slug: string): Promise<DocumentationPageRow | null> {
  const { data, error } = await getPublicClient()
    .from("documentation_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data as unknown as DocumentationPageRow
}

/**
 * Get all published documentation pages, grouped by category and sort_order.
 */
export async function getAllDocumentationPages(): Promise<DocumentationPageRow[]> {
  const { data, error } = await getPublicClient()
    .from("documentation_pages")
    .select("*")
    .eq("status", "published")
    .order("category")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as DocumentationPageRow[]
}

/**
 * Get documentation pages by category.
 */
export async function getDocumentationPagesByCategory(
  category: string
): Promise<DocumentationPageRow[]> {
  const { data, error } = await getPublicClient()
    .from("documentation_pages")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .order("sort_order")

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as DocumentationPageRow[]
}

/**
 * Upsert a documentation page (admin only).
 */
export async function upsertDocumentationPage(
  page: DocumentationPageInsert
): Promise<DocumentationPageRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("documentation_pages")
    .upsert(page, { onConflict: "slug" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as DocumentationPageRow
}

// ── Changelog queries ───────────────────────────────────────────────

/**
 * Get all changelog entries, most recent first.
 */
export async function getChangelogEntries(): Promise<ChangelogRow[]> {
  const { data, error } = await getPublicClient()
    .from("changelog")
    .select("*")
    .order("released_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ChangelogRow[]
}

/**
 * Get a single changelog entry by version.
 */
export async function getChangelogByVersion(version: string): Promise<ChangelogRow | null> {
  const { data, error } = await getPublicClient()
    .from("changelog")
    .select("*")
    .eq("version", version)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data as unknown as ChangelogRow
}

/**
 * Get the latest released version string.
 */
export async function getLatestVersion(): Promise<string | null> {
  const { data, error } = await getPublicClient()
    .from("changelog")
    .select("version")
    .order("released_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return (data as unknown as { version: string } | null)?.version ?? null
}

/**
 * Upsert a changelog entry (admin only).
 */
export async function upsertChangelog(entry: ChangelogInsert): Promise<ChangelogRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("changelog")
    .upsert(entry, { onConflict: "version" })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ChangelogRow
}

// ── Component version queries ───────────────────────────────────────

/**
 * Get version history for a component, most recent first.
 */
export async function getComponentVersions(componentName: string): Promise<ComponentVersionRow[]> {
  const { data, error } = await getPublicClient()
    .from("component_versions")
    .select("*")
    .eq("component_name", componentName)
    .order("released_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ComponentVersionRow[]
}

/**
 * Get a specific component version.
 */
export async function getComponentVersion(
  componentName: string,
  version: string
): Promise<ComponentVersionRow | null> {
  const { data, error } = await getPublicClient()
    .from("component_versions")
    .select("*")
    .eq("component_name", componentName)
    .eq("version", version)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data as unknown as ComponentVersionRow
}

// ── Fundi issue queries ─────────────────────────────────────────────

/**
 * Get Fundi issues, optionally filtered.
 */
export async function getFundiIssues(filters?: FundiIssueFilters): Promise<FundiIssueRow[]> {
  let query = getPublicClient().from("fundi_issues").select("*")

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.severity) query = query.eq("severity", filters.severity)
  if (filters?.component_name) query = query.eq("component_name", filters.component_name)
  if (filters?.layer) query = query.eq("layer", filters.layer)

  query = query.order("created_at", { ascending: false })
  if (filters?.limit) query = query.limit(filters.limit)

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as FundiIssueRow[]
}

/**
 * Get a Fundi issue by id.
 */
export async function getFundiIssue(id: number): Promise<FundiIssueRow | null> {
  const { data, error } = await getPublicClient()
    .from("fundi_issues")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data as unknown as FundiIssueRow
}

/**
 * Create a Fundi issue (admin/server use only).
 */
export async function createFundiIssue(input: FundiIssueInsert): Promise<FundiIssueRow> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getAdminClient() as any)
    .from("fundi_issues")
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as FundiIssueRow
}

/**
 * Get aggregate stats about Fundi issues (for /api/v1/fundi/stats).
 */
export async function getFundiStats(): Promise<{
  total: number
  open: number
  resolved: number
  byLayer: Record<string, number>
}> {
  const { data, error } = await getPublicClient().from("fundi_issues").select("status, layer")

  if (error) throw new Error(error.message)
  const rows = (data ?? []) as unknown as Array<{ status: string; layer: string | null }>

  const byLayer: Record<string, number> = {}
  let open = 0
  let resolved = 0
  for (const row of rows) {
    if (row.status === "open") open++
    if (row.status === "resolved") resolved++
    const key = row.layer ?? "unknown"
    byLayer[key] = (byLayer[key] ?? 0) + 1
  }

  return { total: rows.length, open, resolved, byLayer }
}

// ── Design token queries (from nyuchi-tokens component) ─────────────

/**
 * Get the design tokens payload from the nyuchi-tokens component's source_code.
 *
 * In the migrated schema, design tokens (minerals, semantic colors, typography,
 * spacing, radii) live as a JSON payload in `components.source_code` where
 * `name = 'nyuchi-tokens'` — not in the legacy brand_* tables.
 *
 * Returns null if the component row is missing or source_code doesn't parse.
 */
export async function getDesignTokens(): Promise<DesignTokens | null> {
  const { data, error } = await getPublicClient()
    .from("components")
    .select("source_code")
    .eq("name", "nyuchi-tokens")
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }

  const source = (data as unknown as { source_code: string | null } | null)?.source_code
  if (!source) return null

  try {
    return JSON.parse(source) as DesignTokens
  } catch {
    return null
  }
}

// ── Layer summary query ─────────────────────────────────────────────

export interface LayerSummary {
  layer: string
  total: number
  byCategory: Record<string, number>
  components: Array<{ name: string; category: string | null; description: string }>
}

/**
 * Get a summary of components in a given architecture layer.
 * Used by the MCP server's get_layer_summary tool.
 */
export async function getLayerSummary(layer: string): Promise<LayerSummary> {
  const components = await getComponentsByLayer(layer)

  const byCategory: Record<string, number> = {}
  for (const c of components) {
    const key = c.category ?? "uncategorized"
    byCategory[key] = (byCategory[key] ?? 0) + 1
  }

  return {
    layer,
    total: components.length,
    byCategory,
    components: components.map((c) => ({
      name: c.name,
      category: c.category,
      description: c.description,
    })),
  }
}

// ── Component links (RPC wrapper) ───────────────────────────────────

export interface ComponentLink {
  url: string
  kind: string
  title?: string
}

/**
 * Get portal URLs for a component via the Supabase RPC `get_component_links`.
 * Falls back to canonical portal URLs if the RPC is not available.
 */
export async function getComponentLinks(name: string): Promise<ComponentLink[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getPublicClient() as any).rpc("get_component_links", {
    component_name: name,
  })

  if (!error && Array.isArray(data)) {
    return data as ComponentLink[]
  }

  // Fallback: canonical URL pattern for the portal
  return [
    { url: `https://design.nyuchi.com/components/${name}`, kind: "portal" },
    { url: `https://design.nyuchi.com/api/v1/ui/${name}`, kind: "api" },
  ]
}

// ── 3D Frontend Architecture — issue #46 (`architecture_frontend_*`) ──
//
// The `architecture_frontend_layers` (10 rows) and `architecture_frontend_axes`
// (5 rows) tables are tracked in issue #46. Until that migration ships,
// these fetchers transparently fall back to the canonical hardcoded
// dataset that mirrors the seed data #46 will load. Consumers (e.g. the
// landing-page Three.js architecture explorer) call these without caring
// whether the data is live or fallback. Once the tables are populated
// the fallback never executes.

const FALLBACK_AXES: ArchitectureFrontendAxisRow[] = [
  {
    id: 1,
    name: "X-axis",
    title: "Horizontal Composition Flow",
    description:
      "The build axis. Primitives compose into brand components, brand into pages, pages into the shell. What the user sees.",
    geometry: "horizontal",
    metaphor: "Left-to-right assembly: small parts become bigger parts become the whole product.",
    sort_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    name: "Y-axis",
    title: "Vertical Infrastructure",
    description:
      "The plumbing axis. Tokens, safety, and resilience flow through every X-axis layer like wiring through every room of a house.",
    geometry: "vertical",
    metaphor:
      "Foundations up: design decisions, safety gates, and resilience patterns thread through every visible layer.",
    sort_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: 3,
    name: "Z-axis",
    title: "Depth Observation",
    description:
      "The watching axis. Assurance observes everything on X and Y without being inside anything.",
    geometry: "depth",
    metaphor:
      "From above the build: telemetry and assertions watch the running system without intruding.",
    sort_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: 4,
    name: "Outside",
    title: "Outside Actors",
    description: "Beyond the build. Fundi acts on the system autonomously — heals what L8 finds.",
    geometry: "external",
    metaphor: "An artisan who lives outside the workshop and shows up to repair what's broken.",
    sort_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: 5,
    name: "Documentation",
    title: "Documentation",
    description:
      "The system describing itself. Docs engine, AI context, changelog renderer, public docs API.",
    geometry: "external",
    metaphor: "A mirror the system holds up to itself so the truth never lives outside the source.",
    sort_order: 5,
    created_at: "",
    updated_at: "",
  },
]

const FALLBACK_LAYERS: ArchitectureFrontendLayerRow[] = [
  {
    id: 1,
    layer_number: 1,
    sub_label: "tokens",
    title: "Design Tokens",
    axis_name: "Y-axis",
    role: "The CSS-variable source for every other layer.",
    description:
      "Five African Minerals palette, semantic colors, typography, spacing, radii — all defined exactly once as CSS custom properties.",
    covenant: "Design decisions are data, not code.",
    stakeholder: "Design + Brand",
    implementation_rules: ["CSS values live only here — every other layer consumes via var()"],
    sort_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    layer_number: 2,
    sub_label: "primitive",
    title: "Primitives",
    axis_name: "X-axis",
    role: "Single-purpose UI atoms. Buttons, inputs, badges, separators.",
    description:
      "CVA + Radix + cn() pattern, no business logic, no harness imports. Anything composable starts here.",
    covenant: "A primitive does one thing well.",
    stakeholder: "Component authors",
    implementation_rules: [
      "Never imports useNyuchiHarness",
      "Uses cn() for classNames",
      "Carries data-slot",
    ],
    sort_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: 3,
    layer_number: 3,
    sub_label: "brand",
    title: "Brand",
    axis_name: "X-axis",
    role: "Primitives plus Ubuntu — wordmark, mineral strip, ecosystem motifs.",
    description:
      "Brand components wrap primitives with the harness, the live region, and the motion system. They carry the doctrine.",
    covenant: "A brand component is a primitive with Ubuntu in it.",
    stakeholder: "Brand designers",
    implementation_rules: [
      "Always destructures { log, motion, LiveRegion } from useNyuchiHarness",
      "Always uses the nyuchi- prefix in component name",
    ],
    sort_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: 4,
    layer_number: 4,
    sub_label: "safety",
    title: "Safety",
    axis_name: "Y-axis",
    role: "Render-time gates. Permission checks, content-safety, AI guards.",
    description:
      "Anything that decides whether the children below it should ever render. Threads through every X-axis layer.",
    covenant: "Nothing harmful reaches the user.",
    stakeholder: "Trust + Safety",
    implementation_rules: [
      "Gates render before children execute",
      "Never silently allows — always explicit deny or permit",
    ],
    sort_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: 5,
    layer_number: 5,
    sub_label: "resilience",
    title: "Resilience",
    axis_name: "Y-axis",
    role: "Error boundaries, fallbacks, retry, circuit-breakers.",
    description:
      "Catches failures and renders something graceful so one part going down never takes the whole tree with it.",
    covenant: "Failure in one part never breaks the whole.",
    stakeholder: "SRE",
    implementation_rules: [
      "Boundaries catch, log, and render fallback",
      "Never swallow errors silently",
    ],
    sort_order: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: 6,
    layer_number: 6,
    sub_label: "pages",
    title: "Pages",
    axis_name: "X-axis",
    role: "Pure composition of L2 + L3 + Y-axis cross-cuts.",
    description:
      "Pages don't draw — they arrange. No inline buttons, no hardcoded SVGs, no per-page colour values.",
    covenant: "A page is a composition, not an implementation.",
    stakeholder: "Product engineering",
    implementation_rules: [
      "Pure composition — no inline buttons, cards, SVGs, or brand fonts",
      "Uses semantic CSS vars only",
    ],
    sort_order: 6,
    created_at: "",
    updated_at: "",
  },
  {
    id: 7,
    layer_number: 7,
    sub_label: "shell",
    title: "Shell",
    axis_name: "X-axis",
    role: "App-level providers, navigation chrome, route boundaries.",
    description:
      "The single mount point that holds theme, auth, telemetry, and any other global concern.",
    covenant: "The shell holds the product.",
    stakeholder: "App engineering",
    implementation_rules: ["Global providers live here", "Shell is mounted once per app"],
    sort_order: 7,
    created_at: "",
    updated_at: "",
  },
  {
    id: 8,
    layer_number: 8,
    sub_label: "assurance",
    title: "Assurance",
    axis_name: "Z-axis",
    role: "Telemetry, runtime invariants, fundi report sources.",
    description:
      "Watches X and Y from above. Emits structured events that fundi consumes; never modifies the tree it observes.",
    covenant: "What breaks is seen before users feel it.",
    stakeholder: "SRE + Observability",
    implementation_rules: [
      "Writes to observability_events and fundi_issues",
      "Never stores PII",
      "Rate-limited at the application layer",
    ],
    sort_order: 8,
    created_at: "",
    updated_at: "",
  },
  {
    id: 9,
    layer_number: 9,
    sub_label: "fundi",
    title: "Fundi",
    axis_name: "Outside",
    role: "Self-healing actor. Promotes L8 reports into GitHub issues.",
    description:
      "Lives outside the build. Reads fundi_issues, deduplicates by fingerprint, opens labelled GH issues, writes an append-only healing log.",
    covenant: "Failure is a learning event, not a user-facing incident.",
    stakeholder: "Maintainers",
    implementation_rules: [
      "Opens GitHub issues for failures",
      "Never auto-merges fixes without human review",
      "Logs every healing action append-only",
    ],
    sort_order: 9,
    created_at: "",
    updated_at: "",
  },
  {
    id: 10,
    layer_number: 10,
    sub_label: "documentation",
    title: "Documentation",
    axis_name: "Documentation",
    role: "DB-driven docs, MCP context, AI instructions.",
    description:
      "The system documents itself. Every doc page, changelog entry, and AI instruction lives in Supabase and is served live.",
    covenant: "The system documents itself.",
    stakeholder: "DevRel + AI tooling",
    implementation_rules: [
      "Docs are generated from the database, not the filesystem",
      "Every component has a data-portal attribute backlinking to its docs page",
    ],
    sort_order: 10,
    created_at: "",
    updated_at: "",
  },
]

/**
 * Live fetch with transitional fallback. Once issue #46's
 * `architecture_frontend_axes` table is seeded, the live path returns
 * the rows; until then, callers transparently get the canonical
 * fallback set above.
 */
export async function getArchitectureFrontendAxes(): Promise<ArchitectureFrontendAxisRow[]> {
  if (!isSupabaseConfigured()) return FALLBACK_AXES
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getPublicClient() as any)
    .from("architecture_frontend_axes")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error || !Array.isArray(data) || data.length === 0) {
    return FALLBACK_AXES
  }
  return data as ArchitectureFrontendAxisRow[]
}

/**
 * Live fetch with transitional fallback. See getArchitectureFrontendAxes
 * for the migration story.
 */
export async function getArchitectureFrontendLayers(): Promise<ArchitectureFrontendLayerRow[]> {
  if (!isSupabaseConfigured()) return FALLBACK_LAYERS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getPublicClient() as any)
    .from("architecture_frontend_layers")
    .select("*")
    .order("layer_number", { ascending: true })

  if (error || !Array.isArray(data) || data.length === 0) {
    return FALLBACK_LAYERS
  }
  return data as ArchitectureFrontendLayerRow[]
}

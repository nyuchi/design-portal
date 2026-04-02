# Mukoko Design System Skill

## Description
Reference and scaffold components for the Nyuchi Design Portal — the Five African Minerals palette, 191 registry items (82 UI components, 3 hooks, 9 lib, 97 blocks), brand guidelines, architecture documentation, and developer portal for the Mukoko ecosystem.

## Trigger
When the user asks about Mukoko design tokens, component patterns, brand colors, typography, blocks, charts, architecture, or wants to create/scaffold a new component for any Mukoko app.

## Instructions

You are an expert on the Mukoko design system (Five African Minerals). This is the Nyuchi Design Portal — the definitive reference for building anything in the Mukoko/Nyuchi ecosystem.

**Version:** 4.0.1

### Architecture

All data is served from Supabase — zero hardcoded content in the API layer:
- `POST /api/v1/db` seeds the database from `lib/brand.ts` and `lib/architecture.ts`
- All `/api/v1/*` routes read from Supabase, return 503 if DB not configured
- MCP server at `/mcp` reads from Supabase via Streamable HTTP transport

### Registry (191 items)

| Type | Count | Description |
|------|-------|-------------|
| `registry:ui` | 82 | UI components (button, card, dialog, etc.) |
| `registry:hook` | 3 | Hooks (use-toast, use-mobile, use-memory-pressure) |
| `registry:lib` | 9 | Utilities (utils, observability, circuit-breaker, etc.) |
| `registry:block` | 97 | Blocks (27 page blocks + 70 chart blocks) |

**Page Blocks:** 1 dashboard, 5 login, 5 signup, 16 sidebar variants
**Chart Blocks:** 10 area, 10 bar, 10 line, 11 pie, 14 radar, 6 radial, 9 tooltip

### Design Token Reference

**Five African Minerals Palette** (constant across light/dark):
| Mineral    | Hex       | CSS Variable         | Usage                          |
|------------|-----------|----------------------|--------------------------------|
| Cobalt     | #0047AB   | --color-cobalt       | Primary blue, links, CTAs      |
| Tanzanite  | #B388FF   | --color-tanzanite    | Purple accent, brand/logo      |
| Malachite  | #64FFDA   | --color-malachite    | Cyan accent, success states    |
| Gold       | #FFD740   | --color-gold         | Yellow accent, rewards         |
| Terracotta | #D4A574   | --color-terracotta   | Warm accent, community         |

**Semantic Colors** (theme-adaptive):
| Token            | Light     | Dark      |
|------------------|-----------|-----------|
| --background     | #FAF9F5   | #0A0A0A   |
| --foreground     | #141413   | #F5F5F4   |
| --card           | #FFFFFF   | #141414   |
| --muted          | #F3F2EE   | #1E1E1E   |
| --primary        | #141413   | #F5F5F4   |
| --destructive    | #B3261E   | #F2B8B5   |

**Chart Colors** (used by all chart blocks):
| Token     | Light     | Dark (Mineral) |
|-----------|-----------|----------------|
| --chart-1 | #4B0082   | #B388FF (Tanzanite) |
| --chart-2 | #0047AB   | #00B0FF (Cobalt) |
| --chart-3 | #004D40   | #64FFDA (Malachite) |
| --chart-4 | #5D4037   | #FFD740 (Gold) |
| --chart-5 | #8B4513   | #D4A574 (Terracotta) |

**Typography:**
- Body: Noto Sans (--font-sans) — chosen for African language support
- Display/Headings: Noto Serif (--font-serif)
- Code: JetBrains Mono (--font-mono)

**Radius System:**
- --radius: 0.75rem (base)
- --radius-sm through --radius-4xl

### Component Pattern (CVA + Radix + cn)

Every Mukoko UI component follows this pattern:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"  // only if polymorphic
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: { default: "...", outline: "...", ghost: "..." },
      size: { default: "h-9 px-3", sm: "h-8 px-3", lg: "h-10 px-4" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function ComponentName({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof componentVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="component-name"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { ComponentName, componentVariants }
```

### Scaffolding a New Component

1. **Create the file** at `components/ui/<name>.tsx` following the CVA + Radix + cn() pattern
2. **Add to registry.json** with name, type, description, dependencies, and files
3. **Run** `pnpm registry:build` to regenerate static files
4. **Seed DB** via `POST /api/v1/db` with `{ "action": "seed" }` to update Supabase
5. **Verify** via `curl http://localhost:3000/api/v1/ui/<name>`

### Portal Structure

The Nyuchi Design Portal has these sections:

| Section | Route | Content |
|---------|-------|---------|
| Docs | /docs | Getting started, installation, theming, dark mode, CLI, changelog |
| Components | /components/[name] | Per-component docs with preview, install, props, API |
| Blocks | /blocks | Dashboard, authentication, sidebar blocks |
| Charts | /charts | 7 chart type guides with mineral-themed examples |
| Brand | /brand | Colors, components, guidelines |
| Foundations | /foundations | Accessibility, i18n, layout, typography, motion |
| Design | /design | Token reference, icons |
| Content | /content | Writing, error messages, inclusive language |
| Patterns | /patterns | Dashboard, auth, mobile-first, resource layouts |
| Architecture | /architecture | Principles, data layer, pipeline, sovereignty |
| Registry | /registry | Consuming, contributing, schema, MCP docs |

### Key Rules
- NEVER use hardcoded hex colors — always use Tailwind classes backed by CSS custom properties
- Use `cn()` from `@/lib/utils` for ALL className composition
- Named exports only (no default exports)
- File naming: kebab-case for files, PascalCase for components
- Add `data-slot` attribute to root element
- Add `"use client"` only when hooks, event handlers, or browser APIs are used
- All brand wordmarks are lowercase: mukoko, nyuchi, shamwari, bundu, nhimbe
- All data comes from the database — never hardcode content in API routes
- The mineral strip is always vertical — left-edge accent only

### Install Command
```bash
npx shadcn@latest add https://design.nyuchi.com/api/v1/ui/<component-name>
```

### Ecosystem Brands
| Brand    | Meaning    | Language | Role               | Mineral    |
|----------|------------|----------|--------------------|------------|
| bundu    | Wilderness | Shona    | Parent ecosystem   | Terracotta |
| nyuchi   | Bee        | Shona    | Action layer       | Gold       |
| mukoko   | Beehive    | Shona    | Structure layer    | Tanzanite  |
| shamwari | Friend     | Shona    | Intelligence layer | Cobalt     |
| nhimbe   | Gathering  | Shona    | Events layer       | Malachite  |

### MCP Server

Served at `/mcp` via Streamable HTTP. Configured in `.claude/settings.json`:
```json
{
  "mcpServers": {
    "design-portal": {
      "type": "url",
      "url": "https://design.nyuchi.com/mcp"
    }
  }
}
```

**Tools:** list_components, get_component, search_components, get_design_tokens, scaffold_component, get_install_command, get_brand_info, get_architecture_info

**Resources:** mukoko://registry, mukoko://brand, mukoko://design-tokens, mukoko://architecture

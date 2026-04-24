import createMDX from "@next/mdx"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"

// MDX compilation (replaces Nextra). All `.mdx` files under `app/` are
// compiled by @next/mdx and routed through Next.js's file-based router.
// Rehype plugins add:
//   - `rehype-slug`             — generate heading IDs from text content
//   - `rehype-autolink-headings` — add anchor links next to headings (# style)
//   - `rehype-pretty-code`      — syntax highlighting via Shiki
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        { behavior: "append", properties: { className: ["heading-anchor"] } },
      ],
      [
        rehypePrettyCode,
        {
          theme: { light: "github-light", dark: "github-dark-dimmed" },
          keepBackground: false,
        },
      ],
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["radix-ui"],
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.tsx",
    },
  },
  async headers() {
    return [
      // ── Security headers (all routes) ───────────────────────────────
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer policy — send origin only on cross-origin requests
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restrict browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // HSTS — 2 years, include subdomains, preload-eligible
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // DNS prefetch control
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },

      // ── CORS for all API v1 routes ───────────────────────────────────
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },

      // ── CORS for MCP endpoint ────────────────────────────────────────
      {
        source: "/mcp",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, DELETE, OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, MCP-Protocol-Version, MCP-Session-Id",
          },
        ],
      },

      // ── Cache static registry JSON ───────────────────────────────────
      {
        source: "/r/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600",
          },
        ],
      },

      // ── Cache llms.txt and robots.txt for crawlers ───────────────────
      {
        source: "/(llms.txt|robots.txt|sitemap.xml)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800" }],
      },
    ]
  },

  // ── Permanent redirects — /design/* consolidated under /foundations ──
  // Issue #48. The old /design route group hosted only Tokens and Icons,
  // which are both foundational concerns. Merging them into /foundations
  // gives one IA location and clears a duplicated top-level nav item.
  async redirects() {
    return [
      { source: "/design", destination: "/foundations", permanent: true },
      { source: "/design/tokens", destination: "/foundations/tokens", permanent: true },
      { source: "/design/icons", destination: "/foundations/icons", permanent: true },
    ]
  },
}

export default withMDX(nextConfig)

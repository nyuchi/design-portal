"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, ArrowRight } from "lucide-react"

const minerals = [
  { name: "cobalt", color: "bg-[var(--color-cobalt)]" },
  { name: "tanzanite", color: "bg-[var(--color-tanzanite)]" },
  { name: "malachite", color: "bg-[var(--color-malachite)]" },
  { name: "gold", color: "bg-[var(--color-gold)]" },
  { name: "terracotta", color: "bg-[var(--color-terracotta)]" },
]

function CopyCommand() {
  const [copied, setCopied] = useState(false)
  const command = "npx shadcn@latest add https://registry.mukoko.com/api/r/button"

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(command)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="group flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3.5 text-left transition-all hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(179,136,255,0.08)]"
    >
      <span className="text-primary font-mono text-sm">$</span>
      <code className="flex-1 truncate font-mono text-sm text-muted-foreground">
        {command}
      </code>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors group-hover:text-foreground">
        {copied ? <Check className="size-4 text-[var(--color-malachite)]" /> : <Copy className="size-4" />}
      </span>
    </button>
  )
}

export function Hero() {
  return (
    <section className="relative flex flex-col items-center gap-10 px-6 pt-32 pb-20 text-center md:pt-44 md:pb-32">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(179,136,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(179,136,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="flex flex-col items-center gap-4">
        <Badge variant="outline" className="gap-2 border-primary/20 text-primary px-3 py-1">
          <span className="flex gap-1">
            {minerals.map((m) => (
              <span key={m.name} className={`size-1.5 rounded-full ${m.color}`} />
            ))}
          </span>
          Nyuchi Brand System
        </Badge>

        <div className="flex items-center gap-2">
          {["news.mukoko.com", "weather.mukoko.com"].map((site) => (
            <a
              key={site}
              href={`https://${site}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {site}
            </a>
          ))}
        </div>
      </div>

      <div className="flex max-w-3xl flex-col items-center gap-6">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          The building blocks
          <br />
          <span className="text-primary">of mukoko</span>
        </h1>
        <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Production-ready UI components rooted in the Five African Minerals
          palette. Install directly into your project with the shadcn CLI.
          No packages, no lock-in -- just code you own.
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 w-full">
        <CopyCommand />
        <div className="flex items-center gap-3">
          <Button size="lg" className="gap-2 rounded-xl" asChild>
            <a href="#components">
              Browse components
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl" asChild>
            <a
              href="https://assets.nyuchi.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brand System
            </a>
          </Button>
        </div>
      </div>

      {/* Mineral stat bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
        {[
          { label: "Components", value: "59" },
          { label: "WCAG AAA", value: "7:1+" },
          { label: "Palette", value: "5 minerals" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-semibold text-foreground font-mono">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

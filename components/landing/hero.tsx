"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, ArrowRight } from "lucide-react"

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
      className="group flex w-full max-w-2xl items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition-colors hover:border-accent/40 hover:bg-card/80"
    >
      <span className="text-accent font-mono text-sm">$</span>
      <code className="flex-1 truncate font-mono text-sm text-muted-foreground">
        {command}
      </code>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:text-foreground">
        {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
      </span>
    </button>
  )
}

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-8 px-6 pt-32 pb-20 text-center md:pt-40 md:pb-28">
      <Badge variant="outline" className="gap-1.5 border-accent/30 text-accent">
        <span className="size-1.5 rounded-full bg-accent" />
        59 components available
      </Badge>

      <div className="flex max-w-3xl flex-col items-center gap-5">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
          Build faster with
          <br />
          <span className="text-accent">mukoko</span> components
        </h1>
        <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          A curated registry of production-ready UI components. Install directly
          into your project with the shadcn CLI. No packages, no lock-in.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <CopyCommand />
        <div className="flex items-center gap-3">
          <Button size="lg" className="gap-2" asChild>
            <a href="#components">
              Browse components
              <ArrowRight className="size-4" data-icon="inline-end" />
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/nyuchitech/mukoko-registry" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

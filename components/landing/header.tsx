import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-foreground">
            <span className="text-sm font-bold text-background">m</span>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">mukoko</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">registry</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="#components"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Components
          </a>
          <a
            href="#catalog"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Catalog
          </a>
          <a
            href="https://assets.nyuchi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Brand
            <ExternalLink className="size-3" />
          </a>
          <a
            href="/api/r"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            API
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <a
              href="https://github.com/nyuchitech/mukoko-registry"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Github className="size-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="sm:hidden">
            <a
              href="https://github.com/nyuchitech/mukoko-registry"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <Github className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}

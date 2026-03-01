import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-accent">
            <span className="text-sm font-bold text-accent-foreground">m</span>
          </div>
          <span className="text-sm font-semibold text-foreground">mukoko</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#components"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Components
          </a>
          <a
            href="#catalog"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Catalog
          </a>
          <a
            href="/api/r"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            API
          </a>
        </nav>

        <Button variant="ghost" size="icon-sm" asChild>
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
    </header>
  )
}

import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="px-6 pb-12 pt-8">
      <div className="mx-auto max-w-5xl">
        <Separator className="mb-8" />
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-md bg-accent">
              <span className="text-xs font-bold text-accent-foreground">m</span>
            </div>
            <span className="text-sm text-muted-foreground">
              mukoko registry
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/nyuchitech/mukoko-registry"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="/api/r"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              API
            </a>
            <span className="text-xs text-muted-foreground">
              Built by{" "}
              <a
                href="https://mukoko.com"
                className="text-foreground transition-colors hover:text-accent"
              >
                mukoko
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

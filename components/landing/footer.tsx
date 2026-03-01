import { Separator } from "@/components/ui/separator"

const minerals = [
  { name: "cobalt", color: "bg-[var(--color-cobalt)]" },
  { name: "tanzanite", color: "bg-[var(--color-tanzanite)]" },
  { name: "malachite", color: "bg-[var(--color-malachite)]" },
  { name: "gold", color: "bg-[var(--color-gold)]" },
  { name: "terracotta", color: "bg-[var(--color-terracotta)]" },
]

export function Footer() {
  return (
    <footer className="px-6 pb-12 pt-8">
      <div className="mx-auto max-w-5xl">
        <Separator className="mb-8" />

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-6 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground">m</span>
              </div>
              <span className="text-sm font-semibold text-foreground">mukoko</span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Part of the bundu family. Built on Ubuntu philosophy and the Five African Minerals palette.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              {minerals.map((m) => (
                <span key={m.name} className={`size-2 rounded-full ${m.color}`} title={m.name} />
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">Ecosystem</span>
              <a
                href="https://news.mukoko.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                News
              </a>
              <a
                href="https://weather.mukoko.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Weather
              </a>
              <a
                href="https://assets.nyuchi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Brand System
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">Registry</span>
              <a
                href="#components"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Components
              </a>
              <a
                href="/api/r"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                API
              </a>
              <a
                href="https://github.com/nyuchitech/mukoko-registry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <span className="text-xs text-muted-foreground">
            Built by{" "}
            <a
              href="https://assets.nyuchi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition-colors hover:text-primary"
            >
              Nyuchi
            </a>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">v6.0.0</span>
        </div>
      </div>
    </footer>
  )
}

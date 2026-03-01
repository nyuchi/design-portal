import { Terminal, FolderOpen, Sparkles } from "lucide-react"

const steps = [
  {
    icon: Terminal,
    title: "Run the CLI",
    description: "Use the shadcn CLI to add any component directly from the mukoko registry.",
    code: "npx shadcn@latest add https://registry.mukoko.com/api/r/button",
  },
  {
    icon: FolderOpen,
    title: "Files land in your project",
    description: "Components are copied into your codebase. Full ownership, no hidden dependencies.",
    code: "components/ui/button.tsx",
  },
  {
    icon: Sparkles,
    title: "Customize and ship",
    description: "Modify the source to fit your design system. The code is yours.",
    code: "<Button variant=\"outline\">Ship it</Button>",
  },
]

export function InstallSteps() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium text-accent">How it works</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Three steps. Zero friction.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-accent/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <step.icon className="size-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-medium text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <div className="mt-auto rounded-lg bg-muted/50 px-3 py-2">
                <code className="font-mono text-xs text-muted-foreground break-all">
                  {step.code}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

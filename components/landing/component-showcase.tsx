"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Check } from "lucide-react"

function PreviewCard({
  name,
  description,
  children,
}: {
  name: string
  description: string
  children: React.ReactNode
}) {
  const [copied, setCopied] = useState(false)
  const installCmd = `npx shadcn@latest add https://registry.mukoko.com/api/r/${name}`

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-colors hover:border-accent/30">
      <div className="flex min-h-[200px] items-center justify-center p-8">
        {children}
      </div>
      <div className="flex flex-col gap-2 border-t border-border/60 px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm font-medium text-foreground">{name}</h3>
          <button
            onClick={() => {
              navigator.clipboard.writeText(installCmd)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`Copy install command for ${name}`}
          >
            {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ButtonShowcase() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
}

function BadgeShowcase() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  )
}

function CardShowcase() {
  return (
    <Card className="w-full max-w-[280px]" size="sm">
      <CardHeader>
        <CardTitle>Project Alpha</CardTitle>
        <CardDescription>Deployment status overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className="border-accent/30 text-accent">Active</Badge>
          </div>
          <Progress value={72} />
          <span className="text-xs text-muted-foreground">72% complete</span>
        </div>
      </CardContent>
    </Card>
  )
}

function InputShowcase() {
  return (
    <div className="flex w-full max-w-[260px] flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-demo" className="text-sm">Email</Label>
        <Input id="email-demo" type="email" placeholder="you@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="search-demo" className="text-sm">Search</Label>
        <Input id="search-demo" type="search" placeholder="Search components..." />
      </div>
    </div>
  )
}

function SwitchShowcase() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="notifications" defaultChecked />
        <Label htmlFor="notifications" className="text-sm">Notifications</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="dark-mode" />
        <Label htmlFor="dark-mode" className="text-sm">Dark mode</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="agree" defaultChecked />
        <Label htmlFor="agree" className="text-sm">I agree to the terms</Label>
      </div>
    </div>
  )
}

function TabsShowcase() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-[300px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-3">
        <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-foreground font-medium">Dashboard</p>
          <p className="text-xs text-muted-foreground">Your project overview and key metrics.</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="mt-3">
        <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-foreground font-medium">Analytics</p>
          <p className="text-xs text-muted-foreground">Track performance and user engagement.</p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="mt-3">
        <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-foreground font-medium">Settings</p>
          <p className="text-xs text-muted-foreground">Manage your project configuration.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function AvatarShowcase() {
  return (
    <div className="flex flex-col items-center gap-4">
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>EF</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <Separator className="w-24" />
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

function SkeletonShowcase() {
  return (
    <div className="flex w-full max-w-[260px] flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export function ComponentShowcase() {
  return (
    <section id="components" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium text-accent">Components</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            See them in action
          </h2>
          <p className="mt-4 text-muted-foreground">
            Live previews of select components from the registry.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <PreviewCard name="button" description="Displays a button or a component that looks like a button.">
            <ButtonShowcase />
          </PreviewCard>
          <PreviewCard name="badge" description="Displays a badge or a component that looks like a badge.">
            <BadgeShowcase />
          </PreviewCard>
          <PreviewCard name="card" description="Displays a card with header, content, and footer.">
            <CardShowcase />
          </PreviewCard>
          <PreviewCard name="input" description="Displays a form input field.">
            <InputShowcase />
          </PreviewCard>
          <PreviewCard name="switch" description="A control that allows toggling between states.">
            <SwitchShowcase />
          </PreviewCard>
          <PreviewCard name="tabs" description="A set of layered sections of content.">
            <TabsShowcase />
          </PreviewCard>
          <PreviewCard name="avatar" description="An image element with a fallback for representing the user.">
            <AvatarShowcase />
          </PreviewCard>
          <PreviewCard name="skeleton" description="Used to show a placeholder while content is loading.">
            <SkeletonShowcase />
          </PreviewCard>
        </div>
      </div>
    </section>
  )
}

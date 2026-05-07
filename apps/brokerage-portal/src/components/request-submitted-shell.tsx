import type { CSSProperties } from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  ClockIcon,
  LockKeyholeIcon,
  MailCheckIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

const nextSteps = [
  {
    title: "Reala reviews the request",
    detail:
      "Staff checks listing details, selected services, preferred timing, billing posture, and any special instructions.",
    icon: ClipboardListIcon,
  },
  {
    title: "Legacy systems stay untouched",
    detail:
      "No TimeTap booking, folder creation, invoice, Matterport update, or payment authorization happens from this screen.",
    icon: LockKeyholeIcon,
  },
  {
    title: "Client gets confirmation",
    detail:
      "Once staff accepts or adjusts the request, the portal status can move from review to scheduled or needs-info.",
    icon: MailCheckIcon,
  },
]

const requestSummary = [
  ["Request", "BP-REQ-2044"],
  ["Listing", "1238 Homer St, Vancouver"],
  ["Services", "Photography, Floor Plan, Matterport, Feature Sheet"],
  ["Preferred window", "May 14, 2026 · 9:00 AM - 12:00 PM"],
  ["Estimate", "$1,432.67 CAD"],
  ["Status", "Waiting for Reala review"],
]

export function RequestSubmittedShell({
  requestId = "BP-REQ-2044",
  persisted = false,
  initialAccess,
}: {
  requestId?: string
  persisted?: boolean
  initialAccess?: WorkspaceAccessSnapshot
}) {
  const displayedSummary = requestSummary.map(([label, value]) =>
    label === "Request" ? [label, requestId] : [label, value]
  )

  return (
    <RoleProvider initialAccess={initialAccess}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Request Submitted" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.24),transparent_34%),linear-gradient(135deg,#052e16,#14532d_48%,#0f172a)] p-6 text-white shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                      <CheckCircle2Icon />
                      Submitted to Reala
                    </Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                      Your order request is waiting for staff review
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                      This keeps the new portal useful right away without
                      disrupting the existing Reala admin workflow. Staff can
                      review the request internally before anything is entered or
                      changed in legacy systems.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur md:min-w-80">
                    <div className="text-white/65">Current status</div>
                    <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                      <ClockIcon className="size-5" />
                      Staff review
                    </div>
                    <div className="mt-3 text-white/70">
                      {persisted
                        ? "Saved to the portal intake queue. No live legacy write has been triggered."
                        : "Queued in demo/safe mode. No live legacy write has been triggered."}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Request summary</CardTitle>
                    <CardDescription>
                      What Reala staff sees before accepting the request.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {displayedSummary.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-4 rounded-2xl bg-muted px-4 py-3 text-sm"
                      >
                        <span className="text-muted-foreground">{label}</span>
                        <span className="max-w-72 text-right font-medium">
                          {value}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What happens next</CardTitle>
                    <CardDescription>
                      The portal becomes the intake layer while legacy remains
                      protected.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {nextSteps.map((step) => {
                      const Icon = step.icon

                      return (
                        <div
                          key={step.title}
                          className="grid gap-3 rounded-2xl border p-4 sm:grid-cols-[auto_1fr]"
                        >
                          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <div className="font-medium">{step.title}</div>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </section>

              <Card>
                <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="mt-0.5 size-5 text-emerald-600" />
                    <div>
                      <div className="font-medium">Safe coexistence path</div>
                      <p className="text-sm text-muted-foreground">
                        Client requests can move forward while Reala staff
                        keeps control of legacy admin actions.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button nativeButton={false} variant="outline" render={<Link href="/orders" />}>
                      View orders
                    </Button>
                    <Button nativeButton={false} render={<Link href="/bridge-approvals" />}>
                      Staff intake queue
                      <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

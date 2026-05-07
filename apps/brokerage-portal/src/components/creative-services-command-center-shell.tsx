import Link from "next/link"
import type { ComponentType, CSSProperties } from "react"
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BotIcon,
  CheckCircle2Icon,
  FileTextIcon,
  ImageIcon,
  PackageIcon,
  PrinterIcon,
  SparklesIcon,
  UploadCloudIcon,
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
import { Progress } from "@/components/ui/progress"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { legacyCockpitSample } from "@/lib/legacy-cockpit-data"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

type CreativeMode = "marketing" | "print" | "ai"

type CreativeServicesCommandCenterShellProps = {
  mode: CreativeMode
  initialAccess?: WorkspaceAccessSnapshot
  liveMetrics?: CreativeMetric[]
  liveQueues?: CreativeQueueItem[]
  liveSourceLabel?: string
}

export type CreativeMetricIconKey =
  | "feature-sheet"
  | "staging"
  | "print"
  | "upload"

export type CreativeMetric = {
  label: string
  value: string
  detail: string
  iconKey: CreativeMetricIconKey
}

export type CreativeQueueItem = {
  name: string
  listing: string
  status: string
  next: string
  boundary: string
  href?: string
}

const modeCopy: Record<
  CreativeMode,
  {
    title: string
    eyebrow: string
    description: string
    primaryCta: string
    accent: string
  }
> = {
  marketing: {
    title: "Marketing Studio",
    eyebrow: "Feature sheets, staging, approvals",
    description:
      "A listing-centered creative queue for feature sheets, virtual staging, listing websites, proofs, revisions, and share-ready assets.",
    primaryCta: "Open approvals",
    accent: "from-rose-50 via-white to-orange-50",
  },
  print: {
    title: "Print Shop",
    eyebrow: "Products, proofs, production",
    description:
      "A safer print operations view for product catalog rows, order status, proof approvals, invoice gaps, and fulfillment handoff.",
    primaryCta: "View orders",
    accent: "from-slate-50 via-white to-stone-100",
  },
  ai: {
    title: "AI Services",
    eyebrow: "Upload path, processing, delivery",
    description:
      "The future AI/media lane for photographer, field-tech, and realtor uploads, with QC and delivery modeled before production automation.",
    primaryCta: "Review jobs",
    accent: "from-cyan-50 via-white to-emerald-50",
  },
}

const creativeMetrics: CreativeMetric[] = [
  {
    label: "Feature sheet access",
    value: legacyCockpitSample.samples.clients
      .filter((client) => client.entitlements.featureSheet)
      .length.toLocaleString("en-US"),
    detail: "Sample client rows with feature-sheet entitlement.",
    iconKey: "feature-sheet",
  },
  {
    label: "Virtual staging access",
    value: legacyCockpitSample.samples.clients
      .filter((client) => client.entitlements.virtualStaging)
      .length.toLocaleString("en-US"),
    detail: "Sample client rows with virtual-staging entitlement.",
    iconKey: "staging",
  },
  {
    label: "Print orders",
    value: legacyCockpitSample.counts.printOrders.toLocaleString("en-US"),
    detail: "Legacy print order rows mirrored from local backup.",
    iconKey: "print",
  },
  {
    label: "Field-tech events",
    value: legacyCockpitSample.counts.fieldTechEvents.toLocaleString("en-US"),
    detail: "Future upload/job path should connect here.",
    iconKey: "upload",
  },
]

const creativeQueues: CreativeQueueItem[] = [
  {
    name: "Feature sheet proof",
    listing: "Listing workspace",
    status: "Needs approval",
    next: "Collect copy, photos, floor plan, and brand details.",
    boundary: "Proof generation remains manual/provider-backed until accepted.",
  },
  {
    name: "Virtual staging request",
    listing: "Listing workspace",
    status: "Waiting source images",
    next: "Track source photo, room type, style, output, revision, and approval.",
    boundary: "Provider/AI automation is not live production yet.",
  },
  {
    name: "Print product order",
    listing: "Print shop",
    status: "Invoice gap watch",
    next: "Map print products, CSV behavior, proof status, and invoice bridge.",
    boundary: "Production invoice parity is a separate approval.",
  },
  {
    name: "Realtor upload path",
    listing: "AI services",
    status: "Prototype model",
    next: "Model upload, AI processing, QC, delivery, and notification state.",
    boundary: "Full upload/AI pipeline is a post-sprint module.",
  },
]

const workflowCards = [
  {
    title: "Creative project record",
    body: "One record for feature sheets, virtual staging, listing websites, banners, print design, and AI image work.",
    icon: PackageIcon,
  },
  {
    title: "Source to output assets",
    body: "Track source images, floor plans, generated proofs, final outputs, and share/download state.",
    icon: ImageIcon,
  },
  {
    title: "Revision and approval",
    body: "Make proof status, client comments, revision requests, and final signoff visible at listing level.",
    icon: CheckCircle2Icon,
  },
  {
    title: "Exception visibility",
    body: "Surface missing source assets, overdue proofs, delivery gaps, invoice gaps, and provider delays.",
    icon: AlertTriangleIcon,
  },
]

const featureSheetParityRows = [
  {
    area: "Product",
    legacy: 'Flyer plus 4/8/12/16/20/24 page 17" x 11" feature sheets',
    portal: "Captured on feature-sheet print drafts",
  },
  {
    area: "Quantity",
    legacy: "15, 25, 50, 75, 100, 150, 200, 500",
    portal: "Captured before dry-run print intent",
  },
  {
    area: "Style",
    legacy: "Upload own, style on file, or design app",
    portal: "Captured as template/source review field",
  },
  {
    area: "Paper",
    legacy: "Copy, 80lb, 100lb, 111lb, 130lb",
    portal: "Captured for staff review",
  },
  {
    area: "Status",
    legacy: "Proof Sent, Proof Accepted, Edit Required, Send to Print, delivery/pickup states",
    portal: "Mapped to portal approval/revision/print draft states",
  },
]

const metricIconMap: Record<
  CreativeMetricIconKey,
  ComponentType<{ className?: string }>
> = {
  "feature-sheet": FileTextIcon,
  staging: SparklesIcon,
  print: PrinterIcon,
  upload: UploadCloudIcon,
}

export function CreativeServicesCommandCenterShell({
  mode,
  initialAccess,
  liveMetrics,
  liveQueues,
  liveSourceLabel,
}: CreativeServicesCommandCenterShellProps) {
  const copy = modeCopy[mode]
  const visibleMetrics = liveMetrics?.length ? liveMetrics : creativeMetrics
  const visibleQueues = liveQueues?.length ? liveQueues : creativeQueues

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
          <SiteHeader title={copy.title} />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section
                className={`rounded-3xl border bg-linear-to-br ${copy.accent} p-6 shadow-sm`}
              >
                <Badge className="border-slate-200 bg-white/70 text-slate-700 hover:bg-white/70">
                  {mode === "ai" ? <BotIcon /> : <SparklesIcon />}
                  {copy.eyebrow}
                </Badge>
                <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-end">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                      {copy.title}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {copy.description} This surface makes the creative
                      workflow usable in the brokerage pilot without pretending
                      provider automation, AI processing, print fulfillment, or
                      invoice generation are already replaced.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button nativeButton={false} render={<Link href="/approvals" />}>
                        {copy.primaryCta}
                        <ArrowRightIcon />
                      </Button>
                      <Button nativeButton={false} variant="outline" render={<Link href="/listings" />}>
                        Listing workspace
                      </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">
                        {liveMetrics?.length ? "Live Supabase mirror" : "Sample mode"}
                      </Badge>
                      <span>
                        {liveSourceLabel ??
                          "Static sample data only; no legacy system is contacted."}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-white/75 p-4 shadow-xs">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pilot coverage</span>
                      <span className="font-semibold">70%</span>
                    </div>
                    <Progress value={70} className="mt-3" />
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      Covers visibility, status, proof/revision concepts, and
                      portal-native workflow state. Production automation is
                      intentionally separate.
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {visibleMetrics.map((metric) => (
                  <MetricCard key={metric.label} {...metric} />
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Creative operations queue</CardTitle>
                    <CardDescription>
                      The work items that need to become visible inside each
                      listing workspace.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Work item</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Next action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleQueues.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell className="font-medium">
                              {item.href ? (
                                <Link
                                  href={item.href}
                                  className="inline-flex items-center gap-1 hover:underline"
                                >
                                  {item.name}
                                  <ArrowRightIcon className="size-3" />
                                </Link>
                              ) : (
                                item.name
                              )}
                              <div className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                                {item.boundary}
                              </div>
                            </TableCell>
                            <TableCell>{item.listing}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.status}</Badge>
                            </TableCell>
                            <TableCell className="max-w-sm text-muted-foreground">
                              {item.next}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Workflow model</CardTitle>
                    <CardDescription>
                      The shared model that prevents another patchwork.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {workflowCards.map((card) => (
                      <WorkflowCard key={card.title} {...card} />
                    ))}
                  </CardContent>
                </Card>
              </section>

              {mode === "marketing" ? (
                <section>
                  <Card>
                    <CardHeader>
                      <CardTitle>Feature sheet parity board</CardTitle>
                      <CardDescription>
                        Recovered DigitalOcean scheduler fields that the
                        marketing workshop needs to preserve before any legacy
                        replacement is trusted.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Area</TableHead>
                            <TableHead>Legacy behavior</TableHead>
                            <TableHead>Portal-native draft parity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {featureSheetParityRows.map((row) => (
                            <TableRow key={row.area}>
                              <TableCell className="font-medium">{row.area}</TableCell>
                              <TableCell className="max-w-md text-muted-foreground">
                                {row.legacy}
                              </TableCell>
                              <TableCell className="max-w-md">
                                {row.portal}
                                <div className="mt-1 text-xs text-muted-foreground">
                                  Draft/ledger only. No print, invoice, payment,
                                  storage, email, or legacy mutation.
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>
              ) : null}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function MetricCard({
  label,
  value,
  detail,
  iconKey,
}: {
  label: string
  value: string
  detail: string
  iconKey: CreativeMetricIconKey
}) {
  const Icon = metricIconMap[iconKey]

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-rose-50 text-rose-700">
          <Icon className="size-5" />
        </div>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-5 text-muted-foreground">
        {detail}
      </CardContent>
    </Card>
  )
}

function WorkflowCard({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl border p-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white [&_svg]:size-4">
        <Icon />
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

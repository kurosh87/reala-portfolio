import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"
import {
  AlertTriangleIcon,
  CalendarSyncIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  ExternalLinkIcon,
  FileWarningIcon,
  FolderSyncIcon,
  GaugeIcon,
  LinkIcon,
  PackageSearchIcon,
  PrinterIcon,
  RouteIcon,
  ShieldAlertIcon,
  UploadCloudIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
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
import { formatNumber, legacyCockpitSample } from "@/lib/legacy-cockpit-data"
import { painPointCoverage, type PilotPriority } from "@/lib/pilot-command-center-data"
import type { LiveOpsExceptionMirror } from "@/lib/server/live-portal-data"
import type { TimeTapCalendarException } from "@/lib/timetap-parity"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

type DistanceToFixed = "1-3 days" | "1 week" | "2-4 weeks" | "1-2 months" | "later"
type FixMode = "fix now" | "wrap" | "mirror" | "rebuild" | "defer"

type OpsPainPoint = {
  title: string
  painPoint: string
  legacySurface: string
  currentTruth: string
  failureMode: string
  safeSprintMove: string
  distance: DistanceToFixed
  complexity: number
  mode: FixMode
  priority: PilotPriority
  icon: ReactNode
}

const missingFolderCandidates = legacyCockpitSample.samples.appointments.filter(
  (appointment) => !appointment.hasSubfolder
)

const matterportCandidates = legacyCockpitSample.samples.appointments.filter(
  (appointment) =>
    appointment.services.some((service) => service.name === "Matterport")
)

const invoiceAttention = legacyCockpitSample.exceptions.find(
  (exception) => exception.type === "invoice_attention"
)

const printWithoutTracking = legacyCockpitSample.samples.printOrders.filter(
  (order) => !order.hasTracking
)

const opsPainPoints: OpsPainPoint[] = [
  {
    title: "Folder sync and immediate folder creation",
    painPoint: "Daily sync and folder creation",
    legacySurface: "Daily syncs + Appointment management",
    currentTruth: "TimeTap appointment pull plus legacy folder automation",
    failureMode:
      "Folders are created by nightly maintenance unless an operator manually syncs a selected date.",
    safeSprintMove:
      "Build a read-only detector for appointments missing folder signals, then define an operator-reviewed repair checklist.",
    distance: "1 week",
    complexity: 3,
    mode: "mirror",
    priority: "high",
    icon: <FolderSyncIcon />,
  },
  {
    title: "Matterport canonical URL mismatch",
    painPoint: "Matterport URL mismatch",
    legacySurface: "Delivery app + Matterport URL generator",
    currentTruth: "Generated URL, delivered client URL, and manual override are not cleanly separated.",
    failureMode:
      "Address normalization changes abbreviations and creates mismatches in roughly the reported 15-20% range.",
    safeSprintMove:
      "Represent generated, delivered, and canonical override links separately; flag records where they diverge.",
    distance: "1 week",
    complexity: 3,
    mode: "wrap",
    priority: "high",
    icon: <LinkIcon />,
  },
  {
    title: "Booking errors with missing evidence",
    painPoint: "Booking errors",
    legacySurface: "New booking/signup path + TimeTap handoff",
    currentTruth: "Client screenshots/messages and production logs are the source of truth.",
    failureMode:
      "Errors are reported after the fact without a consistent category, trace ID, payload shape, or recovery state.",
    safeSprintMove:
      "Add an error taxonomy and evidence checklist before rewriting booking or TimeTap writes.",
    distance: "1-3 days",
    complexity: 2,
    mode: "wrap",
    priority: "high",
    icon: <FileWarningIcon />,
  },
  {
    title: "Card hold before fulfillment",
    painPoint: "Card hold at ordering",
    legacySurface: "Calculator, billing, Stripe/customer references",
    currentTruth: "Calculator estimate plus Stripe manual-capture policy in test mode.",
    failureMode:
      "Reala wants funds secured at order time without charging prematurely, but live capture rules need policy approval.",
    safeSprintMove:
      "Prototype and document Stripe test-mode manual authorization, partial capture, expiry, cancel, and overage rules.",
    distance: "2-4 weeks",
    complexity: 4,
    mode: "rebuild",
    priority: "high",
    icon: <CreditCardIcon />,
  },
  {
    title: "Invoice and payment-change visibility",
    painPoint: "Invoices, payment changes, and print gaps",
    legacySurface: "Appointment management",
    currentTruth: "Legacy invoice generation and payment-state records remain production truth.",
    failureMode:
      "Operators need to see unpaid/generated/drift states without accidentally changing billing records.",
    safeSprintMove:
      "Create exception cards and deep-link notes for invoice attention, keeping production edits in legacy for now.",
    distance: "1 week",
    complexity: 3,
    mode: "mirror",
    priority: "medium",
    icon: <ShieldAlertIcon />,
  },
  {
    title: "Print shop order and invoice gap",
    painPoint: "Invoices, payment changes, and print gaps",
    legacySurface: "Product order manager + print order manager",
    currentTruth: "Print product CSV/catalog behavior and print-order status records.",
    failureMode:
      "Print order manager is not yet equivalent to appointment manager for invoice generation.",
    safeSprintMove:
      "Mirror print order status, missing tracking, and invoice-readiness signals before unifying billing.",
    distance: "2-4 weeks",
    complexity: 4,
    mode: "mirror",
    priority: "medium",
    icon: <PrinterIcon />,
  },
  {
    title: "Client flags, discounts, and account setup",
    painPoint: "Client flags, discounts, and access",
    legacySurface: "Client management portal",
    currentTruth: "Legacy user record, entitlements, discounts, account terms, and Stripe reference.",
    failureMode:
      "Access to feature sheets, virtual staging, print shop, discounts, and account terms lives in a hidden operator workflow.",
    safeSprintMove:
      "Model entitlements and account posture in the portal, with audit events before any write bridge.",
    distance: "1 week",
    complexity: 3,
    mode: "mirror",
    priority: "medium",
    icon: <CheckCircle2Icon />,
  },
  {
    title: "Field-tech, photographer, realtor upload path",
    painPoint: "Field tech / photographer / realtor uploads",
    legacySurface: "Field tech app + future AI processing workflow",
    currentTruth: "Appointments, job requirements, uploaded assets, QC, processing, and delivery status.",
    failureMode:
      "This is a full product module, not a safe one-week patch to bolt onto legacy.",
    safeSprintMove:
      "Define the job/upload states and pilot UI; leave full processing, QC, and notifications for a separate module.",
    distance: "1-2 months",
    complexity: 5,
    mode: "rebuild",
    priority: "low",
    icon: <UploadCloudIcon />,
  },
]

const modeStyles: Record<FixMode, string> = {
  "fix now": "border-emerald-200 bg-emerald-50 text-emerald-700",
  wrap: "border-blue-200 bg-blue-50 text-blue-700",
  mirror: "border-cyan-200 bg-cyan-50 text-cyan-700",
  rebuild: "border-amber-200 bg-amber-50 text-amber-800",
  defer: "border-slate-200 bg-slate-50 text-slate-700",
}

const priorityStyles: Record<PilotPriority, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
}

const severityStyles: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-700",
  high: "border-orange-200 bg-orange-50 text-orange-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
}

export function OpsExceptionsShell({
  initialAccess,
  liveOpsExceptionMirror,
  timeTapCalendarExceptions = [],
}: {
  initialAccess?: WorkspaceAccessSnapshot
  liveOpsExceptionMirror?: LiveOpsExceptionMirror
  timeTapCalendarExceptions?: TimeTapCalendarException[]
}) {
  const quickWins = opsPainPoints.filter((item) => item.distance !== "1-2 months" && item.distance !== "later").length
  const averageComplexity = Math.round(
    (opsPainPoints.reduce((sum, item) => sum + item.complexity, 0) /
      opsPainPoints.length) *
      10
  ) / 10
  const liveExceptions = liveOpsExceptionMirror?.exceptions ?? []
  const highSeverityExceptions = liveExceptions.filter((exception) =>
    ["critical", "high"].includes(exception.severity)
  ).length

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
          <SiteHeader title="Ops Exceptions" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.24),transparent_34%),linear-gradient(135deg,#171717,#27272a_52%,#3f2f1f)] p-6 text-white shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                      <AlertTriangleIcon />
                      Pain-point command queue
                    </Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                      Fix what hurts without guessing in production
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                      This workspace converts the legacy management portal pain
                      points into a ranked, operator-readable queue. The sprint
                      posture is visibility first, safe wrappers second, and
                      production writes only after explicit approval.
                    </p>
                  </div>
                  <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur md:min-w-80">
                    <SignalRow label="Quick assessment wins" value={`${quickWins}/${opsPainPoints.length}`} />
                    <SignalRow label="Average complexity" value={`${averageComplexity}/5`} />
                    <SignalRow label="Production writes" value="Off by default" />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  icon={<FolderSyncIcon />}
                  label="Folder candidates"
                  value={formatNumber(missingFolderCandidates.length)}
                  detail="Sample appointments missing a subfolder signal."
                />
                <MetricCard
                  icon={<RouteIcon />}
                  label="Matterport candidates"
                  value={formatNumber(matterportCandidates.length)}
                  detail="Sample appointments where tour-link parity matters."
                />
                <MetricCard
                  icon={<ShieldAlertIcon />}
                  label="Invoice attention"
                  value={formatNumber(invoiceAttention?.count ?? 0)}
                  detail="Legacy invoice/payment states that need operator review."
                />
                <MetricCard
                  icon={<PackageSearchIcon />}
                  label="Print tracking gaps"
                  value={formatNumber(printWithoutTracking.length)}
                  detail="Sample print orders without tracking evidence."
                />
              </section>

              <section className="rounded-2xl border bg-card">
                <div className="border-b p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-semibold">TimeTap calendar parity detectors</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Read-only detector output for TimeTap, Daily Drafting,
                        Scheduler product fields, and portal job alignment.
                      </p>
                    </div>
                    <Badge variant="outline">
                      {timeTapCalendarExceptions.length} detectors
                    </Badge>
                  </div>
                </div>
                <div className="overflow-x-auto p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Detector</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Next operator move</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeTapCalendarExceptions.map((exception) => (
                        <TableRow key={exception.id}>
                          <TableCell>
                            <div className="font-medium">{exception.title}</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {exception.detail}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={severityStyles[exception.severity]}
                            >
                              {exception.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{exception.status}</Badge>
                          </TableCell>
                          <TableCell>{exception.source}</TableCell>
                          <TableCell className="max-w-sm text-sm text-muted-foreground">
                            {exception.nextStep}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle>Live exception mirror</CardTitle>
                        <CardDescription>
                          Open portal-side exception rows from Supabase. These are
                          read-only visibility signals, not legacy repair actions.
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {liveOpsExceptionMirror?.sourceLabel ?? "Sample fallback"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {liveExceptions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Exception</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Next operator move</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {liveExceptions.slice(0, 12).map((exception) => (
                              <LiveExceptionRow
                                key={exception.id}
                                exception={exception}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
                        <div className="font-medium text-foreground">
                          No open live exceptions are visible yet.
                        </div>
                        <p className="mt-1">
                          {liveOpsExceptionMirror?.emptyReason ??
                            "The page is ready for mirrored exception rows once folder, Matterport, billing, print, or booking detectors populate integration_exceptions."}
                        </p>
                        <p className="mt-2">
                          The assessment matrix below remains the source of truth
                          for what we should detect first.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mirror health</CardTitle>
                    <CardDescription>
                      Safe bridge posture for the current ops queue.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm">
                    <SignalPill
                      label="Open live exceptions"
                      value={formatNumber(liveExceptions.length)}
                    />
                    <SignalPill
                      label="High / critical"
                      value={formatNumber(highSeverityExceptions)}
                    />
                    <SignalPill
                      label="Legacy writes"
                      value="Blocked"
                    />
                    <SignalPill
                      label="Operator action"
                      value="Review first"
                    />
                    <p className="pt-1 text-xs leading-5 text-muted-foreground">
                      This is the bridge-safe version of the legacy pain queue:
                      detectors can populate evidence, but fixes still move
                      through admin approval before any production mutation.
                    </p>
                  </CardContent>
                </Card>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Distance to fixed</CardTitle>
                    <CardDescription>
                      Practical sprint view: what can be assessed, wrapped, or
                      safely advanced before touching deeper brokerage rollout.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Issue</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead>Distance</TableHead>
                            <TableHead>Complexity</TableHead>
                            <TableHead>Next safe move</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {opsPainPoints.map((item) => (
                            <PainPointRow key={item.title} item={item} />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>One-week reality check</CardTitle>
                      <CardDescription>
                        Useful progress is realistic. Full replacement is not.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm leading-5 text-muted-foreground">
                      <BoundaryCard
                        icon={<GaugeIcon />}
                        title="Realistic in week one"
                        body="Workflow map, detector design, exception taxonomy, sample queue, operator review checklist, and Stripe test-mode policy."
                      />
                      <BoundaryCard
                        icon={<ExternalLinkIcon />}
                        title="Risky without more proof"
                        body="Live card holds, TimeTap write replacement, invoice generation changes, folder automation writes, and upload/QC processing."
                      />
                      <BoundaryCard
                        icon={<CalendarSyncIcon />}
                        title="Best sprint shape"
                        body="Stabilize visibility while advancing the brokerage command center as an operable front-office layer."
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pain point coverage</CardTitle>
                      <CardDescription>
                        Direct match against the known client concerns.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      {painPointCoverage.map((item) => (
                        <div key={item.painPoint} className="rounded-xl border p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium">{item.painPoint}</div>
                            <Badge className={priorityStyles[item.priority]}>
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm leading-5 text-muted-foreground">
                            {item.included}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function LiveExceptionRow({
  exception,
}: {
  exception: LiveOpsExceptionMirror["exceptions"][number]
}) {
  return (
    <TableRow>
      <TableCell className="min-w-72">
        <Link
          href={`/exceptions/${exception.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {exception.title}
        </Link>
        <div className="mt-1 text-xs leading-4 text-muted-foreground">
          {exception.summary}
        </div>
        <div className="mt-1 text-xs text-muted-foreground/80">
          {exception.exceptionType.replaceAll("_", " ")} · Last seen{" "}
          {formatDateTime(exception.lastSeenAt ?? exception.updatedAt)}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={severityStyles[exception.severity] ?? severityStyles.low}>
          {exception.severity}
        </Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="text-sm">{exception.status}</div>
        <div className="text-xs text-muted-foreground">
          Sync: {exception.syncStatus}
        </div>
      </TableCell>
      <TableCell className="min-w-36 text-sm text-muted-foreground">
        <div>{exception.legacySource ?? "Portal mirror"}</div>
        {exception.legacyId ? (
          <div className="text-xs text-muted-foreground/80">
            {exception.legacyId}
          </div>
        ) : null}
      </TableCell>
      <TableCell className="min-w-72 text-sm leading-5 text-muted-foreground">
        {exception.recommendedAction ??
          exception.syncError ??
          "Review evidence, compare against legacy admin, then decide whether this is fix-now, wrap, mirror, or rebuild."}
      </TableCell>
    </TableRow>
  )
}

function SignalPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/65">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string
  value: string
  detail: string
  icon: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-orange-50 text-orange-700 [&_svg]:size-5">
          {icon}
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

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Unknown time"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function PainPointRow({ item }: { item: OpsPainPoint }) {
  return (
    <TableRow>
      <TableCell className="min-w-72">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white [&_svg]:size-4">
            {item.icon}
          </div>
          <div>
            <div className="font-medium">{item.title}</div>
            <div className="mt-1 text-xs leading-4 text-muted-foreground">
              {item.failureMode}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={modeStyles[item.mode]}>{item.mode}</Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap">{item.distance}</TableCell>
      <TableCell className="min-w-32">
        <div className="flex items-center gap-2">
          <Progress value={item.complexity * 20} className="h-2" />
          <span className="text-xs tabular-nums text-muted-foreground">
            {item.complexity}/5
          </span>
        </div>
      </TableCell>
      <TableCell className="min-w-80 text-sm leading-5 text-muted-foreground">
        <div>{item.safeSprintMove}</div>
        <div className="mt-1 text-xs text-muted-foreground/80">
          Truth: {item.currentTruth}
        </div>
      </TableCell>
    </TableRow>
  )
}

function BoundaryCard({
  title,
  body,
  icon,
}: {
  title: string
  body: string
  icon: ReactNode
}) {
  return (
    <div className="flex gap-3 rounded-2xl border p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white [&_svg]:size-4">
        {icon}
      </div>
      <div>
        <div className="font-medium text-foreground">{title}</div>
        <div>{body}</div>
      </div>
    </div>
  )
}

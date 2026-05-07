import type { CSSProperties, ReactNode } from "react"
import {
  AlertTriangleIcon,
  CalendarDaysIcon,
  CircleDollarSignIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  FileTextIcon,
  Layers3Icon,
  PackageIcon,
  ShieldCheckIcon,
  UserRoundIcon,
  WrenchIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  RoleProvider,
  type WorkspaceAccessSnapshot,
} from "@/components/role-context"
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
import {
  completionLabel,
  formatMoney,
  formatNumber,
  legacyCockpitSample,
  topCounts,
  type LegacyAppointmentSample,
  type LegacyException,
} from "@/lib/legacy-cockpit-data"

const severityStyles = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
} satisfies Record<LegacyException["severity"], string>

export function LegacyCockpitShell({
  initialAccess,
}: {
  initialAccess?: WorkspaceAccessSnapshot
}) {
  const data = legacyCockpitSample
  const totalServiceFlags = Object.values(data.serviceFlags).reduce(
    (sum, value) => sum + value,
    0
  )
  const invoiceAttention = data.exceptions.find(
    (item) => item.type === "invoice_attention"
  )
  const undeliveredServices = data.exceptions.find(
    (item) => item.type === "undelivered_services"
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
          <SiteHeader title="Legacy Cockpit" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.18),transparent_32%),linear-gradient(135deg,#111827,#1f2937_48%,#3f1f1f)] p-6 text-white shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                      <DatabaseIcon />
                      Sanitized local mirror
                    </Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                      Read-only operations cockpit
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                      Built from local DigitalOcean database dumps. Client names,
                      emails, addresses, payment references, passwords, notes,
                      and raw payloads are omitted or replaced with safe labels.
                    </p>
                  </div>
                  <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur md:min-w-80">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/65">Mode</span>
                      <span className="font-medium">{data.source.mode}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/65">Generated</span>
                      <span className="font-medium">
                        {new Date(data.generatedAt).toLocaleString("en-CA")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/65">Production writes</span>
                      <span className="font-medium text-emerald-200">None</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  icon={<UserRoundIcon />}
                  label="Legacy clients"
                  value={formatNumber(data.counts.clients)}
                  detail="Mirrored from Deliverables.users"
                />
                <MetricCard
                  icon={<CalendarDaysIcon />}
                  label="Appointments"
                  value={formatNumber(data.counts.appointments)}
                  detail="Operational spine from Deliverables.appointments"
                />
                <MetricCard
                  icon={<CircleDollarSignIcon />}
                  label="Invoice attention"
                  value={formatNumber(invoiceAttention?.count ?? 0)}
                  detail="Unpaid or under-review appointment invoices"
                />
                <MetricCard
                  icon={<AlertTriangleIcon />}
                  label="Service gaps"
                  value={formatNumber(undeliveredServices?.count ?? 0)}
                  detail="Flagged service statuses not yet delivered"
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Legacy service mix</CardTitle>
                    <CardDescription>
                      Service flags detected across mirrored appointments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(data.serviceFlags).map(([key, value]) => (
                      <ServiceBar
                        key={key}
                        label={serviceLabel(key)}
                        value={value}
                        total={totalServiceFlags}
                      />
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Exception queue</CardTitle>
                    <CardDescription>
                      First read-only exception categories to make visible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.exceptions.map((exception) => (
                      <div
                        key={exception.type}
                        className="rounded-xl border p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium">
                            {exception.type.replaceAll("_", " ")}
                          </div>
                          <Badge className={severityStyles[exception.severity]}>
                            {exception.severity}
                          </Badge>
                        </div>
                        <div className="mt-1 text-2xl font-semibold tabular-nums">
                          {formatNumber(exception.count)}
                        </div>
                        <p className="mt-2 text-sm leading-5 text-muted-foreground">
                          {exception.recommendation}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment mirror sample</CardTitle>
                    <CardDescription>
                      Anonymized records derived from `Deliverables.appointments`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Legacy ID</TableHead>
                            <TableHead>Listing</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Services</TableHead>
                            <TableHead>Invoice</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.samples.appointments.slice(0, 8).map((item) => (
                            <AppointmentRow key={item.id} appointment={item} />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Status distribution</CardTitle>
                      <CardDescription>
                        Top appointment statuses in the legacy dump.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {topCounts(data.appointmentStatusCounts, 5).map((item) => (
                        <CountRow key={item.label} label={item.label} value={item.value} />
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Print and field tech</CardTitle>
                      <CardDescription>
                        Adjacent legacy systems that must be mirrored.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <MiniStat
                        icon={<PackageIcon />}
                        label="Print orders"
                        value={formatNumber(data.counts.printOrders)}
                      />
                      <MiniStat
                        icon={<FileTextIcon />}
                        label="Print catalog rows"
                        value={formatNumber(data.counts.printProducts)}
                      />
                      <MiniStat
                        icon={<WrenchIcon />}
                        label="Field tech events"
                        value={formatNumber(data.counts.fieldTechEvents)}
                      />
                      <MiniStat
                        icon={<Layers3Icon />}
                        label="Field tech entries"
                        value={formatNumber(data.counts.fieldTechEntries)}
                      />
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-3">
                <PrincipleCard
                  icon={<ShieldCheckIcon />}
                  title="Safe by default"
                  body="This slice is local, sanitized, and read-only. It does not connect to TimeTap, Stripe, storage, Matterport, WordPress, or live MySQL."
                />
                <PrincipleCard
                  icon={<DatabaseIcon />}
                  title="Evidence-backed"
                  body="The counts and sample shapes come from local logical DB dumps, while workflow meaning comes from recovered source routes."
                />
                <PrincipleCard
                  icon={<ExternalLinkIcon />}
                  title="Deep-link later"
                  body="The cockpit should point operators to legacy tools for writes until each module has parity and rollback."
                />
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600 [&_svg]:size-5">
          {icon}
        </div>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{detail}</CardContent>
    </Card>
  )
}

function ServiceBar({
  label,
  value,
  total,
}: {
  label: string
  value: number
  total: number
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {formatNumber(value)}
        </span>
      </div>
      <Progress value={percent} />
    </div>
  )
}

function AppointmentRow({
  appointment,
}: {
  appointment: LegacyAppointmentSample
}) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{appointment.legacyId}</TableCell>
      <TableCell>
        <div className="font-medium">{appointment.listingLabel}</div>
        <div className="text-xs text-muted-foreground">
          {appointment.addressLabel} · {appointment.date}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{appointment.status}</Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm">{completionLabel(appointment)}</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {appointment.services.slice(0, 3).map((service) => (
            <Badge key={service.name} variant="secondary">
              {service.name}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">
          {appointment.invoice.generated
            ? formatMoney(appointment.invoice.amount)
            : "Not generated"}
        </div>
        <div className="text-xs text-muted-foreground">
          {appointment.invoice.paymentStatus}
        </div>
      </TableCell>
    </TableRow>
  )
}

function CountRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
      <span className="truncate font-medium">{label}</span>
      <span className="tabular-nums text-muted-foreground">
        {formatNumber(value)}
      </span>
    </div>
  )
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-4">
          {icon}
        </div>
        <span className="truncate text-sm font-medium">{label}</span>
      </div>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
}

function PrincipleCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode
  title: string
  body: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="leading-6">{body}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function serviceLabel(key: string) {
  return {
    photos: "Photography",
    floorPlans: "Floor plans",
    videos: "Video",
    matterport: "Matterport",
    printedMaterial: "Printed material",
  }[key] ?? key
}

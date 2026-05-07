import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CalendarClockIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  FingerprintIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { AuditTimeline } from "@/components/audit-timeline"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { IntegrationExceptionDetail } from "@/lib/server/integration-exception-detail"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

const severityStyles: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-700",
  high: "border-orange-200 bg-orange-50 text-orange-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
}

export function ExceptionDetailShell({
  detail,
  initialAccess,
}: {
  detail: IntegrationExceptionDetail
  initialAccess?: WorkspaceAccessSnapshot
}) {
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
          <SiteHeader
            title="Exception Detail"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Ops Exceptions", href: "/exceptions" },
            ]}
          />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <Button
                  nativeButton={false}
                  variant="ghost"
                  size="sm"
                  render={<Link href="/exceptions" />}
                >
                  <ArrowLeftIcon />
                  Back to exceptions
                </Button>
                <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
                  <DatabaseIcon />
                  Read-only mirror
                </Badge>
              </div>

              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.22),transparent_34%),linear-gradient(135deg,#ffffff,#f8fafc)] p-6 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={severityStyles[detail.severity] ?? severityStyles.low}>
                        {detail.severity}
                      </Badge>
                      <Badge variant="outline">{formatLabel(detail.status)}</Badge>
                      <Badge variant="outline">
                        {formatLabel(detail.exceptionType)}
                      </Badge>
                    </div>
                    <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">
                      {detail.title}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {detail.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{detail.sourceLabel}</Badge>
                      <span>{detail.id}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-white/75 p-4 shadow-xs">
                    <div className="flex items-center gap-2 font-medium">
                      <LockKeyholeIcon className="size-4 text-muted-foreground" />
                      Coexistence boundary
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {detail.safetyBoundary}
                    </p>
                    <div className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                      Next move: {detail.recommendedAction ?? "Staff review before any repair."}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  icon={<AlertTriangleIcon />}
                  label="Sync status"
                  value={formatLabel(detail.syncStatus)}
                  detail={detail.syncError ?? "No sync error is attached."}
                />
                <MetricCard
                  icon={<FingerprintIcon />}
                  label="Legacy source"
                  value={detail.legacySource ?? "Portal mirror"}
                  detail={detail.legacyId ?? "No legacy id attached yet."}
                />
                <MetricCard
                  icon={<CalendarClockIcon />}
                  label="Appointment"
                  value={detail.appointment?.status ?? "Not linked"}
                  detail={
                    detail.appointment?.scheduledFor
                      ? formatDateTime(detail.appointment.scheduledFor)
                      : "No appointment link attached."
                  }
                />
                <MetricCard
                  icon={<ShieldCheckIcon />}
                  label="Bridge attempts"
                  value={`${detail.bridgeAttempts.length}`}
                  detail="Dry-run evidence only; no production write button."
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Operator evidence</CardTitle>
                    <CardDescription>
                      The fields an operator needs before deciding whether this
                      is fix-now, wrap, mirror, rebuild, or defer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm">
                    <EvidenceRow label="Recommended action" value={detail.recommendedAction} />
                    <EvidenceRow label="Legacy source" value={detail.legacySource} />
                    <EvidenceRow label="Legacy ID" value={detail.legacyId} />
                    <EvidenceRow label="Last seen" value={detail.lastSeenAt ? formatDateTime(detail.lastSeenAt) : null} />
                    <EvidenceRow label="Updated" value={formatDateTime(detail.updatedAt)} />
                    {detail.listing ? (
                      <Button
                        nativeButton={false}
                        variant="outline"
                        render={<Link href={`/listing/${detail.listing.id}`} />}
                      >
                        Open listing workspace
                        <ExternalLinkIcon />
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sync run</CardTitle>
                    <CardDescription>
                      The read-only import/detector context that produced or
                      refreshed this exception.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm">
                    {detail.syncRun ? (
                      <>
                        <SignalRow label="Integration" value={detail.syncRun.integrationKey ?? "Unknown"} />
                        <SignalRow label="Mode" value={detail.syncRun.mode ?? "read_only"} />
                        <SignalRow label="Status" value={detail.syncRun.status ?? "Unknown"} />
                        <SignalRow label="Records seen" value={`${detail.syncRun.recordsSeen}`} />
                        <SignalRow label="Mirror changes" value={`${detail.syncRun.recordsChanged}`} />
                        {detail.syncRun.safeError ? (
                          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
                            {detail.syncRun.safeError}
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <div className="rounded-2xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
                        No sync run is attached yet. This is expected for seeded
                        or manually created portal exceptions.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              <Card>
                <CardHeader>
                  <CardTitle>Related bridge attempts</CardTitle>
                  <CardDescription>
                    Dry-run and audit evidence only. Production writes remain
                    blocked from this detail view.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {detail.bridgeAttempts.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Integration</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Payload hash</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detail.bridgeAttempts.map((attempt) => (
                          <TableRow key={attempt.id}>
                            <TableCell>
                              <div className="font-medium">{attempt.integration}</div>
                              <div className="text-xs text-muted-foreground">
                                {attempt.action}
                              </div>
                            </TableCell>
                            <TableCell>{attempt.mode}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{formatLabel(attempt.status)}</Badge>
                            </TableCell>
                            <TableCell className="max-w-md text-sm text-muted-foreground">
                              {attempt.decisionReason}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {attempt.payloadHash.slice(0, 16)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="rounded-2xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
                      No bridge attempts are attached yet. The next dry-run or
                      admin-reviewed payload will appear here.
                    </div>
                  )}
                </CardContent>
              </Card>

              <AuditTimeline
                items={detail.timeline}
                title="Exception audit timeline"
                description="Exception, sync, audit, and dry-run bridge evidence for this one operator signal."
              />
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

function EvidenceRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-medium">{value ?? "Not attached"}</div>
    </div>
  )
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ")
}

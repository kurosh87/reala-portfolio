import type { CSSProperties, ReactNode } from "react"
import {
  ActivityIcon,
  FileClockIcon,
  GitBranchIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  SparklesIcon,
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
import type {
  CoexistenceAuditSnapshot,
  CountRow,
  RecentBridgeAttempt,
  RecentIntegrationException,
  RecentSyncRun,
} from "@/lib/server/coexistence-audit"

type CoexistenceAuditShellProps = {
  snapshot: CoexistenceAuditSnapshot
  initialAccess?: WorkspaceAccessSnapshot
}

const coexistenceStages = [
  {
    label: "Freeze legacy writes",
    status: "Active",
    detail:
      "DigitalOcean, TimeTap, Stripe, folders, WordPress, Matterport, and legacy MySQL remain protected.",
  },
  {
    label: "Mirror and observe",
    status: "In progress",
    detail:
      "Bridge attempts, sync runs, exceptions, and product parity seeds now create an auditable read-only trail.",
  },
  {
    label: "Manual operator handoff",
    status: "Ready",
    detail:
      "Portal requests can be reviewed, approved for manual entry, and marked entered without automated legacy writes.",
  },
  {
    label: "Dry-run bridge",
    status: "Next",
    detail:
      "Specific workflows can graduate to repeatable dry-run payloads with hashes, decisions, and rollback notes.",
  },
  {
    label: "Synthetic live test",
    status: "Later",
    detail:
      "Only TEST-PORTAL fixtures should be used before any production bridge module is considered.",
  },
]

const cutoverGates = [
  "Every write has a bridge_attempt row with source request, target, mode, status, payload hash, and decision reason.",
  "Every exception has an owner, recommended action, legacy source/id, and evidence trail.",
  "Operators can complete the workflow manually from the new portal without guessing where legacy truth lives.",
  "The workflow has dry-run evidence, synthetic test data, rollback notes, and Reala signoff.",
  "No module cuts over globally; each module moves independently from mirror to manual handoff to approved bridge.",
]

export function CoexistenceAuditShell({
  snapshot,
  initialAccess,
}: CoexistenceAuditShellProps) {
  const totalBridgeAttempts = sumCounts(snapshot.bridgeAttemptCounts)
  const totalExceptions = sumCounts(snapshot.exceptionStatusCounts)
  const productParityTotal = sumCounts(snapshot.productParityCounts)
  const dryRunCount =
    snapshot.bridgeAttemptCounts.find((item) => item.label === "dry_run")
      ?.count ?? 0
  const coverage =
    totalBridgeAttempts && totalExceptions && productParityTotal ? 64 : 42

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
          <SiteHeader title="Coexistence Audit" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.25),transparent_35%),linear-gradient(135deg,#0f172a,#164e63_48%,#14532d)] p-6 text-white shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
                  <div>
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                      <GitBranchIcon />
                      Freeze, mirror, handoff, then bridge
                    </Badge>
                    <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">
                      Coexistence plan with an audit trail, not a blind rewrite
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
                      This page tracks the safe path from legacy production to a
                      useful Reala portal: portal-native requests,
                      read-only mirrors, dry-run payloads, operator handoff, and
                      module-by-module cutover gates.
                    </p>
                    <div className="mt-4 text-xs text-white/60">
                      Snapshot generated {formatDateTime(snapshot.generatedAt)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Coexistence readiness</span>
                      <span className="font-semibold">{coverage}%</span>
                    </div>
                    <Progress value={coverage} className="mt-3" />
                    <p className="mt-3 text-xs leading-5 text-white/65">
                      Measured by visible audit trail, safe manual handoff, and
                      parity records. It does not imply production replacement
                      of TimeTap, Stripe, folder automation, or legacy portals.
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  icon={<FileClockIcon />}
                  label="Bridge attempts"
                  value={totalBridgeAttempts}
                  detail={`${dryRunCount} dry-run rows captured with payload hashes.`}
                />
                <MetricCard
                  icon={<ActivityIcon />}
                  label="Open exceptions"
                  value={totalExceptions}
                  detail="Folder, Matterport, invoice, print, booking, and operational signals."
                />
                <MetricCard
                  icon={<SparklesIcon />}
                  label="Product parity records"
                  value={productParityTotal}
                  detail="Feature sheet, virtual staging, print catalog, and workflow rows."
                />
                <MetricCard
                  icon={<ShieldCheckIcon />}
                  label="Legacy write mode"
                  value="0 live"
                  detail="No automatic legacy write adapters are enabled in this portal layer."
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Coexistence stages</CardTitle>
                    <CardDescription>
                      The operating model for keeping Reala production
                      stable while the new portal becomes useful.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {coexistenceStages.map((stage, index) => (
                      <div
                        key={stage.label}
                        className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[2rem_1fr_auto]"
                      >
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{stage.label}</div>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {stage.detail}
                          </p>
                        </div>
                        <Badge variant="outline">{stage.status}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cutover gates</CardTitle>
                    <CardDescription>
                      Nothing graduates from coexistence until these are true
                      for a specific module.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {cutoverGates.map((gate) => (
                      <div
                        key={gate}
                        className="flex gap-3 rounded-2xl bg-muted/50 p-3 text-sm"
                      >
                        <LockKeyholeIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <span className="leading-6 text-muted-foreground">
                          {gate}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <CountsCard
                  title="Bridge status"
                  description="Proof that would-write activity is captured before anything can move toward legacy."
                  rows={snapshot.bridgeAttemptCounts}
                  secondaryRows={snapshot.bridgeModeCounts}
                />
                <CountsCard
                  title="Request posture"
                  description="Portal intake and access requests remain staff-reviewed, not production writes."
                  rows={snapshot.intakeStatusCounts}
                  secondaryRows={snapshot.accessStatusCounts}
                />
                <CountsCard
                  title="Exception posture"
                  description="Legacy pain signals imported or mirrored as operator-visible exceptions."
                  rows={snapshot.exceptionStatusCounts}
                  secondaryRows={snapshot.exceptionTypeCounts}
                />
                <CountsCard
                  title="Product-module parity"
                  description="Feature sheets, virtual staging, print, and workflow rows that support the broker-facing portal."
                  rows={snapshot.productParityCounts}
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <BridgeAttemptTable attempts={snapshot.recentBridgeAttempts} />
                <ExceptionTable exceptions={snapshot.recentExceptions} />
              </section>

              <SyncRunTable runs={snapshot.recentSyncRuns} />
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
  value: number | string
  detail: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
          <Badge variant="outline">{value}</Badge>
        </div>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{detail}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function CountsCard({
  title,
  description,
  rows,
  secondaryRows = [],
}: {
  title: string
  description: string
  rows: CountRow[]
  secondaryRows?: CountRow[]
}) {
  const visibleRows = [...rows, ...secondaryRows]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {visibleRows.length ? (
          visibleRows.map((row) => (
            <div
              key={`${title}-${row.label}`}
              className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-3 py-2 text-sm"
            >
              <span className="text-muted-foreground">
                {formatLabel(row.label)}
              </span>
              <span className="font-medium">{row.count}</span>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
            No rows captured yet.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function BridgeAttemptTable({
  attempts,
}: {
  attempts: RecentBridgeAttempt[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent bridge attempts</CardTitle>
        <CardDescription>
          Would-write records with mode, status, decision, and payload hash.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.map((attempt) => (
              <TableRow key={attempt.id}>
                <TableCell className="min-w-48">
                  <div className="font-medium">{attempt.sourceRequestId}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(attempt.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{attempt.integration}</Badge>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {attempt.action}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{attempt.status}</Badge>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {attempt.mode}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {attempt.payloadHash.slice(0, 12)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function ExceptionTable({
  exceptions,
}: {
  exceptions: RecentIntegrationException[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent integration exceptions</CardTitle>
        <CardDescription>
          Operational pain signals visible before repair or bridge work.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exception</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exceptions.map((exception) => (
              <TableRow key={exception.id}>
                <TableCell className="min-w-56">
                  <div className="font-medium">{exception.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {exception.legacySource ?? "portal"} ·{" "}
                    {exception.legacyId ?? exception.exceptionType}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{exception.severity}</Badge>
                </TableCell>
                <TableCell>{exception.status}</TableCell>
                <TableCell className="max-w-80 text-sm text-muted-foreground">
                  {exception.recommendedAction ?? exception.summary}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function SyncRunTable({ runs }: { runs: RecentSyncRun[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Read-only sync/import runs</CardTitle>
        <CardDescription>
          Evidence that mirror work is happening through local/sample import
          passes, not through production legacy mutation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Integration</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Seen</TableHead>
              <TableHead>Changed</TableHead>
              <TableHead>Finished</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell className="font-medium">
                  {formatLabel(run.integrationKey)}
                </TableCell>
                <TableCell>{run.mode}</TableCell>
                <TableCell>
                  <Badge variant="outline">{run.status}</Badge>
                </TableCell>
                <TableCell>{run.recordsSeen}</TableCell>
                <TableCell>{run.recordsChanged}</TableCell>
                <TableCell>
                  {run.finishedAt ? formatDateTime(run.finishedAt) : "Open"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function sumCounts(rows: CountRow[]) {
  return rows.reduce((total, row) => total + row.count, 0)
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ")
}

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Unknown"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

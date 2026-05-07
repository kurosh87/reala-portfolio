import type { CSSProperties } from "react"
import Link from "next/link"
import {
  CheckCircle2Icon,
  DatabaseIcon,
  EyeIcon,
  LockKeyholeIcon,
  SendIcon,
  ShieldAlertIcon,
  UserPlusIcon,
  WorkflowIcon,
} from "lucide-react"

import { updatePortalIntakeStatusAction } from "@/app/actions/portal-intake"
import { AppSidebar } from "@/components/app-sidebar"
import { AuditTimeline } from "@/components/audit-timeline"
import {
  RoleProvider,
  type WorkspaceAccessSnapshot,
} from "@/components/role-context"
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
import {
  bridgeApprovalRequests,
  buildApprovalAttemptPreview,
  getApprovalDecision,
  type BridgeApprovalRequest,
  type BridgeApprovalStatus,
} from "@/lib/legacy-bridge-approval-data"
import {
  accessRequestStatusLabels,
  accessRequestTypeLabels,
  type AccessRequestRecord,
  type AccessRequestStatus,
} from "@/lib/access-requests"
import type { BridgeAttemptRecord } from "@/lib/server/bridge-attempts"
import type { TimeTapBridgePreview } from "@/lib/timetap-parity"

const statusStyles: Record<BridgeApprovalStatus, string> = {
  submitted: "border-blue-200 bg-blue-50 text-blue-700",
  needs_review: "border-amber-200 bg-amber-50 text-amber-800",
  under_review: "border-cyan-200 bg-cyan-50 text-cyan-700",
  needs_info: "border-orange-200 bg-orange-50 text-orange-800",
  ready_for_dry_run: "border-blue-200 bg-blue-50 text-blue-700",
  blocked: "border-red-200 bg-red-50 text-red-700",
  approved_for_sandbox: "border-emerald-200 bg-emerald-50 text-emerald-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  manually_entered_in_legacy: "border-slate-200 bg-slate-50 text-slate-700",
}

const riskStyles: Record<BridgeApprovalRequest["risk"], string> = {
  low: "border-slate-200 bg-slate-50 text-slate-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-red-200 bg-red-50 text-red-700",
}

const accessStatusStyles: Record<AccessRequestStatus, string> = {
  submitted: "border-blue-200 bg-blue-50 text-blue-700",
  under_review: "border-cyan-200 bg-cyan-50 text-cyan-700",
  needs_info: "border-orange-200 bg-orange-50 text-orange-800",
  approved_for_manual_action: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  manually_completed: "border-slate-200 bg-slate-50 text-slate-700",
}

type ReadinessWarning = {
  category: string
  label: string
  detail: string
  severity: "blocking" | "review" | "info"
}

export function BridgeApprovalsShell({
  requests = bridgeApprovalRequests,
  accessRequests = [],
  bridgeAttempts = [],
  timeTapBridgePreviews = [],
  initialAccess,
}: {
  requests?: BridgeApprovalRequest[]
  accessRequests?: AccessRequestRecord[]
  bridgeAttempts?: BridgeAttemptRecord[]
  timeTapBridgePreviews?: TimeTapBridgePreview[]
  initialAccess?: WorkspaceAccessSnapshot
}) {
  const dryRunCount = requests.filter(
    (request) => getApprovalDecision(request).dryRun
  ).length
  const handoffWarningCounts = requests.reduce(
    (counts, request) => {
      for (const warning of readPayloadReadinessWarnings(request.payload)) {
        counts[warning.severity] += 1
      }

      return counts
    },
    { blocking: 0, review: 0, info: 0 }
  )
  const openAccessCount = accessRequests.filter((request) =>
    ["submitted", "under_review", "needs_info"].includes(request.status)
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
          <SiteHeader title="Portal Intake Review" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_34%),linear-gradient(135deg,#111827,#172554_50%,#312e81)] p-6 text-white shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                      <WorkflowIcon />
                      Reala staff review
                    </Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                      Review portal requests before legacy is touched
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                      This is the inbox for anything the new portal wants
                      Reala staff to approve: new clients, new orders,
                      Matterport fixes, and folder repair previews. Nothing here
                      changes the old admin tools automatically.
                    </p>
                  </div>
                  <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur md:min-w-80">
                    <SignalRow label="Items waiting" value={`${requests.length}`} />
                    <SignalRow
                      label="Access drafts"
                      value={`${openAccessCount}`}
                    />
                    <SignalRow
                      label="Dry-run previews"
                      value={`${dryRunCount + timeTapBridgePreviews.length}`}
                    />
                    <SignalRow
                      label="Ledger attempts"
                      value={`${bridgeAttempts.length}`}
                    />
                    <SignalRow
                      label="Blocking handoffs"
                      value={`${handoffWarningCounts.blocking}`}
                    />
                    <SignalRow
                      label="Review warnings"
                      value={`${handoffWarningCounts.review}`}
                    />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                  icon={<UserPlusIcon />}
                  title="What lands here"
                  value="Intake"
                  detail="New portal signups, order requests, and ops exceptions that need staff review."
                />
                <SummaryCard
                  icon={<LockKeyholeIcon />}
                  title="What cannot happen"
                  value="No auto-write"
                  detail="This page does not change legacy clients, appointments, folders, invoices, or payments."
                />
                <SummaryCard
                  icon={<SendIcon />}
                  title="What happens next"
                  value="Review"
                  detail="Staff approves, rejects, asks for info, or manually handles the item in legacy."
                />
              </section>

              <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <Card className="border-blue-200/70 bg-blue-50/35">
                  <CardHeader>
                    <CardTitle>TimeTap bridge previews</CardTitle>
                    <CardDescription>
                      Dry-run payloads for the TimeTap and Daily Drafting work
                      identified in the calendar parity mirror. These previews do
                      not call TimeTap or Google Sheets.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {timeTapBridgePreviews.map((preview) => (
                      <div
                        key={preview.id}
                        className="rounded-2xl border bg-background p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{preview.mode}</Badge>
                          <Badge variant="outline">{preview.target}</Badge>
                        </div>
                        <div className="mt-2 font-medium">{preview.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Source: {preview.sourceRecord}
                        </div>
                        <div className="mt-3 grid gap-1 rounded-xl bg-muted/40 p-3 text-xs">
                          {Object.entries(preview.payloadPreview).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between gap-3"
                            >
                              <span className="text-muted-foreground">{key}</span>
                              <span className="text-right font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Approval checklist</CardTitle>
                    <CardDescription>
                      What staff must verify before any future live bridge is
                      even considered.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    {Array.from(
                      new Set(timeTapBridgePreviews.flatMap((preview) => preview.checklist))
                    ).map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 rounded-xl border bg-muted/20 p-3 text-sm"
                      >
                        <CheckCircle2Icon className="mt-0.5 size-4 text-emerald-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">
                      Production writes remain disabled: no TimeTap PUT, no
                      Google Sheets update, no folder creation, no invoice, and
                      no legacy MySQL mutation.
                    </div>
                  </CardContent>
                </Card>
              </section>

              <Card>
                <CardHeader>
                  <CardTitle>Admin intake queue</CardTitle>
                  <CardDescription>
                    Read this like a staff work queue, not a developer screen.
                    The technical bridge details are available inside each card
                    only for safety and implementation review.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Next step</TableHead>
                          <TableHead>Risk</TableHead>
                          <TableHead>Safety</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => {
                          const decision = getApprovalDecision(request)
                          const rowWarnings = readPayloadReadinessWarnings(
                            request.payload
                          )

                          return (
                            <TableRow key={request.id}>
                              <TableCell className="min-w-72">
                                <div className="font-medium">{request.plainTitle}</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {request.id} · {request.requester}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1.5">
                                  <Badge variant="outline">
                                    {request.intakeType}
                                  </Badge>
                                  {rowWarnings.length ? (
                                    <Badge variant="secondary">
                                      {rowWarnings.length} warnings
                                    </Badge>
                                  ) : null}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-80 text-sm text-muted-foreground">
                                  {request.adminNextStep}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={riskStyles[request.risk]}>
                                  {request.risk}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {decision.allowed ? (
                                    <CheckCircle2Icon className="size-4 text-emerald-600" />
                                  ) : (
                                    <ShieldAlertIcon className="size-4 text-red-600" />
                                  )}
                                  <span className="text-sm">
                                    {decision.dryRun
                                      ? "Dry-run only"
                                      : decision.allowed
                                        ? "Sandbox allowed"
                                        : "Blocked"}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {accessRequests.length ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Workspace and access drafts</CardTitle>
                    <CardDescription>
                      Org, role, vendor onboarding, and legacy-access requests
                      also need staff review here so Reala has one inbox.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Draft</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Requested access</TableHead>
                            <TableHead>Legacy candidate</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {accessRequests.slice(0, 8).map((request) => (
                            <TableRow key={request.publicRequestId}>
                              <TableCell className="min-w-72 whitespace-normal">
                                <div className="font-medium">
                                  {request.requestedOrganizationName ||
                                    request.requestedEmail ||
                                    request.publicRequestId}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {request.publicRequestId} ·{" "}
                                  {request.requesterName}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {accessRequestTypeLabels[request.requestType]}
                                </Badge>
                              </TableCell>
                              <TableCell className="min-w-56 whitespace-normal text-sm text-muted-foreground">
                                {[request.requestedRole, request.requestedEmail]
                                  .filter(Boolean)
                                  .join(" · ") || "Workspace review"}
                              </TableCell>
                              <TableCell className="min-w-56 whitespace-normal text-sm text-muted-foreground">
                                {request.legacyCandidateClientName ||
                                  "Not mapped yet"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={accessStatusStyles[request.status]}
                                >
                                  {accessRequestStatusLabels[request.status]}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <BridgeAttemptLedger attempts={bridgeAttempts} />

              <section className="grid gap-4 xl:grid-cols-2">
                {requests.map((request) => (
                  <RequestReviewCard key={request.id} request={request} />
                ))}
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

export function BridgeApprovalDetailShell({
  request,
  bridgeAttempts = [],
  initialAccess,
}: {
  request: BridgeApprovalRequest
  bridgeAttempts?: BridgeAttemptRecord[]
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
          <SiteHeader title="Portal Intake Detail" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <div>
                <Button
                  nativeButton={false}
                  variant="ghost"
                  size="sm"
                  render={<Link href="/bridge-approvals" />}
                >
                  Back to intake queue
                </Button>
              </div>

              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(135deg,#0f172a,#1e293b_52%,#115e59)] p-6 text-white shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                      <ShieldAlertIcon />
                      Admin-approved bridge handoff
                    </Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                      {request.plainTitle}
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-white/75">
                      This is the operator review page for one portal intake.
                      It keeps the request, dry-run payload, staff decision log,
                      and related bridge ledger rows together before anything is
                      manually entered or separately approved for legacy.
                    </p>
                  </div>
                  <div className="grid gap-2 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur lg:min-w-80">
                    <DetailFact label="Request ID" value={request.id} />
                    <DetailFact label="Type" value={request.intakeType} />
                    <DetailFact label="Requester" value={request.requester} />
                    <DetailFact
                      label="Bridge"
                      value={`${request.integration} · ${request.action}`}
                    />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                <RequestReviewCard request={request} showDetailLink={false} />
                <div className="grid content-start gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Review boundary</CardTitle>
                      <CardDescription>
                        Safe handling rule for this specific handoff.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm">
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <div className="font-medium">Source record</div>
                        <p className="mt-1 text-muted-foreground">
                          {request.sourceRecord}
                        </p>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <div className="font-medium">Target candidate</div>
                        <p className="mt-1 text-muted-foreground">
                          {request.targetRecord}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-blue-950">
                        {request.safeBoundary}
                      </div>
                    </CardContent>
                  </Card>

                  <BridgeAttemptLedger attempts={bridgeAttempts} />
                </div>
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function DetailFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/60">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

function BridgeAttemptLedger({
  attempts,
}: {
  attempts: BridgeAttemptRecord[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bridge attempt ledger</CardTitle>
        <CardDescription>
          Immutable record of would-write payloads generated by portal intake,
          access drafts, and vendor onboarding. This proves what the portal
          intended to do without touching legacy production.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {attempts.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payload hash</TableHead>
                  <TableHead>Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.slice(0, 12).map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell className="min-w-56">
                      <div className="font-medium">
                        {attempt.sourceRequestId}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {attempt.sourceRequestType} ·{" "}
                        {formatDateTime(attempt.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-52">
                      <Badge variant="outline">{attempt.integration}</Badge>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {attempt.action} · {attempt.targetEnvironment}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{attempt.mode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          attempt.status === "dry_run"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : attempt.status === "blocked"
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }
                      >
                        {attempt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {attempt.payloadHash.slice(0, 12)}
                    </TableCell>
                    <TableCell className="min-w-80 text-sm text-muted-foreground">
                      {attempt.decisionReason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            No bridge attempts are recorded yet. Submit or backfill a portal
            request to create dry-run ledger rows.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RequestReviewCard({
  request,
  showDetailLink = true,
}: {
  request: BridgeApprovalRequest
  showDetailLink?: boolean
}) {
  const decision = getApprovalDecision(request)
  const attemptPreview = buildApprovalAttemptPreview(request)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>{request.plainTitle}</CardTitle>
            <CardDescription className="mt-1">
              {request.intakeType} · {request.requester}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {showDetailLink ? (
              <Button
                nativeButton={false}
                variant="outline"
                size="sm"
                render={
                  <Link href={`/bridge-approvals/${encodeURIComponent(request.id)}`} />
                }
              >
                Open review
              </Button>
            ) : null}
            <Badge className={statusStyles[request.status]}>
              {formatStatus(request.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {request.summary}
        </p>

        {request.intakeType === "New order" ? (
          <PortalOrderDetails request={request} />
        ) : null}
        {request.intakeType === "Vendor assignment" ? (
          <VendorAssignmentDetails request={request} />
        ) : null}
        {request.intakeType === "Feature sheet / print" ? (
          <FeatureSheetPrintDetails request={request} />
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <div className="font-medium">Next staff action</div>
            <p className="mt-1 leading-6">{request.adminNextStep}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <div className="font-medium">Safety boundary</div>
            <p className="mt-1 leading-6">{request.safeBoundary}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <EyeIcon className="size-4 text-muted-foreground" />
              Staff checklist
            </div>
            <ul className="grid gap-2 text-sm text-muted-foreground">
              {request.operatorChecklist.map((item) => (
                <li key={item} className="rounded-xl bg-muted px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <DatabaseIcon className="size-4 text-muted-foreground" />
              Why it is safe right now
            </div>
            <div className="rounded-xl bg-muted px-3 py-2 text-sm">
              {decision.reason}
            </div>
            <div className="mt-3 rounded-xl bg-muted px-3 py-2 text-sm">
              <span className="font-medium">Rollback: </span>
              {request.rollbackNote}
            </div>
            <Button
              className="mt-3 w-full"
              variant={decision.allowed && !decision.dryRun ? "default" : "outline"}
              disabled
            >
              {decision.allowed && !decision.dryRun
                ? "Needs real approval workflow"
                : "No live push available"}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border p-3">
          <div className="mb-3 text-sm font-medium">Staff decision log</div>
          {request.persisted ? (
            <StaffDecisionForm request={request} />
          ) : (
            <div className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
              Sample item only. Submit a real portal request to enable status
              actions.
            </div>
          )}
        </div>

        {request.statusHistory?.length ? (
          <AuditTimeline
            title="Intake audit timeline"
            description="Staff decisions and manual handoff records for this portal request."
            items={request.statusHistory.map((entry, index) => ({
              id: `${request.id}-${entry.createdAt}-${index}`,
              tone:
                entry.status === "manually_entered_in_legacy"
                  ? "handoff"
                  : "audit",
              title: formatStatus(entry.status),
              summary:
                entry.manualLegacyEntryNote ??
                entry.note ??
                "Staff status changed in the portal audit trail.",
              timestamp: entry.createdAt,
              actor: entry.manualLegacyEnteredBy ?? entry.actorRole,
              status: entry.status,
              reference: entry.legacyReference,
            }))}
          />
        ) : null}

        <details className="rounded-2xl border bg-muted/30 p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Technical dry-run preview
          </summary>
          <pre className="mt-3 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
            {JSON.stringify(attemptPreview, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  )
}

function StaffDecisionForm({
  request,
}: {
  request: BridgeApprovalRequest
}) {
  const latestDecision = request.statusHistory?.at(-1)

  return (
    <div className="grid gap-4">
      {latestDecision ? (
        <div className="rounded-xl border bg-muted/40 px-3 py-2 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-medium">
              Last decision: {formatStatus(latestDecision.status)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDateTime(latestDecision.createdAt)}
            </div>
          </div>
          {latestDecision.legacyReference ? (
            <div className="mt-1 text-xs text-muted-foreground">
              Legacy reference: {latestDecision.legacyReference}
            </div>
          ) : null}
          {latestDecision.note ? (
            <div className="mt-2 text-muted-foreground">{latestDecision.note}</div>
          ) : null}
          {latestDecision.manualLegacyEntryNote ? (
            <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-900">
              Manual entry: {latestDecision.manualLegacyEntryNote}
            </div>
          ) : null}
          {latestDecision.followUpRequired ? (
            <Badge className="mt-2 border-amber-200 bg-amber-50 text-amber-800">
              Follow-up required
            </Badge>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
          No staff decision note is recorded yet. Add one before marking a
          request entered in legacy so the bridge trail is auditable.
        </div>
      )}

      <form action={updatePortalIntakeStatusAction} className="grid gap-3">
        <input type="hidden" name="publicRequestId" value={request.id} />
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Decision status</span>
            <select
              name="status"
              defaultValue={request.status === "submitted" ? "under_review" : request.status}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="under_review">Start / continue review</option>
              <option value="needs_info">Needs info</option>
              <option value="approved">Approved for manual entry</option>
              <option value="rejected">Rejected / do not enter</option>
              <option value="manually_entered_in_legacy">
                Mark manually entered in legacy
              </option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Legacy reference</span>
            <input
              name="legacyReference"
              className="h-10 rounded-md border bg-background px-3 text-sm"
              placeholder="Optional: TimeTap ID, invoice/order ID, folder path"
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Staff note</span>
          <textarea
            name="statusNote"
            className="min-h-20 rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="What did staff verify, approve, reject, or manually enter?"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Evidence / repair note</span>
          <textarea
            name="operatorEvidence"
            className="min-h-16 rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Optional: checked legacy screen, spoke to client, matched folder, confirmed no payment/folder automation ran."
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Manual legacy-entry note</span>
          <textarea
            name="manualLegacyEntryNote"
            className="min-h-16 rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="If staff manually entered this into legacy, record exactly what was entered and where. This is audit-only."
          />
        </label>
        <label className="flex items-start gap-2 rounded-xl border bg-muted/25 px-3 py-2 text-sm">
          <input
            type="checkbox"
            name="followUpRequired"
            className="mt-1 size-4 rounded border"
          />
          <span>
            <span className="font-medium">Follow-up required</span>
            <span className="block text-muted-foreground">
              Flag this if staff still needs to verify invoice, print, folder,
              Matterport, or client-facing delivery state.
            </span>
          </span>
        </label>
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-900">
          This records an operator decision in the portal audit trail only. It
          still does not write to TimeTap, Stripe, folders, Matterport,
          WordPress, print systems, or legacy MySQL.
        </div>
        <Button type="submit" className="w-full sm:w-fit">
          Save staff decision
        </Button>
      </form>
    </div>
  )
}

function PortalOrderDetails({ request }: { request: BridgeApprovalRequest }) {
  const address = readPayloadString(request.payload, "listingAddress")
  const area = readPayloadString(request.payload, "listingArea")
  const mls = readPayloadString(request.payload, "mlsNumber")
  const requester = readPayloadString(request.payload, "requesterName")
  const requesterEmail = readPayloadString(request.payload, "requesterEmail")
  const estimate = readPayloadString(request.payload, "estimateTotal")
  const requestedDate = readPayloadString(request.payload, "requestedDate")
  const requestedWindow = readPayloadString(request.payload, "requestedWindow")
  const staffPreference = readPayloadString(request.payload, "staffPreference")
  const paymentMode = readPayloadString(request.payload, "paymentMode")
  const services = readPayloadServices(request.payload)
  const readinessWarnings = readPayloadReadinessWarnings(request.payload)
  const pricingMapping = readPayloadRecord(request.payload, "legacyPricingMapping")
  const operationalMapping = readPayloadRecord(request.payload, "legacyOperationalMapping")
  const access = readPayloadRecord(operationalMapping, "access")
  const photoRequirements = readPayloadRecord(
    operationalMapping,
    "photoRequirements"
  )
  const measurementRequirements = readPayloadRecord(
    operationalMapping,
    "measurementRequirements"
  )

  return (
    <div className="grid gap-3 rounded-2xl border bg-muted/25 p-4 text-sm md:grid-cols-2">
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Listing request
        </div>
        <div className="mt-2 font-medium">{address || "No address captured"}</div>
        <div className="mt-1 text-muted-foreground">
          {[area, mls ? `MLS ${mls}` : ""].filter(Boolean).join(" · ")}
        </div>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Requester
        </div>
        <div className="mt-2 font-medium">{requester || request.requester}</div>
        <div className="mt-1 text-muted-foreground">{requesterEmail}</div>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Timing and payment
        </div>
        <div className="mt-2 font-medium">
          {requestedDate || "No date captured"}
          {requestedWindow ? ` · ${requestedWindow}` : ""}
        </div>
        <div className="mt-1 text-muted-foreground">
          {[estimate, paymentMode].filter(Boolean).join(" · ")}
        </div>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Services
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {services.length ? (
            services.map((service) => (
              <Badge key={service} variant="outline">
                {service}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">No services captured</span>
          )}
        </div>
      </div>
      <div className="rounded-2xl border bg-background p-3 md:col-span-2">
        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Handoff warnings
          </div>
          <Badge variant={readinessWarnings.length ? "outline" : "secondary"}>
            {readinessWarnings.length
              ? `${readinessWarnings.length} needs review`
              : "No warnings captured"}
          </Badge>
        </div>
        {readinessWarnings.length ? (
          <div className="grid gap-2 md:grid-cols-2">
            {readinessWarnings.slice(0, 6).map((warning) => (
              <div
                key={`${warning.category}-${warning.label}`}
                className="rounded-xl bg-muted px-3 py-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{warning.label}</span>
                  <Badge
                    variant={
                      warning.severity === "blocking"
                        ? "destructive"
                        : warning.severity === "review"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {warning.severity}
                  </Badge>
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {warning.category}
                </div>
                <p className="mt-1 text-muted-foreground">{warning.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-muted px-3 py-2 text-muted-foreground">
            Older sample items may not include warning metadata. Newly submitted
            portal orders will carry the same warnings shown on the review step.
          </div>
        )}
      </div>
      <SchedulingReviewCard
        request={request}
        requestedDate={requestedDate}
        requestedWindow={requestedWindow}
        staffPreference={staffPreference}
        services={services}
        pricingMapping={pricingMapping}
        operationalMapping={operationalMapping}
      />
      <JobDecompositionPreview
        services={services}
        pricingMapping={pricingMapping}
        operationalMapping={operationalMapping}
      />
      <div className="rounded-2xl border bg-background p-3 md:col-span-2">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Legacy create-order preview
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <PreviewFact
            label="Sq ft"
            value={[
              readRecordString(pricingMapping, "livable"),
              readRecordString(pricingMapping, "nonLivable")
                ? `non-livable ${readRecordString(pricingMapping, "nonLivable")}`
                : "",
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <PreviewFact
            label="Photography"
            value={[
              readRecordString(pricingMapping, "photgraphyType"),
              readRecordString(pricingMapping, "photos")
                ? `${readRecordString(pricingMapping, "photos")} photos`
                : "",
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <PreviewFact
            label="Floor plan"
            value={[
              readRecordString(pricingMapping, "fpType"),
              readRecordString(pricingMapping, "levels3d")
                ? `${readRecordString(pricingMapping, "levels3d")} 3D levels`
                : "",
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <PreviewFact
            label="Matterport / video"
            value={[
              readRecordString(pricingMapping, "matterportType"),
              readRecordString(pricingMapping, "videographyLength")
                ? `${readRecordString(pricingMapping, "videographyLength")} sec`
                : "",
            ]
              .filter(Boolean)
              .join(" · ")}
          />
        </div>
      </div>
      <div className="rounded-2xl border bg-background p-3 md:col-span-2">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Field crew / ops preview
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <PreviewFact
            label="Access"
            value={[
              readRecordString(access, "lockboxOnSite"),
              readRecordString(access, "lockboxLocation"),
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <PreviewFact
            label="Contact"
            value={[
              readRecordString(access, "contactName"),
              readRecordString(access, "contactPhone"),
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <PreviewFact
            label="Photo notes"
            value={[
              readRecordString(photoRequirements, "requiredPhotoCount")
                ? `${readRecordString(photoRequirements, "requiredPhotoCount")} photos`
                : "",
              readRecordString(photoRequirements, "twilightRequested"),
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <PreviewFact
            label="Measurement"
            value={[
              readRecordString(measurementRequirements, "squareFootageSource"),
              readRecordString(measurementRequirements, "restrictedAreas"),
            ]
              .filter(Boolean)
              .join(" · ")}
          />
        </div>
      </div>
      <LegacyManualEntryWorksheet
        request={request}
        pricingMapping={pricingMapping}
        operationalMapping={operationalMapping}
        services={services}
        requestedDate={requestedDate}
        requestedWindow={requestedWindow}
        staffPreference={staffPreference}
        paymentMode={paymentMode}
        estimate={estimate}
      />
    </div>
  )
}

function SchedulingReviewCard({
  request,
  requestedDate,
  requestedWindow,
  staffPreference,
  services,
  pricingMapping,
  operationalMapping,
}: {
  request: BridgeApprovalRequest
  requestedDate: string
  requestedWindow: string
  staffPreference: string
  services: string[]
  pricingMapping: Record<string, unknown>
  operationalMapping: Record<string, unknown>
}) {
  const access = readPayloadRecord(operationalMapping, "access")
  const photoRequirements = readPayloadRecord(
    operationalMapping,
    "photoRequirements"
  )
  const address = readPayloadString(request.payload, "listingAddress")
  const requiredPhotoCount = readRecordString(
    photoRequirements,
    "requiredPhotoCount"
  )
  const estimatedDuration = estimateServiceDuration(services, pricingMapping)
  const riskNotes = [
    readRecordString(access, "lockboxOnSite")
      ? `Lockbox: ${readRecordString(access, "lockboxOnSite")}`
      : "",
    readRecordString(access, "petsOnSite")
      ? `Pets: ${readRecordString(access, "petsOnSite")}`
      : "",
    readRecordString(access, "alarmSecurity")
      ? `Alarm: ${readRecordString(access, "alarmSecurity")}`
      : "",
    requiredPhotoCount ? `${requiredPhotoCount} requested photos` : "",
  ].filter(Boolean)

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-3 text-blue-950 md:col-span-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-blue-800/80">
            Scheduling intake review
          </div>
          <p className="mt-1 text-sm text-blue-900/80">
            Treat this as a staff scheduling intent. It does not book TimeTap,
            create a calendar event, notify vendors, or create folders.
          </p>
        </div>
        <Badge className="border-blue-200 bg-white text-blue-800 hover:bg-white">
          TimeTap dry-run only
        </Badge>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <PreviewFact
          label="Requested slot"
          value={[requestedDate, requestedWindow].filter(Boolean).join(" · ")}
        />
        <PreviewFact label="Staff preference" value={staffPreference} />
        <PreviewFact label="Duration estimate" value={estimatedDuration} />
        <PreviewFact
          label="Calendar source"
          value="Portal request, not confirmed TimeTap"
        />
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <div className="rounded-xl bg-white/75 px-3 py-2">
          <div className="text-xs font-medium uppercase tracking-wide text-blue-800/80">
            Match existing appointment
          </div>
          <p className="mt-1 text-sm">
            Search legacy by date, client, address, and service before creating
            anything new. Address to match: {address || "needs staff review"}.
          </p>
        </div>
        <div className="rounded-xl bg-white/75 px-3 py-2">
          <div className="text-xs font-medium uppercase tracking-wide text-blue-800/80">
            Site risk notes
          </div>
          <p className="mt-1 text-sm">
            {riskNotes.length
              ? riskNotes.join(" · ")
              : "No site risks captured yet; staff should verify access before booking."}
          </p>
        </div>
      </div>
    </div>
  )
}

function JobDecompositionPreview({
  services,
  pricingMapping,
  operationalMapping,
}: {
  services: string[]
  pricingMapping: Record<string, unknown>
  operationalMapping: Record<string, unknown>
}) {
  const jobs = buildJobDecomposition(services, pricingMapping)
  const access = readPayloadRecord(operationalMapping, "access")
  const photoRequirements = readPayloadRecord(
    operationalMapping,
    "photoRequirements"
  )

  return (
    <div className="rounded-2xl border bg-background p-3 md:col-span-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Job decomposition preview
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            This previews the portal jobs the order would become after staff
            approval. It does not assign vendors or create legacy jobs.
          </p>
        </div>
        <Badge variant="outline">Portal-only planning</Badge>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {jobs.length ? (
          jobs.map((job) => (
            <div key={job.type} className="rounded-xl bg-muted px-3 py-2">
              <div className="font-medium">{job.label}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {job.type} · {job.assignmentHint}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{job.requirements}</p>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-muted px-3 py-2 text-muted-foreground">
            No service-driven jobs can be previewed yet.
          </div>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        Requirements source: access notes, photo requirements, measurement
        notes, Matterport notes, and print/feature-sheet notes. Current access
        marker:{" "}
        {[readRecordString(access, "lockboxOnSite"), readRecordString(access, "parkingNotes")]
          .filter(Boolean)
          .join(" · ") || "needs staff review"}
        {readRecordString(photoRequirements, "mustCaptureRooms")
          ? ` · Must capture: ${readRecordString(photoRequirements, "mustCaptureRooms")}`
          : ""}
      </div>
    </div>
  )
}

function LegacyManualEntryWorksheet({
  request,
  pricingMapping,
  operationalMapping,
  services,
  requestedDate,
  requestedWindow,
  staffPreference,
  paymentMode,
  estimate,
}: {
  request: BridgeApprovalRequest
  pricingMapping: Record<string, unknown>
  operationalMapping: Record<string, unknown>
  services: string[]
  requestedDate: string
  requestedWindow: string
  staffPreference: string
  paymentMode: string
  estimate: string
}) {
  const payload = request.payload
  const access = readPayloadRecord(operationalMapping, "access")
  const photoRequirements = readPayloadRecord(
    operationalMapping,
    "photoRequirements"
  )
  const measurementRequirements = readPayloadRecord(
    operationalMapping,
    "measurementRequirements"
  )
  const serviceName = buildLegacyServiceName(services)
  const unitDisplay = [
    readPayloadString(payload, "listingUnitType"),
    readPayloadString(payload, "listingUnitNumber"),
  ]
    .filter(Boolean)
    .join(" ")
  const addressDisplay = [
    unitDisplay ? `${unitDisplay} -` : "",
    readPayloadString(payload, "listingAddress"),
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="rounded-2xl border bg-background p-3 md:col-span-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Manual legacy entry worksheet
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            These labels follow the recovered legacy DB/API fields where
            available. Copy only after staff review. This worksheet does not
            submit or sync anything.
          </p>
        </div>
        <Badge variant="outline">Dry-run copy sheet</Badge>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <WorksheetSection
          title="1. Client Management / users.*"
          rows={[
            ["users.clientName", readPayloadString(payload, "requesterName")],
            ["users.email", readPayloadString(payload, "requesterEmail")],
            ["users.brokerage", readPayloadString(payload, "brokerageName")],
            ["TimeTap: Payment Method", paymentMode],
            ["Portal requester role", readPayloadString(payload, "requesterRole")],
            ["Portal request id", request.id],
          ]}
        />
        <WorksheetSection
          title="2. Appointment Management / appointments.*"
          rows={[
            ["appointments.timetap_id", "Assigned by TimeTap/legacy after manual entry"],
            ["appointments.status", "Needs staff review"],
            ["appointments.date", requestedDate],
            ["appointments.client", readPayloadString(payload, "requesterName")],
            ["appointments.address", addressDisplay],
            ["appointments.service_name", serviceName],
            ["appointments.floor_plan", flagFromRecord(pricingMapping, "floorplan")],
            ["appointments.photos", flagFromRecord(pricingMapping, "photography")],
            ["appointments.video", flagFromRecord(pricingMapping, "videography")],
            ["appointments.matterport", flagFromRecord(pricingMapping, "matterport")],
            [
              "appointments.printed_material",
              flagFromRecord(pricingMapping, "printedMaterial"),
            ],
            ["appointments.subfolder", "Verify after folder sync/manual folder creation"],
          ]}
        />
        <WorksheetSection
          title="3. TimeTap / scheduler fields"
          rows={[
            ["Date", requestedDate],
            ["Window", requestedWindow],
            ["Staff", staffPreference],
            ["Address", addressDisplay],
            ["MLS", readPayloadString(payload, "mlsNumber")],
            [
              "Total Livable SQ FT (for MLS)",
              readRecordString(pricingMapping, "livable"),
            ],
            [
              "Total Non Livable/Extras",
              readRecordString(pricingMapping, "nonLivable"),
            ],
            [
              "Legacy action",
              "Create/confirm TimeTap appointment from the old appointment manager.",
            ],
            [
              "Folder rule",
              "Do not run folder creation until appointment details are verified.",
            ],
          ]}
        />
        <WorksheetSection
          title="4. Create pricing / getCreatePricing"
          rows={[
            ["estimateTotal", estimate],
            ["livable", readRecordString(pricingMapping, "livable")],
            ["nonLivable", readRecordString(pricingMapping, "nonLivable")],
            ["floorplan", flagFromRecord(pricingMapping, "floorplan")],
            ["fpType", readRecordString(pricingMapping, "fpType")],
            [
              "simplifiedMatterport",
              readRecordString(pricingMapping, "simplifiedMatterport"),
            ],
            ["levels3d", readRecordString(pricingMapping, "levels3d")],
            ["matterport", flagFromRecord(pricingMapping, "matterport")],
            ["matterportType", readRecordString(pricingMapping, "matterportType")],
            ["virtualStaging", flagFromRecord(pricingMapping, "virtualStaging")],
            [
              "photoEmbedding",
              readRecordString(pricingMapping, "photoEmbedding"),
            ],
          ]}
        />
        <WorksheetSection
          title="5. Photo / video pricing body"
          rows={[
            ["photography", flagFromRecord(pricingMapping, "photography")],
            ["photgraphyType", readRecordString(pricingMapping, "photgraphyType")],
            ["photos", readRecordString(pricingMapping, "photos")],
            ["dronePhotos", readRecordString(pricingMapping, "dronePhotos")],
            ["drone360", readRecordString(pricingMapping, "drone360")],
            [
              "virtualStagingPhoto",
              readRecordString(pricingMapping, "virtualStagingPhoto"),
            ],
            ["dayToTwilight", readRecordString(pricingMapping, "dayToTwilight")],
            ["image360Tour", readRecordString(pricingMapping, "image360Tour")],
            ["videography", flagFromRecord(pricingMapping, "videography")],
            ["videographyType", readRecordString(pricingMapping, "videographyType")],
            [
              "videographyLength",
              readRecordString(pricingMapping, "videographyLength"),
            ],
            ["drone", readRecordString(pricingMapping, "drone")],
            ["social", readRecordString(pricingMapping, "social")],
            ["narration", readRecordString(pricingMapping, "narration")],
            ["map3D", readRecordString(pricingMapping, "map3D")],
          ]}
        />
        <WorksheetSection
          title="6. Listing facts / feature-sheet context"
          rows={[
            ["MLS", readPayloadString(payload, "mlsNumber")],
            ["Listing URL", readPayloadString(payload, "listingPublicUrl")],
            ["Listing title", readPayloadString(payload, "listingTitle")],
            ["Price display", readPayloadString(payload, "listingPriceDisplay")],
            [
              "Beds / baths",
              [
                readPayloadValue(payload, "listingBedrooms")
                  ? `${readPayloadValue(payload, "listingBedrooms")} beds`
                  : "",
                readPayloadValue(payload, "listingBathrooms")
                  ? `${readPayloadValue(payload, "listingBathrooms")} baths`
                  : "",
              ]
                .filter(Boolean)
                .join(" / "),
            ],
            ["Property type", readPayloadString(payload, "listingPropertyType")],
            ["Neighborhood", readPayloadString(payload, "listingNeighborhood")],
            ["Verify notes", readPayloadString(payload, "listingVerifyNotes")],
            [
              "Feature-sheet notes",
              readRecordString(operationalMapping, "featureSheetNotes") ||
                readRecordString(pricingMapping, "printedMaterialNotes"),
            ],
          ]}
        />
        <WorksheetSection
          title="7. Field crew / site notes"
          rows={[
            ["lockboxOnSite", readRecordString(access, "lockboxOnSite")],
            ["lockboxLocation", readRecordString(access, "lockboxLocation")],
            ["accessCodeProvided", readRecordString(access, "accessCodeProvided")],
            ["callOnArrival", readRecordString(access, "callOnArrival")],
            [
              "arrivalContact",
              [
                readRecordString(access, "contactName"),
                readRecordString(access, "contactPhone"),
              ]
                .filter(Boolean)
                .join(" · "),
            ],
            ["occupancyStatus", readRecordString(access, "occupancyStatus")],
            ["petsOnSite", readRecordString(access, "petsOnSite")],
            ["alarmSecurity", readRecordString(access, "alarmSecurity")],
            ["parkingNotes", readRecordString(access, "parkingNotes")],
            [
              "mustCaptureRooms",
              readRecordString(photoRequirements, "mustCaptureRooms"),
            ],
            ["photoNotes", readRecordString(photoRequirements, "photoNotes")],
            [
              "measurementNotes",
              readRecordString(measurementRequirements, "measurementNotes"),
            ],
            [
              "restrictedAreas",
              readRecordString(measurementRequirements, "restrictedAreas"),
            ],
            [
              "matterportNotes",
              readRecordString(operationalMapping, "matterportNotes"),
            ],
          ]}
        />
        <WorksheetSection
          title="8. Invoice / PrintShopOrders fields"
          rows={[
            ["appointments.invoiceGenerated", "0 until staff generates invoice"],
            ["appointments.invoiceAmount", estimate],
            ["appointments.invoicePaymentStatus", "UNPAID or UNDER REVIEW"],
            ["appointments.invoiceStripePaymentID", "Do not set from portal"],
            ["appointments.invoiceOtherPaymentDetails", paymentMode],
            ["appointments.invoicePaidDate", "Blank until paid"],
            [
              "PrintShopOrders.client",
              readPayloadString(payload, "requesterName"),
            ],
            ["PrintShopOrders.address", addressDisplay],
            [
              "PrintShopOrders.product_details",
              readRecordString(pricingMapping, "printedMaterialNotes"),
            ],
            ["PrintShopOrders.quantity", "Needs staff review"],
            ["PrintShopOrders.payment", paymentMode],
            ["PrintShopOrders.notes", readPayloadString(payload, "specialInstructions")],
            [
              "PrintShopOrders.staff_notes",
              readPayloadString(payload, "specialInstructions") ||
                "Needs staff review",
            ],
          ]}
        />
      </div>

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        Legacy sequence: verify client/account, manually create or match the
        appointment, confirm estimate/payment posture, then run sync/folder
        actions only through the existing Reala tools.
      </div>
    </div>
  )
}

function WorksheetSection({
  title,
  rows,
}: {
  title: string
  rows: Array<[string, string]>
}) {
  return (
    <div className="rounded-2xl border p-3">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-3 grid gap-2">
        {rows.map(([label, value]) => (
          <WorksheetRow key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  )
}

function WorksheetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-xl bg-muted px-3 py-2 md:grid-cols-[13rem_1fr]">
      <div className="break-words font-mono text-[11px] font-semibold text-muted-foreground">
        {label}
      </div>
      <div className="break-words text-sm font-medium">
        {value || "Needs staff review"}
      </div>
    </div>
  )
}

function FeatureSheetPrintDetails({
  request,
}: {
  request: BridgeApprovalRequest
}) {
  const payload = request.payload
  const schedulerFields = readPayloadRecord(payload, "legacySchedulerFields")
  const printShopFields = readPayloadRecord(payload, "legacyPrintShopOrderFields")
  const listingAddress = readPayloadString(payload, "listingAddress")
  const actionLabel = readPayloadString(payload, "actionLabel")
  const proofStatus = readPayloadString(payload, "proofStatus")
  const proofSource = readPayloadString(payload, "proofSource")
  const selectedPhotos = readPayloadString(payload, "selectedPhotos")
  const floorPlanStatus = readPayloadString(payload, "floorPlanStatus")
  const copyTemplateNotes = readPayloadString(payload, "copyTemplateNotes")

  return (
    <div className="grid gap-3 rounded-2xl border bg-muted/25 p-4 text-sm">
      <div className="grid gap-3 md:grid-cols-3">
        <DetailBlock
          label="Feature sheet action"
          value={actionLabel || "Feature sheet draft"}
          detail={listingAddress || "Listing not captured"}
        />
        <DetailBlock
          label="Proof state"
          value={proofStatus || "Needs staff review"}
          detail={proofSource || "No proof source captured"}
        />
        <DetailBlock
          label="Source assets"
          value={selectedPhotos || "Photos need review"}
          detail={floorPlanStatus || "Floor plan needs review"}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <WorksheetSection
          title="Recovered scheduler printed-material fields"
          rows={[
            [
              "Would you like Flyers / Feature Sheets printed?",
              readRecordString(schedulerFields, "printedMaterial"),
            ],
            ["Quantity required", readRecordString(schedulerFields, "quantityRequired")],
            ["What style would you like?", readRecordString(schedulerFields, "stylePreference")],
            ["Paper Weight", readRecordString(schedulerFields, "paperWeight")],
            [
              "Hood report and/or MLS Page",
              readRecordString(schedulerFields, "hoodReportOrMlsPage"),
            ],
            [
              "Drop off or deliver flyers/feature sheets to",
              readRecordString(schedulerFields, "dropOffOrDeliverTo"),
            ],
            ["Existing floor plan", readRecordString(schedulerFields, "existingFloorPlan")],
            [
              "Printed Material Status",
              readRecordString(schedulerFields, "printedMaterialStatus"),
            ],
          ]}
        />
        <WorksheetSection
          title="PrintShopOrders dry-run copy fields"
          rows={[
            ["PrintShopOrders.client", request.requester],
            ["PrintShopOrders.address", listingAddress],
            [
              "PrintShopOrders.product_details",
              readRecordString(printShopFields, "productDetails"),
            ],
            ["PrintShopOrders.quantity", readRecordString(printShopFields, "quantity")],
            ["PrintShopOrders.payment", readRecordString(printShopFields, "payment")],
            ["PrintShopOrders.notes", readRecordString(printShopFields, "notes")],
            [
              "PrintShopOrders.staff_notes",
              readRecordString(printShopFields, "staffNotes"),
            ],
          ]}
        />
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
        Copy/template notes: {copyTemplateNotes || "Needs staff review"}. This
        is a portal-native draft only; no printed-material status, PrintShopOrders
        row, invoice, payment, PDF upload, email, or fulfillment action has run.
      </div>
    </div>
  )
}

function VendorAssignmentDetails({
  request,
}: {
  request: BridgeApprovalRequest
}) {
  const vendorName = readPayloadString(request.payload, "vendorName")
  const vendorEmail = readPayloadString(request.payload, "vendorEmail")
  const vendorCompany = readPayloadString(request.payload, "vendorCompany")
  const vendorSpecialty = readPayloadString(request.payload, "vendorSpecialty")
  const listingAddress = readPayloadString(request.payload, "listingAddress")
  const serviceType = readPayloadString(request.payload, "serviceType")
  const requestedDate = readPayloadString(request.payload, "requestedDate")
  const requestedWindow = readPayloadString(request.payload, "requestedWindow")
  const requirements = readPayloadString(request.payload, "requirements")
  const listingId = readPayloadString(request.payload, "listingId")
  const orderId = readPayloadString(request.payload, "orderId")
  const orderItemId = readPayloadString(request.payload, "orderItemId")

  return (
    <div className="grid gap-3 rounded-2xl border bg-muted/25 p-4 text-sm md:grid-cols-2">
      <DetailBlock
        label="Vendor"
        value={vendorName || "Vendor not captured"}
        detail={[vendorCompany, vendorEmail, vendorSpecialty]
          .filter(Boolean)
          .join(" · ")}
      />
      <DetailBlock
        label="Portal listing/order"
        value={listingAddress || "Listing not captured"}
        detail={[
          orderId ? `order ${orderId.slice(0, 8)}` : "",
          orderItemId ? `item ${orderItemId.slice(0, 8)}` : "",
          listingId ? `listing ${listingId.slice(0, 8)}` : "",
        ]
          .filter(Boolean)
          .join(" · ")}
      />
      <DetailBlock
        label="Service"
        value={serviceType || "Service not captured"}
        detail="Service is portal-selected and still pending staff approval."
      />
      <DetailBlock
        label="Preferred timing"
        value={requestedDate || "No date requested"}
        detail={requestedWindow || "No preferred window captured"}
      />
      <div className="rounded-2xl border bg-background p-3 md:col-span-2">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Vendor requirements
        </div>
        <p className="mt-2 leading-6 text-muted-foreground">
          {requirements || "No requirements captured yet. Staff should request details before assigning real work."}
        </p>
      </div>
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3 text-blue-900 md:col-span-2">
        This is a portal intake draft only. It has not created a workflow job,
        vendor assignment, TimeTap appointment, folder, notification, Stripe
        action, or legacy update.
      </div>
    </div>
  )
}

function DetailBlock({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail?: string
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-medium">{value}</div>
      {detail ? <div className="mt-1 text-muted-foreground">{detail}</div> : null}
    </div>
  )
}

function PreviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value || "Needs staff review"}</div>
    </div>
  )
}

function readPayloadString(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  return typeof value === "string" ? value : ""
}

function readPayloadValue(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  if (typeof value === "string") return value
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return ""
}

function flagFromRecord(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  if (typeof value === "boolean") return value ? "1" : "0"
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 0 ? "1" : "0"
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (!normalized || normalized === "false" || normalized === "0") return "0"
    return "1"
  }
  return "0"
}

function buildLegacyServiceName(services: string[]) {
  if (!services.length) return ""

  return services.join(", ")
}

function estimateServiceDuration(
  services: string[],
  pricingMapping: Record<string, unknown>
) {
  let minutes = 0

  if (serviceMatches(services, ["photo", "photography"])) minutes += 90
  if (serviceMatches(services, ["floor", "plan"])) minutes += 60
  if (serviceMatches(services, ["matterport"])) minutes += 60
  if (serviceMatches(services, ["video", "videography"])) minutes += 90
  if (serviceMatches(services, ["drone"])) minutes += 45

  const livable = Number(readRecordString(pricingMapping, "livable"))
  if (Number.isFinite(livable) && livable > 3500) minutes += 45

  if (!minutes) return "Needs staff review"
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return remainingMinutes ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`
}

function buildJobDecomposition(
  services: string[],
  pricingMapping: Record<string, unknown>
) {
  const jobs: Array<{
    type: string
    label: string
    assignmentHint: string
    requirements: string
  }> = []

  if (serviceMatches(services, ["photo", "photography"])) {
    jobs.push({
      type: "shoot_photography",
      label: "Photography shoot",
      assignmentHint: "Photographer",
      requirements: [
        readRecordString(pricingMapping, "photgraphyType"),
        readRecordString(pricingMapping, "photos")
          ? `${readRecordString(pricingMapping, "photos")} photos`
          : "",
      ]
        .filter(Boolean)
        .join(" · ") || "Confirm shot count and package.",
    })
    jobs.push({
      type: "edit_photos",
      label: "Photo edit / QC",
      assignmentHint: "Studio editor",
      requirements: "Triggered after upload; no legacy write from this preview.",
    })
  }

  if (serviceMatches(services, ["floor", "plan"])) {
    jobs.push({
      type: "shoot_floor_plan",
      label: "Floor plan scan",
      assignmentHint: "Floor-plan tech",
      requirements: [
        readRecordString(pricingMapping, "fpType"),
        readRecordString(pricingMapping, "livable")
          ? `${readRecordString(pricingMapping, "livable")} livable sqft`
          : "",
        readRecordString(pricingMapping, "nonLivable")
          ? `${readRecordString(pricingMapping, "nonLivable")} non-livable sqft`
          : "",
      ]
        .filter(Boolean)
        .join(" · ") || "Confirm livable and non-livable area.",
    })
  }

  if (serviceMatches(services, ["matterport"])) {
    jobs.push({
      type: "shoot_matterport",
      label: "Matterport capture",
      assignmentHint: "Matterport-capable tech",
      requirements:
        readRecordString(pricingMapping, "matterportType") ||
        "Confirm tour type and canonical URL policy.",
    })
  }

  if (serviceMatches(services, ["video", "videography"])) {
    jobs.push({
      type: "shoot_video",
      label: "Video shoot",
      assignmentHint: "Videographer",
      requirements: [
        readRecordString(pricingMapping, "videographyType"),
        readRecordString(pricingMapping, "videographyLength")
          ? `${readRecordString(pricingMapping, "videographyLength")} sec`
          : "",
      ]
        .filter(Boolean)
        .join(" · ") || "Confirm video style and length.",
    })
  }

  if (serviceMatches(services, ["drone"])) {
    jobs.push({
      type: "shoot_drone",
      label: "Drone capture",
      assignmentHint: "Licensed drone operator",
      requirements:
        readRecordString(pricingMapping, "dronePhotos") ||
        readRecordString(pricingMapping, "drone") ||
        "Confirm drone scope and weather window.",
    })
  }

  if (serviceMatches(services, ["virtual", "staging"])) {
    jobs.push({
      type: "virtual_staging",
      label: "Virtual staging",
      assignmentHint: "Studio/API workflow",
      requirements:
        readRecordString(pricingMapping, "virtualStagingPhoto") ||
        "Confirm room count, source images, and approval flow.",
    })
  }

  if (serviceMatches(services, ["feature", "sheet"])) {
    jobs.push({
      type: "feature_sheet",
      label: "Feature sheet",
      assignmentHint: "Designer/proof workflow",
      requirements: "Confirm template, selected assets, copy, and proof route.",
    })
  }

  if (serviceMatches(services, ["print"])) {
    jobs.push({
      type: "print_shop",
      label: "Print order",
      assignmentHint: "Print operator",
      requirements:
        readRecordString(pricingMapping, "printedMaterialNotes") ||
        "Confirm product, quantity, proof, and invoice readiness.",
    })
  }

  return jobs
}

function serviceMatches(services: string[], keywords: string[]) {
  const haystack = services.join(" ").toLowerCase()
  return keywords.every((keyword) => haystack.includes(keyword.toLowerCase()))
}

function readPayloadRecord(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function readPayloadReadinessWarnings(
  payload: Record<string, unknown>
): ReadinessWarning[] {
  const warnings = payload.readinessWarnings

  if (!Array.isArray(warnings)) return []

  return warnings.flatMap((warning) => {
    if (!warning || typeof warning !== "object") return []

    const record = warning as Record<string, unknown>
    const category = typeof record.category === "string" ? record.category : ""
    const label = typeof record.label === "string" ? record.label : ""
    const detail = typeof record.detail === "string" ? record.detail : ""
    const severity =
      record.severity === "blocking" ||
      record.severity === "review" ||
      record.severity === "info"
        ? record.severity
        : "review"

    if (!category || !label) return []

    return [{ category, label, detail, severity }]
  })
}

function readRecordString(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  if (typeof value === "string") return value
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  if (typeof value === "boolean") return value ? "Yes" : "No"
  return ""
}

function readPayloadServices(payload: Record<string, unknown>) {
  const services = payload.services

  if (!Array.isArray(services)) return []

  return services.flatMap((service) => {
    if (typeof service === "string" && service) return [service]
    if (!service || typeof service !== "object") return []

    const name = (service as Record<string, unknown>).name
    return typeof name === "string" && name ? [name] : []
  })
}

function formatStatus(status: BridgeApprovalStatus) {
  return status.replaceAll("_", " ")
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

function SummaryCard({
  icon,
  title,
  value,
  detail,
}: {
  icon: React.ReactNode
  title: string
  value: string
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
        <CardTitle>{title}</CardTitle>
        <CardDescription>{detail}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/65">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

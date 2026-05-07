import type { CSSProperties } from "react"
import {
  Building2Icon,
  ClipboardCheckIcon,
  DatabaseIcon,
  EyeIcon,
  KeyRoundIcon,
  LockKeyholeIcon,
  UserRoundPlusIcon,
} from "lucide-react"

import { updateAccessRequestStatusAction } from "@/app/actions/access-requests"
import { AppSidebar } from "@/components/app-sidebar"
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
  accessRequestStatusLabels,
  accessRequestTypeLabels,
  type AccessRequestRecord,
  type AccessRequestStatus,
} from "@/lib/access-requests"

const statusStyles: Record<AccessRequestStatus, string> = {
  submitted: "border-blue-200 bg-blue-50 text-blue-700",
  under_review: "border-cyan-200 bg-cyan-50 text-cyan-700",
  needs_info: "border-orange-200 bg-orange-50 text-orange-800",
  approved_for_manual_action: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  manually_completed: "border-slate-200 bg-slate-50 text-slate-700",
}

const riskStyles: Record<AccessRequestRecord["riskLevel"], string> = {
  low: "border-slate-200 bg-slate-50 text-slate-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-red-200 bg-red-50 text-red-700",
}

export function AccessRequestsShell({
  requests,
  initialAccess,
}: {
  requests: AccessRequestRecord[]
  initialAccess?: WorkspaceAccessSnapshot
}) {
  const pendingCount = requests.filter((request) =>
    ["submitted", "under_review", "needs_info"].includes(request.status)
  ).length
  const workspaceCount = requests.filter((request) =>
    ["workspace_request", "vendor_onboarding_request"].includes(
      request.requestType
    )
  ).length
  const roleCount = requests.filter(
    (request) => request.requestType === "role_permission_request"
  ).length
  const highRiskCount = requests.filter(
    (request) => request.riskLevel === "high"
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
          <SiteHeader title="Access Requests" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_34%),linear-gradient(135deg,#0f172a,#134e4a_48%,#1f2937)] p-6 text-white shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                      <KeyRoundIcon />
                      Workspace and access drafts
                    </Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                      Review org, role, and legacy-access requests before anything is granted
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                      This queue turns Add Organization and Add Role Permission into real portal-native records. It stays aligned with legacy client-management by capturing clientName candidates and entitlement flags, but it does not write to Clerk, Deliverables, TimeTap, Stripe, folders, or email.
                    </p>
                  </div>
                  <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur md:min-w-80">
                    <SignalRow label="Open drafts" value={`${pendingCount}`} />
                    <SignalRow label="Workspace drafts" value={`${workspaceCount}`} />
                    <SignalRow label="Role drafts" value={`${roleCount}`} />
                    <SignalRow label="High risk" value={`${highRiskCount}`} />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                  icon={<Building2Icon />}
                  title="Legacy-aware"
                  value="clientName"
                  detail="Requests capture legacy clientName candidates because the old client table is not keyed like Clerk orgs."
                />
                <SummaryCard
                  icon={<LockKeyholeIcon />}
                  title="Production safe"
                  value="No writes"
                  detail="Approval here means staff review or manual action, not automatic TimeTap, Stripe, folder, or legacy mutation."
                />
                <SummaryCard
                  icon={<ClipboardCheckIcon />}
                  title="Operator ready"
                  value="Checklist"
                  detail="Each draft carries the exact checks Reala should perform before granting access or mapping legacy."
                />
              </section>

              <Card>
                <CardHeader>
                  <CardTitle>Workspace drafts queue</CardTitle>
                  <CardDescription>
                    A compact view of pending access intent. Use the detail cards below to inspect legacy mapping candidates and dry-run payloads.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Requested access</TableHead>
                        <TableHead>Legacy candidate</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.publicRequestId}>
                          <TableCell className="min-w-72 whitespace-normal">
                            <div className="font-medium">
                              {request.requestedOrganizationName || request.requestedEmail || request.publicRequestId}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {request.publicRequestId} · {request.requesterName}
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
                            {request.legacyCandidateClientName || "Not mapped yet"}
                          </TableCell>
                          <TableCell>
                            <Badge className={riskStyles[request.riskLevel]}>
                              {request.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusStyles[request.status]}>
                              {accessRequestStatusLabels[request.status]}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <section className="grid gap-4 xl:grid-cols-2">
                {requests.map((request) => (
                  <AccessRequestCard
                    key={request.publicRequestId}
                    request={request}
                  />
                ))}
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function AccessRequestCard({ request }: { request: AccessRequestRecord }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>
              {request.requestedOrganizationName || request.requestedEmail || request.publicRequestId}
            </CardTitle>
            <CardDescription className="mt-1">
              {accessRequestTypeLabels[request.requestType]} · {request.requesterName}
            </CardDescription>
          </div>
          <Badge className={statusStyles[request.status]}>
            {accessRequestStatusLabels[request.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 rounded-2xl border bg-muted/25 p-4 text-sm md:grid-cols-2">
          <DetailBlock
            label="Requested workspace"
            value={request.requestedOrganizationName || "No org name captured"}
            detail={request.requestedWorkspaceType || request.activeWorkspaceOrganizationId || "Portal-only draft"}
          />
          <DetailBlock
            label="Requested person/role"
            value={request.requestedDisplayName || request.requestedEmail || "No person captured"}
            detail={[request.requestedRole, request.requestedEmail]
              .filter(Boolean)
              .join(" · ")}
          />
          <DetailBlock
            label="Legacy candidate"
            value={request.legacyCandidateClientName || "Not mapped yet"}
            detail={[
              request.legacyCandidateEmail,
              request.legacyCandidateTimetapId
                ? `TimeTap ${request.legacyCandidateTimetapId}`
                : "TimeTap disabled",
              request.legacyCandidateStripeCustomerIdPresent
                ? "Stripe ref present"
                : "Stripe disabled",
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <DetailBlock
            label="Requested access flags"
            value={request.requestedCapabilities.length ? "Review flags" : "No flags requested"}
            detail={request.requestedCapabilities.length ? request.requestedCapabilities.join(", ") : "Feature sheets, staging, print shop, and calculator remain unchanged."}
          />
        </div>

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
              Legacy-aligned checklist
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
              Why this is safe
            </div>
            <div className="rounded-xl bg-muted px-3 py-2 text-sm">
              This queue persists review intent only. It does not call Clerk organization APIs, legacy MySQL write routes, TimeTap, Stripe, Dropbox/Wasabi, folder automation, or email senders.
            </div>
            <div className="mt-3 rounded-xl bg-muted px-3 py-2 text-sm">
              <span className="font-medium">Rollback: </span>
              {request.rollbackNote}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <UserRoundPlusIcon className="size-4 text-muted-foreground" />
            Staff status actions
          </div>
          {request.persisted ? (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              <StatusActionButton
                requestId={request.publicRequestId}
                status="under_review"
                label="Start review"
              />
              <StatusActionButton
                requestId={request.publicRequestId}
                status="needs_info"
                label="Needs info"
                variant="outline"
              />
              <StatusActionButton
                requestId={request.publicRequestId}
                status="approved_for_manual_action"
                label="Approve manual"
                variant="outline"
              />
              <StatusActionButton
                requestId={request.publicRequestId}
                status="manually_completed"
                label="Mark done"
                variant="outline"
              />
              <StatusActionButton
                requestId={request.publicRequestId}
                status="rejected"
                label="Reject"
                variant="outline"
              />
            </div>
          ) : (
            <div className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
              Sample item only. Create a real workspace or role draft to enable status actions.
            </div>
          )}
        </div>

        <details className="rounded-2xl border bg-muted/30 p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Technical dry-run payload
          </summary>
          <pre className="mt-3 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
            {JSON.stringify(request.dryRunPayload, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  )
}

function StatusActionButton({
  requestId,
  status,
  label,
  variant = "default",
}: {
  requestId: string
  status: AccessRequestStatus
  label: string
  variant?: "default" | "outline"
}) {
  return (
    <form action={updateAccessRequestStatusAction}>
      <input type="hidden" name="publicRequestId" value={requestId} />
      <input type="hidden" name="status" value={status} />
      <Button type="submit" variant={variant} className="w-full">
        {label}
      </Button>
    </form>
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

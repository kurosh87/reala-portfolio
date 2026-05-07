import Link from "next/link"
import {
  ArrowRightIcon,
  ClipboardListIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type {
  BridgeApprovalRequest,
  BridgeApprovalStatus,
} from "@/lib/legacy-bridge-approval-data"

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

export function OrdersIntakePanel({
  requests,
}: {
  requests: BridgeApprovalRequest[]
}) {
  const orderRequests = requests.filter(
    (request) => request.intakeType === "New order" && request.persisted
  )

  return (
    <Card className="my-5 overflow-hidden border-blue-200/70 bg-blue-50/35">
      <CardHeader className="border-b bg-background/70">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardListIcon className="size-5 text-blue-600" />
              Portal order intake
            </CardTitle>
            <CardDescription>
              New portal order requests before they are manually reviewed or
              entered into legacy Reala tools.
            </CardDescription>
          </div>
          <Button nativeButton={false} variant="outline" render={<Link href="/bridge-approvals" />}>
            Open staff intake queue
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-4">
        {orderRequests.length ? (
          orderRequests.slice(0, 5).map((request) => (
            <div
              key={request.id}
              className="grid gap-3 rounded-2xl border bg-background p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div className="min-w-0">
                <OrderPayloadSummary request={request} />
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-medium">{request.id}</div>
                  <Badge className={statusStyles[request.status]}>
                    {formatStatus(request.status)}
                  </Badge>
                  <Badge variant="outline">{request.risk} risk</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {request.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{request.sourceRecord}</span>
                  <span>·</span>
                  <span>No legacy write triggered</span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground lg:w-64">
                <ClockIcon className="size-4 shrink-0" />
                {request.adminNextStep}
              </div>
            </div>
          ))
        ) : (
          <div className="grid gap-3 rounded-2xl border border-dashed bg-background p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <ShieldCheckIcon className="size-5" />
            </div>
            <div>
              <div className="font-medium">No submitted portal orders yet</div>
              <p className="text-sm text-muted-foreground">
                When a client submits from the new order flow, the request will
                appear here before staff decides how to handle it in legacy.
              </p>
            </div>
            <Button nativeButton={false} render={<Link href="/create-order" />}>
              Create test request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatStatus(status: BridgeApprovalStatus) {
  return status.replaceAll("_", " ")
}

function OrderPayloadSummary({ request }: { request: BridgeApprovalRequest }) {
  const address = readPayloadString(request.payload, "listingAddress")
  const estimate = readPayloadString(request.payload, "estimateTotal")
  const requester = readPayloadString(request.payload, "requesterName")
  const requestedDate = readPayloadString(request.payload, "requestedDate")
  const requestedWindow = readPayloadString(request.payload, "requestedWindow")
  const services = readPayloadServices(request.payload)

  return (
    <div className="mb-3 grid gap-2 rounded-2xl border bg-muted/25 p-3 text-sm">
      <div className="font-medium">
        {address || "Portal order request"}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {requester ? <span>Requester: {requester}</span> : null}
        {estimate ? <span>Estimate: {estimate}</span> : null}
        {requestedDate ? (
          <span>
            Preferred: {requestedDate}
            {requestedWindow ? `, ${requestedWindow}` : ""}
          </span>
        ) : null}
      </div>
      {services.length ? (
        <div className="flex flex-wrap gap-1.5">
          {services.slice(0, 6).map((service) => (
            <Badge key={service} variant="outline">
              {service}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function readPayloadString(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  return typeof value === "string" ? value : ""
}

function readPayloadServices(payload: Record<string, unknown>) {
  const services = payload.services

  if (!Array.isArray(services)) return []

  return services.flatMap((service) => {
    if (!service || typeof service !== "object") return []

    const name = (service as Record<string, unknown>).name
    return typeof name === "string" && name ? [name] : []
  })
}

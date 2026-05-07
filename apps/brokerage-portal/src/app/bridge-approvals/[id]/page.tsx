import { notFound } from "next/navigation"

import { BridgeApprovalDetailShell } from "@/components/bridge-approvals-shell"
import { getPortalIntakeApprovalRequest } from "@/lib/portal-intake-requests"
import { listBridgeAttemptsForSource } from "@/lib/server/bridge-attempts"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const publicRequestId = decodeURIComponent(id)
  const access = await requireWorkspaceAccess({
    capability: "approve_bridge",
    pathname: `/bridge-approvals/${publicRequestId}`,
  })
  const request = await getPortalIntakeApprovalRequest(publicRequestId)

  if (!request) notFound()

  const bridgeAttempts = await listBridgeAttemptsForSource(
    "portal_intake_request",
    request.id
  )

  return (
    <BridgeApprovalDetailShell
      request={request}
      bridgeAttempts={bridgeAttempts}
      initialAccess={access}
    />
  )
}

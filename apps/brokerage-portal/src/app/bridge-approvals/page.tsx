import { BridgeApprovalsShell } from "@/components/bridge-approvals-shell"
import {
  filterAccessRequestsForWorkspace,
  listAccessRequests,
} from "@/lib/access-requests"
import { listPortalIntakeApprovalRequests } from "@/lib/portal-intake-requests"
import { listRecentBridgeAttempts } from "@/lib/server/bridge-attempts"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"
import { getTimeTapBridgePreviews } from "@/lib/timetap-parity"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "approve_bridge",
    pathname: "/bridge-approvals",
  })
  const requests = await listPortalIntakeApprovalRequests()
  const accessRequests = filterAccessRequestsForWorkspace(
    await listAccessRequests(),
    access
  )
  const bridgeAttempts = await listRecentBridgeAttempts()
  const timeTapBridgePreviews = getTimeTapBridgePreviews()

  return (
    <BridgeApprovalsShell
      requests={requests}
      accessRequests={accessRequests}
      bridgeAttempts={bridgeAttempts}
      timeTapBridgePreviews={timeTapBridgePreviews}
      initialAccess={access}
    />
  )
}

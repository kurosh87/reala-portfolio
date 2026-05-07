import { AccessRequestsShell } from "@/components/access-requests-shell"
import {
  filterAccessRequestsForWorkspace,
  listAccessRequests,
} from "@/lib/access-requests"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "approve_bridge",
    pathname: "/access-requests",
  })
  const requests = filterAccessRequestsForWorkspace(
    await listAccessRequests(),
    access
  )

  return <AccessRequestsShell requests={requests} initialAccess={access} />
}

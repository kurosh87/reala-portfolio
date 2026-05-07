import { ApprovalsPageShell } from "@/components/approvals-page-shell"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/approvals" })

  return <ApprovalsPageShell initialAccess={access} />
}

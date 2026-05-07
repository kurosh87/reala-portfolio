import { CoexistenceAuditShell } from "@/components/coexistence-audit-shell"
import { getCoexistenceAuditSnapshot } from "@/lib/server/coexistence-audit"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "approve_bridge",
    pathname: "/coexistence-audit",
  })
  const snapshot = await getCoexistenceAuditSnapshot()

  return <CoexistenceAuditShell snapshot={snapshot} initialAccess={access} />
}

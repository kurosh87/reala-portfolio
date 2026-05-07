import { AgentsPageShell } from "@/components/agents-page-shell"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/agents" })

  return <AgentsPageShell initialAccess={access} />
}

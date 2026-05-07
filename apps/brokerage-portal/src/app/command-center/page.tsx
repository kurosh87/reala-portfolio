import { BrokerageCommandCenterShell } from "@/components/brokerage-command-center-shell"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/command-center" })

  return <BrokerageCommandCenterShell initialAccess={access} />
}

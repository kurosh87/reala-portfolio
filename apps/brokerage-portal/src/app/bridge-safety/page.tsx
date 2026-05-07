import { BridgeSafetyShell } from "@/components/bridge-safety-shell"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "approve_bridge",
    pathname: "/bridge-safety",
  })

  return <BridgeSafetyShell initialAccess={access} />
}

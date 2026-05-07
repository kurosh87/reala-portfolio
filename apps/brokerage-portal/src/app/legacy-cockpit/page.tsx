import { LegacyCockpitShell } from "@/components/legacy-cockpit-shell"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "view_legacy",
    pathname: "/legacy-cockpit",
  })

  return <LegacyCockpitShell initialAccess={access} />
}

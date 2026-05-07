import { DashboardStub } from "@/components/dashboard-stub"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/help" })

  return <DashboardStub title="Get Help" initialAccess={access} />
}

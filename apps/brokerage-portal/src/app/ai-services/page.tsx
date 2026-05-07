import { CreativeServicesCommandCenterShell } from "@/components/creative-services-command-center-shell"
import { getLiveCreativeMirror } from "@/lib/server/live-portal-data"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/ai-services" })
  const mirror = await getLiveCreativeMirror(access)

  return (
    <CreativeServicesCommandCenterShell
      mode="ai"
      initialAccess={access}
      liveMetrics={mirror.metrics}
      liveQueues={mirror.queues}
      liveSourceLabel={mirror.sourceLabel}
    />
  )
}

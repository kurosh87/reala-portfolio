import { VendorsPageShell } from "@/components/vendors-page-shell"
import {
  getLiveVendorMirror,
  getVendorAssignmentCandidates,
} from "@/lib/server/live-portal-data"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "manage_vendors",
    pathname: "/vendors",
  })
  const mirror = await getLiveVendorMirror(access)
  const assignmentCandidates = await getVendorAssignmentCandidates(access)

  return (
    <VendorsPageShell
      initialAccess={access}
      liveVendors={mirror.vendors}
      liveSourceLabel={mirror.sourceLabel}
      liveEmptyReason={mirror.emptyReason}
      assignmentCandidates={assignmentCandidates}
    />
  )
}

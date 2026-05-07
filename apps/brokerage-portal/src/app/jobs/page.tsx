import { JobsPageShell } from "@/components/jobs-page-shell"
import { getLiveJobMirror } from "@/lib/server/live-portal-data"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"
import {
  getTimeTapCalendarSummary,
  getTimeTapParityEvents,
} from "@/lib/timetap-parity"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/jobs" })
  const mirror = await getLiveJobMirror(access)
  const timeTapEvents = getTimeTapParityEvents(access)
  const timeTapSummary = getTimeTapCalendarSummary(access)

  return (
    <JobsPageShell
      initialAccess={access}
      liveEvents={[
        ...timeTapEvents,
        ...mirror.pendingReviewEvents,
        ...mirror.events,
      ]}
      pendingReviewCount={mirror.pendingReviewEvents.length}
      liveSourceLabel={`${timeTapSummary.sourceLabel}; ${mirror.sourceLabel}`}
      liveEmptyReason={mirror.emptyReason}
      timeTapSummary={timeTapSummary}
    />
  )
}

import { OpsExceptionsShell } from "@/components/ops-exceptions-shell"
import { getLiveOpsExceptionMirror } from "@/lib/server/live-portal-data"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"
import { getTimeTapCalendarExceptions } from "@/lib/timetap-parity"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "view_legacy",
    pathname: "/exceptions",
  })
  const liveOpsExceptionMirror = await getLiveOpsExceptionMirror(access)
  const timeTapCalendarExceptions = getTimeTapCalendarExceptions()

  return (
    <OpsExceptionsShell
      initialAccess={access}
      liveOpsExceptionMirror={liveOpsExceptionMirror}
      timeTapCalendarExceptions={timeTapCalendarExceptions}
    />
  )
}

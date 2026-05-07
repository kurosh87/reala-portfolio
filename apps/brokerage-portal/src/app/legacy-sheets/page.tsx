import { LegacySheetsWorkplaceShell } from "@/components/legacy-sheets-workplace-shell"
import { getLegacySheetsWorkplace } from "@/lib/server/legacy-sheets"
import {
  requireWorkspaceAccess,
  WorkspaceAccessDeniedError,
} from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/legacy-sheets" })

  if (access.activeRole !== "Reala Super Admin") {
    throw new WorkspaceAccessDeniedError(
      "Only Reala Super Admin can access Legacy Sheets."
    )
  }

  const data = await getLegacySheetsWorkplace()

  return <LegacySheetsWorkplaceShell initialAccess={access} data={data} />
}

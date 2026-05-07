import { notFound } from "next/navigation"

import { ExceptionDetailShell } from "@/components/exception-detail-shell"
import { getIntegrationExceptionDetail } from "@/lib/server/integration-exception-detail"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const exceptionId = decodeURIComponent(id)
  const access = await requireWorkspaceAccess({
    capability: "view_legacy",
    pathname: `/exceptions/${exceptionId}`,
  })
  const detail = await getIntegrationExceptionDetail(exceptionId, access)

  if (!detail) notFound()

  return <ExceptionDetailShell detail={detail} initialAccess={access} />
}

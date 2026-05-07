import { RequestSubmittedShell } from "@/components/request-submitted-shell"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const access = await requireWorkspaceAccess({
    capability: "write_portal_draft",
    pathname: "/request-submitted",
  })
  const params = await searchParams
  const request = readSearchParam(params?.request) ?? "PW-REQ-2044"
  const persisted = readSearchParam(params?.persisted) === "true"

  return (
    <RequestSubmittedShell
      requestId={request}
      persisted={persisted}
      initialAccess={access}
    />
  )
}

function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

import { NextResponse } from "next/server"

import { getCurrentWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const access = await getCurrentWorkspaceAccess({
    requestedOrganizationId: url.searchParams.get("organizationId"),
    requestedRole: url.searchParams.get("role"),
    pathname: url.searchParams.get("pathname"),
  })

  return NextResponse.json({
    userId: access.userId,
    activeOrganization: access.activeOrganization,
    activeRole: access.activeRole,
    memberships: access.memberships,
    allowedRoutes: access.allowedRoutes,
    dataScope: access.dataScope,
    bridgePolicy: access.bridgePolicy,
    canPreviewOrg: access.canPreviewOrg,
    canApproveBridge: access.canApproveBridge,
    canWritePortalDraft: access.canWritePortalDraft,
    canViewLegacy: access.canViewLegacy,
    isPreviewFallback: access.isPreviewFallback,
    source: access.source,
  })
}

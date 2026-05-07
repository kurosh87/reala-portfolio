import { NextResponse } from "next/server"

import { searchMlsListings } from "@/lib/mls-listing-provider"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  await requireWorkspaceAccess({
    capability: "write_portal_draft",
    pathname: "/create-order",
  })

  const url = new URL(request.url)
  const query = url.searchParams.get("q") ?? ""

  return NextResponse.json(await searchMlsListings(query))
}

import { notFound } from "next/navigation"

import { ProductParityDetailShell } from "@/components/product-parity-detail-shell"
import { getProductParityDetail } from "@/lib/server/product-parity"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const access = await requireWorkspaceAccess({
    pathname: `/ai-services/${id}`,
  })
  const detail = await getProductParityDetail("virtual-staging", id, access)

  if (!detail) notFound()

  return <ProductParityDetailShell detail={detail} initialAccess={access} />
}

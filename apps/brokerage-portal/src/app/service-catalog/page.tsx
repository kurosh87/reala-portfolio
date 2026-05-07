import { ServiceCatalogShell } from "@/components/service-catalog-shell"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/service-catalog" })

  return <ServiceCatalogShell initialAccess={access} />
}

import { ClientsAccessShell } from "@/components/clients-access-shell"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "manage_clients",
    pathname: "/clients",
  })

  return <ClientsAccessShell initialAccess={access} />
}

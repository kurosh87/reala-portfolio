import { BillingCommandCenterShell } from "@/components/billing-command-center-shell"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "manage_billing",
    pathname: "/billing",
  })

  return <BillingCommandCenterShell initialAccess={access} />
}

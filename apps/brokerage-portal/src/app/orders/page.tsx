import { ListingsPageShell } from "@/components/listings-page-shell"
import { OrdersIntakePanel } from "@/components/orders-intake-panel"
import { orderData } from "@/lib/listings-data"
import { listPortalIntakeApprovalRequests } from "@/lib/portal-intake-requests"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"
import { withOrderTimeTapStatuses } from "@/lib/timetap-parity"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/orders" })
  const intakeRequests = access.canApproveBridge
    ? await listPortalIntakeApprovalRequests()
    : []

  return (
    <ListingsPageShell
      initialAccess={access}
      title="Orders"
      description="Operations command center for active orders and portal intake requests."
      searchPlaceholder="Search by order #, address, MLS #, agent, or client..."
      addLabel="Add order"
      importLabel="Import / sync orders"
      tableItemLabel="Orders"
      tableData={withOrderTimeTapStatuses(orderData)}
      tableVariant="orders"
      actionsVariant="orders"
    >
      {access.canApproveBridge ? (
        <OrdersIntakePanel requests={intakeRequests} />
      ) : null}
    </ListingsPageShell>
  )
}

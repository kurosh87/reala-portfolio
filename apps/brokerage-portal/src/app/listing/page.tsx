import { ListingsPageShell } from "@/components/listings-page-shell"
import { combinedListingRows } from "@/lib/legacy-listing-adapter"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/listing" })

  return (
    <ListingsPageShell
      initialAccess={access}
      title="Brokerage listings"
      description="Pilot workspace for portal-native listings with mirrored legacy context where needed."
      searchPlaceholder="Search address, MLS #, agent, TimeTap mirror IDs, status, or service state..."
      addLabel="Add pilot listing"
      importLabel="Import / sync context"
      tableItemLabel="Listings"
      tableData={combinedListingRows()}
    />
  )
}

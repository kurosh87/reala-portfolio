import {
  EllipsisIcon,
  FileSpreadsheetIcon,
  ImportIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "lucide-react"
import type { ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { listingData } from "@/lib/listings-data"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

type ListingsPageShellProps = {
  title?: string
  description?: string
  searchPlaceholder?: string
  addLabel?: string
  importLabel?: string
  tableItemLabel?: string
  tableData?: React.ComponentProps<typeof DataTable>["data"]
  tableVariant?: React.ComponentProps<typeof DataTable>["variant"]
  actionsVariant?: "listings" | "orders"
  children?: ReactNode
  initialAccess?: WorkspaceAccessSnapshot
}

export function ListingsPageShell({
  title = "Listings",
  description = "Marketing command center for your portfolio.",
  searchPlaceholder = "Search by address, MLS #, agent, or listing name...",
  addLabel = "Add listing",
  importLabel = "Import / sync listings",
  tableItemLabel = "Listings",
  tableData = listingData,
  tableVariant = "listings",
  actionsVariant = "listings",
  children,
  initialAccess,
}: ListingsPageShellProps) {
  return (
    <RoleProvider initialAccess={initialAccess}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title={title} />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col p-4 lg:p-6">
              <BlurFade>
                <section className="flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-normal">
                    {title}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {actionsVariant === "orders" ? (
                    <OrderPageActions />
                  ) : (
                    <>
                      <AddListingSheet label={addLabel} />
                      <ImportListingsSheet label={importLabel} />
                    </>
                  )}
                </div>
                </section>
              </BlurFade>
              <BlurFade delay={0.06}>
                <div className="relative border-b py-4">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={searchPlaceholder}
                />
                </div>
              </BlurFade>
              <BlurFade delay={0.12}>
                {children}
                <DataTable
                  data={tableData}
                  wide
                  variant={tableVariant}
                  itemLabel={tableItemLabel}
                />
              </BlurFade>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function OrderPageActions() {
  return (
    <>
      <Button className="bg-red-600 text-white hover:bg-red-700">
        <PlusIcon />
        Create New Order
      </Button>
      <Button variant="outline">
        <ShoppingCartIcon />
        Shopping Cart
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          <EllipsisIcon />
          <span className="sr-only">Open order actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem>Import orders</DropdownMenuItem>
          <DropdownMenuItem>Export CSV</DropdownMenuItem>
          <DropdownMenuItem>View invoices</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Order settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

function AddListingSheet({ label }: { label: string }) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button className="bg-red-600 text-white hover:bg-red-700" />
        }
      >
        <PlusIcon />
        {label}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add New Listing</SheetTitle>
          <SheetDescription>
            Create a portal-native pilot listing. Legacy records are mirrored or
            deep-linked separately until cutover is approved.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
          <div className="grid gap-2">
            <Label htmlFor="mls-number">MLS number</Label>
            <Input id="mls-number" placeholder="e.g. 20854678" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="listing-address">Address</Label>
            <Input id="listing-address" placeholder="123 Main St, Dallas, TX" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="listing-agent">Listing agent</Label>
            <Input id="listing-agent" placeholder="Agent name or email" />
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 font-medium">
              <SearchIcon className="size-4" />
              MLS Search Preview
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              MLS/search results can prefill this workspace once the adapter is
              connected. For now this is safe pilot data only.
            </p>
          </div>
        </div>
        <SheetFooter>
          <Button className="bg-red-600 text-white hover:bg-red-700">
            Save pilot listing
          </Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function ImportListingsSheet({ label }: { label: string }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        <ImportIcon />
        {label}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Import Listings from CSV</SheetTitle>
          <SheetDescription>
            Validate imported listing context before anything becomes a
            production sync.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
          <div className="rounded-lg border border-dashed p-6 text-center">
            <FileSpreadsheetIcon className="mx-auto size-8 text-muted-foreground" />
            <div className="mt-3 font-medium">Upload CSV file</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Accepts exported listing sheets with address, MLS, agent, and
              status columns.
            </p>
            <Button variant="outline" className="mt-4">
              Choose file
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="csv-source">Import source name</Label>
            <Input id="csv-source" placeholder="MLS weekly export" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="csv-owner">Default owner</Label>
            <Input id="csv-owner" placeholder="Brokerage Admin" />
          </div>
        </div>
        <SheetFooter>
          <Button>Validate CSV</Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

import type { CSSProperties } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { CreateOrderCanvas } from "@/components/create-order-canvas"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({
    capability: "write_portal_draft",
    pathname: "/create-order",
  })

  return (
    <RoleProvider initialAccess={access}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="min-w-0 overflow-x-hidden">
          <SiteHeader title="Create Order" />
          <CreateOrderCanvas />
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

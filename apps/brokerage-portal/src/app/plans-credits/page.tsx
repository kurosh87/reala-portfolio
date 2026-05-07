import { AppSidebar } from "@/components/app-sidebar"
import { PlansCreditsBody } from "@/components/plans-credits-body"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireWorkspaceAccess } from "@/lib/server/workspace-access"

export const dynamic = "force-dynamic"

export default async function Page() {
  const access = await requireWorkspaceAccess({ pathname: "/plans-credits" })

  return (
    <RoleProvider initialAccess={access}>
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
          <SiteHeader title="Plans & Credits" />
          <PlansCreditsBody />
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

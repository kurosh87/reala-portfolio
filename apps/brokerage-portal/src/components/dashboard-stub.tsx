import { DashboardContent } from "@/components/dashboard-content"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

export function DashboardStub({
  title,
  initialAccess,
}: {
  title: string
  initialAccess?: WorkspaceAccessSnapshot
}) {
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
          <DashboardContent />
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

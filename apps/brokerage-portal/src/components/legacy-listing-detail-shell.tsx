import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  CircleDollarSignIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  FileCheckIcon,
  FolderIcon,
  PackageIcon,
  Share2Icon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  completionLabel,
  formatMoney,
  type LegacyAppointmentSample,
} from "@/lib/legacy-cockpit-data"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

export function LegacyListingDetailShell({
  appointment,
  initialAccess,
}: {
  appointment: LegacyAppointmentSample
  initialAccess?: WorkspaceAccessSnapshot
}) {
  const completion =
    appointment.totalServices > 0
      ? Math.round((appointment.deliveredServices / appointment.totalServices) * 100)
      : 0

  return (
    <RoleProvider initialAccess={initialAccess}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader
            title={appointment.listingLabel}
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Listings", href: "/listings" },
              { label: "Legacy mirror", href: "/legacy-cockpit" },
            ]}
          />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <Button nativeButton={false} variant="ghost" size="sm" render={<Link href="/listings" />}>
                  <ArrowLeftIcon />
                  Back to mirrored listings
                </Button>
                <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
                  <DatabaseIcon />
                  Read-only legacy mirror
                </Badge>
              </div>

              <section className="rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.14),transparent_34%),linear-gradient(135deg,#ffffff,#fff7ed)] p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{appointment.legacyId}</Badge>
                      <Badge variant="outline">{appointment.status}</Badge>
                      <Badge variant="outline">{appointment.date}</Badge>
                    </div>
                    <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight md:text-4xl">
                      {appointment.addressLabel}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {appointment.serviceName}
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-white/70 p-4 shadow-xs lg:min-w-72">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Service delivery</span>
                      <span className="font-medium">{completionLabel(appointment)}</span>
                    </div>
                    <Progress value={completion} className="mt-3" />
                    <div className="mt-3 text-xs text-muted-foreground">
                      Mirrored from `Deliverables.appointments`. Writes stay in
                      legacy tools until parity is proven.
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                  icon={<CalendarDaysIcon />}
                  label="Appointment"
                  value={appointment.status}
                  detail={`Legacy key ${appointment.legacyId}`}
                />
                <SummaryCard
                  icon={<PackageIcon />}
                  label="Services"
                  value={`${appointment.totalServices}`}
                  detail={completionLabel(appointment)}
                />
                <SummaryCard
                  icon={<CircleDollarSignIcon />}
                  label="Invoice"
                  value={appointment.invoice.generated ? "Generated" : "Not generated"}
                  detail={`${appointment.invoice.paymentStatus} / ${formatMoney(appointment.invoice.amount)}`}
                />
                <SummaryCard
                  icon={<Share2Icon />}
                  label="Shareable"
                  value={appointment.shareableEnabled ? "Configured" : "Not configured"}
                  detail={appointment.hasSubfolder ? "Uses client subfolder" : "No subfolder flag"}
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Service status mirror</CardTitle>
                    <CardDescription>
                      These rows are normalized from legacy boolean/status columns.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>New portal model</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointment.services.length ? (
                          appointment.services.map((service) => (
                            <TableRow key={service.name}>
                              <TableCell className="font-medium">{service.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{service.status}</Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                Order item -&gt; job -&gt; asset -&gt; approval
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-muted-foreground">
                              No legacy service flags were enabled on this sample record.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Exception candidates</CardTitle>
                    <CardDescription>
                      What the cockpit should make actionable before any cutover.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ExceptionRow
                      icon={<AlertTriangleIcon />}
                      title="Invoice/payment attention"
                      active={/unpaid|under review/i.test(appointment.invoice.paymentStatus)}
                      body="Payment state should deep-link to the legacy appointment manager until billing parity exists."
                    />
                    <ExceptionRow
                      icon={<FolderIcon />}
                      title="Folder sync visibility"
                      active={!appointment.hasSubfolder}
                      body="Folder presence should become an explicit storage_folders record, not a hidden script assumption."
                    />
                    <ExceptionRow
                      icon={<ExternalLinkIcon />}
                      title="Matterport canonical URL"
                      active={appointment.services.some((service) => service.name === "Matterport")}
                      body="Store model ID, generated URL, delivered URL, and mismatch status separately."
                    />
                    <ExceptionRow
                      icon={<FileCheckIcon />}
                      title="Shareable delivery state"
                      active={appointment.shareableEnabled}
                      body="Share links should become explicit records with asset visibility and audit history."
                    />
                  </CardContent>
                </Card>
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600 [&_svg]:size-5">
          {icon}
        </div>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-xl font-semibold">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{detail}</CardContent>
    </Card>
  )
}

function ExceptionRow({
  icon,
  title,
  active,
  body,
}: {
  icon: ReactNode
  title: string
  active: boolean
  body: string
}) {
  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
          {title}
        </div>
        <Badge
          className={
            active
              ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-50"
              : "border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
          }
        >
          {active ? "watch" : "clear"}
        </Badge>
      </div>
      <p className="mt-2 text-sm leading-5 text-muted-foreground">{body}</p>
    </div>
  )
}

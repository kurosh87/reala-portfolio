import Link from "next/link"
import type { CSSProperties } from "react"
import {
  ArrowLeftIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { AuditTimeline } from "@/components/audit-timeline"
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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ProductParityDetail } from "@/lib/server/product-parity"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

const kindLabels: Record<ProductParityDetail["kind"], string> = {
  "feature-sheet": "Feature sheet",
  "virtual-staging": "Virtual staging",
  print: "Print shop",
}

const backHrefs: Record<ProductParityDetail["kind"], string> = {
  "feature-sheet": "/marketing-studio",
  "virtual-staging": "/ai-services",
  print: "/print-shop",
}

export function ProductParityDetailShell({
  detail,
  initialAccess,
}: {
  detail: ProductParityDetail
  initialAccess?: WorkspaceAccessSnapshot
}) {
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
            title={kindLabels[detail.kind]}
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: kindLabels[detail.kind], href: backHrefs[detail.kind] },
            ]}
          />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <Button
                  nativeButton={false}
                  variant="ghost"
                  size="sm"
                  render={<Link href={backHrefs[detail.kind]} />}
                >
                  <ArrowLeftIcon />
                  Back to {kindLabels[detail.kind]}
                </Button>
                <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
                  <DatabaseIcon />
                  Read-only portal mirror
                </Badge>
              </div>

              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.16),transparent_32%),linear-gradient(135deg,#ffffff,#f8fafc)] p-6 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{kindLabels[detail.kind]}</Badge>
                      <Badge variant="outline">{formatLabel(detail.status)}</Badge>
                      {detail.listingLabel ? (
                        <Badge variant="outline">{detail.listingLabel}</Badge>
                      ) : null}
                    </div>
                    <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">
                      {detail.title}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {detail.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{detail.sourceLabel}</Badge>
                      <span>{detail.sourceRecord}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-white/75 p-4 shadow-xs">
                    <div className="flex items-center gap-2 font-medium">
                      <LockKeyholeIcon className="size-4 text-muted-foreground" />
                      Coexistence boundary
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {detail.safetyBoundary}
                    </p>
                    <div className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                      Target: {detail.targetRecord}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {detail.metrics.map((metric) => (
                  <Card key={metric.label}>
                    <CardHeader>
                      <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                        <FileTextIcon className="size-5" />
                      </div>
                      <CardDescription>{metric.label}</CardDescription>
                      <CardTitle className="text-2xl font-semibold">
                        {metric.value}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Parity requirements</CardTitle>
                    <CardDescription>
                      These checks show what can be reviewed before any bridge
                      or cutover conversation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {detail.requirements.map((requirement) => (
                      <div
                        key={requirement.label}
                        className="flex gap-3 rounded-2xl border p-3"
                      >
                        <div className="mt-0.5">
                          <ShieldCheckIcon
                            className={
                              requirement.status === "clear"
                                ? "size-4 text-emerald-600"
                                : "size-4 text-amber-600"
                            }
                          />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">
                              {requirement.label}
                            </span>
                            <Badge
                              variant={
                                requirement.status === "clear"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {requirement.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                            {requirement.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bridge and exception state</CardTitle>
                    <CardDescription>
                      Visible evidence only; no live adapter is available from
                      this detail view.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <SignalRow label="Open exceptions" value={detail.exceptions.length} />
                    <SignalRow
                      label="Bridge attempts"
                      value={detail.bridgeAttempts.length}
                    />
                    <SignalRow
                      label="Manual handoff"
                      value={
                        detail.timeline.some((item) => item.tone === "handoff")
                          ? "Recorded"
                          : "Not recorded"
                      }
                    />
                    {detail.listingId ? (
                      <Button
                        nativeButton={false}
                        variant="outline"
                        render={<Link href={`/listing/${detail.listingId}`} />}
                      >
                        Open listing workspace
                        <ExternalLinkIcon />
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              </section>

              <Card>
                <CardHeader>
                  <CardTitle>Related exceptions</CardTitle>
                  <CardDescription>
                    Product parity gaps are created as portal exceptions, not
                    production repairs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {detail.exceptions.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exception</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Recommended action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detail.exceptions.map((exception) => (
                          <TableRow key={exception.id}>
                            <TableCell>
                              <div className="font-medium">{exception.title}</div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                {exception.summary}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {exception.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {formatLabel(exception.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-sm text-sm text-muted-foreground">
                              {exception.recommendedAction ?? "Staff review"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="rounded-2xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
                      No product parity exceptions are attached yet.
                    </div>
                  )}
                </CardContent>
              </Card>

              <AuditTimeline
                items={detail.timeline}
                title="Product audit timeline"
                description="Product, exception, bridge, sync, audit, and manual handoff events for this parity record."
              />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function SignalRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ")
}

import type { CSSProperties, ReactNode } from "react"
import {
  AlertTriangleIcon,
  BanknoteIcon,
  CreditCardIcon,
  FileTextIcon,
  PackageIcon,
  ShieldCheckIcon,
  WalletCardsIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { RoleProvider } from "@/components/role-context"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
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
import { legacyCockpitSample } from "@/lib/legacy-cockpit-data"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

const billingCards = [
  {
    label: "Legacy invoices",
    value: legacyCockpitSample.counts.invoices.toLocaleString("en-US"),
    detail: "Mirrored invoice rows found in the local backup sample.",
    icon: FileTextIcon,
  },
  {
    label: "Unpaid / review",
    value: (
      (legacyCockpitSample.invoiceStatusCounts.UNPAID ?? 0) +
      (legacyCockpitSample.invoiceStatusCounts["UNDER REVIEW"] ?? 0)
    ).toLocaleString("en-US"),
    detail: "Needs operator review before automated billing changes.",
    icon: AlertTriangleIcon,
  },
  {
    label: "Stripe references",
    value: legacyCockpitSample.samples.clients
      .filter((client) => client.hasStripeReference)
      .length.toLocaleString("en-US"),
    detail: "Sample client rows with payment references present.",
    icon: CreditCardIcon,
  },
  {
    label: "Print orders",
    value: legacyCockpitSample.counts.printOrders.toLocaleString("en-US"),
    detail: "Print order visibility before invoice parity work.",
    icon: PackageIcon,
  },
]

const paymentStates = [
  {
    state: "Estimate created",
    owner: "Portal",
    status: "pilot-ready",
    note: "Order drafts can show package estimate, credits, discounts, and expected hold.",
  },
  {
    state: "Authorization required",
    owner: "Portal + Stripe test mode",
    status: "test-mode",
    note: "Non-account client policy is modeled before live PaymentIntents.",
  },
  {
    state: "Authorization succeeded",
    owner: "Stripe",
    status: "test-mode",
    note: "Manual-capture success path is validated in test mode only.",
  },
  {
    state: "Capture / invoice reconciliation",
    owner: "Legacy + operator",
    status: "separate approval",
    note: "Live capture, partial capture, expiry, refunds, and invoice sync are not automatic yet.",
  },
]

const exceptionRows = [
  {
    issue: "Invoice generated but unpaid",
    signal: "Payment state is unpaid after invoice generation.",
    next: "Deep-link to appointment manager; do not auto-capture.",
  },
  {
    issue: "Invoice amount without generated flag",
    signal: "Legacy amount exists but generated state is false.",
    next: "Operator review before stamping invoice state.",
  },
  {
    issue: "Print order invoice gap",
    signal: "Print order status exists outside appointment invoice flow.",
    next: "Map print invoice source before rebuild.",
  },
  {
    issue: "Card-hold readiness",
    signal: "Non-account booking needs estimate and hold policy.",
    next: "Run Stripe test-mode manual-capture proof.",
  },
]

export function BillingCommandCenterShell({
  initialAccess,
}: {
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
          <SiteHeader title="Billing" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_32%),linear-gradient(135deg,#fffaf0,#ffffff)] p-6 shadow-sm">
                <Badge className="border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-50">
                  <ShieldCheckIcon />
                  Test-mode first
                </Badge>
                <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-end">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                      Billing, holds, and invoice exceptions
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                      The portal can make billing posture visible and validate a
                      Stripe manual-capture flow in test mode. Live card holds,
                      invoice generation, and payment reconciliation remain
                      separate production approvals.
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-white/75 p-4 shadow-xs">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Hold rollout</span>
                      <span className="font-semibold">Test-mode only</span>
                    </div>
                    <Progress value={35} className="mt-3" />
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      Design and test the flow now; launch live only after
                      capture, expiry, refund, and reconciliation rules are
                      accepted.
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {billingCards.map((card) => (
                  <MetricCard key={card.label} {...card} />
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Card-hold state model</CardTitle>
                    <CardDescription>
                      This is the safe path for non-account clients before live
                      production holds.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>State</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentStates.map((row) => (
                          <TableRow key={row.state}>
                            <TableCell className="font-medium">
                              {row.state}
                            </TableCell>
                            <TableCell>{row.owner}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{row.status}</Badge>
                            </TableCell>
                            <TableCell className="max-w-md text-muted-foreground">
                              {row.note}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account terms and credits</CardTitle>
                    <CardDescription>
                      What the portal should expose before payment automation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <BillingPolicy
                      icon={<WalletCardsIcon />}
                      title="Non-account clients"
                      body="Show estimate, required hold, card-on-file status, and test-mode validation."
                    />
                    <BillingPolicy
                      icon={<BanknoteIcon />}
                      title="On-account clients"
                      body="Show account terms, discounts, package credits, and invoice posture."
                    />
                    <BillingPolicy
                      icon={<PackageIcon />}
                      title="Print and creative"
                      body="Feature sheets, staging, and print orders need explicit billing/status cards."
                    />
                  </CardContent>
                </Card>
              </section>

              <Card>
                <CardHeader>
                  <CardTitle>Billing exception queue</CardTitle>
                  <CardDescription>
                    The sprint should make these visible before any production
                    billing mutation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {exceptionRows.map((row) => (
                      <div key={row.issue} className="rounded-2xl border p-4">
                        <div className="flex items-center gap-2 font-semibold">
                          <AlertTriangleIcon className="size-4 text-amber-600" />
                          {row.issue}
                        </div>
                        <p className="mt-2 text-sm leading-5 text-muted-foreground">
                          {row.signal}
                        </p>
                        <p className="mt-3 rounded-xl bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">
                          {row.next}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: string
  detail: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-amber-50 text-amber-700">
          <Icon className="size-5" />
        </div>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-5 text-muted-foreground">
        {detail}
      </CardContent>
    </Card>
  )
}

function BillingPolicy({
  icon,
  title,
  body,
}: {
  icon: ReactNode
  title: string
  body: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl border p-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white [&_svg]:size-4">
        {icon}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

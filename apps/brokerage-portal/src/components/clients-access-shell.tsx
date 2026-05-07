import type { CSSProperties, ReactNode } from "react"
import {
  Building2Icon,
  CalculatorIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  PrinterIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersRoundIcon,
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
  legacyCockpitSample,
  type LegacyClientSample,
} from "@/lib/legacy-cockpit-data"
import type { WorkspaceAccessSnapshot } from "@/lib/workspace-access"

const entitlementLabels: Array<{
  key: keyof LegacyClientSample["entitlements"]
  label: string
  icon: ReactNode
}> = [
  { key: "featureSheet", label: "Feature sheets", icon: <FileTextIcon /> },
  { key: "virtualStaging", label: "Virtual staging", icon: <SparklesIcon /> },
  { key: "printShop", label: "Print shop", icon: <PrinterIcon /> },
  { key: "calculator", label: "Calculator", icon: <CalculatorIcon /> },
  { key: "spw", label: "SPW / websites", icon: <Building2Icon /> },
  { key: "membership", label: "Membership", icon: <ShieldCheckIcon /> },
]

const clients = legacyCockpitSample.samples.clients

function entitlementCount(key: keyof LegacyClientSample["entitlements"]) {
  return clients.filter((client) => client.entitlements[key]).length
}

const accessMetrics = [
  {
    label: "Legacy clients",
    value: legacyCockpitSample.counts.clients.toLocaleString("en-US"),
    detail: "Total mirrored user rows in the sanitized local sample/report.",
    icon: <UsersRoundIcon />,
  },
  {
    label: "Stripe references",
    value: clients
      .filter((client) => client.hasStripeReference)
      .length.toLocaleString("en-US"),
    detail: "Sample rows with payment/customer references present.",
    icon: <CreditCardIcon />,
  },
  {
    label: "Brokerage-linked",
    value: clients
      .filter((client) => client.brokeragePresent)
      .length.toLocaleString("en-US"),
    detail: "Sample rows with brokerage context detected.",
    icon: <Building2Icon />,
  },
  {
    label: "Sub-account capable",
    value: clients
      .filter((client) => client.hasSubAccounts)
      .length.toLocaleString("en-US"),
    detail: "Legacy account hierarchy signal to map before migration.",
    icon: <FolderIcon />,
  },
]

const operatorRules = [
  {
    title: "Edit safe profile fields",
    body: "Phone, social links, discounts, account notes, and access flags can be modeled in the portal.",
  },
  {
    title: "Protect identity fields",
    body: "Name and email ownership should stay governed by Clerk/legacy migration rules, not casual edits.",
  },
  {
    title: "Separate account terms",
    body: "On-account, cheque, direct deposit, and card-on-file clients need explicit billing posture.",
  },
  {
    title: "Audit every entitlement change",
    body: "Feature sheets, virtual staging, print shop, calculator, SPW, and discounts should be ledgered.",
  },
]

export function ClientsAccessShell({
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
          <SiteHeader title="Clients & Access" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_32%),linear-gradient(135deg,#f8fbff,#ffffff)] p-6 shadow-sm">
                <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
                  <ShieldCheckIcon />
                  Client management parity
                </Badge>
                <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight md:text-4xl">
                  Client access, discounts, account terms, and entitlements
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  This replaces the hidden mental map behind the legacy client
                  management portal with explicit account posture. It makes
                  feature sheets, virtual staging, print shop access, discounts,
                  social/profile info, and billing terms visible before any
                  production legacy write path is changed.
                </p>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {accessMetrics.map((metric) => (
                  <MetricCard key={metric.label} {...metric} />
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Entitlement coverage</CardTitle>
                    <CardDescription>
                      Access flags that need a clean portal-native model and
                      audit trail.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {entitlementLabels.map((item) => (
                      <EntitlementRow
                        key={item.key}
                        label={item.label}
                        icon={item.icon}
                        count={entitlementCount(item.key)}
                      />
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client access sample</CardTitle>
                    <CardDescription>
                      Sanitized legacy rows. Names, emails, raw details, and
                      payment references stay hidden.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Billing</TableHead>
                            <TableHead>Access flags</TableHead>
                            <TableHead>Boundary</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clients.slice(0, 10).map((client) => (
                            <ClientRow key={client.legacyId} client={client} />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section className="grid gap-4 lg:grid-cols-4">
                {operatorRules.map((rule) => (
                  <Card key={rule.title}>
                    <CardHeader>
                      <CardTitle className="text-base">{rule.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-5 text-muted-foreground">
                      {rule.body}
                    </CardContent>
                  </Card>
                ))}
              </section>
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
  icon,
}: {
  label: string
  value: string
  detail: string
  icon: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 [&_svg]:size-5">
          {icon}
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

function EntitlementRow({
  label,
  icon,
  count,
}: {
  label: string
  icon: ReactNode
  count: number
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border p-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-white [&_svg]:size-4">
          {icon}
        </div>
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">
            Portal-native entitlement + audit event
          </div>
        </div>
      </div>
      <Badge variant="outline">{count}</Badge>
    </div>
  )
}

function ClientRow({ client }: { client: LegacyClientSample }) {
  const enabled = Object.entries(client.entitlements)
    .filter(([, value]) => value)
    .map(([key]) => key)

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{client.clientLabel}</div>
        <div className="text-xs text-muted-foreground">{client.legacyId}</div>
      </TableCell>
      <TableCell>
        <div>{client.accountType}</div>
        <div className="text-xs text-muted-foreground">
          {client.brokeragePresent ? "Brokerage linked" : "No brokerage link"}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={
            client.hasStripeReference
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }
        >
          {client.hasStripeReference ? "card reference" : "terms unknown"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex max-w-xs flex-wrap gap-1">
          {enabled.length ? (
            enabled.map((key) => (
              <Badge key={key} variant="outline" className="text-xs">
                {key}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No flags</span>
          )}
        </div>
      </TableCell>
      <TableCell className="max-w-xs text-sm text-muted-foreground">
        Portal can model edits; legacy write path stays separate until approved.
      </TableCell>
    </TableRow>
  )
}

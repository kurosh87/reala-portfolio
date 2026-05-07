import type { CSSProperties, ReactNode } from "react"
import {
  ClipboardCheckIcon,
  DatabaseZapIcon,
  FlaskConicalIcon,
  LockKeyholeIcon,
  RadarIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  TestTube2Icon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  RoleProvider,
  type WorkspaceAccessSnapshot,
} from "@/components/role-context"
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
  bridgeModeDescriptions,
  bridgeTestingPhases,
  protectedLegacySystems,
  syntheticIdentityRules,
} from "@/lib/legacy-bridge-testing-data"
import {
  buildLegacyBridgeAttempt,
  readLegacyWriteModeFromEnv,
  type LegacyWriteMode,
} from "@/lib/legacy-bridge-safety"

const modeStyles: Record<LegacyWriteMode, string> = {
  off: "border-slate-200 bg-slate-50 text-slate-700",
  dry_run: "border-blue-200 bg-blue-50 text-blue-700",
  sandbox: "border-emerald-200 bg-emerald-50 text-emerald-700",
  admin_approved_live: "border-amber-200 bg-amber-50 text-amber-800",
}

const phaseIcons: ReactNode[] = [
  <DatabaseZapIcon key="clone" />,
  <RadarIcon key="dry-run" />,
  <ShieldOffIcon key="ghost" />,
  <TestTube2Icon key="synthetic" />,
  <ClipboardCheckIcon key="approved" />,
]

const sampleDryRunAttempt = buildLegacyBridgeAttempt({
  integration: "legacy_mysql",
  action: "create_account",
  targetEnvironment: "production",
  mode: "dry_run",
  actorId: "super-admin-preview",
  payload: {
    clientName: "TEST-PORTAL-Sample Brokerage",
    email: "test-portal-client@example.com",
    stripeSecretKey: "[example-secret-that-should-redact]",
    requestedEntitlements: ["feature_sheets", "print_shop"],
  },
})

const sampleVendorDryRunAttempts = [
  buildLegacyBridgeAttempt({
    integration: "timetap",
    action: "create_account",
    targetEnvironment: "production",
    mode: "dry_run",
    actorId: "vendor-onboarding-preview",
    payload: {
      externalReference: "TEST-PORTAL-VENDOR-dispatch@example.com",
      fullName: "TEST-PORTAL-Jordan Media",
      email: "dispatch@example.com",
      company: "Jordan Media Co.",
      serviceCapabilities: ["Photography", "Floor Plans"],
      region: "Vancouver, BC",
    },
  }),
  buildLegacyBridgeAttempt({
    integration: "stripe",
    action: "create_account",
    targetEnvironment: "production",
    mode: "dry_run",
    actorId: "vendor-onboarding-preview",
    payload: {
      externalReference: "TEST-PORTAL-VENDOR-dispatch@example.com",
      fullName: "TEST-PORTAL-Jordan Media",
      email: "dispatch@example.com",
      company: "Jordan Media Co.",
      payoutMode: "portal-note-only",
    },
  }),
]

export function BridgeSafetyShell({
  initialAccess,
}: {
  initialAccess?: WorkspaceAccessSnapshot
}) {
  const currentMode = readLegacyWriteModeFromEnv()
  const currentModeDetails = bridgeModeDescriptions[currentMode]

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
          <SiteHeader title="Bridge Safety" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_34%),linear-gradient(135deg,#0f172a,#1e293b_48%,#134e4a)] p-6 text-white shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                      <ShieldCheckIcon />
                      Legacy write guard
                    </Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                      Prove the bridge without touching live ops
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                      The new portal can mirror, dry-run, and stage bridge
                      actions before any production legacy system is allowed to
                      change. Client-facing writes stay behind an explicit
                      super-admin gate.
                    </p>
                  </div>
                  <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur md:min-w-80">
                    <SignalRow label="Current write mode" value={currentModeDetails.label} />
                    <SignalRow label="Posture" value={currentModeDetails.posture} />
                    <SignalRow label="Client live writes" value="Blocked by default" />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Object.entries(bridgeModeDescriptions).map(([mode, details]) => (
                  <Card key={mode} className={mode === currentMode ? "border-primary/50" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle>{details.label}</CardTitle>
                        <Badge className={modeStyles[mode as LegacyWriteMode]}>
                          {mode}
                        </Badge>
                      </div>
                      <CardDescription>{details.posture}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-muted-foreground">
                      {details.description}
                    </CardContent>
                  </Card>
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Testing ladder</CardTitle>
                    <CardDescription>
                      Move down this list only after the previous layer passes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bridgeTestingPhases.map((phase, index) => (
                      <div key={phase.phase} className="rounded-2xl border p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="flex gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              {phaseIcons[index]}
                            </div>
                            <div>
                              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {phase.phase}
                              </div>
                              <h3 className="text-lg font-semibold">{phase.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {phase.environment}
                              </p>
                            </div>
                          </div>
                          <Badge className={modeStyles[phase.writeMode]}>
                            {phase.writeMode}
                          </Badge>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <ActionList title="Allowed" items={phase.allowedWork} />
                          <ActionList title="Blocked" items={phase.blockedWork} />
                        </div>
                        <div className="mt-4 rounded-xl bg-muted px-3 py-2 text-sm">
                          <span className="font-medium">Acceptance: </span>
                          {phase.acceptance}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Synthetic fixture rules</CardTitle>
                      <CardDescription>
                        Anything live must look impossible to confuse with a real order.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid gap-3 text-sm text-muted-foreground">
                        {syntheticIdentityRules.map((rule) => (
                          <li key={rule} className="flex gap-2">
                            <LockKeyholeIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dry-run attempt example</CardTitle>
                      <CardDescription>
                        Account/order payloads are redacted before they are
                        exposed for review.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                        {JSON.stringify(sampleDryRunAttempt, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Vendor dry-run queue example</CardTitle>
                      <CardDescription>
                        Vendor onboarding can prepare TimeTap/Stripe would-write
                        payloads without sending them live.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                        {JSON.stringify(sampleVendorDryRunAttempts, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Card>
                <CardHeader>
                  <CardTitle>Protected legacy systems</CardTitle>
                  <CardDescription>
                    These systems stay production-owned until the bridge has
                    evidence, approval, and rollback notes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>System</TableHead>
                          <TableHead>Production risk</TableHead>
                          <TableHead>Safe test method</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {protectedLegacySystems.map((system) => (
                          <TableRow key={system.name}>
                            <TableCell className="font-medium">{system.name}</TableCell>
                            <TableCell>{system.productionRisk}</TableCell>
                            <TableCell>{system.safeTestMethod}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/65">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function ActionList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        <FlaskConicalIcon className="size-4 text-muted-foreground" />
        {title}
      </div>
      <ul className="grid gap-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-muted px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

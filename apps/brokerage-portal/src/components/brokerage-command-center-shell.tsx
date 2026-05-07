"use client"

import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import {
  ArrowRightIcon,
  Building2Icon,
  ClipboardListIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileCheckIcon,
  FolderSyncIcon,
  PackageIcon,
  ShieldCheckIcon,
  UsersRoundIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  type WorkspaceAccessSnapshot,
  type WorkspaceProfile,
  RoleProvider,
  useDashboardRole,
} from "@/components/role-context"
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
  brokerageWorkspaceItems,
  exceptionCards,
  painPointCoverage,
  pilotWorkflows,
  type PainPointCoverage,
  type PilotPriority,
  type PilotStatus,
} from "@/lib/pilot-command-center-data"

const statusLabel: Record<PilotStatus, string> = {
  "usable-pilot": "usable pilot",
  visibility: "visibility",
  "test-mode": "test mode",
  planned: "planned",
}

const statusStyles: Record<PilotStatus, string> = {
  "usable-pilot": "border-emerald-200 bg-emerald-50 text-emerald-700",
  visibility: "border-blue-200 bg-blue-50 text-blue-700",
  "test-mode": "border-amber-200 bg-amber-50 text-amber-800",
  planned: "border-slate-200 bg-slate-50 text-slate-700",
}

const priorityStyles: Record<PilotPriority, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
}

export function BrokerageCommandCenterShell({
  initialAccess,
}: {
  initialAccess?: WorkspaceAccessSnapshot
}) {
  return (
    <RoleProvider initialAccess={initialAccess}>
      <BrokerageCommandCenterContent />
    </RoleProvider>
  )
}

function BrokerageCommandCenterContent() {
  const { activeProfile } = useDashboardRole()
  const view = getCommandCenterView(activeProfile)
  const usableWorkflows = pilotWorkflows.filter(
    (workflow) => workflow.status === "usable-pilot"
  ).length
  const readiness = Math.round((usableWorkflows / pilotWorkflows.length) * 100)

  return (
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
          <SiteHeader title="Command Center" />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-5 p-4 lg:p-6">
              <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.2),transparent_32%),linear-gradient(135deg,#08111f,#172033_50%,#1f3b3f)] p-6 text-white shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                      <ShieldCheckIcon />
                      {view.eyebrow}
                    </Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                      {view.title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                      {view.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button nativeButton={false} className="bg-white text-slate-950 hover:bg-white/90" render={<Link href={activeProfile.primaryActions[0]?.href ?? activeProfile.defaultRoute} />}>
                        {activeProfile.primaryActions[0]?.label ?? "Open workspace"}
                        <ArrowRightIcon />
                      </Button>
                      {activeProfile.primaryActions[1] ? (
                        <Button
                          nativeButton={false}
                          className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                          variant="outline"
                          render={<Link href={activeProfile.primaryActions[1].href} />}
                        >
                          {activeProfile.primaryActions[1].label}
                        </Button>
                      ) : null}
                      <Button
                        nativeButton={false}
                        className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                        variant="outline"
                        render={<Link href={activeProfile.canViewLegacy ? "/legacy-cockpit" : "/bridge-safety"} />}
                      >
                        {activeProfile.canViewLegacy ? "View legacy cockpit" : "View safety rules"}
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur md:min-w-80">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/65">Pilot readiness</span>
                      <span className="font-semibold">{readiness}%</span>
                    </div>
                    <Progress value={readiness} className="mt-3 bg-white/20" />
                    <div className="mt-3 text-xs leading-5 text-white/65">
                      {view.readinessNote}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {view.metrics.map((item) => (
                  <MetricCard key={item.label} {...item} />
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>{view.workflowTitle}</CardTitle>
                    <CardDescription>
                      {view.workflowDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {pilotWorkflows.map((workflow) => (
                      <WorkflowCard key={workflow.title} workflow={workflow} />
                    ))}
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{view.exceptionTitle}</CardTitle>
                      <CardDescription>
                        {view.exceptionDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      {exceptionCards.map((card) => (
                        <ExceptionCard key={card.title} {...card} />
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{view.boundaryTitle}</CardTitle>
                      <CardDescription>
                        {view.boundaryDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <BoundaryRow
                        icon={<DatabaseIcon />}
                        title="Legacy stays production"
                        body="DigitalOcean, WordPress, TimeTap, delivery portals, and internal tools keep running."
                      />
                      <BoundaryRow
                        icon={<CreditCardIcon />}
                        title="Stripe stays protected"
                        body="Payment, payout, customer, and card-hold behavior is test-mode or dry-run until approved."
                      />
                      <BoundaryRow
                        icon={<FolderSyncIcon />}
                        title="No hidden repairs"
                        body="Folder, invoice, Matterport, and print fixes require validation before writes."
                      />
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Pain point coverage</CardTitle>
                    <CardDescription>
                      Every known pain point is covered as visibility, test-mode
                      proof, portal-native workflow, or a separate production
                      module.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pain point</TableHead>
                            <TableHead>Included now</TableHead>
                            <TableHead>Production boundary</TableHead>
                            <TableHead>Priority</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {painPointCoverage.map((item) => (
                            <PainPointRow key={item.painPoint} item={item} />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{view.objectTitle}</CardTitle>
                    <CardDescription>
                      {view.objectDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {view.objects.map((object) => (
                      <ObjectRow
                        key={object.title}
                        icon={object.icon}
                        title={object.title}
                        body={object.body}
                      />
                    ))}
                  </CardContent>
                </Card>
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
  )
}

type CommandCenterView = {
  eyebrow: string
  title: string
  description: string
  readinessNote: string
  workflowTitle: string
  workflowDescription: string
  exceptionTitle: string
  exceptionDescription: string
  boundaryTitle: string
  boundaryDescription: string
  objectTitle: string
  objectDescription: string
  metrics: BrokerageWorkspaceItemProps[]
  objects: {
    icon: ReactNode
    title: string
    body: string
  }[]
}

function getCommandCenterView(profile: WorkspaceProfile): CommandCenterView {
  if (profile.workspaceType === "vendor-workspace") {
    return {
      eyebrow: "Vendor portal preview",
      title: `${profile.scopeLabel} workspace`,
      description:
        "A scoped vendor layer for capabilities, assignments, requirements, uploads, and dry-run TimeTap/Stripe bridge review. Vendor actions stay portal-native until Reala approves a bridge.",
      readinessNote:
        "Measured by vendor onboarding, assigned-job visibility, upload readiness, and dry-run safety, not legacy writes.",
      workflowTitle: "Vendor workflow board",
      workflowDescription:
        "What vendors can manage in the portal vs. what remains protected behind Reala ops.",
      exceptionTitle: "Vendor attention stack",
      exceptionDescription:
        "Assignments, upload gaps, capacity flags, and bridge payloads that need operator review.",
      boundaryTitle: "Vendor safety posture",
      boundaryDescription:
        "Vendor onboarding creates portal drafts and dry-run payloads only.",
      objectTitle: "Vendor-native objects",
      objectDescription:
        "The vendor experience should feel real without mutating TimeTap, Stripe, or legacy storage.",
      metrics: [
        { label: "Draft vendors", value: "6", detail: "Portal provider profiles available for scoped workflow testing." },
        { label: "Assigned jobs", value: "14", detail: "Job cards visible by vendor scope, not global legacy data." },
        { label: "Dry-run payloads", value: "2", detail: "TimeTap and Stripe would-write payloads generated for review only." },
        { label: "Uploads pending", value: "3", detail: "Evidence, notes, and asset handoff states to validate." },
      ],
      objects: [
        { icon: <UsersRoundIcon />, title: "Vendor companies", body: "Company profile, members, specialties, regions, and capacity." },
        { icon: <ClipboardListIcon />, title: "Assigned jobs", body: "Job requirements, appointment windows, notes, and status." },
        { icon: <FileCheckIcon />, title: "Uploads", body: "Photos, floor plan files, evidence, revisions, and QC state." },
        { icon: <DatabaseIcon />, title: "Dry-run bridge records", body: "Sanitized TimeTap and Stripe payloads for Reala review only." },
        { icon: <ShieldCheckIcon />, title: "Scoped permissions", body: "Vendors only see their own company, jobs, clients, and uploads." },
      ],
    }
  }

  if (profile.workspaceType === "client-workspace") {
    return {
      eyebrow: "Reala client preview",
      title: "Client order workspace",
      description:
        "A clean front-office layer for starting order drafts, tracking status, reviewing assets, and seeing billing posture. Production booking, payment, and folder work stays gated.",
      readinessNote:
        "Measured by draft intake and request visibility, not live TimeTap or Stripe production writes.",
      workflowTitle: "Client request board",
      workflowDescription:
        "What a new Reala client can do before an admin pushes anything into legacy.",
      exceptionTitle: "Request attention stack",
      exceptionDescription:
        "Drafts, approvals, payment-policy questions, and delivery gaps that need operator review.",
      boundaryTitle: "Client safety posture",
      boundaryDescription:
        "Client actions create portal requests, not production bookings or charges.",
      objectTitle: "Client-native objects",
      objectDescription:
        "A usable order workspace that keeps legacy systems protected.",
      metrics: [
        { label: "Draft requests", value: "1", detail: "Portal-native requests waiting for admin review." },
        { label: "Preferred windows", value: "2", detail: "Scheduling intent collected without TimeTap writes." },
        { label: "Visible assets", value: "0", detail: "Assets appear after staff delivery or mirrored status." },
        { label: "Payment policy", value: "Test", detail: "Card-hold design remains Stripe test-mode only." },
      ],
      objects: [
        { icon: <Building2Icon />, title: "Listings", body: "Property facts, service choices, and instructions." },
        { icon: <ClipboardListIcon />, title: "Order drafts", body: "Services, estimates, preferred windows, and admin review." },
        { icon: <FileCheckIcon />, title: "Assets and approvals", body: "Proofs, revisions, downloads, and delivery state." },
        { icon: <CreditCardIcon />, title: "Billing status", body: "Terms and payment policy visibility without live captures." },
        { icon: <ShieldCheckIcon />, title: "Protected bridge", body: "No direct TimeTap, Stripe, legacy MySQL, or folder writes." },
      ],
    }
  }

  if (profile.workspaceType === "reala-internal") {
    return {
      eyebrow: "Reala ops preview",
      title: "Reala operations command center",
      description:
        "A coexistence-first cockpit for legacy mirrors, client access, vendor onboarding, exceptions, bridge safety, billing posture, and operator review.",
      readinessNote:
        "Measured by visibility, mirror accuracy, and safe dry-run review, not replacement of TimeTap, Stripe, invoices, or storage.",
      workflowTitle: "Ops workflow board",
      workflowDescription:
        "What Reala can safely monitor, draft, and review before any production mutation.",
      exceptionTitle: "Operator exception stack",
      exceptionDescription:
        "The first pain points to make visible before any repair or production write.",
      boundaryTitle: "Safe-production posture",
      boundaryDescription:
        "This keeps the pilot useful without turning it into a risky cutover.",
      objectTitle: "Operational objects",
      objectDescription:
        "The cockpit organizes the hodgepodge into stable reviewable work objects.",
      metrics: brokerageWorkspaceItems,
      objects: [
        { icon: <DatabaseIcon />, title: "Legacy mirrors", body: "Read-only appointments, clients, invoices, print orders, and exceptions." },
        { icon: <UsersRoundIcon />, title: "Vendors", body: "Draft provider profiles, capabilities, assignments, and dry-run payloads." },
        { icon: <ClipboardListIcon />, title: "Order drafts", body: "Service packages, instructions, estimates, and admin review." },
        { icon: <FileCheckIcon />, title: "Assets and approvals", body: "Feature sheets, staging, Matterport, proofs, revisions, and share state." },
        { icon: <ShieldCheckIcon />, title: "Bridge safety", body: "Explicit boundaries for TimeTap, Stripe, folders, invoices, and storage." },
      ],
    }
  }

  return {
    eyebrow: "Coexistence-first pilot",
    title: "Brokerage command center",
    description:
      "A usable front-office layer for listings, order drafts, credits, assets, approvals, and operational exceptions. Legacy systems remain production until each write path is separately approved.",
    readinessNote:
      "Measured by usable portal-native workflows, not production replacement of TimeTap, Stripe, invoices, or storage.",
    workflowTitle: "Pilot workflow board",
    workflowDescription:
      "What is usable inside the new command center vs. what remains protected behind legacy boundaries.",
    exceptionTitle: "Brokerage attention stack",
    exceptionDescription:
      "Listing, approval, asset, credit, and service issues visible to the brokerage workspace.",
    boundaryTitle: "Safe-production posture",
    boundaryDescription:
      "This keeps the pilot useful without turning it into a risky cutover.",
    objectTitle: "Portal-native objects",
    objectDescription:
      "The pilot should feel operable, even while legacy remains the source of truth.",
    metrics: brokerageWorkspaceItems,
    objects: [
      { icon: <Building2Icon />, title: "Listings", body: "Editable pilot records, mirrored legacy context, and status timeline." },
      { icon: <ClipboardListIcon />, title: "Order drafts", body: "Service packages, instructions, estimate, scheduling intent, and review." },
      { icon: <FileCheckIcon />, title: "Assets and approvals", body: "Feature sheets, staging, Matterport, proofs, revisions, and share state." },
      { icon: <PackageIcon />, title: "Credits and entitlements", body: "Brokerage terms, discounts, package credits, and access flags." },
      { icon: <UsersRoundIcon />, title: "Brokerage roles", body: "Admin, coordinator, team, agent, and support views." },
    ],
  }
}

function MetricCard({ label, value, detail }: BrokerageWorkspaceItemProps) {
  return (
    <Card>
      <CardHeader>
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

type BrokerageWorkspaceItemProps = {
  label: string
  value: string
  detail: string
}

function WorkflowCard({
  workflow,
}: {
  workflow: (typeof pilotWorkflows)[number]
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="font-semibold">{workflow.title}</div>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {workflow.description}
          </p>
        </div>
        <Badge className={statusStyles[workflow.status]}>
          {statusLabel[workflow.status]}
        </Badge>
      </div>
      <div className="mt-3 grid gap-2 rounded-xl bg-muted/40 p-3 text-xs leading-5 text-muted-foreground md:grid-cols-2">
        <div>
          <span className="font-medium text-foreground">Next:</span>{" "}
          {workflow.nextAction}
        </div>
        <div>
          <span className="font-medium text-foreground">Boundary:</span>{" "}
          {workflow.legacyBoundary}
        </div>
      </div>
    </div>
  )
}

function ExceptionCard({
  title,
  count,
  detail,
  action,
  priority,
}: {
  title: string
  count: number
  detail: string
  action: string
  priority: PilotPriority
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">{title}</div>
        <Badge className={priorityStyles[priority]}>{priority}</Badge>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">
        {count.toLocaleString("en-US")}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      <p className="mt-3 rounded-xl bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">
        {action}
      </p>
    </div>
  )
}

function PainPointRow({ item }: { item: PainPointCoverage }) {
  return (
    <TableRow>
      <TableCell className="min-w-48 font-medium">{item.painPoint}</TableCell>
      <TableCell className="min-w-64 text-muted-foreground">
        {item.included}
      </TableCell>
      <TableCell className="min-w-64 text-muted-foreground">
        {item.boundary}
      </TableCell>
      <TableCell>
        <Badge className={priorityStyles[item.priority]}>
          {item.priority}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

function BoundaryRow({
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
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 [&_svg]:size-4">
        {icon}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

function ObjectRow({
  icon,
  title,
  body,
}: {
  icon: ReactNode
  title: string
  body: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl border bg-muted/20 p-3">
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

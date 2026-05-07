import { legacyCockpitSample } from "@/lib/legacy-cockpit-data"

export type PilotPriority = "high" | "medium" | "low"
export type PilotStatus = "usable-pilot" | "visibility" | "test-mode" | "planned"

export type PilotWorkflow = {
  title: string
  description: string
  status: PilotStatus
  owner: string
  nextAction: string
  legacyBoundary: string
}

export type PainPointCoverage = {
  painPoint: string
  included: string
  boundary: string
  priority: PilotPriority
}

export type BrokerageWorkspaceItem = {
  label: string
  value: string
  detail: string
}

const invoiceAttention = legacyCockpitSample.exceptions.find(
  (exception) => exception.type === "invoice_attention"
)

const undeliveredServices = legacyCockpitSample.exceptions.find(
  (exception) => exception.type === "undelivered_services"
)

const matterportAppointments = legacyCockpitSample.samples.appointments.filter(
  (appointment) =>
    appointment.services.some((service) => service.name === "Matterport")
)

const missingFolderCandidates = legacyCockpitSample.samples.appointments.filter(
  (appointment) => !appointment.hasSubfolder
)

export const brokerageWorkspaceItems: BrokerageWorkspaceItem[] = [
  {
    label: "Pilot listings",
    value: legacyCockpitSample.samples.appointments.length.toString(),
    detail: "Sanitized listings available for portal-native workflow testing.",
  },
  {
    label: "Legacy appointments",
    value: legacyCockpitSample.counts.appointments.toLocaleString("en-US"),
    detail: "Current operational spine remains in legacy until cutover.",
  },
  {
    label: "Client records",
    value: legacyCockpitSample.counts.clients.toLocaleString("en-US"),
    detail: "Entitlements, account posture, and discounts need clean modeling.",
  },
  {
    label: "Exception signals",
    value: (
      (invoiceAttention?.count ?? 0) + (undeliveredServices?.count ?? 0)
    ).toLocaleString("en-US"),
    detail: "First queue for operator attention and acceptance review.",
  },
]

export const pilotWorkflows: PilotWorkflow[] = [
  {
    title: "Listings workspace",
    description:
      "Create and edit portal-native listing records, track service status, attach notes, and view mirrored legacy context.",
    status: "usable-pilot",
    owner: "Brokerage / agent",
    nextAction: "Make listing workspace the default command-center object.",
    legacyBoundary: "Mirrored legacy listings are never overwritten.",
  },
  {
    title: "Order and service drafts",
    description:
      "Draft service packages, instructions, estimates, and scheduling intent before any production booking write.",
    status: "usable-pilot",
    owner: "Agent / coordinator",
    nextAction: "Connect draft summary to listing workspace and service catalog.",
    legacyBoundary: "No automatic TimeTap, Stripe, invoice, or MySQL writes.",
  },
  {
    title: "Credits and billing visibility",
    description:
      "Show account terms, credits posture, invoice/payment exceptions, and card-hold readiness.",
    status: "visibility",
    owner: "Ops / accounting",
    nextAction: "Separate account terms, invoice state, and card-hold state.",
    legacyBoundary: "Invoice generation and live payment capture stay legacy/manual.",
  },
  {
    title: "Card holds",
    description:
      "Validate the non-account client hold flow with Stripe manual capture in test mode.",
    status: "test-mode",
    owner: "Ops / finance",
    nextAction: "Document capture, partial capture, cancel, expiry, and overage rules.",
    legacyBoundary: "No live production authorization/capture in this sprint.",
  },
  {
    title: "Assets and approvals",
    description:
      "Represent delivered assets, pending proofs, feature sheets, virtual staging, Matterport, and share status.",
    status: "usable-pilot",
    owner: "Agent / studio ops",
    nextAction: "Model proof, revision, approval, and delivery state per listing.",
    legacyBoundary: "Full upload, AI processing, and delivery automation remain later.",
  },
  {
    title: "Operator exception cards",
    description:
      "Surface folder/sync, Matterport, invoice, print, and booking-error issues in one place.",
    status: "visibility",
    owner: "Reala ops",
    nextAction: "Review masked exception examples with an operator before repair.",
    legacyBoundary: "Repairs are manual or separately approved until validated.",
  },
]

export const painPointCoverage: PainPointCoverage[] = [
  {
    painPoint: "Daily sync and folder creation",
    included:
      "Folder/sync visibility, missing-folder candidates, and safe next-action guidance.",
    boundary: "No automated folder writes until detector output is validated.",
    priority: "high",
  },
  {
    painPoint: "Matterport URL mismatch",
    included:
      "Canonical-link model, mismatch visibility, and generated-vs-delivered URL separation.",
    boundary: "No production publishing replacement without approval.",
    priority: "high",
  },
  {
    painPoint: "Booking errors",
    included:
      "Evidence capture, error categories, and route/service failure taxonomy.",
    boundary: "No blind booking rewrite before log samples prove the failure mode.",
    priority: "high",
  },
  {
    painPoint: "Card hold at ordering",
    included:
      "Stripe test-mode manual-capture design and operator policy checklist.",
    boundary: "No live card holds or captures in production.",
    priority: "high",
  },
  {
    painPoint: "Invoices, payment changes, and print gaps",
    included:
      "Exception cards for invoice drift, unpaid states, print status, and missing evidence.",
    boundary: "No production invoice/payment rebuild in this sprint.",
    priority: "medium",
  },
  {
    painPoint: "Client flags, discounts, and access",
    included:
      "Entitlement/account posture model for feature sheets, virtual staging, print shop, discounts, and terms.",
    boundary: "Legacy client-management writes stay in existing tools.",
    priority: "medium",
  },
  {
    painPoint: "Feature sheets and virtual staging",
    included:
      "Creative-service visibility inside listing assets, approvals, and exception state.",
    boundary: "Provider automation and full creative production workflow are later.",
    priority: "medium",
  },
  {
    painPoint: "Field tech / photographer / realtor uploads",
    included:
      "Job/upload state model and visible path from appointment to asset delivery.",
    boundary: "Full upload, AI processing, QC, and notifications are a separate module.",
    priority: "low",
  },
]

export const exceptionCards = [
  {
    title: "Folder/sync candidates",
    count: missingFolderCandidates.length,
    detail: "Sample records missing subfolder signal.",
    action: "Review expected folder rules before any repair action.",
    priority: "high" as const,
  },
  {
    title: "Matterport candidates",
    count: matterportAppointments.length,
    detail: "Sample records with Matterport service enabled.",
    action: "Separate generated, delivered, and canonical tour URLs.",
    priority: "high" as const,
  },
  {
    title: "Invoice attention",
    count: invoiceAttention?.count ?? 0,
    detail: "Unpaid, under-review, or generated-state issues.",
    action: "Keep deep link to legacy appointment manager until billing parity.",
    priority: "medium" as const,
  },
  {
    title: "Service delivery gaps",
    count: undeliveredServices?.count ?? 0,
    detail: "Flagged services not yet delivered in mirrored sample/report.",
    action: "Turn into listing-level service/job/asset cards.",
    priority: "medium" as const,
  },
]

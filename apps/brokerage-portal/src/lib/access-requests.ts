import { desc, eq } from "drizzle-orm"

import { buildLegacyBridgeAttempt } from "@/lib/legacy-bridge-safety"
import type { LegacyBridgeAttemptLike } from "@/lib/server/bridge-attempts"
import type {
  DashboardRole,
  WorkspaceAccessSnapshot,
  WorkspaceOrganizationId,
  WorkspaceType,
} from "@/lib/workspace-access"

export type AccessRequestType =
  | "workspace_request"
  | "role_permission_request"
  | "client_entitlement_request"
  | "vendor_onboarding_request"
  | "legacy_account_mapping_request"

export type AccessRequestStatus =
  | "submitted"
  | "under_review"
  | "needs_info"
  | "approved_for_manual_action"
  | "rejected"
  | "manually_completed"

export type AccessRiskLevel = "low" | "medium" | "high"

export type AccessRequestInput = {
  publicRequestId: string
  requestType: AccessRequestType
  status?: AccessRequestStatus
  riskLevel: AccessRiskLevel
  requesterClerkUserId?: string | null
  requesterName: string
  requesterEmail?: string | null
  activeWorkspaceOrganizationId?: string | null
  activeRole?: string | null
  requestedOrganizationName?: string | null
  requestedWorkspaceType?: string | null
  requestedRole?: string | null
  requestedEmail?: string | null
  requestedDisplayName?: string | null
  requestedCapabilities: string[]
  legacyCandidateUserId?: string | null
  legacyCandidateClientName?: string | null
  legacyCandidateEmail?: string | null
  legacyCandidateTimetapId?: string | null
  legacyCandidateStripeCustomerIdPresent?: boolean
  safeBoundary: string
  adminNextStep: string
  operatorChecklist: string[]
  dryRunPayload: Record<string, unknown>
  rollbackNote: string
  auditPayload?: Record<string, unknown>
}

export type AccessRequestRecord = AccessRequestInput & {
  status: AccessRequestStatus
  id: string
  createdAt: string
  updatedAt: string
  persisted: boolean
  decisionByClerkUserId?: string | null
  decisionAt?: string | null
}

export type AccessRequestCreateResult = {
  publicRequestId: string
  persisted: boolean
  error?: string
}

export const accessRequestStatusLabels: Record<AccessRequestStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  needs_info: "Needs info",
  approved_for_manual_action: "Approved for manual action",
  rejected: "Rejected",
  manually_completed: "Manually completed",
}

export const accessRequestTypeLabels: Record<AccessRequestType, string> = {
  workspace_request: "Workspace request",
  role_permission_request: "Role permission",
  client_entitlement_request: "Client entitlement",
  vendor_onboarding_request: "Vendor onboarding",
  legacy_account_mapping_request: "Legacy account mapping",
}

export async function createAccessRequest(
  input: AccessRequestInput
): Promise<AccessRequestCreateResult> {
  try {
    const { db } = await import("@/db")
    const { accessRequests } = await import("../../drizzle/schema")

    await db.insert(accessRequests).values({
      publicRequestId: input.publicRequestId,
      requestType: input.requestType,
      status: input.status ?? "submitted",
      riskLevel: input.riskLevel,
      requesterClerkUserId: input.requesterClerkUserId,
      requesterName: input.requesterName,
      requesterEmail: input.requesterEmail,
      activeWorkspaceOrganizationId: input.activeWorkspaceOrganizationId,
      activeRole: input.activeRole,
      requestedOrganizationName: input.requestedOrganizationName,
      requestedWorkspaceType: input.requestedWorkspaceType,
      requestedRole: input.requestedRole,
      requestedEmail: input.requestedEmail,
      requestedDisplayName: input.requestedDisplayName,
      requestedCapabilities: input.requestedCapabilities,
      legacyCandidateUserId: input.legacyCandidateUserId,
      legacyCandidateClientName: input.legacyCandidateClientName,
      legacyCandidateEmail: input.legacyCandidateEmail,
      legacyCandidateTimetapId: input.legacyCandidateTimetapId,
      legacyCandidateStripeCustomerIdPresent:
        input.legacyCandidateStripeCustomerIdPresent ?? false,
      safeBoundary: input.safeBoundary,
      adminNextStep: input.adminNextStep,
      operatorChecklist: input.operatorChecklist,
      dryRunPayload: input.dryRunPayload,
      rollbackNote: input.rollbackNote,
      auditPayload: input.auditPayload ?? {},
    })

    const { persistBridgeAttemptsForSource } = await import(
      "@/lib/server/bridge-attempts"
    )
    await persistBridgeAttemptsForSource(
      {
        sourceRequestType: "access_request",
        sourceRequestId: input.publicRequestId,
        sourceRecord: `portal.access_requests:${input.publicRequestId}`,
        targetRecord: getAccessRequestTargetRecord(input.requestType),
        workspaceOrganizationId: input.activeWorkspaceOrganizationId ?? null,
        activeRole: input.activeRole ?? null,
        metadata: {
          requestType: input.requestType,
          riskLevel: input.riskLevel,
        },
      },
      extractBridgeAttempts(input.dryRunPayload)
    )

    return { publicRequestId: input.publicRequestId, persisted: true }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown access request persistence error"

    console.warn("Access request was not persisted.", message)

    return {
      publicRequestId: input.publicRequestId,
      persisted: false,
      error: message,
    }
  }
}

function getAccessRequestTargetRecord(requestType: AccessRequestType) {
  if (requestType === "vendor_onboarding_request") {
    return "legacy.vendor_or_staff_account:dry-run"
  }

  if (requestType === "role_permission_request") {
    return "legacy.user_entitlement_or_clerk_membership:dry-run"
  }

  return "legacy.client_or_workspace_account:dry-run"
}

function extractBridgeAttempts(
  payload: Record<string, unknown>
): LegacyBridgeAttemptLike[] {
  const attempts = payload.attempts

  if (Array.isArray(attempts)) {
    return attempts.flatMap((attempt) =>
      isBridgeAttemptLike(attempt) ? [attempt] : []
    )
  }

  return isBridgeAttemptLike(payload) ? [payload] : []
}

function isBridgeAttemptLike(value: unknown): value is LegacyBridgeAttemptLike {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false

  const record = value as Record<string, unknown>

  return (
    typeof record.integration === "string" &&
    typeof record.action === "string" &&
    typeof record.targetEnvironment === "string" &&
    typeof record.mode === "string" &&
    typeof record.status === "string" &&
    typeof record.reason === "string"
  )
}

export async function listAccessRequests(): Promise<AccessRequestRecord[]> {
  try {
    const { db } = await import("@/db")
    const { accessRequests } = await import("../../drizzle/schema")

    const rows = await db
      .select()
      .from(accessRequests)
      .orderBy(desc(accessRequests.createdAt))
      .limit(50)

    if (!rows.length) return sampleAccessRequests

    return rows.map((row) => ({
      id: row.publicRequestId,
      publicRequestId: row.publicRequestId,
      requestType: normalizeAccessRequestType(row.requestType),
      status: normalizeAccessRequestStatus(row.status),
      riskLevel: normalizeRiskLevel(row.riskLevel),
      requesterClerkUserId: row.requesterClerkUserId,
      requesterName: row.requesterName,
      requesterEmail: row.requesterEmail,
      activeWorkspaceOrganizationId: row.activeWorkspaceOrganizationId,
      activeRole: row.activeRole,
      requestedOrganizationName: row.requestedOrganizationName,
      requestedWorkspaceType: row.requestedWorkspaceType,
      requestedRole: row.requestedRole,
      requestedEmail: row.requestedEmail,
      requestedDisplayName: row.requestedDisplayName,
      requestedCapabilities: row.requestedCapabilities ?? [],
      legacyCandidateUserId: row.legacyCandidateUserId,
      legacyCandidateClientName: row.legacyCandidateClientName,
      legacyCandidateEmail: row.legacyCandidateEmail,
      legacyCandidateTimetapId: row.legacyCandidateTimetapId,
      legacyCandidateStripeCustomerIdPresent:
        row.legacyCandidateStripeCustomerIdPresent,
      safeBoundary: row.safeBoundary,
      adminNextStep: row.adminNextStep,
      operatorChecklist: row.operatorChecklist ?? [],
      dryRunPayload: row.dryRunPayload ?? {},
      rollbackNote: row.rollbackNote,
      auditPayload: row.auditPayload ?? {},
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      decisionByClerkUserId: row.decisionByClerkUserId,
      decisionAt: row.decisionAt?.toISOString() ?? null,
      persisted: true,
    }))
  } catch (error) {
    console.warn(
      "Falling back to sample access requests. Apply the access_requests migration to persist workspace drafts.",
      error
    )
    return sampleAccessRequests
  }
}

export function filterAccessRequestsForWorkspace(
  requests: AccessRequestRecord[],
  access: Pick<
    WorkspaceAccessSnapshot,
    "activeOrganizationId" | "userId" | "canApproveBridge" | "canPreviewOrg"
  >
) {
  if (access.canPreviewOrg || access.canApproveBridge) return requests

  return requests.filter(
    (request) =>
      request.activeWorkspaceOrganizationId === access.activeOrganizationId ||
      (Boolean(access.userId) && request.requesterClerkUserId === access.userId)
  )
}

export async function updateAccessRequestStatus({
  publicRequestId,
  status,
  decisionByClerkUserId,
}: {
  publicRequestId: string
  status: AccessRequestStatus
  decisionByClerkUserId?: string | null
}) {
  try {
    const { db } = await import("@/db")
    const { accessRequests } = await import("../../drizzle/schema")

    const updated = await db
      .update(accessRequests)
      .set({
        status,
        decisionByClerkUserId,
        decisionAt: decisionStatusHasDecision(status) ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(accessRequests.publicRequestId, publicRequestId))
      .returning({ publicRequestId: accessRequests.publicRequestId })

    return { ok: updated.length > 0, publicRequestId, status }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown access request status update error"

    console.warn("Access request status was not updated.", message)

    return { ok: false, publicRequestId, status, error: message }
  }
}

export function buildWorkspaceAccessRequest(input: {
  publicRequestId: string
  requesterClerkUserId?: string | null
  requesterName?: string | null
  requesterEmail?: string | null
  activeWorkspaceOrganizationId: WorkspaceOrganizationId
  activeRole: DashboardRole
  organizationName: string
  workspaceType: WorkspaceType | string
  primaryEmail: string
  legacyClientName: string
  capabilities: string[]
  notes: string
}): AccessRequestInput {
  const workspaceType = input.workspaceType || "brokerage-workspace"
  const isVendor = workspaceType.includes("vendor")
  const requestType: AccessRequestType = isVendor
    ? "vendor_onboarding_request"
    : "workspace_request"
  const requestedName = input.organizationName || "Unnamed workspace draft"
  const legacyClientName = input.legacyClientName || requestedName
  const dryRunPayload = buildLegacyBridgeAttempt({
    integration: "legacy_mysql",
    action: "create_account",
    targetEnvironment: "production",
    mode: "dry_run",
    actorId: input.requesterClerkUserId ?? "portal-preview",
    payload: {
      requestType,
      clientName: legacyClientName,
      email: input.primaryEmail,
      brokerage: requestedName,
      featureSheet: input.capabilities.includes("featureSheet"),
      virtualStaging: input.capabilities.includes("virtualStaging"),
      printShop: input.capabilities.includes("printShop"),
      calculator: input.capabilities.includes("calculator"),
      workspaceType,
      notes: input.notes,
    },
  })

  return {
    publicRequestId: input.publicRequestId,
    requestType,
    status: "submitted",
    riskLevel: isVendor ? "high" : "medium",
    requesterClerkUserId: input.requesterClerkUserId,
    requesterName: input.requesterName || "Portal workspace request",
    requesterEmail: input.requesterEmail || input.primaryEmail || null,
    activeWorkspaceOrganizationId: input.activeWorkspaceOrganizationId,
    activeRole: input.activeRole,
    requestedOrganizationName: requestedName,
    requestedWorkspaceType: workspaceType,
    requestedRole: isVendor ? "Vendor Admin" : "Brokerage Admin",
    requestedEmail: input.primaryEmail || null,
    requestedDisplayName: requestedName,
    requestedCapabilities: input.capabilities,
    legacyCandidateClientName: legacyClientName || null,
    legacyCandidateEmail: input.primaryEmail || null,
    legacyCandidateStripeCustomerIdPresent: false,
    safeBoundary:
      "This creates a portal-native workspace draft only. It does not create a Clerk organization, legacy Deliverables.users row, TimeTap client, Stripe customer, folder, or client email.",
    adminNextStep:
      "Check whether this maps to an existing legacy clientName/brokerage/sub-account, then decide whether to create a Clerk org manually, map a legacy client, or ask for more information.",
    operatorChecklist: [
      "Confirm the requested workspace is not already represented by a legacy clientName or brokerage field.",
      "Confirm email ownership and whether this is portal-only or legacy-mapped.",
      "Confirm feature sheet, virtual staging, print shop, and calculator entitlements before any legacy manual action.",
      "Confirm TimeTap, Stripe, folder automation, and email side effects remain disabled.",
    ],
    dryRunPayload,
    rollbackNote:
      "Reject or leave as needs_info if the workspace cannot be safely mapped; no production system needs rollback because no live write occurs.",
    auditPayload: {
      source: "sidebar_add_organization_dialog",
      legacyWriteTriggered: false,
      notes: input.notes,
    },
  }
}

export function buildRolePermissionAccessRequest(input: {
  publicRequestId: string
  requesterClerkUserId?: string | null
  requesterName?: string | null
  requesterEmail?: string | null
  activeWorkspaceOrganizationId: WorkspaceOrganizationId
  activeRole: DashboardRole
  organizationName: string
  requestedEmail: string
  requestedDisplayName: string
  requestedRole: string
  legacyClientName: string
  capabilities: string[]
  notes: string
}): AccessRequestInput {
  const legacyClientName = input.legacyClientName || input.organizationName
  const dryRunPayload = buildLegacyBridgeAttempt({
    integration: "legacy_mysql",
    action: "create_account",
    targetEnvironment: "production",
    mode: "dry_run",
    actorId: input.requesterClerkUserId ?? "portal-preview",
    payload: {
      requestType: "role_permission_request",
      clientName: legacyClientName,
      email: input.requestedEmail,
      displayName: input.requestedDisplayName,
      requestedRole: input.requestedRole,
      featureSheet: input.capabilities.includes("featureSheet"),
      virtualStaging: input.capabilities.includes("virtualStaging"),
      printShop: input.capabilities.includes("printShop"),
      calculator: input.capabilities.includes("calculator"),
      notes: input.notes,
    },
  })

  return {
    publicRequestId: input.publicRequestId,
    requestType: "role_permission_request",
    status: "submitted",
    riskLevel: roleRiskLevel(input.requestedRole),
    requesterClerkUserId: input.requesterClerkUserId,
    requesterName: input.requesterName || "Portal role request",
    requesterEmail: input.requesterEmail || null,
    activeWorkspaceOrganizationId: input.activeWorkspaceOrganizationId,
    activeRole: input.activeRole,
    requestedOrganizationName: input.organizationName,
    requestedWorkspaceType: null,
    requestedRole: input.requestedRole,
    requestedEmail: input.requestedEmail || null,
    requestedDisplayName: input.requestedDisplayName || null,
    requestedCapabilities: input.capabilities,
    legacyCandidateClientName: legacyClientName || null,
    legacyCandidateEmail: input.requestedEmail || null,
    legacyCandidateStripeCustomerIdPresent: false,
    safeBoundary:
      "This creates a role/access draft only. It does not invite a Clerk user, change membership, update Deliverables.users, create TimeTap access, create Stripe records, or trigger folders.",
    adminNextStep:
      "Verify the person belongs in this organization, check for an existing legacy clientName/sub-account relationship, then manually decide whether this should become a Clerk membership, legacy mapping, or request for more information.",
    operatorChecklist: [
      "Confirm the email belongs to the intended brokerage, client, vendor, or technician.",
      "Check for an existing legacy Deliverables.users row by clientName and email before creating anything manually.",
      "Confirm role scope matches the legacy access flags and operator convention.",
      "Keep TimeTap, Stripe, field-tech auth, folders, and emails disabled unless separately approved.",
    ],
    dryRunPayload,
    rollbackNote:
      "Reject or mark needs_info if identity or legacy mapping is uncertain; no production system needs rollback because no live write occurs.",
    auditPayload: {
      source: "top_nav_add_role_permission_dialog",
      legacyWriteTriggered: false,
      notes: input.notes,
    },
  }
}

export function buildVendorOnboardingAccessRequest(input: {
  publicRequestId: string
  requesterClerkUserId?: string | null
  requesterName?: string | null
  requesterEmail?: string | null
  activeWorkspaceOrganizationId: WorkspaceOrganizationId
  activeRole: DashboardRole
  vendorName: string
  companyName: string
  vendorEmail: string
  region: string
  specialty: string
  billingNotes: string
}): AccessRequestInput {
  const companyName = input.companyName || input.vendorName || "Unnamed vendor"
  const displayName = input.vendorName || companyName
  const externalReference = `TEST-PORTAL-VENDOR-${input.vendorEmail || companyName}`
  const timetapDryRun = buildLegacyBridgeAttempt({
    integration: "timetap",
    action: "create_account",
    targetEnvironment: "production",
    mode: "dry_run",
    actorId: input.requesterClerkUserId ?? "portal-preview",
    payload: {
      externalReference,
      fullName: `TEST-PORTAL-${displayName}`,
      email: input.vendorEmail,
      company: companyName,
      serviceCapabilities: [input.specialty],
      preferredSchedulingWindow: input.region,
      notes: input.billingNotes,
    },
  })
  const stripeDryRun = buildLegacyBridgeAttempt({
    integration: "stripe",
    action: "create_account",
    targetEnvironment: "production",
    mode: "dry_run",
    actorId: input.requesterClerkUserId ?? "portal-preview",
    payload: {
      externalReference,
      fullName: `TEST-PORTAL-${displayName}`,
      email: input.vendorEmail,
      company: companyName,
      billingTerms: input.billingNotes || "Terms pending",
      payoutMode: "portal-note-only",
    },
  })

  return {
    publicRequestId: input.publicRequestId,
    requestType: "vendor_onboarding_request",
    status: "submitted",
    riskLevel: "high",
    requesterClerkUserId: input.requesterClerkUserId,
    requesterName: input.requesterName || "Portal vendor request",
    requesterEmail: input.requesterEmail || null,
    activeWorkspaceOrganizationId: input.activeWorkspaceOrganizationId,
    activeRole: input.activeRole,
    requestedOrganizationName: companyName,
    requestedWorkspaceType: "vendor-workspace",
    requestedRole: "Vendor Admin",
    requestedEmail: input.vendorEmail || null,
    requestedDisplayName: displayName,
    requestedCapabilities: [input.specialty, "portal_vendor_draft"].filter(Boolean),
    legacyCandidateUserId: null,
    legacyCandidateClientName: companyName,
    legacyCandidateEmail: input.vendorEmail || null,
    legacyCandidateTimetapId: null,
    legacyCandidateStripeCustomerIdPresent: false,
    safeBoundary:
      "This creates a portal-native vendor onboarding request only. It does not create TimeTap staff, Stripe customers, Stripe Connect accounts, legacy users, folder automation, payouts, appointments, or notification emails.",
    adminNextStep:
      "Verify the vendor identity, service capability, coverage area, insurance/business requirements, and payout policy before any manual Clerk, TimeTap, Stripe, or legacy action.",
    operatorChecklist: [
      "Confirm this vendor is not already represented in the legacy field-tech or delivery systems.",
      "Confirm service type, coverage area, capacity, billing/payout terms, and whether the vendor is internal or third-party.",
      "If TimeTap staff/resource setup is needed, do it manually after approval; the portal has not called TimeTap.",
      "If Stripe payout/customer setup is needed, do it manually or in Stripe test mode first; the portal has not called Stripe.",
      "Confirm no folder automation, appointment assignment, client notification, or production order side effect was triggered.",
    ],
    dryRunPayload: {
      attempts: [timetapDryRun, stripeDryRun],
    },
    rollbackNote:
      "Reject, mark needs_info, or leave submitted if vendor details are uncertain; no production system needs rollback because no live write occurs.",
    auditPayload: {
      source: "vendors_create_draft_vendor_dialog",
      legacyWriteTriggered: false,
      region: input.region,
      specialty: input.specialty,
      billingNotes: input.billingNotes,
    },
  }
}

export function isAccessRequestStatus(
  status: string
): status is AccessRequestStatus {
  return [
    "submitted",
    "under_review",
    "needs_info",
    "approved_for_manual_action",
    "rejected",
    "manually_completed",
  ].includes(status)
}

function normalizeAccessRequestStatus(status: string): AccessRequestStatus {
  return isAccessRequestStatus(status) ? status : "submitted"
}

function normalizeAccessRequestType(type: string): AccessRequestType {
  if (
    type === "workspace_request" ||
    type === "role_permission_request" ||
    type === "client_entitlement_request" ||
    type === "vendor_onboarding_request" ||
    type === "legacy_account_mapping_request"
  ) {
    return type
  }

  return "workspace_request"
}

function normalizeRiskLevel(risk: string): AccessRiskLevel {
  if (risk === "low" || risk === "medium" || risk === "high") return risk
  return "medium"
}

function decisionStatusHasDecision(status: AccessRequestStatus) {
  return [
    "approved_for_manual_action",
    "rejected",
    "manually_completed",
  ].includes(status)
}

function roleRiskLevel(role: string): AccessRiskLevel {
  if (["Vendor Admin", "Field Technician", "Partner Photographer"].includes(role)) {
    return "high"
  }

  if (["Brokerage Admin", "North Group Team"].includes(role)) return "medium"

  return "low"
}

const sampleAccessRequests: AccessRequestRecord[] = [
  {
    id: "BP-ACCESS-SAMPLE-1",
    publicRequestId: "BP-ACCESS-SAMPLE-1",
    requestType: "workspace_request",
    status: "submitted",
    riskLevel: "medium",
    requesterClerkUserId: null,
    requesterName: "Sample portal request",
    requesterEmail: "sample@example.com",
    activeWorkspaceOrganizationId: "reala",
    activeRole: "Reala Super Admin",
    requestedOrganizationName: "Sample Brokerage Workspace",
    requestedWorkspaceType: "brokerage-workspace",
    requestedRole: "Brokerage Admin",
    requestedEmail: "admin@example.com",
    requestedDisplayName: "Sample Brokerage Workspace",
    requestedCapabilities: ["featureSheet", "virtualStaging", "printShop"],
    legacyCandidateUserId: null,
    legacyCandidateClientName: "Sample Brokerage Workspace",
    legacyCandidateEmail: "admin@example.com",
    legacyCandidateTimetapId: null,
    legacyCandidateStripeCustomerIdPresent: false,
    safeBoundary:
      "Sample only. No Clerk, legacy, TimeTap, Stripe, folder, or email action is available.",
    adminNextStep:
      "Submit a real workspace or role draft from the switchers to replace this sample item.",
    operatorChecklist: [
      "Confirm legacy clientName mapping.",
      "Confirm entitlement flags.",
      "Confirm all production side effects remain disabled.",
    ],
    dryRunPayload: buildLegacyBridgeAttempt({
      integration: "legacy_mysql",
      action: "create_account",
      targetEnvironment: "production",
      mode: "dry_run",
      payload: {
        clientName: "Sample Brokerage Workspace",
        email: "admin@example.com",
        featureSheet: true,
        virtualStaging: true,
        printShop: true,
      },
    }),
    rollbackNote: "Sample only; no rollback applies.",
    auditPayload: { sample: true },
    createdAt: "2026-04-30T12:00:00.000Z",
    updatedAt: "2026-04-30T12:00:00.000Z",
    persisted: false,
    decisionByClerkUserId: null,
    decisionAt: null,
  },
]

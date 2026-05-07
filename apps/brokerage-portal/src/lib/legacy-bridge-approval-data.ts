import {
  buildLegacyBridgeAttempt,
  evaluateLegacyBridgeRequest,
  type LegacyBridgeAction,
  type LegacyBridgeEnvironment,
  type LegacyIntegrationKey,
  type LegacyWriteMode,
} from "@/lib/legacy-bridge-safety"

export type BridgeApprovalStatus =
  | "submitted"
  | "needs_review"
  | "under_review"
  | "needs_info"
  | "ready_for_dry_run"
  | "blocked"
  | "approved_for_sandbox"
  | "approved"
  | "rejected"
  | "manually_entered_in_legacy"

export type BridgeApprovalStatusHistoryEntry = {
  status: BridgeApprovalStatus
  note: string | null
  legacyReference: string | null
  operatorEvidence: string | null
  manualLegacyEntryNote?: string | null
  manualLegacyEnteredAt?: string | null
  manualLegacyEnteredBy?: string | null
  followUpRequired?: boolean
  actorId: string | null
  actorRole: string | null
  createdAt: string
}

export type BridgeApprovalRequest = {
  id: string
  title: string
  plainTitle: string
  requester: string
  requesterType: "new_client" | "existing_client" | "ops_admin" | "vendor"
  intakeType:
    | "New client"
    | "New order"
    | "Feature sheet / print"
    | "Vendor assignment"
    | "Ops exception"
    | "Folder repair"
  integration: LegacyIntegrationKey
  action: LegacyBridgeAction
  targetEnvironment: LegacyBridgeEnvironment
  requestedMode: LegacyWriteMode
  status: BridgeApprovalStatus
  risk: "low" | "medium" | "high"
  createdAt: string
  summary: string
  adminNextStep: string
  safeBoundary: string
  operatorChecklist: string[]
  rollbackNote: string
  sourceRecord: string
  targetRecord: string
  payload: Record<string, unknown>
  statusHistory?: BridgeApprovalStatusHistoryEntry[]
  persisted?: boolean
}

export const bridgeApprovalRequests: BridgeApprovalRequest[] = [
  {
    id: "BAR-1001",
    title: "Create TEST-PORTAL brokerage client",
    plainTitle: "New client signup waiting for Reala review",
    requester: "Portal signup flow",
    requesterType: "new_client",
    intakeType: "New client",
    integration: "legacy_mysql",
    action: "create_account",
    targetEnvironment: "production",
    requestedMode: "dry_run",
    status: "ready_for_dry_run",
    risk: "medium",
    createdAt: "2026-04-30T04:40:00.000Z",
    summary:
      "A new client account was started in the new portal. Reala staff should verify the account details, access flags, and billing posture before creating or matching a legacy client record.",
    adminNextStep:
      "Review the client details, confirm which services they should access, then keep this as dry-run until the legacy user mapping is confirmed.",
    safeBoundary:
      "This does not create a real legacy client, Stripe customer, TimeTap client, or folder.",
    operatorChecklist: [
      "Confirm TEST-PORTAL marker is present.",
      "Confirm email is not a real customer address.",
      "Confirm entitlements and discounts are ops-approved.",
      "Confirm no Stripe or TimeTap write will be triggered.",
    ],
    rollbackNote:
      "If promoted to a synthetic live fixture, mark the legacy user inactive or keep it as the permanent test account.",
    sourceRecord: "portal.users:new-signup-preview",
    targetRecord: "Deliverables.users:create",
    payload: {
      clientName: "TEST-PORTAL-Royal Pacific Pilot",
      email: "test-portal-client@example.com",
      brokerage: "Royal Pacific TEST-PORTAL",
      featureSheet: true,
      virtualStaging: true,
      printShop: true,
      accountType: "pilot-test",
    },
  },
  {
    id: "BAR-1002",
    title: "Submit staged listing order",
    plainTitle: "New order request waiting for staff review",
    requester: "Brokerage command center",
    requesterType: "existing_client",
    intakeType: "New order",
    integration: "legacy_mysql",
    action: "create_order",
    targetEnvironment: "production",
    requestedMode: "dry_run",
    status: "needs_review",
    risk: "high",
    createdAt: "2026-04-30T04:47:00.000Z",
    summary:
      "A client or brokerage user submitted a listing service request in the new portal. Staff should confirm the services, timing, pricing estimate, and legacy handoff path before the old system is touched.",
    adminNextStep:
      "Compare the request against the legacy appointment/order fields and decide whether it stays portal-native, gets manually entered, or becomes a dry-run legacy payload.",
    safeBoundary:
      "This does not book TimeTap, create folders, generate invoices, or charge/authorize a card.",
    operatorChecklist: [
      "Confirm address and service requirements are complete.",
      "Confirm calculator estimate matches the legacy billing expectation.",
      "Confirm TimeTap scheduling remains manual or read-only.",
      "Confirm folder creation will not run automatically.",
    ],
    rollbackNote:
      "Keep this as a portal-native request if legacy field mapping is incomplete; do not push partial booking data.",
    sourceRecord: "portal.orders:BP-REQ-2044",
    targetRecord: "Deliverables.appointments:dry-run",
    payload: {
      orderNumber: "TEST-PORTAL-BP-REQ-2044",
      listingAddress: "TEST-PORTAL-1234 Cypress Demo Ave",
      services: ["photos", "floor_plan", "feature_sheet", "matterport"],
      estimateCents: 87500,
      requestedDate: "2026-05-06",
    },
  },
  {
    id: "BAR-1003",
    title: "Matterport canonical override request",
    plainTitle: "Matterport link mismatch needs review",
    requester: "Ops exception queue",
    requesterType: "ops_admin",
    intakeType: "Ops exception",
    integration: "matterport",
    action: "matterport_override",
    targetEnvironment: "production",
    requestedMode: "off",
    status: "blocked",
    risk: "medium",
    createdAt: "2026-04-30T04:53:00.000Z",
    summary:
      "The generated Matterport URL and the client-delivered URL do not match. Staff should decide which URL is canonical before anything is updated.",
    adminNextStep:
      "Compare the generated, delivered, and intended canonical URLs with the actual client-facing delivery app.",
    safeBoundary:
      "This does not publish or overwrite a Matterport URL.",
    operatorChecklist: [
      "Compare generated, delivered, and intended canonical URLs.",
      "Confirm the client-facing delivery app already shows the right tour.",
      "Confirm the old generator will not overwrite the override.",
    ],
    rollbackNote:
      "If the override is wrong, restore the previous canonical URL and leave the mismatch exception open.",
    sourceRecord: "portal.exceptions:matterport-url-mismatch",
    targetRecord: "legacy.matterport_tours:update",
    payload: {
      listingAddress: "TEST-PORTAL-987 Matterport Demo Rd",
      generatedUrl: "https://matterport.example/generated-demo",
      deliveredUrl: "https://matterport.example/delivered-demo",
      canonicalUrl: "https://matterport.example/canonical-demo",
    },
  },
  {
    id: "BAR-1004",
    title: "Folder missing detector repair preview",
    plainTitle: "Missing folder repair preview",
    requester: "Legacy cockpit",
    requesterType: "ops_admin",
    intakeType: "Folder repair",
    integration: "folder_automation",
    action: "sync_folders",
    targetEnvironment: "sandbox",
    requestedMode: "sandbox",
    status: "approved_for_sandbox",
    risk: "high",
    createdAt: "2026-04-30T05:02:00.000Z",
    summary:
      "The mirror detected an appointment-like fixture without expected folder signals. Staff can preview the folder plan without running live folder automation.",
    adminNextStep:
      "Confirm the expected folder paths in sandbox and only consider a real repair after a one-record approval.",
    safeBoundary:
      "This does not create, rename, move, or delete real Dropbox/Wasabi folders.",
    operatorChecklist: [
      "Confirm sandbox storage target.",
      "Confirm legacy appointment fixture is synthetic.",
      "Confirm no real folder path is deleted or renamed.",
      "Confirm expected folder paths are shown before execution.",
    ],
    rollbackNote:
      "Delete only sandbox folders created by this run; never delete production folder paths from the bridge.",
    sourceRecord: "portal.storage_folders:missing-preview",
    targetRecord: "sandbox.folder_automation:create",
    payload: {
      orderNumber: "TEST-PORTAL-FOLDER-001",
      listingAddress: "TEST-PORTAL-445 Storage Fixture Lane",
      expectedFolders: ["Photos", "Floor Plans", "Matterport", "Feature Sheets"],
    },
  },
]

export function buildApprovalAttemptPreview(request: BridgeApprovalRequest) {
  return buildLegacyBridgeAttempt({
    integration: request.integration,
    action: request.action,
    targetEnvironment: request.targetEnvironment,
    mode: request.requestedMode,
    actorId: "super-admin-preview",
    adminApprovalId:
      request.requestedMode === "admin_approved_live"
        ? `${request.id}-approval`
        : undefined,
    payload: request.payload,
  })
}

export function getApprovalDecision(request: BridgeApprovalRequest) {
  return evaluateLegacyBridgeRequest({
    integration: request.integration,
    action: request.action,
    targetEnvironment: request.targetEnvironment,
    mode: request.requestedMode,
    actorId: "super-admin-preview",
    adminApprovalId:
      request.requestedMode === "admin_approved_live"
        ? `${request.id}-approval`
        : undefined,
    payload: request.payload,
  })
}

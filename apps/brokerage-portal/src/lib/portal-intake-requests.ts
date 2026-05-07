import { desc, eq } from "drizzle-orm"

import {
  bridgeApprovalRequests,
  type BridgeApprovalStatus,
  type BridgeApprovalRequest,
  type BridgeApprovalStatusHistoryEntry,
} from "@/lib/legacy-bridge-approval-data"
import {
  buildLegacyBridgeAttempt,
  type LegacyBridgeAction,
  type LegacyBridgeEnvironment,
  type LegacyIntegrationKey,
  type LegacyWriteMode,
} from "@/lib/legacy-bridge-safety"

type PortalIntakeInput = {
  publicRequestId: string
  intakeType: BridgeApprovalRequest["intakeType"]
  status?: string
  risk: BridgeApprovalRequest["risk"]
  title: string
  summary: string
  requesterName: string
  requesterType: BridgeApprovalRequest["requesterType"]
  sourceRecord: string
  targetRecord: string
  adminNextStep: string
  safeBoundary: string
  operatorChecklist: string[]
  rollbackNote: string
  bridgeIntegration: LegacyIntegrationKey
  bridgeAction: LegacyBridgeAction
  bridgeTargetEnvironment: LegacyBridgeEnvironment
  bridgeRequestedMode: LegacyWriteMode
  submittedByClerkUserId?: string | null
  payload: Record<string, unknown>
  metadata?: Record<string, unknown>
}

type PortalOrderService = {
  name: string
  detail: string
  price: string
}

type PortalOrderReadinessWarning = {
  category: string
  label: string
  detail: string
  severity: "blocking" | "review" | "info"
}

type PortalOrderInput = {
  listingAddress: string
  listingArea: string
  mlsNumber: string
  listingSource: string
  listingPublicUrl: string
  listingTitle: string
  listingPriceDisplay: string
  listingPriceValue: string
  listingCurrency: string
  listingBedrooms: string
  listingBathrooms: string
  listingPropertyType: string
  listingLivingArea: string
  listingNonLivableArea: string
  listingNeighborhood: string
  listingLatitude: string
  listingLongitude: string
  listingDescription: string
  listingUnitType: string
  listingUnitNumber: string
  listingVerifyNotes: string
  mlsListingInventoryId: string
  mlsSourceId: string
  mlsSourceSlug: string
  mlsSourceListingKey: string
  brokerageName: string
  requesterName: string
  requesterEmail: string
  requesterRole: string
  services: PortalOrderService[]
  serviceDetails: Record<string, unknown>
  jobInstructions: Record<string, unknown>
  readinessWarnings: PortalOrderReadinessWarning[]
  estimateTotal: string
  estimateSubtotal: string
  requestedDate: string
  requestedWindow: string
  staffPreference: string
  paymentMode: string
  specialInstructions: string
}

type VendorAssignmentInput = {
  selectedCandidateId: string
  listingId: string
  orderId: string
  orderItemId: string
  vendorName: string
  vendorEmail: string
  vendorCompany: string
  vendorSpecialty: string
  listingAddress: string
  serviceType: string
  requestedDate: string
  requestedWindow: string
  requirements: string
  requesterName: string
}

export type FeatureSheetPrintActionKind =
  | "proof_edit"
  | "revision_request"
  | "approval_request"
  | "print_intent"
  | "pdf_review"

type FeatureSheetPrintDraftInput = {
  listingId: string
  listingAddress: string
  listingArea: string
  templateName: string
  featureSheetProduct: string
  featureSheetStyle: string
  paperWeight: string
  hoodReportOrMlsPage: string
  proofVersion: string
  proofStatus: string
  printedMaterialStatus: string
  proofSource: string
  selectedPhotos: string
  floorPlanStatus: string
  existingFloorPlan: string
  listingFactsStatus: string
  copyTemplateNotes: string
  actionKind: FeatureSheetPrintActionKind
  actionLabel: string
  notes: string
  printProduct: string
  printQuantity: string
  printDeliveryMethod: string
  printDeliveryNotes: string
  requesterName: string
}

export type PortalIntakeCreateResult = {
  publicRequestId: string
  persisted: boolean
  error?: string
}

export type PortalIntakeActionState = {
  ok: boolean
  message?: string
  publicRequestId?: string
  persisted?: boolean
  error?: string
}

export type PortalIntakeStatus =
  | "submitted"
  | "under_review"
  | "needs_info"
  | "approved"
  | "rejected"
  | "manually_entered_in_legacy"

export type PortalIntakeStatusDecisionInput = {
  note?: string
  legacyReference?: string
  operatorEvidence?: string
  manualLegacyEntryNote?: string
  manualLegacyEnteredAt?: string
  manualLegacyEnteredBy?: string
  followUpRequired?: boolean
  actorId?: string | null
  actorRole?: string | null
}

export const portalIntakeStatusLabels: Record<PortalIntakeStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  needs_info: "Needs info",
  approved: "Approved for manual entry",
  rejected: "Rejected",
  manually_entered_in_legacy: "Manually entered in legacy",
}

export async function listPortalIntakeApprovalRequests(): Promise<
  BridgeApprovalRequest[]
> {
  try {
    const { db } = await import("@/db")
    const { portalIntakeRequests } = await import("../../drizzle/schema")

    const rows = await db
      .select()
      .from(portalIntakeRequests)
      .orderBy(desc(portalIntakeRequests.createdAt))
      .limit(25)

    if (!rows.length) {
      return bridgeApprovalRequests
    }

    const persistedRequests: BridgeApprovalRequest[] = rows.map((row) => {
      const metadata = parseMetadata(row.metadata)

      return {
        id: row.publicRequestId,
        title: row.title,
        plainTitle: row.title,
        requester: row.requesterName,
        requesterType: row.requesterType as BridgeApprovalRequest["requesterType"],
        intakeType: row.intakeType as BridgeApprovalRequest["intakeType"],
        integration: row.bridgeIntegration as LegacyIntegrationKey,
        action: row.bridgeAction as LegacyBridgeAction,
        targetEnvironment: row.bridgeTargetEnvironment as LegacyBridgeEnvironment,
        requestedMode: row.bridgeRequestedMode as LegacyWriteMode,
        status: normalizePortalIntakeStatus(row.status),
        risk: row.risk as BridgeApprovalRequest["risk"],
        createdAt: row.createdAt.toISOString(),
        summary: row.summary,
        adminNextStep: row.adminNextStep,
        safeBoundary: row.safeBoundary,
        operatorChecklist: row.operatorChecklist ?? [],
        rollbackNote: row.rollbackNote,
        sourceRecord: row.sourceRecord,
        targetRecord: row.targetRecord,
        payload: row.payload ?? {},
        statusHistory: readStatusHistory(metadata),
        persisted: true,
      }
    })

    return [
      ...persistedRequests,
      ...bridgeApprovalRequests,
    ]
  } catch (error) {
    console.warn(
      "Falling back to sample portal intake requests. Apply the portal_intake_requests migration to persist submitted requests.",
      error
    )
    return bridgeApprovalRequests
  }
}

export async function getPortalIntakeApprovalRequest(
  publicRequestId: string
): Promise<BridgeApprovalRequest | null> {
  const requests = await listPortalIntakeApprovalRequests()

  return (
    requests.find((request) => request.id === publicRequestId) ??
    null
  )
}

export async function updatePortalIntakeRequestStatus({
  publicRequestId,
  status,
  decision,
}: {
  publicRequestId: string
  status: PortalIntakeStatus
  decision?: PortalIntakeStatusDecisionInput
}) {
  try {
    const { db } = await import("@/db")
    const { portalIntakeRequests } = await import("../../drizzle/schema")
    const [existing] = await db
      .select({
        metadata: portalIntakeRequests.metadata,
      })
      .from(portalIntakeRequests)
      .where(eq(portalIntakeRequests.publicRequestId, publicRequestId))
      .limit(1)

    const metadata = parseMetadata(existing?.metadata)
    const statusHistory = readStatusHistory(metadata)
    const decisionEntry = buildStatusHistoryEntry(status, decision)

    const updated = await db
      .update(portalIntakeRequests)
      .set({
        status,
        metadata: {
          ...metadata,
          lastStatusDecision: decisionEntry,
          statusHistory: [...statusHistory, decisionEntry].slice(-25),
        },
        updatedAt: new Date(),
      })
      .where(eq(portalIntakeRequests.publicRequestId, publicRequestId))
      .returning({ publicRequestId: portalIntakeRequests.publicRequestId })

    return {
      ok: updated.length > 0,
      publicRequestId,
      status,
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown portal intake status update error"

    console.warn("Portal intake status was not updated.", message)

    return {
      ok: false,
      publicRequestId,
      status,
      error: message,
    }
  }
}

function normalizePortalIntakeStatus(status: string): BridgeApprovalStatus {
  if (
    status === "submitted" ||
    status === "under_review" ||
    status === "needs_info" ||
    status === "approved" ||
    status === "rejected" ||
    status === "manually_entered_in_legacy"
  ) {
    return status
  }

  return "submitted"
}

function parseMetadata(input: unknown): Record<string, unknown> {
  return input && typeof input === "object" && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : {}
}

function readStatusHistory(
  metadata: Record<string, unknown>
): BridgeApprovalStatusHistoryEntry[] {
  const history = metadata.statusHistory

  if (!Array.isArray(history)) return []

  return history.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return []

    const record = entry as Record<string, unknown>
    const status = record.status
    const createdAt = record.createdAt

    if (typeof status !== "string" || !createdAt || typeof createdAt !== "string") {
      return []
    }

    return [
      {
        status: normalizePortalIntakeStatus(status) as PortalIntakeStatus,
        note: readNullableString(record.note),
        legacyReference: readNullableString(record.legacyReference),
        operatorEvidence: readNullableString(record.operatorEvidence),
        manualLegacyEntryNote: readNullableString(record.manualLegacyEntryNote),
        manualLegacyEnteredAt: readNullableString(record.manualLegacyEnteredAt),
        manualLegacyEnteredBy: readNullableString(record.manualLegacyEnteredBy),
        followUpRequired: record.followUpRequired === true,
        actorId: readNullableString(record.actorId),
        actorRole: readNullableString(record.actorRole),
        createdAt,
      },
    ]
  })
}

function buildStatusHistoryEntry(
  status: PortalIntakeStatus,
  decision?: PortalIntakeStatusDecisionInput
): BridgeApprovalStatusHistoryEntry {
  return {
    status,
    note: normalizeOptionalText(decision?.note),
    legacyReference: normalizeOptionalText(decision?.legacyReference),
    operatorEvidence: normalizeOptionalText(decision?.operatorEvidence),
    manualLegacyEntryNote: normalizeOptionalText(decision?.manualLegacyEntryNote),
    manualLegacyEnteredAt:
      status === "manually_entered_in_legacy"
        ? normalizeOptionalText(decision?.manualLegacyEnteredAt) ??
          new Date().toISOString()
        : null,
    manualLegacyEnteredBy:
      status === "manually_entered_in_legacy"
        ? normalizeOptionalText(decision?.manualLegacyEnteredBy) ??
          normalizeOptionalText(decision?.actorRole) ??
          normalizeOptionalText(decision?.actorId)
        : null,
    followUpRequired: decision?.followUpRequired === true,
    actorId: normalizeOptionalText(decision?.actorId),
    actorRole: normalizeOptionalText(decision?.actorRole),
    createdAt: new Date().toISOString(),
  }
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed.slice(0, 2000) : null
}

function readNullableString(input: unknown) {
  return typeof input === "string" && input.trim() ? input : null
}

export async function createPortalIntakeRequest(
  input: PortalIntakeInput
): Promise<PortalIntakeCreateResult> {
  try {
    const { db } = await import("@/db")
    const { portalIntakeRequests } = await import("../../drizzle/schema")

    await db.insert(portalIntakeRequests).values({
      publicRequestId: input.publicRequestId,
      intakeType: input.intakeType,
      status: input.status ?? "submitted",
      risk: input.risk,
      title: input.title,
      summary: input.summary,
      requesterName: input.requesterName,
      requesterType: input.requesterType,
      sourceRecord: input.sourceRecord,
      targetRecord: input.targetRecord,
      adminNextStep: input.adminNextStep,
      safeBoundary: input.safeBoundary,
      operatorChecklist: input.operatorChecklist,
      rollbackNote: input.rollbackNote,
      bridgeIntegration: input.bridgeIntegration,
      bridgeAction: input.bridgeAction,
      bridgeTargetEnvironment: input.bridgeTargetEnvironment,
      bridgeRequestedMode: input.bridgeRequestedMode,
      submittedByClerkUserId: input.submittedByClerkUserId,
      payload: input.payload,
      metadata: input.metadata ?? {},
    })

    const { persistBridgeAttemptsForSource } = await import(
      "@/lib/server/bridge-attempts"
    )
    await persistBridgeAttemptsForSource(
      {
        sourceRequestType: "portal_intake_request",
        sourceRequestId: input.publicRequestId,
        sourceRecord: input.sourceRecord,
        targetRecord: input.targetRecord,
        workspaceOrganizationId:
          readStringFromRecord(input.metadata?.workspaceContext, "activeOrganizationId"),
        activeRole: readStringFromRecord(input.metadata?.workspaceContext, "activeRole"),
        metadata: {
          intakeType: input.intakeType,
          risk: input.risk,
        },
      },
      buildLegacyBridgeAttempt({
        integration: input.bridgeIntegration,
        action: input.bridgeAction,
        targetEnvironment: input.bridgeTargetEnvironment,
        mode: input.bridgeRequestedMode,
        actorId: input.submittedByClerkUserId ?? "portal-intake",
        payload: input.payload,
      })
    )

    return {
      publicRequestId: input.publicRequestId,
      persisted: true,
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown portal intake persistence error"

    console.warn("Portal intake request was not persisted.", message)

    return {
      publicRequestId: input.publicRequestId,
      persisted: false,
      error: message,
    }
  }
}

function readStringFromRecord(value: unknown, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null

  const record = value as Record<string, unknown>
  const fieldValue = record[key]

  return typeof fieldValue === "string" ? fieldValue : null
}

export function buildPortalOrderIntakeRequest({
  publicRequestId,
  clerkUserId,
  order,
  workspaceContext,
}: {
  publicRequestId: string
  clerkUserId?: string | null
  order: PortalOrderInput
  workspaceContext?: Record<string, unknown>
}): PortalIntakeInput {
  const listingAddress = order.listingAddress || "Unspecified listing"
  const requesterName = order.requesterName || "Portal order flow"
  const serviceNames = order.services.map((service) => service.name)
  const serviceDetails = order.serviceDetails
  const jobInstructions = order.jobInstructions
  const readinessWarnings = order.readinessWarnings
  const readinessSummary = buildReadinessSummary(readinessWarnings)
  const risk = getPortalOrderRisk(readinessWarnings)
  const hasFeatureSheetPrint = serviceNameMatches(serviceNames, [
    "feature sheet",
    "print",
    "printed",
  ])
  const operatorChecklist = buildPortalOrderOperatorChecklist({
    readinessWarnings,
    hasEstimate: Boolean(order.estimateTotal),
    hasFeatureSheetPrint,
  })
  const serviceSummary = serviceNames.length
    ? serviceNames.join(", ")
    : "Services not selected"

  return {
    publicRequestId,
    intakeType: "New order",
    status: "submitted",
    risk,
    title: `New order request for ${listingAddress}`,
    summary:
      `${requesterName} submitted a portal order for ${listingAddress}. Requested services: ${serviceSummary}. Staff should confirm timing, pricing, billing posture, and legacy handoff path before the old system is touched.`,
    requesterName,
    requesterType: "existing_client",
    sourceRecord: `portal.orders:${publicRequestId}`,
    targetRecord: "Deliverables.appointments:dry-run",
    adminNextStep:
      getPortalOrderAdminNextStep(readinessSummary),
    safeBoundary:
      "This does not book TimeTap, create folders, generate invoices, or charge/authorize a card.",
    operatorChecklist,
    rollbackNote:
      getPortalOrderRollbackNote(readinessSummary),
    bridgeIntegration: "legacy_mysql",
    bridgeAction: "create_order",
    bridgeTargetEnvironment: "production",
    bridgeRequestedMode: "dry_run",
    submittedByClerkUserId: clerkUserId,
    payload: {
      orderNumber: publicRequestId,
      listingAddress,
      listingArea: order.listingArea,
      mlsNumber: order.mlsNumber,
      listingSource: order.listingSource || "demo",
      listingPublicUrl: order.listingPublicUrl,
      listingTitle: order.listingTitle,
      listingPriceDisplay: order.listingPriceDisplay,
      listingPriceValue: parseOptionalNumber(order.listingPriceValue),
      listingCurrency: order.listingCurrency,
      listingBedrooms: parseOptionalNumber(order.listingBedrooms),
      listingBathrooms: parseOptionalNumber(order.listingBathrooms),
      listingPropertyType: order.listingPropertyType,
      listingLivingArea: order.listingLivingArea,
      listingNonLivableArea: order.listingNonLivableArea,
      listingNeighborhood: order.listingNeighborhood,
      listingLatitude: parseOptionalNumber(order.listingLatitude),
      listingLongitude: parseOptionalNumber(order.listingLongitude),
      listingDescription: order.listingDescription,
      listingUnitType: order.listingUnitType,
      listingUnitNumber: order.listingUnitNumber,
      listingVerifyNotes: order.listingVerifyNotes,
      mlsListingInventoryId: order.mlsListingInventoryId,
      mlsSourceId: order.mlsSourceId,
      mlsSourceSlug: order.mlsSourceSlug,
      mlsSourceListingKey: order.mlsSourceListingKey,
      brokerageName: order.brokerageName,
      requesterName,
      requesterEmail: order.requesterEmail,
      requesterRole: order.requesterRole,
      services: order.services,
      serviceNames,
      serviceDetails,
      jobInstructions,
      readinessWarnings,
      readinessSummary,
      legacyPricingMapping: {
        livable: order.listingLivingArea,
        nonLivable: order.listingNonLivableArea,
        floorplan: serviceNameMatches(serviceNames, ["floor plan"]),
        fpType: serviceDetails.floorplanType ?? null,
        simplifiedMatterport: serviceDetails.simplifiedMatterport ?? null,
        levels3d: serviceDetails.levels3d ?? null,
        matterport: serviceNameMatches(serviceNames, ["matterport"]),
        matterportType: serviceDetails.matterportType ?? null,
        virtualStaging: serviceNameMatches(serviceNames, ["virtual staging"]),
        matterportVirtualStaging: serviceDetails.matterportVirtualStaging ?? null,
        photoEmbedding: serviceDetails.matterportPhotoEmbedding ?? null,
        photography: serviceNameMatches(serviceNames, ["photography", "drone"]),
        photgraphyType: serviceDetails.photographyType ?? null,
        photos: serviceDetails.photoCount ?? null,
        dronePhotos: serviceDetails.dronePhotos ?? null,
        drone360: serviceDetails.drone360 ?? null,
        virtualStagingPhoto: serviceDetails.virtualStagingPhotoCount ?? null,
        dayToTwilight: serviceDetails.dayToTwilight ?? null,
        image360Tour: serviceDetails.image360Tour ?? null,
        videography: serviceNameMatches(serviceNames, ["video"]),
        videographyType: serviceDetails.videographyType ?? null,
        videographyLength: serviceDetails.videographyLength ?? null,
        drone: serviceDetails.videoDrone ?? null,
        social: serviceDetails.videoSocial ?? null,
        narration: serviceDetails.videoNarration ?? null,
        map3D: serviceDetails.videoMap3d ?? null,
        printedMaterial: serviceNameMatches(serviceNames, [
          "feature sheet",
          "print",
          "printed",
        ]),
        printedMaterialNotes:
          jobInstructions.featureSheetNotes ??
          serviceDetails.printedMaterialNotes ??
          null,
      },
      featureSheetPrintDraft: hasFeatureSheetPrint
        ? {
            mode: "portal_native_staff_review",
            selectedServices: serviceNames.filter((name) =>
              serviceNameMatches([name], ["feature sheet", "print", "printed"])
            ),
            templateAndCopyNotes: jobInstructions.featureSheetNotes ?? null,
            printProductIntent: serviceDetails.printedMaterialProduct ?? null,
            printQuantityIntent: serviceDetails.printedMaterialQuantity ?? null,
            proofSource: "portal_order_intake",
            noLegacyWrite: true,
          }
        : null,
      legacyOperationalMapping: {
        access: {
          lockboxOnSite: jobInstructions.lockboxOnSite ?? null,
          lockboxLocation: jobInstructions.lockboxLocation ?? null,
          accessCodeProvided: Boolean(jobInstructions.accessCode),
          callOnArrival: jobInstructions.callOnArrival ?? null,
          contactName: jobInstructions.contactName ?? null,
          contactPhone: jobInstructions.contactPhone ?? null,
          occupancyStatus: jobInstructions.occupancyStatus ?? null,
          petsOnSite: jobInstructions.petsOnSite ?? null,
          alarmSecurity: jobInstructions.alarmSecurity ?? null,
          parkingNotes: jobInstructions.parkingNotes ?? null,
        },
        photoRequirements: {
          requiredPhotoCount: jobInstructions.requiredPhotoCount ?? null,
          twilightRequested: jobInstructions.twilightRequested ?? null,
          mustCaptureRooms: jobInstructions.mustCaptureRooms ?? null,
          stagingNotes: jobInstructions.stagingNotes ?? null,
          photoNotes: jobInstructions.photoNotes ?? null,
        },
        measurementRequirements: {
          squareFootageSource: jobInstructions.squareFootageSource ?? null,
          measurementNotes: jobInstructions.measurementNotes ?? null,
          restrictedAreas: jobInstructions.restrictedAreas ?? null,
        },
        matterportNotes: jobInstructions.matterportNotes ?? null,
        featureSheetNotes: jobInstructions.featureSheetNotes ?? null,
      },
      estimateTotal: order.estimateTotal,
      estimateSubtotal: order.estimateSubtotal,
      estimateCents: amountToCents(order.estimateTotal),
      requestedDate: order.requestedDate,
      requestedWindow: order.requestedWindow,
      staffPreference: order.staffPreference,
      paymentMode: order.paymentMode || "staff_review_only",
      specialInstructions: order.specialInstructions,
    },
    metadata: {
      source: "create_order_canvas",
      legacyWriteTriggered: false,
      featureSheetPrintDraftIncluded: hasFeatureSheetPrint,
      workspaceContext: workspaceContext ?? {},
    },
  }
}

export function buildFeatureSheetPrintIntakeRequest({
  publicRequestId,
  clerkUserId,
  draft,
  workspaceContext,
}: {
  publicRequestId: string
  clerkUserId?: string | null
  draft: FeatureSheetPrintDraftInput
  workspaceContext?: Record<string, unknown>
}): PortalIntakeInput {
  const listingAddress = draft.listingAddress || "Unspecified listing"
  const actionLabel = draft.actionLabel || getFeatureSheetActionLabel(draft.actionKind)
  const isPrintIntent = draft.actionKind === "print_intent"
  const externalReference = `TEST-PORTAL-FS-${publicRequestId}`
  const printQuantity = Number.parseInt(draft.printQuantity, 10)

  return {
    publicRequestId,
    intakeType: "Feature sheet / print",
    status: "submitted",
    risk: isPrintIntent ? "high" : "medium",
    title: `${actionLabel} for ${listingAddress}`,
    summary:
      `${draft.requesterName || "Portal user"} submitted a portal-native feature-sheet/print draft for ${listingAddress}. Reala staff should review the proof, copy/template requirements, print intent, and bridge ledger payload before any legacy print, invoice, payment, fulfillment, or storage action is considered.`,
    requesterName: draft.requesterName || "Feature sheet draft",
    requesterType: "existing_client",
    sourceRecord: `portal.feature_sheet_print:${publicRequestId}`,
    targetRecord: isPrintIntent
      ? "legacy.print_shop_orders:dry-run"
      : "legacy.feature_sheet_workflow:dry-run",
    adminNextStep: isPrintIntent
      ? "Verify the approved proof, print product, quantity, delivery notes, and invoice/payment posture. Keep this as dry-run unless Reala explicitly approves a separate print bridge."
      : "Review the proof notes, template/copy requirements, selected assets, and approval/revision state. Keep edits portal-native or manually coordinate with staff if needed.",
    safeBoundary:
      "This creates a portal draft and bridge ledger row only. It does not write to legacy MySQL, create or update PrintShopOrders, upload to legacy storage, generate an invoice, charge or authorize payment, send email, or start print fulfillment.",
    operatorChecklist: [
      "Verify listing facts and address before any staff handoff.",
      "Verify selected/template copy requirements and source asset expectations.",
      "Verify proof status, approval notes, and revision context.",
      "Verify print product, quantity, delivery or pickup notes, and proof source.",
      "Confirm no invoice, payment, fulfillment, storage, email, provider, or legacy mutation has happened.",
    ],
    rollbackNote:
      "Reject or mark needs_info if the draft is incomplete. No production rollback is required because this request is portal-native and the bridge attempt is dry-run only.",
    bridgeIntegration: isPrintIntent ? "print_shop" : "legacy_mysql",
    bridgeAction: isPrintIntent ? "create_order" : "update_order",
    bridgeTargetEnvironment: "production",
    bridgeRequestedMode: "dry_run",
    submittedByClerkUserId: clerkUserId,
    payload: {
      externalReference,
      orderNumber: publicRequestId,
      actionKind: draft.actionKind,
      actionLabel,
      listingId: draft.listingId,
      listingAddress,
      listingArea: draft.listingArea,
      templateName: draft.templateName,
      proofVersion: draft.proofVersion,
      proofStatus: draft.proofStatus,
      proofSource: draft.proofSource,
      selectedPhotos: draft.selectedPhotos,
      floorPlanStatus: draft.floorPlanStatus,
      existingFloorPlan: draft.existingFloorPlan,
      listingFactsStatus: draft.listingFactsStatus,
      copyTemplateNotes: draft.copyTemplateNotes,
      notes: draft.notes,
      printProduct: draft.printProduct,
      printQuantity: Number.isFinite(printQuantity) ? printQuantity : null,
      printDeliveryMethod: draft.printDeliveryMethod,
      printDeliveryNotes: draft.printDeliveryNotes,
      legacySchedulerFields: {
        printedMaterial:
          draft.featureSheetProduct || draft.printProduct || "Needs staff review",
        quantityRequired: Number.isFinite(printQuantity) ? printQuantity : null,
        stylePreference: draft.featureSheetStyle,
        paperWeight: draft.paperWeight,
        hoodReportOrMlsPage: draft.hoodReportOrMlsPage,
        dropOffOrDeliverTo: draft.printDeliveryMethod,
        existingFloorPlan: draft.existingFloorPlan,
        printedMaterialStatus: draft.printedMaterialStatus,
      },
      legacyPrintShopOrderFields: {
        productDetails:
          draft.printProduct || draft.featureSheetProduct || "Needs staff review",
        quantity: Number.isFinite(printQuantity) ? printQuantity : null,
        address: listingAddress,
        payment: "Needs staff review",
        notes: draft.printDeliveryNotes || draft.notes,
        staffNotes:
          "Portal-native draft only. No PrintShopOrders row, invoice, payment, storage, email, or fulfillment action has happened.",
      },
      draftMode: "portal_native_staff_review_only",
      noLegacyWrite: true,
    },
    metadata: {
      source: "listing_feature_sheet_tab",
      legacyWriteTriggered: false,
      workspaceContext: workspaceContext ?? {},
    },
  }
}

export function buildVendorAssignmentIntakeRequest({
  publicRequestId,
  clerkUserId,
  assignment,
  workspaceContext,
}: {
  publicRequestId: string
  clerkUserId?: string | null
  assignment: VendorAssignmentInput
  workspaceContext?: Record<string, unknown>
}): PortalIntakeInput {
  const vendorName = assignment.vendorName || "Unspecified vendor"
  const listingAddress = assignment.listingAddress || "Unspecified listing"
  const serviceType =
    assignment.serviceType || assignment.vendorSpecialty || "Vendor service"
  const externalReference = `TEST-PORTAL-ASSIGNMENT-${publicRequestId}`

  return {
    publicRequestId,
    intakeType: "Vendor assignment",
    status: "submitted",
    risk: "high",
    title: `Vendor assignment draft for ${listingAddress}`,
    summary:
      `${assignment.requesterName || "Portal user"} drafted a vendor assignment for ${vendorName} at ${listingAddress}. Staff should verify the vendor, listing/order mapping, requirements, and scheduling before anything is entered into legacy or TimeTap.`,
    requesterName: assignment.requesterName || "Vendor assignment draft",
    requesterType: "vendor",
    sourceRecord: `portal.vendor_assignments:${publicRequestId}`,
    targetRecord: "legacy.vendor_or_appointment_assignment:dry-run",
    adminNextStep:
      "Confirm this assignment maps to a real portal/legacy order, verify the vendor should receive the work, then manually coordinate legacy/TimeTap only if Reala approves.",
    safeBoundary:
      "This creates a portal assignment draft only. It does not assign a legacy job, create a TimeTap appointment/resource, notify the vendor, create folders, update Stripe, or change client-facing delivery status.",
    operatorChecklist: [
      "Confirm the listing/order exists and the vendor should be assigned to this service.",
      "Confirm the requested date/window is staff-approved before any TimeTap or calendar entry.",
      "Confirm requirements are complete enough for the vendor to act safely.",
      "Confirm no client notification, vendor notification, folder automation, Stripe action, or legacy update has been triggered.",
    ],
    rollbackNote:
      "Reject or mark needs_info if the assignment is incomplete; no production system needs rollback because this is a portal-only draft.",
    bridgeIntegration: "legacy_mysql",
    bridgeAction: "update_order",
    bridgeTargetEnvironment: "production",
    bridgeRequestedMode: "dry_run",
    submittedByClerkUserId: clerkUserId,
    payload: {
      externalReference,
      orderNumber: publicRequestId,
      vendorName,
      vendorEmail: assignment.vendorEmail,
      vendorCompany: assignment.vendorCompany,
      vendorSpecialty: assignment.vendorSpecialty,
      selectedCandidateId: assignment.selectedCandidateId,
      listingId: assignment.listingId,
      orderId: assignment.orderId,
      orderItemId: assignment.orderItemId,
      listingAddress,
      serviceType,
      requestedDate: assignment.requestedDate,
      requestedWindow: assignment.requestedWindow,
      requirements: assignment.requirements,
      assignmentMode: "portal_draft_staff_review_only",
    },
    metadata: {
      source: "vendors_create_portal_assignment_dialog",
      legacyWriteTriggered: false,
      workspaceContext: workspaceContext ?? {},
    },
  }
}

function buildReadinessSummary(
  readinessWarnings: PortalOrderReadinessWarning[]
) {
  return {
    blocking: readinessWarnings.filter(
      (warning) => warning.severity === "blocking"
    ).length,
    review: readinessWarnings.filter((warning) => warning.severity === "review")
      .length,
    info: readinessWarnings.filter((warning) => warning.severity === "info")
      .length,
  }
}

function getPortalOrderRisk(
  readinessWarnings: PortalOrderReadinessWarning[]
): PortalIntakeInput["risk"] {
  if (readinessWarnings.some((warning) => warning.severity === "blocking")) {
    return "high"
  }

  if (readinessWarnings.some((warning) => warning.severity === "review")) {
    return "medium"
  }

  return "low"
}

function buildPortalOrderOperatorChecklist({
  readinessWarnings,
  hasEstimate,
  hasFeatureSheetPrint,
}: {
  readinessWarnings: PortalOrderReadinessWarning[]
  hasEstimate: boolean
  hasFeatureSheetPrint: boolean
}) {
  const warningChecklist = readinessWarnings.slice(0, 8).map((warning) => {
    const prefix =
      warning.severity === "blocking"
        ? "Resolve before legacy entry"
        : warning.severity === "review"
          ? "Review before handoff"
          : "Note for staff"

    return `${prefix}: ${warning.label}. ${warning.detail}`
  })

  return [
    ...warningChecklist,
    "Confirm the legacy appointment/order screen has matching fields before manual entry.",
    hasEstimate
      ? "Confirm the calculator estimate matches the legacy billing expectation before invoicing or payment action."
      : "Add a verified estimate before invoicing or payment action.",
    ...(hasFeatureSheetPrint
      ? [
          "Verify feature-sheet copy/template notes, proof source, print product, quantity, and delivery constraints before any print-shop handoff.",
          "Confirm no print order, invoice, payment, or fulfillment action has been triggered from the portal draft.",
        ]
      : []),
    "Keep TimeTap scheduling manual/read-only until the bridge has an approved live write path.",
    "Confirm folder creation will not be triggered automatically from this review.",
  ]
}

function getFeatureSheetActionLabel(actionKind: FeatureSheetPrintActionKind) {
  if (actionKind === "proof_edit") return "Feature sheet proof edit draft"
  if (actionKind === "revision_request") return "Feature sheet revision request"
  if (actionKind === "approval_request") return "Feature sheet approval request"
  if (actionKind === "print_intent") return "Feature sheet print intent"
  return "Feature sheet PDF review"
}

function getPortalOrderAdminNextStep(
  readinessSummary: ReturnType<typeof buildReadinessSummary>
) {
  if (readinessSummary.blocking > 0) {
    return "Resolve the blocking handoff warnings first, then compare the cleaned request against the legacy appointment/order fields before any manual entry."
  }

  if (readinessSummary.review > 0) {
    return "Review the flagged handoff items, confirm the legacy field mapping, then decide whether staff should manually enter the order or keep it portal-native."
  }

  return "Compare the request against the legacy appointment/order fields and, if it matches, staff can manually enter it in legacy while the bridge remains dry-run only."
}

function getPortalOrderRollbackNote(
  readinessSummary: ReturnType<typeof buildReadinessSummary>
) {
  if (readinessSummary.blocking > 0) {
    return "Do not push or manually enter this request until the blocking fields are corrected; keep it portal-native and ask the requester for the missing details."
  }

  return "Keep this as a portal-native request if legacy field mapping is incomplete; do not push partial booking data."
}

function amountToCents(value: string) {
  const normalized = value.replace(/[^\d.-]/g, "")
  const amount = Number.parseFloat(normalized)

  if (!Number.isFinite(amount)) return 0

  return Math.round(amount * 100)
}

function serviceNameMatches(serviceNames: string[], keywords: string[]) {
  return serviceNames.some((name) => {
    const normalizedName = name.toLowerCase()
    return keywords.some((keyword) => normalizedName.includes(keyword))
  })
}

function parseOptionalNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

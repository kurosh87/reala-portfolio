"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  buildFeatureSheetPrintIntakeRequest,
  buildPortalOrderIntakeRequest,
  buildVendorAssignmentIntakeRequest,
  createPortalIntakeRequest,
  updatePortalIntakeRequestStatus,
  type FeatureSheetPrintActionKind,
  type PortalIntakeActionState,
  type PortalIntakeStatus,
} from "@/lib/portal-intake-requests"
import {
  recordAccessAuditEvent,
  requireBridgeApprovalCapability,
  requireWorkspaceAccess,
} from "@/lib/server/workspace-access"

export async function submitPortalOrderForReviewAction(formData: FormData) {
  const access = await requireWorkspaceAccess({
    capability: "write_portal_draft",
    pathname: "/create-order",
  })
  const publicRequestId = `BP-REQ-${Date.now().toString().slice(-6)}`

  const result = await createPortalIntakeRequest(
    buildPortalOrderIntakeRequest({
      publicRequestId,
      clerkUserId: access.userId,
      order: {
        listingAddress: readFormString(formData, "listingAddress"),
        listingArea: readFormString(formData, "listingArea"),
        mlsNumber: readFormString(formData, "mlsNumber"),
        listingSource: readFormString(formData, "listingSource"),
        listingPublicUrl: readFormString(formData, "listingPublicUrl"),
        listingTitle: readFormString(formData, "listingTitle"),
        listingPriceDisplay: readFormString(formData, "listingPriceDisplay"),
        listingPriceValue: readFormString(formData, "listingPriceValue"),
        listingCurrency: readFormString(formData, "listingCurrency"),
        listingBedrooms: readFormString(formData, "listingBedrooms"),
        listingBathrooms: readFormString(formData, "listingBathrooms"),
        listingPropertyType: readFormString(formData, "listingPropertyType"),
        listingLivingArea: readFormString(formData, "listingLivingArea"),
        listingNonLivableArea: readFormString(formData, "listingNonLivableArea"),
        listingNeighborhood: readFormString(formData, "listingNeighborhood"),
        listingLatitude: readFormString(formData, "listingLatitude"),
        listingLongitude: readFormString(formData, "listingLongitude"),
        listingDescription: readFormString(formData, "listingDescription"),
        listingUnitType: readFormString(formData, "listingUnitType"),
        listingUnitNumber: readFormString(formData, "listingUnitNumber"),
        listingVerifyNotes: readFormString(formData, "listingVerifyNotes"),
        mlsListingInventoryId: readFormString(formData, "mlsListingInventoryId"),
        mlsSourceId: readFormString(formData, "mlsSourceId"),
        mlsSourceSlug: readFormString(formData, "mlsSourceSlug"),
        mlsSourceListingKey: readFormString(formData, "mlsSourceListingKey"),
        brokerageName: readFormString(formData, "brokerageName"),
        requesterName: readFormString(formData, "requesterName"),
        requesterEmail: readFormString(formData, "requesterEmail"),
        requesterRole: readFormString(formData, "requesterRole"),
        services: parseServices(readFormString(formData, "servicesJson")),
        serviceDetails: parseJsonRecord(readFormString(formData, "serviceDetailsJson")),
        jobInstructions: parseJsonRecord(readFormString(formData, "jobInstructionsJson")),
        readinessWarnings: parseReadinessWarnings(
          readFormString(formData, "readinessWarningsJson")
        ),
        estimateTotal: readFormString(formData, "estimateTotal"),
        estimateSubtotal: readFormString(formData, "estimateSubtotal"),
        requestedDate: readFormString(formData, "requestedDate"),
        requestedWindow: readFormString(formData, "requestedWindow"),
        staffPreference: readFormString(formData, "staffPreference"),
        paymentMode: readFormString(formData, "paymentMode"),
        specialInstructions: readFormString(formData, "specialInstructions"),
      },
      workspaceContext: {
        activeOrganizationId: access.activeOrganizationId,
        activeRole: access.activeRole,
        bridgePolicy: access.bridgePolicy,
        source: access.source,
      },
    })
  )

  await recordAccessAuditEvent(access, {
    eventType: "portal_draft_creation",
    summary: `Created portal intake draft ${result.publicRequestId}`,
    payload: {
      publicRequestId: result.publicRequestId,
      persisted: result.persisted,
    },
  })

  const params = new URLSearchParams({
    request: result.publicRequestId,
    persisted: result.persisted ? "true" : "false",
  })

  redirect(`/request-submitted?${params.toString()}`)
}

export async function updatePortalIntakeStatusAction(formData: FormData) {
  const access = await requireBridgeApprovalCapability()
  const publicRequestId = String(formData.get("publicRequestId") ?? "")
  const status = String(formData.get("status") ?? "") as PortalIntakeStatus

  if (!publicRequestId || !isPortalIntakeStatus(status)) {
    return
  }

  await updatePortalIntakeRequestStatus({
    publicRequestId,
    status,
    decision: {
      note: readFormString(formData, "statusNote"),
      legacyReference: readFormString(formData, "legacyReference"),
      operatorEvidence: readFormString(formData, "operatorEvidence"),
      manualLegacyEntryNote: readFormString(formData, "manualLegacyEntryNote"),
      manualLegacyEnteredBy: access.activeRole,
      followUpRequired: formData.get("followUpRequired") === "on",
      actorId: access.userId,
      actorRole: access.activeRole,
    },
  })

  const isManualLegacyEntry = status === "manually_entered_in_legacy"

  await recordAccessAuditEvent(access, {
    eventType: isManualLegacyEntry
      ? "manual_legacy_handoff_recorded"
      : "bridge_approval_decision",
    summary: isManualLegacyEntry
      ? `Recorded manual legacy handoff for portal intake ${publicRequestId}`
      : `Updated portal intake ${publicRequestId} to ${status}`,
    payload: {
      publicRequestId,
      status,
      legacyReference: readFormString(formData, "legacyReference"),
      operatorEvidence: readFormString(formData, "operatorEvidence"),
      manualLegacyEntryNote: readFormString(formData, "manualLegacyEntryNote"),
      followUpRequired: formData.get("followUpRequired") === "on",
      legacyWriteTriggered: false,
    },
  })

  revalidatePath("/bridge-approvals")
  revalidatePath(`/bridge-approvals/${encodeURIComponent(publicRequestId)}`)
  revalidatePath("/coexistence-audit")
  revalidatePath("/orders")
}

export async function submitFeatureSheetPrintDraftAction(formData: FormData) {
  const pathname = readFormString(formData, "pathname") || "/listing"
  const access = await requireWorkspaceAccess({
    capability: "write_portal_draft",
    pathname,
  })
  const publicRequestId = `BP-FS-${Date.now().toString().slice(-6)}`
  const actionKind = normalizeFeatureSheetPrintActionKind(
    readFormString(formData, "actionKind")
  )

  const result = await createPortalIntakeRequest(
    buildFeatureSheetPrintIntakeRequest({
      publicRequestId,
      clerkUserId: access.userId,
      draft: {
        listingId: readFormString(formData, "listingId"),
        listingAddress: readFormString(formData, "listingAddress"),
        listingArea: readFormString(formData, "listingArea"),
        templateName: readFormString(formData, "templateName"),
        featureSheetProduct: readFormString(formData, "featureSheetProduct"),
        featureSheetStyle: readFormString(formData, "featureSheetStyle"),
        paperWeight: readFormString(formData, "paperWeight"),
        hoodReportOrMlsPage: readFormString(formData, "hoodReportOrMlsPage"),
        proofVersion: readFormString(formData, "proofVersion"),
        proofStatus: readFormString(formData, "proofStatus"),
        printedMaterialStatus: readFormString(formData, "printedMaterialStatus"),
        proofSource: readFormString(formData, "proofSource"),
        selectedPhotos: readFormString(formData, "selectedPhotos"),
        floorPlanStatus: readFormString(formData, "floorPlanStatus"),
        existingFloorPlan: readFormString(formData, "existingFloorPlan"),
        listingFactsStatus: readFormString(formData, "listingFactsStatus"),
        copyTemplateNotes: readFormString(formData, "copyTemplateNotes"),
        actionKind,
        actionLabel: readFormString(formData, "actionLabel"),
        notes: readFormString(formData, "notes"),
        printProduct: readFormString(formData, "printProduct"),
        printQuantity: readFormString(formData, "printQuantity"),
        printDeliveryMethod: readFormString(formData, "printDeliveryMethod"),
        printDeliveryNotes: readFormString(formData, "printDeliveryNotes"),
        requesterName: access.activeProfile.role,
      },
      workspaceContext: {
        activeOrganizationId: access.activeOrganizationId,
        activeRole: access.activeRole,
        bridgePolicy: access.bridgePolicy,
        source: access.source,
      },
    })
  )

  await recordAccessAuditEvent(access, {
    eventType: getFeatureSheetPrintAuditEventType(actionKind),
    summary: `${getFeatureSheetPrintAuditSummary(actionKind)} ${publicRequestId}`,
    payload: {
      publicRequestId,
      persisted: result.persisted,
      actionKind,
      listingAddress: readFormString(formData, "listingAddress"),
      legacyWriteTriggered: false,
    },
  })

  revalidatePath("/bridge-approvals")
  revalidatePath("/marketing-studio")
  revalidatePath("/print-shop")
  revalidatePath("/approvals")
  revalidatePath(pathname)

  const params = new URLSearchParams({
    request: result.publicRequestId,
    persisted: result.persisted ? "true" : "false",
  })

  redirect(`/request-submitted?${params.toString()}`)
}

export async function createVendorAssignmentDraftAction(
  _state: PortalIntakeActionState,
  formData: FormData
): Promise<PortalIntakeActionState> {
  const access = await requireWorkspaceAccess({ capability: "write_portal_draft" })
  const publicRequestId = `BP-JOB-${Date.now().toString().slice(-6)}`

  const request = buildVendorAssignmentIntakeRequest({
    publicRequestId,
    clerkUserId: access.userId,
    assignment: {
      selectedCandidateId: readFormString(formData, "selectedCandidateId"),
      listingId: readFormString(formData, "listingId"),
      orderId: readFormString(formData, "orderId"),
      orderItemId: readFormString(formData, "orderItemId"),
      vendorName: readFormString(formData, "vendorName"),
      vendorEmail: readFormString(formData, "vendorEmail"),
      vendorCompany: readFormString(formData, "vendorCompany"),
      vendorSpecialty: readFormString(formData, "vendorSpecialty"),
      listingAddress: readFormString(formData, "listingAddress"),
      serviceType: readFormString(formData, "serviceType"),
      requestedDate: readFormString(formData, "requestedDate"),
      requestedWindow: readFormString(formData, "requestedWindow"),
      requirements: readFormString(formData, "requirements"),
      requesterName: access.activeProfile.role,
    },
    workspaceContext: {
      activeOrganizationId: access.activeOrganizationId,
      activeRole: access.activeRole,
      bridgePolicy: access.bridgePolicy,
      source: access.source,
    },
  })
  const result = await createPortalIntakeRequest(request)

  await recordAccessAuditEvent(access, {
    eventType: "portal_assignment_draft_created",
    summary: `Created vendor assignment draft ${publicRequestId}`,
    payload: {
      publicRequestId,
      persisted: result.persisted,
      vendorName: request.payload.vendorName,
      listingAddress: request.payload.listingAddress,
    },
  })

  revalidatePath("/bridge-approvals")
  revalidatePath("/vendors")
  revalidatePath("/jobs")

  return {
    ok: result.persisted,
    message: result.persisted
      ? "Vendor assignment draft created for Reala admin review."
      : "Vendor assignment draft was captured in the UI but not persisted. Apply the portal_intake_requests migration and try again.",
    publicRequestId,
    persisted: result.persisted,
    error: result.error,
  }
}

function isPortalIntakeStatus(status: string): status is PortalIntakeStatus {
  return (
    status === "submitted" ||
    status === "under_review" ||
    status === "needs_info" ||
    status === "approved" ||
    status === "rejected" ||
    status === "manually_entered_in_legacy"
  )
}

function readFormString(formData: FormData, key: string) {
  const values = formData.getAll(key)
  const value = values.length ? values[values.length - 1] : formData.get(key)
  return typeof value === "string" ? value : ""
}

function parseServices(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown

    if (!Array.isArray(parsed)) return []

    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return []

      const record = item as Record<string, unknown>
      const name = typeof record.name === "string" ? record.name : ""
      const detail = typeof record.detail === "string" ? record.detail : ""
      const price = typeof record.price === "string" ? record.price : ""

      if (!name) return []

      return [{ name, detail, price }]
    })
  } catch {
    return []
  }
}

function parseJsonRecord(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value) as unknown

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {}
    }

    return parsed as Record<string, unknown>
  } catch {
    return {}
  }
}

function parseReadinessWarnings(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown

    if (!Array.isArray(parsed)) return []

    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return []

      const record = item as Record<string, unknown>
      const category = typeof record.category === "string" ? record.category : ""
      const label = typeof record.label === "string" ? record.label : ""
      const detail = typeof record.detail === "string" ? record.detail : ""
      const severity: "blocking" | "review" | "info" =
        record.severity === "blocking" ||
        record.severity === "review" ||
        record.severity === "info"
          ? record.severity
          : "review"

      if (!category || !label) return []

      return [{ category, label, detail, severity }]
    })
  } catch {
    return []
  }
}

function normalizeFeatureSheetPrintActionKind(
  value: string
): FeatureSheetPrintActionKind {
  if (
    value === "proof_edit" ||
    value === "revision_request" ||
    value === "approval_request" ||
    value === "print_intent" ||
    value === "pdf_review"
  ) {
    return value
  }

  return "proof_edit"
}

function getFeatureSheetPrintAuditEventType(
  actionKind: FeatureSheetPrintActionKind
) {
  if (actionKind === "revision_request") {
    return "feature_sheet_revision_requested"
  }

  if (actionKind === "approval_request") {
    return "feature_sheet_approval_requested"
  }

  if (actionKind === "print_intent") {
    return "feature_sheet_print_intent_submitted"
  }

  if (actionKind === "pdf_review") {
    return "feature_sheet_pdf_review_requested"
  }

  return "feature_sheet_draft_created"
}

function getFeatureSheetPrintAuditSummary(
  actionKind: FeatureSheetPrintActionKind
) {
  if (actionKind === "revision_request") {
    return "Created feature sheet revision request"
  }

  if (actionKind === "approval_request") {
    return "Created feature sheet approval request"
  }

  if (actionKind === "print_intent") {
    return "Submitted feature sheet print intent"
  }

  if (actionKind === "pdf_review") {
    return "Created feature sheet PDF review draft"
  }

  return "Created feature sheet proof draft"
}

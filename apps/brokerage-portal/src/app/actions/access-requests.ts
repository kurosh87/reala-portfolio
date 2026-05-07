"use server"

import { revalidatePath } from "next/cache"

import {
  buildRolePermissionAccessRequest,
  buildVendorOnboardingAccessRequest,
  buildWorkspaceAccessRequest,
  createAccessRequest,
  isAccessRequestStatus,
  updateAccessRequestStatus,
  type AccessRequestStatus,
} from "@/lib/access-requests"
import {
  recordAccessAuditEvent,
  requireBridgeApprovalCapability,
  requireWorkspaceAccess,
} from "@/lib/server/workspace-access"
import { getOrganization, type WorkspaceType } from "@/lib/workspace-access"

export type AccessRequestActionState = {
  ok: boolean
  message?: string
  publicRequestId?: string
  persisted?: boolean
  error?: string
}

export async function createWorkspaceAccessRequestAction(
  _state: AccessRequestActionState,
  formData: FormData
): Promise<AccessRequestActionState> {
  const access = await requireWorkspaceAccess({ capability: "write_portal_draft" })
  const publicRequestId = buildPublicRequestId("BP-ACCESS")
  const organizationName = readFormString(formData, "organizationName")
  const workspaceType = readFormString(formData, "workspaceType") as WorkspaceType
  const primaryEmail = readFormString(formData, "primaryEmail")
  const legacyClientName = readFormString(formData, "legacyClientName")
  const notes = readFormString(formData, "notes")
  const capabilities = readFormStrings(formData, "capabilities")

  const request = buildWorkspaceAccessRequest({
    publicRequestId,
    requesterClerkUserId: access.userId,
    requesterName: access.activeProfile.role,
    requesterEmail: null,
    activeWorkspaceOrganizationId: access.activeOrganizationId,
    activeRole: access.activeRole,
    organizationName,
    workspaceType,
    primaryEmail,
    legacyClientName,
    capabilities,
    notes,
  })

  const result = await createAccessRequest(request)

  await recordAccessAuditEvent(access, {
    eventType: "access_request_created",
    summary: `Created workspace access draft ${publicRequestId}`,
    payload: {
      publicRequestId,
      requestType: request.requestType,
      persisted: result.persisted,
      requestedOrganizationName: request.requestedOrganizationName,
    },
  })

  revalidatePath("/access-requests")
  revalidatePath("/bridge-approvals")

  return {
    ok: result.persisted,
    message: result.persisted
      ? "Workspace draft created for Reala admin review."
      : "Workspace draft was captured in the UI but not persisted. Apply the access_requests migration and try again.",
    publicRequestId,
    persisted: result.persisted,
    error: result.error,
  }
}

export async function createRolePermissionAccessRequestAction(
  _state: AccessRequestActionState,
  formData: FormData
): Promise<AccessRequestActionState> {
  const access = await requireWorkspaceAccess({ capability: "write_portal_draft" })
  const publicRequestId = buildPublicRequestId("BP-ACCESS")
  const organization = getOrganization(access.activeOrganizationId)
  const requestedEmail = readFormString(formData, "email")
  const requestedDisplayName = readFormString(formData, "displayName")
  const requestedRole = readFormString(formData, "role")
  const legacyClientName = readFormString(formData, "legacyClientName")
  const notes = readFormString(formData, "notes")
  const capabilities = readFormStrings(formData, "capabilities")

  const request = buildRolePermissionAccessRequest({
    publicRequestId,
    requesterClerkUserId: access.userId,
    requesterName: access.activeProfile.role,
    requesterEmail: null,
    activeWorkspaceOrganizationId: access.activeOrganizationId,
    activeRole: access.activeRole,
    organizationName: organization.name,
    requestedEmail,
    requestedDisplayName,
    requestedRole,
    legacyClientName,
    capabilities,
    notes,
  })

  const result = await createAccessRequest(request)

  await recordAccessAuditEvent(access, {
    eventType: "access_request_created",
    summary: `Created role permission draft ${publicRequestId}`,
    payload: {
      publicRequestId,
      requestType: request.requestType,
      persisted: result.persisted,
      requestedEmail: request.requestedEmail,
      requestedRole: request.requestedRole,
    },
  })

  revalidatePath("/access-requests")
  revalidatePath("/bridge-approvals")

  return {
    ok: result.persisted,
    message: result.persisted
      ? "Role permission draft created for Reala admin review."
      : "Role permission draft was captured in the UI but not persisted. Apply the access_requests migration and try again.",
    publicRequestId,
    persisted: result.persisted,
    error: result.error,
  }
}

export async function createVendorOnboardingAccessRequestAction(
  _state: AccessRequestActionState,
  formData: FormData
): Promise<AccessRequestActionState> {
  const access = await requireWorkspaceAccess({ capability: "write_portal_draft" })
  const publicRequestId = buildPublicRequestId("BP-VENDOR")
  const vendorName = readFormString(formData, "vendorName")
  const companyName = readFormString(formData, "companyName")
  const vendorEmail = readFormString(formData, "vendorEmail")
  const region = readFormString(formData, "region")
  const specialty = readFormString(formData, "specialty")
  const billingNotes = readFormString(formData, "billingNotes")

  const request = buildVendorOnboardingAccessRequest({
    publicRequestId,
    requesterClerkUserId: access.userId,
    requesterName: access.activeProfile.role,
    requesterEmail: null,
    activeWorkspaceOrganizationId: access.activeOrganizationId,
    activeRole: access.activeRole,
    vendorName,
    companyName,
    vendorEmail,
    region,
    specialty,
    billingNotes,
  })

  const result = await createAccessRequest(request)

  await recordAccessAuditEvent(access, {
    eventType: "access_request_created",
    summary: `Created vendor onboarding draft ${publicRequestId}`,
    payload: {
      publicRequestId,
      requestType: request.requestType,
      persisted: result.persisted,
      requestedOrganizationName: request.requestedOrganizationName,
      requestedEmail: request.requestedEmail,
    },
  })

  revalidatePath("/access-requests")
  revalidatePath("/bridge-approvals")
  revalidatePath("/vendors")

  return {
    ok: result.persisted,
    message: result.persisted
      ? "Vendor onboarding draft created for Reala admin review."
      : "Vendor draft was captured in the UI but not persisted. Apply the access_requests migration and try again.",
    publicRequestId,
    persisted: result.persisted,
    error: result.error,
  }
}

export async function updateAccessRequestStatusAction(formData: FormData) {
  const access = await requireBridgeApprovalCapability()
  const publicRequestId = readFormString(formData, "publicRequestId")
  const status = readFormString(formData, "status") as AccessRequestStatus

  if (!publicRequestId || !isAccessRequestStatus(status)) return

  await updateAccessRequestStatus({
    publicRequestId,
    status,
    decisionByClerkUserId: access.userId,
  })

  await recordAccessAuditEvent(access, {
    eventType: "access_request_decision",
    summary: `Updated access request ${publicRequestId} to ${status}`,
    payload: { publicRequestId, status },
  })

  revalidatePath("/access-requests")
}

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function readFormStrings(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .flatMap((value) => (typeof value === "string" && value ? [value] : []))
}

function buildPublicRequestId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `${prefix}-${Date.now().toString().slice(-6)}-${random}`
}

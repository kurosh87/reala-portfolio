export const legacyWriteModes = [
  "off",
  "dry_run",
  "sandbox",
  "admin_approved_live",
] as const

export type LegacyWriteMode = (typeof legacyWriteModes)[number]

export const legacyIntegrationKeys = [
  "legacy_mysql",
  "timetap",
  "stripe",
  "dropbox_wasabi",
  "matterport",
  "wordpress",
  "folder_automation",
  "print_shop",
] as const

export type LegacyIntegrationKey = (typeof legacyIntegrationKeys)[number]

export const legacyBridgeActions = [
  "read_mirror",
  "create_account",
  "create_order",
  "update_order",
  "sync_folders",
  "generate_invoice",
  "payment_authorization",
  "matterport_override",
  "print_status_update",
] as const

export type LegacyBridgeAction = (typeof legacyBridgeActions)[number]

export type LegacyBridgeEnvironment = "offline_clone" | "sandbox" | "production"

export type LegacyBridgeRequest = {
  integration: LegacyIntegrationKey
  action: LegacyBridgeAction
  targetEnvironment: LegacyBridgeEnvironment
  mode?: LegacyWriteMode
  actorId?: string
  adminApprovalId?: string
  payload?: Record<string, unknown>
}

export type LegacyBridgeDecision = {
  allowed: boolean
  dryRun: boolean
  mode: LegacyWriteMode
  reason: string
  requiresAdminApproval: boolean
  requiresSyntheticFixture: boolean
}

const secretKeyPattern =
  /(secret|password|token|api[_-]?key|authorization|auth|stripe|refresh|jwt|cookie)/i

const defaultSyntheticPrefix = "TEST-PORTAL-"

export function resolveLegacyWriteMode(
  rawMode?: string | null
): LegacyWriteMode {
  if (legacyWriteModes.includes(rawMode as LegacyWriteMode)) {
    return rawMode as LegacyWriteMode
  }

  return "off"
}

export function readLegacyWriteModeFromEnv() {
  return resolveLegacyWriteMode(process.env.LEGACY_WRITE_MODE)
}

export function evaluateLegacyBridgeRequest(
  request: LegacyBridgeRequest
): LegacyBridgeDecision {
  const mode = request.mode ?? readLegacyWriteModeFromEnv()
  const isReadOnly = request.action === "read_mirror"

  if (isReadOnly) {
    return {
      allowed: true,
      dryRun: false,
      mode,
      reason: "Read-only mirror actions are allowed in every bridge mode.",
      requiresAdminApproval: false,
      requiresSyntheticFixture: false,
    }
  }

  if (mode === "off") {
    return {
      allowed: false,
      dryRun: false,
      mode,
      reason: "Legacy writes are disabled.",
      requiresAdminApproval: false,
      requiresSyntheticFixture: false,
    }
  }

  if (mode === "dry_run") {
    return {
      allowed: true,
      dryRun: true,
      mode,
      reason: "Bridge action may be logged as a would-write payload only.",
      requiresAdminApproval: false,
      requiresSyntheticFixture: request.targetEnvironment === "production",
    }
  }

  if (mode === "sandbox") {
    return {
      allowed: request.targetEnvironment !== "production",
      dryRun: false,
      mode,
      reason:
        request.targetEnvironment === "production"
          ? "Sandbox mode cannot write to production legacy systems."
          : "Sandbox writes are allowed against cloned or test fixtures.",
      requiresAdminApproval: false,
      requiresSyntheticFixture: true,
    }
  }

  const hasApproval = Boolean(request.adminApprovalId)
  const isSynthetic = hasSyntheticFixtureMarkers(request.payload)

  return {
    allowed: hasApproval && isSynthetic,
    dryRun: false,
    mode,
    reason:
      hasApproval && isSynthetic
        ? "Admin-approved live bridge action is limited to a synthetic fixture."
        : "Live bridge actions require an admin approval id and synthetic fixture markers.",
    requiresAdminApproval: true,
    requiresSyntheticFixture: true,
  }
}

export function buildLegacyBridgeAttempt(request: LegacyBridgeRequest) {
  const decision = evaluateLegacyBridgeRequest(request)

  return {
    actorId: request.actorId ?? "system",
    integration: request.integration,
    action: request.action,
    targetEnvironment: request.targetEnvironment,
    mode: decision.mode,
    status: decision.allowed ? (decision.dryRun ? "dry_run" : "allowed") : "blocked",
    reason: decision.reason,
    adminApprovalId: request.adminApprovalId ?? null,
    payload: redactBridgePayload(request.payload ?? {}),
    createdAt: new Date().toISOString(),
  }
}

export function hasSyntheticFixtureMarkers(
  payload: Record<string, unknown> | undefined,
  prefix = process.env.LEGACY_BRIDGE_TEST_PREFIX ?? defaultSyntheticPrefix
) {
  if (!payload) return false

  const searchableValues = [
    payload.clientName,
    payload.fullName,
    payload.email,
    payload.listingAddress,
    payload.orderNumber,
    payload.externalReference,
  ]

  return searchableValues.some(
    (value) => typeof value === "string" && value.includes(prefix)
  )
}

export function redactBridgePayload(
  payload: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (secretKeyPattern.test(key)) {
        return [key, "[redacted]"]
      }

      if (value && typeof value === "object" && !Array.isArray(value)) {
        return [key, redactBridgePayload(value as Record<string, unknown>)]
      }

      return [key, value]
    })
  )
}

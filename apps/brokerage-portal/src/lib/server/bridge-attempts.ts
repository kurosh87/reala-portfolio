import "server-only"

import { createHash } from "node:crypto"

import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { and, desc, eq } from "drizzle-orm"

import type { bridgeAttempts } from "../../../drizzle/schema"

type BridgeAttemptInsert = InferInsertModel<typeof bridgeAttempts>
type BridgeAttemptRow = InferSelectModel<typeof bridgeAttempts>

export type BridgeAttemptRecord = {
  id: string
  sourceRequestType: string
  sourceRequestId: string
  sourceRecord: string | null
  targetRecord: string | null
  actorId: string
  workspaceOrganizationId: string | null
  activeRole: string | null
  integration: string
  action: string
  targetEnvironment: string
  mode: string
  status: string
  decisionReason: string
  adminApprovalId: string | null
  payloadHash: string
  redactedPayload: Record<string, unknown>
  createdAt: string
}

export type LegacyBridgeAttemptLike = {
  actorId?: string | null
  integration: string
  action: string
  targetEnvironment: string
  mode: string
  status: string
  reason: string
  adminApprovalId?: string | null
  payload?: Record<string, unknown>
  createdAt?: string
}

export type BridgeAttemptSource = {
  sourceRequestType: "portal_intake_request" | "access_request"
  sourceRequestId: string
  sourceRecord?: string | null
  targetRecord?: string | null
  organizationId?: string | null
  workspaceOrganizationId?: string | null
  activeRole?: string | null
  metadata?: Record<string, unknown>
}

export async function persistBridgeAttemptsForSource(
  source: BridgeAttemptSource,
  attempts: LegacyBridgeAttemptLike | LegacyBridgeAttemptLike[] | null | undefined
) {
  const normalizedAttempts = normalizeAttempts(attempts)

  if (!normalizedAttempts.length) {
    return { persisted: 0 }
  }

  try {
    const { db } = await import("@/db")
    const { bridgeAttempts } = await import("../../../drizzle/schema")
    const rows: BridgeAttemptInsert[] = normalizedAttempts.map((attempt) => {
      const redactedPayload = attempt.payload ?? {}

      return {
        sourceRequestType: source.sourceRequestType,
        sourceRequestId: source.sourceRequestId,
        sourceRecord: source.sourceRecord ?? null,
        targetRecord: source.targetRecord ?? null,
        actorId: attempt.actorId ?? "system",
        organizationId: source.organizationId ?? null,
        workspaceOrganizationId: source.workspaceOrganizationId ?? null,
        activeRole: source.activeRole ?? null,
        integration: attempt.integration,
        action: attempt.action,
        targetEnvironment: attempt.targetEnvironment,
        mode: attempt.mode,
        status: attempt.status,
        decisionReason: attempt.reason,
        adminApprovalId: attempt.adminApprovalId ?? null,
        payloadHash: hashPayload(redactedPayload),
        redactedPayload,
        metadata: {
          ...(source.metadata ?? {}),
          originalCreatedAt: attempt.createdAt ?? null,
        },
      }
    })

    const insertedRows = await db
      .insert(bridgeAttempts)
      .values(rows)
      .onConflictDoNothing()
      .returning({ id: bridgeAttempts.id })

    return { persisted: insertedRows.length }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown bridge attempt persistence error"

    console.warn("Bridge attempts were not persisted.", message)

    return {
      persisted: 0,
      error: message,
    }
  }
}

export async function listRecentBridgeAttempts(limit = 50) {
  try {
    const { db } = await import("@/db")
    const { bridgeAttempts } = await import("../../../drizzle/schema")

    const rows = await db
      .select()
      .from(bridgeAttempts)
      .orderBy(desc(bridgeAttempts.createdAt))
      .limit(limit)

    return rows.map(mapBridgeAttemptRecord)
  } catch (error) {
    console.warn("Bridge attempts could not be loaded.", error)
    return []
  }
}

export async function listBridgeAttemptsForSource(
  sourceRequestType: BridgeAttemptSource["sourceRequestType"],
  sourceRequestId: string,
  limit = 100
) {
  try {
    const { db } = await import("@/db")
    const { bridgeAttempts } = await import("../../../drizzle/schema")

    const rows = await db
      .select()
      .from(bridgeAttempts)
      .where(
        and(
          eq(bridgeAttempts.sourceRequestType, sourceRequestType),
          eq(bridgeAttempts.sourceRequestId, sourceRequestId)
        )
      )
      .orderBy(desc(bridgeAttempts.createdAt))
      .limit(limit)

    return rows.map(mapBridgeAttemptRecord)
  } catch (error) {
    console.warn("Source bridge attempts could not be loaded.", error)
    return []
  }
}

export function buildPayloadHash(payload: Record<string, unknown>) {
  return hashPayload(payload)
}

function mapBridgeAttemptRecord(row: BridgeAttemptRow): BridgeAttemptRecord {
  return {
    id: row.id,
    sourceRequestType: row.sourceRequestType,
    sourceRequestId: row.sourceRequestId,
    sourceRecord: row.sourceRecord,
    targetRecord: row.targetRecord,
    actorId: row.actorId,
    workspaceOrganizationId: row.workspaceOrganizationId,
    activeRole: row.activeRole,
    integration: row.integration,
    action: row.action,
    targetEnvironment: row.targetEnvironment,
    mode: row.mode,
    status: row.status,
    decisionReason: row.decisionReason,
    adminApprovalId: row.adminApprovalId,
    payloadHash: row.payloadHash,
    redactedPayload: row.redactedPayload ?? {},
    createdAt: row.createdAt.toISOString(),
  }
}

function normalizeAttempts(
  attempts: LegacyBridgeAttemptLike | LegacyBridgeAttemptLike[] | null | undefined
) {
  if (!attempts) return []

  return Array.isArray(attempts) ? attempts : [attempts]
}

function hashPayload(payload: Record<string, unknown>) {
  return createHash("sha256")
    .update(stableStringify(payload))
    .digest("hex")
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`
  }

  const record = value as Record<string, unknown>

  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`
}

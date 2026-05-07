import "server-only"

import { sql } from "@/db"
import type { AuditTimelineItem } from "@/components/audit-timeline"
import type { WorkspaceAccess } from "@/lib/server/workspace-access"

type ScopedQuery = {
  scope: "all" | "organization" | "none"
  organizationId: string | null
  label: string
}

type ExceptionRow = {
  id: string
  organization_id: string | null
  listing_id: string | null
  appointment_id: string | null
  sync_run_id: string | null
  exception_type: string
  status: string
  severity: string
  title: string
  summary: string
  recommended_action: string | null
  legacy_source: string | null
  legacy_id: string | null
  legacy_payload: Record<string, unknown> | null
  last_seen_at: Date | string | null
  sync_status: string
  sync_error: string | null
  metadata: Record<string, unknown> | null
  created_at: Date | string
  updated_at: Date | string
  listing_label: string | null
  appointment_status: string | null
  appointment_scheduled_for: Date | string | null
  sync_integration_key: string | null
  sync_mode: string | null
  sync_run_status: string | null
  sync_records_seen: number | null
  sync_records_changed: number | null
  sync_started_at: Date | string | null
  sync_finished_at: Date | string | null
  sync_safe_error: string | null
}

type BridgeAttemptRow = {
  id: string
  integration: string
  action: string
  mode: string
  status: string
  decision_reason: string
  source_request_id: string
  payload_hash: string
  created_at: Date | string
}

type AuditEventRow = {
  id: string
  event_type: string
  summary: string
  payload: Record<string, unknown> | null
  created_at: Date | string
}

export type IntegrationExceptionDetail = {
  id: string
  exceptionType: string
  status: string
  severity: string
  title: string
  summary: string
  recommendedAction: string | null
  legacySource: string | null
  legacyId: string | null
  legacyPayload: Record<string, unknown>
  metadata: Record<string, unknown>
  syncStatus: string
  syncError: string | null
  lastSeenAt: string | null
  createdAt: string
  updatedAt: string
  sourceLabel: string
  safetyBoundary: string
  listing: { id: string; label: string | null } | null
  appointment: { id: string; status: string | null; scheduledFor: string | null } | null
  syncRun: {
    id: string
    integrationKey: string | null
    mode: string | null
    status: string | null
    recordsSeen: number
    recordsChanged: number
    startedAt: string | null
    finishedAt: string | null
    safeError: string | null
  } | null
  bridgeAttempts: Array<{
    id: string
    integration: string
    action: string
    mode: string
    status: string
    decisionReason: string
    sourceRequestId: string
    payloadHash: string
    createdAt: string
  }>
  timeline: AuditTimelineItem[]
}

export async function getIntegrationExceptionDetail(
  id: string,
  access: WorkspaceAccess
): Promise<IntegrationExceptionDetail | null> {
  const scoped = getExceptionScope(access)

  if (scoped.scope === "none") return null

  try {
    const row = await getExceptionRow(id, scoped)

    if (!row) return null

    const [bridgeAttempts, auditEvents] = await Promise.all([
      getRelatedBridgeAttempts(row),
      getRelatedAuditEvents(row),
    ])

    return {
      id: row.id,
      exceptionType: row.exception_type,
      status: row.status,
      severity: row.severity.toLowerCase(),
      title: row.title,
      summary: row.summary,
      recommendedAction: row.recommended_action,
      legacySource: row.legacy_source,
      legacyId: row.legacy_id,
      legacyPayload: row.legacy_payload ?? {},
      metadata: row.metadata ?? {},
      syncStatus: row.sync_status,
      syncError: row.sync_error,
      lastSeenAt: row.last_seen_at ? toIsoString(row.last_seen_at) : null,
      createdAt: toIsoString(row.created_at),
      updatedAt: toIsoString(row.updated_at),
      sourceLabel: scoped.label,
      safetyBoundary:
        "Read-only exception evidence: this page does not call TimeTap, Stripe, Matterport, folders, WordPress, storage, or legacy MySQL.",
      listing: row.listing_id
        ? { id: row.listing_id, label: row.listing_label }
        : null,
      appointment: row.appointment_id
        ? {
            id: row.appointment_id,
            status: row.appointment_status,
            scheduledFor: row.appointment_scheduled_for
              ? toIsoString(row.appointment_scheduled_for)
              : null,
          }
        : null,
      syncRun: row.sync_run_id
        ? {
            id: row.sync_run_id,
            integrationKey: row.sync_integration_key,
            mode: row.sync_mode,
            status: row.sync_run_status,
            recordsSeen: Number(row.sync_records_seen ?? 0),
            recordsChanged: Number(row.sync_records_changed ?? 0),
            startedAt: row.sync_started_at ? toIsoString(row.sync_started_at) : null,
            finishedAt: row.sync_finished_at ? toIsoString(row.sync_finished_at) : null,
            safeError: row.sync_safe_error,
          }
        : null,
      bridgeAttempts: bridgeAttempts.map((attempt) => ({
        id: attempt.id,
        integration: attempt.integration,
        action: attempt.action,
        mode: attempt.mode,
        status: attempt.status,
        decisionReason: attempt.decision_reason,
        sourceRequestId: attempt.source_request_id,
        payloadHash: attempt.payload_hash,
        createdAt: toIsoString(attempt.created_at),
      })),
      timeline: buildExceptionTimeline(row, bridgeAttempts, auditEvents),
    }
  } catch (error) {
    console.warn("Integration exception detail could not be loaded.", error)
    return null
  }
}

function getExceptionScope(access: WorkspaceAccess): ScopedQuery {
  if (
    access.canPreviewOrg ||
    access.canApproveBridge ||
    access.activeRole === "Reala Super Admin" ||
    access.activeRole === "Reala Ops Admin"
  ) {
    return {
      scope: "all",
      organizationId: null,
      label: "Supabase exception mirror · all Reala-visible records",
    }
  }

  if (access.databaseOrganizationId) {
    return {
      scope: "organization",
      organizationId: access.databaseOrganizationId,
      label: `Supabase exception mirror · ${access.activeOrganization.name}`,
    }
  }

  return {
    scope: "none",
    organizationId: null,
    label: `Portal scope · ${access.activeOrganization.name}`,
  }
}

async function getExceptionRow(id: string, scoped: ScopedQuery) {
  const rows =
    scoped.scope === "organization"
      ? await sql<ExceptionRow[]>`
          select
            ie.id::text,
            ie.organization_id::text,
            ie.listing_id::text,
            ie.appointment_id::text,
            ie.sync_run_id::text,
            ie.exception_type,
            ie.status::text,
            ie.severity,
            ie.title,
            ie.summary,
            ie.recommended_action,
            ie.legacy_source,
            ie.legacy_id,
            ie.legacy_payload,
            ie.last_seen_at,
            ie.sync_status::text,
            ie.sync_error,
            ie.metadata,
            ie.created_at,
            ie.updated_at,
            concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
            a.status as appointment_status,
            a.scheduled_for as appointment_scheduled_for,
            sr.integration_key as sync_integration_key,
            sr.mode as sync_mode,
            sr.status::text as sync_run_status,
            sr.records_seen as sync_records_seen,
            sr.records_changed as sync_records_changed,
            sr.started_at as sync_started_at,
            sr.finished_at as sync_finished_at,
            sr.safe_error as sync_safe_error
          from public.integration_exceptions ie
          left join public.listings l on l.id = ie.listing_id
          left join public.appointments a on a.id = ie.appointment_id
          left join public.integration_sync_runs sr on sr.id = ie.sync_run_id
          where ie.id::text = ${id}
            and (ie.organization_id = ${scoped.organizationId} or ie.organization_id is null)
          limit 1
        `
      : await sql<ExceptionRow[]>`
          select
            ie.id::text,
            ie.organization_id::text,
            ie.listing_id::text,
            ie.appointment_id::text,
            ie.sync_run_id::text,
            ie.exception_type,
            ie.status::text,
            ie.severity,
            ie.title,
            ie.summary,
            ie.recommended_action,
            ie.legacy_source,
            ie.legacy_id,
            ie.legacy_payload,
            ie.last_seen_at,
            ie.sync_status::text,
            ie.sync_error,
            ie.metadata,
            ie.created_at,
            ie.updated_at,
            concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
            a.status as appointment_status,
            a.scheduled_for as appointment_scheduled_for,
            sr.integration_key as sync_integration_key,
            sr.mode as sync_mode,
            sr.status::text as sync_run_status,
            sr.records_seen as sync_records_seen,
            sr.records_changed as sync_records_changed,
            sr.started_at as sync_started_at,
            sr.finished_at as sync_finished_at,
            sr.safe_error as sync_safe_error
          from public.integration_exceptions ie
          left join public.listings l on l.id = ie.listing_id
          left join public.appointments a on a.id = ie.appointment_id
          left join public.integration_sync_runs sr on sr.id = ie.sync_run_id
          where ie.id::text = ${id}
          limit 1
        `

  return rows[0] ?? null
}

async function getRelatedBridgeAttempts(row: ExceptionRow) {
  const exceptionPattern = `%${row.id}%`
  const legacyPattern = row.legacy_id ? `%${row.legacy_id}%` : null
  const listingPattern = row.listing_id ? `%${row.listing_id}%` : null

  return sql<BridgeAttemptRow[]>`
    select
      id::text,
      integration,
      action,
      mode,
      status,
      decision_reason,
      source_request_id,
      payload_hash,
      created_at
    from public.bridge_attempts
    where source_request_id = ${row.id}
      or source_record ilike ${exceptionPattern}
      or target_record ilike ${exceptionPattern}
      or redacted_payload->>'exceptionId' = ${row.id}
      or metadata->>'exceptionId' = ${row.id}
      or (${legacyPattern}::text is not null and redacted_payload::text ilike ${legacyPattern})
      or (${legacyPattern}::text is not null and metadata::text ilike ${legacyPattern})
      or (${listingPattern}::text is not null and redacted_payload::text ilike ${listingPattern})
      or (${listingPattern}::text is not null and metadata::text ilike ${listingPattern})
    order by created_at desc
    limit 12
  `
}

async function getRelatedAuditEvents(row: ExceptionRow) {
  const exceptionPattern = `%${row.id}%`
  const legacyPattern = row.legacy_id ? `%${row.legacy_id}%` : null

  return sql<AuditEventRow[]>`
    select
      id::text,
      event_type,
      summary,
      payload,
      created_at
    from public.audit_events
    where (${row.listing_id}::uuid is not null and listing_id = ${row.listing_id})
      or payload::text ilike ${exceptionPattern}
      or (${legacyPattern}::text is not null and payload::text ilike ${legacyPattern})
    order by created_at desc
    limit 12
  `
}

function buildExceptionTimeline(
  row: ExceptionRow,
  bridgeAttempts: BridgeAttemptRow[],
  auditEvents: AuditEventRow[]
): AuditTimelineItem[] {
  const items: AuditTimelineItem[] = [
    {
      id: `${row.id}:created`,
      tone: "exception",
      title: "Exception created",
      summary: row.summary,
      timestamp: toIsoString(row.created_at),
      status: row.status,
      reference: row.legacy_id ?? row.exception_type,
    },
    {
      id: `${row.id}:updated`,
      tone: "sync",
      title: "Exception mirror updated",
      summary:
        row.sync_error ??
        row.recommended_action ??
        "Latest portal mirror state is visible for operator review.",
      timestamp: toIsoString(row.updated_at),
      status: row.sync_status,
      reference: row.legacy_source,
    },
  ]

  if (row.sync_run_id && row.sync_started_at) {
    items.push({
      id: `${row.sync_run_id}:sync-run`,
      tone: "sync",
      title: `${row.sync_integration_key ?? "Integration"} sync run`,
      summary: `Read-only run saw ${Number(row.sync_records_seen ?? 0)} records and changed ${Number(row.sync_records_changed ?? 0)} mirror records.`,
      timestamp: toIsoString(row.sync_started_at),
      status: row.sync_run_status,
      reference: row.sync_run_id,
    })
  }

  return [
    ...items,
    ...bridgeAttempts.map((attempt) => ({
      id: attempt.id,
      tone: "bridge" as const,
      title: `${attempt.integration} ${attempt.action}`,
      summary: attempt.decision_reason,
      timestamp: toIsoString(attempt.created_at),
      status: attempt.status,
      reference: attempt.payload_hash.slice(0, 12),
    })),
    ...auditEvents.map((event) => ({
      id: event.id,
      tone: "audit" as const,
      title: event.event_type.replaceAll("_", " "),
      summary: event.summary,
      timestamp: toIsoString(event.created_at),
      status: readPayloadString(event.payload, "status"),
      reference: readPayloadString(event.payload, "publicRequestId"),
    })),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

function readPayloadString(payload: unknown, key: string) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null
  }

  const value = (payload as Record<string, unknown>)[key]
  return typeof value === "string" && value.trim() ? value : null
}

function toIsoString(value: Date | string) {
  if (value instanceof Date) return value.toISOString()

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString()
}

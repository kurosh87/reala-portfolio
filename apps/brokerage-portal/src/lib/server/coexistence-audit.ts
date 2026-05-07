import "server-only"

import { sql } from "@/db"

export type CountRow = {
  label: string
  count: number
}

export type RecentBridgeAttempt = {
  id: string
  sourceRequestId: string
  sourceRequestType: string
  integration: string
  action: string
  mode: string
  status: string
  decisionReason: string
  payloadHash: string
  createdAt: string
}

export type RecentIntegrationException = {
  id: string
  exceptionType: string
  severity: string
  status: string
  title: string
  summary: string
  recommendedAction: string | null
  legacySource: string | null
  legacyId: string | null
  createdAt: string
}

export type RecentSyncRun = {
  id: string
  integrationKey: string
  mode: string
  status: string
  recordsSeen: number
  recordsChanged: number
  startedAt: string | null
  finishedAt: string | null
}

export type CoexistenceAuditSnapshot = {
  generatedAt: string
  bridgeAttemptCounts: CountRow[]
  bridgeModeCounts: CountRow[]
  intakeStatusCounts: CountRow[]
  accessStatusCounts: CountRow[]
  exceptionStatusCounts: CountRow[]
  exceptionTypeCounts: CountRow[]
  productParityCounts: CountRow[]
  recentBridgeAttempts: RecentBridgeAttempt[]
  recentExceptions: RecentIntegrationException[]
  recentSyncRuns: RecentSyncRun[]
}

export async function getCoexistenceAuditSnapshot(): Promise<CoexistenceAuditSnapshot> {
  const [
    bridgeAttemptCounts,
    bridgeModeCounts,
    intakeStatusCounts,
    accessStatusCounts,
    exceptionStatusCounts,
    exceptionTypeCounts,
    productParityCounts,
    recentBridgeAttempts,
    recentExceptions,
    recentSyncRuns,
  ] = await Promise.all([
    getBridgeAttemptCounts(),
    getBridgeModeCounts(),
    getPortalIntakeStatusCounts(),
    getAccessStatusCounts(),
    getExceptionStatusCounts(),
    getExceptionTypeCounts(),
    getProductParityCounts(),
    getRecentBridgeAttempts(),
    getRecentExceptions(),
    getRecentSyncRuns(),
  ])

  return {
    generatedAt: new Date().toISOString(),
    bridgeAttemptCounts,
    bridgeModeCounts,
    intakeStatusCounts,
    accessStatusCounts,
    exceptionStatusCounts,
    exceptionTypeCounts,
    productParityCounts,
    recentBridgeAttempts,
    recentExceptions,
    recentSyncRuns,
  }
}

async function getBridgeAttemptCounts(): Promise<CountRow[]> {
  return normalizeCountRows(
    await sql`
      select status as label, count(*)::int as count
      from public.bridge_attempts
      group by status
      order by count desc, status asc
    `
  )
}

async function getBridgeModeCounts(): Promise<CountRow[]> {
  return normalizeCountRows(
    await sql`
      select mode as label, count(*)::int as count
      from public.bridge_attempts
      group by mode
      order by count desc, mode asc
    `
  )
}

async function getPortalIntakeStatusCounts(): Promise<CountRow[]> {
  return normalizeCountRows(
    await sql`
      select status as label, count(*)::int as count
      from public.portal_intake_requests
      group by status
      order by count desc, status asc
    `
  )
}

async function getAccessStatusCounts(): Promise<CountRow[]> {
  return normalizeCountRows(
    await sql`
      select status as label, count(*)::int as count
      from public.access_requests
      group by status
      order by count desc, status asc
    `
  )
}

async function getExceptionStatusCounts(): Promise<CountRow[]> {
  return normalizeCountRows(
    await sql`
      select status::text as label, count(*)::int as count
      from public.integration_exceptions
      group by status
      order by count desc, status asc
    `
  )
}

async function getExceptionTypeCounts(): Promise<CountRow[]> {
  return normalizeCountRows(
    await sql`
      select exception_type as label, count(*)::int as count
      from public.integration_exceptions
      group by exception_type
      order by count desc, exception_type asc
    `
  )
}

async function getProductParityCounts(): Promise<CountRow[]> {
  const [row] = await sql`
    select
      (select count(*)::int from public.feature_sheet_projects) as feature_sheet_projects,
      (select count(*)::int from public.virtual_staging_requests) as virtual_staging_requests,
      (select count(*)::int from public.print_catalog_products) as print_catalog_products,
      (
        select count(*)::int
        from public.workflow_jobs
        where type::text in ('feature_sheet', 'virtual_staging', 'print_order')
      ) as product_workflow_jobs
  `

  return [
    { label: "Feature sheet projects", count: Number(row.feature_sheet_projects ?? 0) },
    { label: "Virtual staging requests", count: Number(row.virtual_staging_requests ?? 0) },
    { label: "Print catalog products", count: Number(row.print_catalog_products ?? 0) },
    { label: "Product workflow jobs", count: Number(row.product_workflow_jobs ?? 0) },
  ]
}

async function getRecentBridgeAttempts(): Promise<RecentBridgeAttempt[]> {
  const rows = await sql`
    select
      id::text,
      source_request_id,
      source_request_type,
      integration,
      action,
      mode,
      status,
      decision_reason,
      payload_hash,
      created_at
    from public.bridge_attempts
    order by created_at desc
    limit 12
  `

  return rows.map((row) => ({
    id: String(row.id),
    sourceRequestId: String(row.source_request_id),
    sourceRequestType: String(row.source_request_type),
    integration: String(row.integration),
    action: String(row.action),
    mode: String(row.mode),
    status: String(row.status),
    decisionReason: String(row.decision_reason),
    payloadHash: String(row.payload_hash),
    createdAt: toIsoString(row.created_at),
  }))
}

async function getRecentExceptions(): Promise<RecentIntegrationException[]> {
  const rows = await sql`
    select
      id::text,
      exception_type,
      severity,
      status::text,
      title,
      summary,
      recommended_action,
      legacy_source,
      legacy_id,
      created_at
    from public.integration_exceptions
    order by created_at desc
    limit 12
  `

  return rows.map((row) => ({
    id: String(row.id),
    exceptionType: String(row.exception_type),
    severity: String(row.severity),
    status: String(row.status),
    title: String(row.title),
    summary: String(row.summary),
    recommendedAction: row.recommended_action ? String(row.recommended_action) : null,
    legacySource: row.legacy_source ? String(row.legacy_source) : null,
    legacyId: row.legacy_id ? String(row.legacy_id) : null,
    createdAt: toIsoString(row.created_at),
  }))
}

async function getRecentSyncRuns(): Promise<RecentSyncRun[]> {
  const rows = await sql`
    select
      id::text,
      integration_key,
      mode,
      status::text,
      records_seen,
      records_changed,
      started_at,
      finished_at
    from public.integration_sync_runs
    order by started_at desc nulls last
    limit 8
  `

  return rows.map((row) => ({
    id: String(row.id),
    integrationKey: String(row.integration_key),
    mode: String(row.mode),
    status: String(row.status),
    recordsSeen: Number(row.records_seen ?? 0),
    recordsChanged: Number(row.records_changed ?? 0),
    startedAt: row.started_at ? toIsoString(row.started_at) : null,
    finishedAt: row.finished_at ? toIsoString(row.finished_at) : null,
  }))
}

function normalizeCountRows(rows: Array<{ label: unknown; count: unknown }>) {
  return rows.map((row) => ({
    label: String(row.label),
    count: Number(row.count ?? 0),
  }))
}

function toIsoString(value: unknown) {
  if (value instanceof Date) return value.toISOString()

  const date = new Date(String(value))

  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

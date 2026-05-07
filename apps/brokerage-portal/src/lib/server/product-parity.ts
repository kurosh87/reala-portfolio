import "server-only"

import { sql } from "@/db"
import type { AuditTimelineItem } from "@/components/audit-timeline"
import { listingData } from "@/lib/listings-data"
import type { WorkspaceAccess } from "@/lib/server/workspace-access"

export type ProductParityKind = "feature-sheet" | "virtual-staging" | "print"

export type ProductParitySummary = {
  id: string
  kind: ProductParityKind
  title: string
  status: string
  listingId: string | null
  listingLabel: string | null
  href: string
  updatedAt: string
  safetyBoundary: string
}

export type ProductParityDetail = ProductParitySummary & {
  description: string
  organizationId: string | null
  sourceLabel: string
  sourceRecord: string
  targetRecord: string
  metrics: Array<{ label: string; value: string }>
  requirements: Array<{ label: string; status: "clear" | "watch"; detail: string }>
  payload: Record<string, unknown>
  timeline: AuditTimelineItem[]
  exceptions: Array<{
    id: string
    type: string
    severity: string
    status: string
    title: string
    summary: string
    recommendedAction: string | null
    createdAt: string
  }>
  bridgeAttempts: Array<{
    id: string
    sourceRequestId: string
    integration: string
    action: string
    mode: string
    status: string
    payloadHash: string
    decisionReason: string
    createdAt: string
  }>
}

type ScopedQuery = {
  scope: "all" | "organization" | "none"
  organizationId: string | null
  label: string
}

type ProductRecordRow = {
  id: string
  kind: ProductParityKind
  organization_id: string | null
  listing_id: string | null
  listing_label: string | null
  title: string
  status: string
  description: string | null
  source_record: string
  target_record: string
  payload: Record<string, unknown> | null
  created_at: Date | string
  updated_at: Date | string
}

type ExceptionRow = {
  id: string
  exception_type: string
  severity: string
  status: string
  title: string
  summary: string
  recommended_action: string | null
  created_at: Date | string
}

type BridgeAttemptRow = {
  id: string
  source_request_id: string
  integration: string
  action: string
  mode: string
  status: string
  payload_hash: string
  decision_reason: string
  created_at: Date | string
}

type AuditEventRow = {
  id: string
  event_type: string
  summary: string
  payload: Record<string, unknown> | null
  created_at: Date | string
}

type PortalIntakeRow = {
  public_request_id: string
  status: string
  title: string
  metadata: Record<string, unknown> | null
  updated_at: Date | string
  created_at: Date | string
}

type StaticListingRecord = (typeof listingData)[number]

export async function getProductParityDetail(
  kind: ProductParityKind,
  id: string,
  access: WorkspaceAccess
): Promise<ProductParityDetail | null> {
  const scoped = getProductScope(access)

  if (scoped.scope === "none") return null

  try {
    const row = await getProductRow(kind, id, scoped)

    if (!row) return null

    const [exceptions, bridgeAttempts, auditEvents, handoffEvents] =
      await Promise.all([
        getProductExceptions(row),
        getProductBridgeAttempts(row),
        getProductAuditEvents(row),
        getProductHandoffEvents(row),
      ])

    return {
      ...mapProductSummary(row),
      description: row.description ?? getProductDescription(row.kind),
      organizationId: row.organization_id,
      sourceLabel: scoped.label,
      sourceRecord: row.source_record,
      targetRecord: row.target_record,
      metrics: buildProductMetrics(row),
      requirements: buildProductRequirements(row, exceptions),
      payload: row.payload ?? {},
      exceptions,
      bridgeAttempts,
      timeline: buildTimeline(row, {
        exceptions,
        bridgeAttempts,
        auditEvents,
        handoffEvents,
      }),
    }
  } catch (error) {
    console.warn("Product parity detail could not be loaded.", error)
    return null
  }
}

export async function getListingProductParity(
  listingId: string,
  access: WorkspaceAccess
): Promise<ProductParitySummary[]> {
  const scoped = getProductScope(access)

  if (scoped.scope === "none") return []

  try {
    const resolvedListingIds = await resolveListingIdsForParity(listingId, scoped)

    if (!resolvedListingIds.length) return []

    const rowSets = await Promise.all(
      resolvedListingIds.map((resolvedListingId) =>
        scoped.scope === "all"
          ? getProductRowsForListing(resolvedListingId)
          : getProductRowsForListing(resolvedListingId, scoped.organizationId)
      )
    )
    const rows = rowSets.flat()

    return rows.map(mapProductSummary)
  } catch (error) {
    console.warn("Listing product parity rows could not be loaded.", error)
    return []
  }
}

export async function getRecentProductParitySummaries(
  kind: ProductParityKind,
  access: WorkspaceAccess
): Promise<ProductParitySummary[]> {
  const scoped = getProductScope(access)

  if (scoped.scope === "none") return []

  try {
    const rows = await getRecentProductRows(kind, scoped)

    return rows.map(mapProductSummary)
  } catch (error) {
    console.warn("Recent product parity rows could not be loaded.", error)
    return []
  }
}

function getProductScope(access: WorkspaceAccess): ScopedQuery {
  if (
    access.canPreviewOrg ||
    access.activeRole === "Reala Super Admin" ||
    access.activeRole === "Reala Ops Admin"
  ) {
    return {
      scope: "all",
      organizationId: null,
      label: "Supabase portal mirror · all product parity records",
    }
  }

  if (access.databaseOrganizationId) {
    return {
      scope: "organization",
      organizationId: access.databaseOrganizationId,
      label: `Supabase portal mirror · ${access.activeOrganization.name}`,
    }
  }

  return {
    scope: "none",
    organizationId: null,
    label: `Portal scope · ${access.activeOrganization.name}`,
  }
}

async function getProductRow(
  kind: ProductParityKind,
  id: string,
  scoped: ScopedQuery
) {
  const rows =
    kind === "feature-sheet"
      ? await getFeatureSheetRows(scoped, id)
      : kind === "virtual-staging"
        ? await getVirtualStagingRows(scoped, id)
        : await getPrintRows(scoped, id)

  return rows[0] ?? null
}

async function getRecentProductRows(kind: ProductParityKind, scoped: ScopedQuery) {
  if (kind === "feature-sheet") return getFeatureSheetRows(scoped)
  if (kind === "virtual-staging") return getVirtualStagingRows(scoped)
  return getPrintRows(scoped)
}

async function getFeatureSheetRows(scoped: ScopedQuery, id?: string) {
  if (scoped.scope === "organization") {
    return sql<ProductRecordRow[]>`
      select
        fs.id::text,
        'feature-sheet' as kind,
        fs.organization_id::text,
        fs.listing_id::text,
        concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
        coalesce(fs.copy_json->>'headline', concat('Feature sheet · ', l.address_line1)) as title,
        fs.status::text as status,
        fs.layout_json->>'template' as description,
        concat('feature_sheet_projects:', fs.id::text) as source_record,
        'legacy.feature_sheet_or_print:manual-handoff' as target_record,
        jsonb_build_object(
          'matchConfirmation', fs.match_confirmation_json,
          'selectedAssets', fs.selected_assets_json,
          'copy', fs.copy_json,
          'layout', fs.layout_json,
          'proofAssetId', fs.proof_asset_id,
          'finalAssetId', fs.final_asset_id,
          'approvedAt', fs.approved_at
        ) as payload,
        fs.created_at,
        fs.updated_at
      from public.feature_sheet_projects fs
      left join public.listings l on l.id = fs.listing_id
      where fs.organization_id = ${scoped.organizationId}
        and (${id ?? null}::text is null or fs.id::text = ${id ?? null})
      order by fs.updated_at desc
      limit 12
    `
  }

  return sql<ProductRecordRow[]>`
    select
      fs.id::text,
      'feature-sheet' as kind,
      fs.organization_id::text,
      fs.listing_id::text,
      concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
      coalesce(fs.copy_json->>'headline', concat('Feature sheet · ', l.address_line1)) as title,
      fs.status::text as status,
      fs.layout_json->>'template' as description,
      concat('feature_sheet_projects:', fs.id::text) as source_record,
      'legacy.feature_sheet_or_print:manual-handoff' as target_record,
      jsonb_build_object(
        'matchConfirmation', fs.match_confirmation_json,
        'selectedAssets', fs.selected_assets_json,
        'copy', fs.copy_json,
        'layout', fs.layout_json,
        'proofAssetId', fs.proof_asset_id,
        'finalAssetId', fs.final_asset_id,
        'approvedAt', fs.approved_at
      ) as payload,
      fs.created_at,
      fs.updated_at
    from public.feature_sheet_projects fs
    left join public.listings l on l.id = fs.listing_id
    where (${id ?? null}::text is null or fs.id::text = ${id ?? null})
    order by fs.updated_at desc
    limit 12
  `
}

async function getVirtualStagingRows(scoped: ScopedQuery, id?: string) {
  if (scoped.scope === "organization") {
    return sql<ProductRecordRow[]>`
      select
        vs.id::text,
        'virtual-staging' as kind,
        vs.organization_id::text,
        vs.listing_id::text,
        concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
        concat('Virtual staging · ', coalesce(vs.room_type, l.address_line1)) as title,
        vs.status::text as status,
        concat_ws(' / ', vs.room_type, vs.staging_style) as description,
        concat('virtual_staging_requests:', vs.id::text) as source_record,
        'legacy.virtual_staging_or_ai_provider:manual-handoff' as target_record,
        jsonb_build_object(
          'sourceAssetId', vs.source_asset_id,
          'workflowJobId', vs.workflow_job_id,
          'roomType', vs.room_type,
          'stagingStyle', vs.staging_style,
          'removeExistingFurniture', vs.remove_existing_furniture,
          'creditCost', vs.credit_cost,
          'generationSettings', vs.generation_settings_json,
          'selectedOutputAssetId', vs.selected_output_asset_id,
          'approvedAt', vs.approved_at
        ) as payload,
        vs.created_at,
        vs.updated_at
      from public.virtual_staging_requests vs
      left join public.listings l on l.id = vs.listing_id
      where vs.organization_id = ${scoped.organizationId}
        and (${id ?? null}::text is null or vs.id::text = ${id ?? null})
      order by vs.updated_at desc
      limit 12
    `
  }

  return sql<ProductRecordRow[]>`
    select
      vs.id::text,
      'virtual-staging' as kind,
      vs.organization_id::text,
      vs.listing_id::text,
      concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
      concat('Virtual staging · ', coalesce(vs.room_type, l.address_line1)) as title,
      vs.status::text as status,
      concat_ws(' / ', vs.room_type, vs.staging_style) as description,
      concat('virtual_staging_requests:', vs.id::text) as source_record,
      'legacy.virtual_staging_or_ai_provider:manual-handoff' as target_record,
      jsonb_build_object(
        'sourceAssetId', vs.source_asset_id,
        'workflowJobId', vs.workflow_job_id,
        'roomType', vs.room_type,
        'stagingStyle', vs.staging_style,
        'removeExistingFurniture', vs.remove_existing_furniture,
        'creditCost', vs.credit_cost,
        'generationSettings', vs.generation_settings_json,
        'selectedOutputAssetId', vs.selected_output_asset_id,
        'approvedAt', vs.approved_at
      ) as payload,
      vs.created_at,
      vs.updated_at
    from public.virtual_staging_requests vs
    left join public.listings l on l.id = vs.listing_id
    where (${id ?? null}::text is null or vs.id::text = ${id ?? null})
    order by vs.updated_at desc
    limit 12
  `
}

async function getPrintRows(scoped: ScopedQuery, id?: string) {
  if (scoped.scope === "organization") {
    return sql<ProductRecordRow[]>`
      select
        pc.id::text,
        'print' as kind,
        pc.organization_id::text,
        null::text as listing_id,
        null::text as listing_label,
        pc.name as title,
        pc.status::text as status,
        pc.description,
        concat('print_catalog_products:', coalesce(pc.sku, pc.id::text)) as source_record,
        'legacy.print_shop_csv_or_invoice:manual-handoff' as target_record,
        jsonb_build_object(
          'sku', pc.sku,
          'priceCents', pc.price_cents,
          'mediaRequired', pc.media_required,
          'designOption', pc.design_option,
          'deliveryOptions', pc.delivery_options_json,
          'addons', pc.addons_json,
          'publishedVersion', pc.published_version
        ) as payload,
        pc.created_at,
        pc.updated_at
      from public.print_catalog_products pc
      where (pc.organization_id = ${scoped.organizationId} or pc.organization_id is null)
        and (${id ?? null}::text is null or pc.id::text = ${id ?? null} or pc.sku = ${id ?? null})
      order by pc.updated_at desc
      limit 12
    `
  }

  return sql<ProductRecordRow[]>`
    select
      pc.id::text,
      'print' as kind,
      pc.organization_id::text,
      null::text as listing_id,
      null::text as listing_label,
      pc.name as title,
      pc.status::text as status,
      pc.description,
      concat('print_catalog_products:', coalesce(pc.sku, pc.id::text)) as source_record,
      'legacy.print_shop_csv_or_invoice:manual-handoff' as target_record,
      jsonb_build_object(
        'sku', pc.sku,
        'priceCents', pc.price_cents,
        'mediaRequired', pc.media_required,
        'designOption', pc.design_option,
        'deliveryOptions', pc.delivery_options_json,
        'addons', pc.addons_json,
        'publishedVersion', pc.published_version
      ) as payload,
      pc.created_at,
      pc.updated_at
    from public.print_catalog_products pc
    where (${id ?? null}::text is null or pc.id::text = ${id ?? null} or pc.sku = ${id ?? null})
    order by pc.updated_at desc
    limit 12
  `
}

async function getProductRowsForListing(
  listingId: string,
  organizationId?: string | null
) {
  const rows = organizationId
    ? await sql<ProductRecordRow[]>`
        select * from (
          select
            fs.id::text,
            'feature-sheet' as kind,
            fs.organization_id::text,
            fs.listing_id::text,
            concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
            coalesce(fs.copy_json->>'headline', concat('Feature sheet · ', l.address_line1)) as title,
            fs.status::text as status,
            fs.layout_json->>'template' as description,
            concat('feature_sheet_projects:', fs.id::text) as source_record,
            'legacy.feature_sheet_or_print:manual-handoff' as target_record,
            jsonb_build_object('proofAssetId', fs.proof_asset_id, 'finalAssetId', fs.final_asset_id) as payload,
            fs.created_at,
            fs.updated_at
          from public.feature_sheet_projects fs
          left join public.listings l on l.id = fs.listing_id
          where fs.listing_id = ${listingId} and fs.organization_id = ${organizationId}
          union all
          select
            vs.id::text,
            'virtual-staging' as kind,
            vs.organization_id::text,
            vs.listing_id::text,
            concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
            concat('Virtual staging · ', coalesce(vs.room_type, l.address_line1)) as title,
            vs.status::text as status,
            concat_ws(' / ', vs.room_type, vs.staging_style) as description,
            concat('virtual_staging_requests:', vs.id::text) as source_record,
            'legacy.virtual_staging_or_ai_provider:manual-handoff' as target_record,
            jsonb_build_object('sourceAssetId', vs.source_asset_id, 'selectedOutputAssetId', vs.selected_output_asset_id) as payload,
            vs.created_at,
            vs.updated_at
          from public.virtual_staging_requests vs
          left join public.listings l on l.id = vs.listing_id
          where vs.listing_id = ${listingId} and vs.organization_id = ${organizationId}
        ) records
        order by updated_at desc
      `
    : await sql<ProductRecordRow[]>`
        select * from (
          select
            fs.id::text,
            'feature-sheet' as kind,
            fs.organization_id::text,
            fs.listing_id::text,
            concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
            coalesce(fs.copy_json->>'headline', concat('Feature sheet · ', l.address_line1)) as title,
            fs.status::text as status,
            fs.layout_json->>'template' as description,
            concat('feature_sheet_projects:', fs.id::text) as source_record,
            'legacy.feature_sheet_or_print:manual-handoff' as target_record,
            jsonb_build_object('proofAssetId', fs.proof_asset_id, 'finalAssetId', fs.final_asset_id) as payload,
            fs.created_at,
            fs.updated_at
          from public.feature_sheet_projects fs
          left join public.listings l on l.id = fs.listing_id
          where fs.listing_id = ${listingId}
          union all
          select
            vs.id::text,
            'virtual-staging' as kind,
            vs.organization_id::text,
            vs.listing_id::text,
            concat_ws(', ', l.address_line1, l.city, l.province) as listing_label,
            concat('Virtual staging · ', coalesce(vs.room_type, l.address_line1)) as title,
            vs.status::text as status,
            concat_ws(' / ', vs.room_type, vs.staging_style) as description,
            concat('virtual_staging_requests:', vs.id::text) as source_record,
            'legacy.virtual_staging_or_ai_provider:manual-handoff' as target_record,
            jsonb_build_object('sourceAssetId', vs.source_asset_id, 'selectedOutputAssetId', vs.selected_output_asset_id) as payload,
            vs.created_at,
            vs.updated_at
          from public.virtual_staging_requests vs
          left join public.listings l on l.id = vs.listing_id
          where vs.listing_id = ${listingId}
        ) records
        order by updated_at desc
      `

  return rows
}

async function resolveListingIdsForParity(
  listingId: string,
  scoped: ScopedQuery
) {
  if (looksLikeUuid(listingId)) return [listingId]

  const staticListing = listingData.find(
    (listing) =>
      String(listing.id) === listingId ||
      listing.header.replace("#", "") === listingId.replace("#", "")
  )

  if (!staticListing) return []

  return findMirroredListingIds(staticListing, scoped)
}

async function findMirroredListingIds(
  staticListing: StaticListingRecord,
  scoped: ScopedQuery
) {
  const addressNeedle = `%${staticListing.listing}%`
  const fullAddressNeedle = `%${staticListing.address}%`
  const mlsNumber = staticListing.mls.trim()

  const rows =
    scoped.scope === "organization"
      ? await sql<Array<{ id: string }>>`
          select id::text
          from public.listings
          where organization_id = ${scoped.organizationId}
            and (
              address_line1 ilike ${addressNeedle}
              or concat_ws(', ', address_line1, city, province) ilike ${fullAddressNeedle}
              or (${mlsNumber} <> '' and mls_number = ${mlsNumber})
            )
          order by updated_at desc nulls last
          limit 5
        `
      : await sql<Array<{ id: string }>>`
          select id::text
          from public.listings
          where address_line1 ilike ${addressNeedle}
            or concat_ws(', ', address_line1, city, province) ilike ${fullAddressNeedle}
            or (${mlsNumber} <> '' and mls_number = ${mlsNumber})
          order by updated_at desc nulls last
          limit 5
        `

  return rows.map((row) => row.id)
}

async function getProductExceptions(row: ProductRecordRow) {
  const productPattern = `%${row.id}%`
  const listingId = row.listing_id
  const rows = listingId
    ? await sql<ExceptionRow[]>`
        select
          id::text,
          exception_type,
          severity,
          status::text,
          title,
          summary,
          recommended_action,
          created_at
        from public.integration_exceptions
        where listing_id = ${listingId}
          or metadata->>'productId' = ${row.id}
          or metadata->>'product_id' = ${row.id}
          or metadata::text ilike ${productPattern}
          or legacy_id ilike ${productPattern}
        order by created_at desc
        limit 8
      `
    : await sql<ExceptionRow[]>`
        select
          id::text,
          exception_type,
          severity,
          status::text,
          title,
          summary,
          recommended_action,
          created_at
        from public.integration_exceptions
        where metadata->>'productId' = ${row.id}
          or metadata->>'product_id' = ${row.id}
          or metadata::text ilike ${productPattern}
          or legacy_id ilike ${productPattern}
          or exception_type ilike ${`%${row.kind.replace("-", "_")}%`}
        order by created_at desc
        limit 8
      `

  return rows.map((exception) => ({
    id: exception.id,
    type: exception.exception_type,
    severity: exception.severity,
    status: exception.status,
    title: exception.title,
    summary: exception.summary,
    recommendedAction: exception.recommended_action,
    createdAt: toIsoString(exception.created_at),
  }))
}

async function getProductBridgeAttempts(row: ProductRecordRow) {
  const productPattern = `%${row.id}%`
  const rows = await sql<BridgeAttemptRow[]>`
    select
      id::text,
      source_request_id,
      integration,
      action,
      mode,
      status,
      payload_hash,
      decision_reason,
      created_at
    from public.bridge_attempts
    where source_request_id = ${row.id}
      or source_record ilike ${productPattern}
      or target_record ilike ${productPattern}
      or redacted_payload->>'productId' = ${row.id}
      or redacted_payload->>'product_id' = ${row.id}
      or redacted_payload::text ilike ${productPattern}
      or metadata::text ilike ${productPattern}
    order by created_at desc
    limit 8
  `

  return rows.map((attempt) => ({
    id: attempt.id,
    sourceRequestId: attempt.source_request_id,
    integration: attempt.integration,
    action: attempt.action,
    mode: attempt.mode,
    status: attempt.status,
    payloadHash: attempt.payload_hash,
    decisionReason: attempt.decision_reason,
    createdAt: toIsoString(attempt.created_at),
  }))
}

async function getProductAuditEvents(row: ProductRecordRow) {
  if (!row.listing_id) return []

  const rows = await sql<AuditEventRow[]>`
    select
      id::text,
      event_type,
      summary,
      payload,
      created_at
    from public.audit_events
    where listing_id = ${row.listing_id}
    order by created_at desc
    limit 8
  `

  return rows
}

async function getProductHandoffEvents(row: ProductRecordRow) {
  const productPattern = `%${row.id}%`
  const rows = await sql<PortalIntakeRow[]>`
    select
      public_request_id,
      status,
      title,
      metadata,
      updated_at,
      created_at
    from public.portal_intake_requests
    where status = 'manually_entered_in_legacy'
      and (
        metadata::text ilike ${productPattern}
        or payload::text ilike ${productPattern}
        or source_record ilike ${productPattern}
        or target_record ilike ${productPattern}
      )
    order by updated_at desc
    limit 8
  `

  return rows
}

function mapProductSummary(row: ProductRecordRow): ProductParitySummary {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    status: row.status,
    listingId: row.listing_id,
    listingLabel: row.listing_label,
    href: getProductHref(row.kind, row.id),
    updatedAt: toIsoString(row.updated_at),
    safetyBoundary: getProductSafetyBoundary(row.kind),
  }
}

function buildProductMetrics(row: ProductRecordRow) {
  const payload = row.payload ?? {}

  if (row.kind === "feature-sheet") {
    return [
      { label: "Selected assets", value: countArray(payload.selectedAssets).toString() },
      { label: "Proof asset", value: payload.proofAssetId ? "Present" : "Missing" },
      { label: "Final asset", value: payload.finalAssetId ? "Present" : "Missing" },
      { label: "Legacy write", value: "Blocked" },
    ]
  }

  if (row.kind === "virtual-staging") {
    return [
      { label: "Source asset", value: payload.sourceAssetId ? "Present" : "Missing" },
      { label: "Final output", value: payload.selectedOutputAssetId ? "Present" : "Missing" },
      { label: "Credits", value: String(payload.creditCost ?? "Review") },
      { label: "Provider call", value: "Not enabled" },
    ]
  }

  return [
    { label: "SKU", value: String(payload.sku ?? "No SKU") },
    { label: "Media required", value: payload.mediaRequired ? "Yes" : "No" },
    { label: "Published version", value: String(payload.publishedVersion ?? "Draft") },
    { label: "Legacy CSV", value: "Manual only" },
  ]
}

function buildProductRequirements(
  row: ProductRecordRow,
  exceptions: ProductParityDetail["exceptions"]
) {
  const payload = row.payload ?? {}
  const hasOpenException = exceptions.some(
    (exception) => !["resolved", "ignored"].includes(exception.status)
  )
  const shared = [
    {
      label: "Coexistence boundary",
      status: "clear" as const,
      detail: getProductSafetyBoundary(row.kind),
    },
    {
      label: "Exception visibility",
      status: hasOpenException ? ("watch" as const) : ("clear" as const),
      detail: hasOpenException
        ? "Open product parity exceptions are visible to staff."
        : "No open product parity exception is attached yet.",
    },
  ]

  if (row.kind === "feature-sheet") {
    return [
      {
        label: "Source assets",
        status: countArray(payload.selectedAssets) ? ("clear" as const) : ("watch" as const),
        detail: "Photos, floor plan, copy, and template should be explicit before proof work.",
      },
      {
        label: "Proof/final asset",
        status: payload.proofAssetId && payload.finalAssetId ? ("clear" as const) : ("watch" as const),
        detail: "Proof and final PDF assets should become explicit portal records.",
      },
      ...shared,
    ]
  }

  if (row.kind === "virtual-staging") {
    return [
      {
        label: "Source photo",
        status: payload.sourceAssetId ? ("clear" as const) : ("watch" as const),
        detail: "The staging request needs a specific source image before provider or AI work.",
      },
      {
        label: "Selected output",
        status: payload.selectedOutputAssetId ? ("clear" as const) : ("watch" as const),
        detail: "Final staged image selection should be visible before delivery.",
      },
      ...shared,
    ]
  }

  return [
    {
      label: "Catalog mapping",
      status: payload.sku ? ("clear" as const) : ("watch" as const),
      detail: "Legacy print product / CSV mapping should have a stable SKU-like reference.",
    },
    {
      label: "Invoice handoff",
      status: "watch" as const,
      detail: "Print invoice generation remains legacy/manual until accounting parity is accepted.",
    },
    ...shared,
  ]
}

function buildTimeline(
  row: ProductRecordRow,
  related: {
    exceptions: ProductParityDetail["exceptions"]
    bridgeAttempts: ProductParityDetail["bridgeAttempts"]
    auditEvents: AuditEventRow[]
    handoffEvents: PortalIntakeRow[]
  }
): AuditTimelineItem[] {
  return [
    {
      id: `${row.id}:product-created`,
      tone: "product" as const,
      title: "Product parity record created",
      summary: `${row.title} entered the portal mirror/audit layer.`,
      timestamp: toIsoString(row.created_at),
      status: row.status,
      reference: row.source_record,
    },
    {
      id: `${row.id}:product-updated`,
      tone: "product" as const,
      title: "Product parity record updated",
      summary: "Latest mirrored product status available to the portal.",
      timestamp: toIsoString(row.updated_at),
      status: row.status,
      reference: row.source_record,
    },
    ...related.exceptions.map((exception) => ({
      id: exception.id,
      tone: "exception" as const,
      title: exception.title,
      summary: exception.summary,
      timestamp: exception.createdAt,
      status: exception.status,
      reference: exception.type,
    })),
    ...related.bridgeAttempts.map((attempt) => ({
      id: attempt.id,
      tone: "bridge" as const,
      title: `${attempt.integration} ${attempt.action}`,
      summary: attempt.decisionReason,
      timestamp: attempt.createdAt,
      status: attempt.status,
      reference: attempt.payloadHash.slice(0, 12),
    })),
    ...related.auditEvents.map((event) => ({
      id: event.id,
      tone: "audit" as const,
      title: event.event_type.replaceAll("_", " "),
      summary: event.summary,
      timestamp: toIsoString(event.created_at),
      status: readPayloadString(event.payload, "status"),
      reference: readPayloadString(event.payload, "publicRequestId"),
    })),
    ...related.handoffEvents.map((event) => {
      const metadata = parseRecord(event.metadata)
      const decision = parseRecord(metadata.lastStatusDecision)

      return {
        id: event.public_request_id,
        tone: "handoff" as const,
        title: "Manual legacy entry recorded",
        summary:
          readPayloadString(decision, "manualLegacyEntryNote") ??
          readPayloadString(decision, "note") ??
          event.title,
        timestamp: toIsoString(event.updated_at),
        actor: readPayloadString(decision, "actorRole"),
        status: event.status,
        reference: readPayloadString(decision, "legacyReference"),
      }
    }),
  ].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

function toIsoString(value: Date | string) {
  if (value instanceof Date) return value.toISOString()

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString()
}

function getProductHref(kind: ProductParityKind, id: string) {
  if (kind === "feature-sheet") return `/marketing-studio/${id}`
  if (kind === "virtual-staging") return `/ai-services/${id}`
  return `/print-shop/${id}`
}

function getProductDescription(kind: ProductParityKind) {
  if (kind === "feature-sheet") {
    return "Feature sheet proofing, copy, selected assets, revisions, approval, and print intent."
  }

  if (kind === "virtual-staging") {
    return "Virtual staging request state: source photo, room/style choices, provider output, approval, and delivery."
  }

  return "Print catalog or order parity: product mapping, media requirements, proof state, CSV/invoice gap, and manual handoff."
}

function getProductSafetyBoundary(kind: ProductParityKind) {
  if (kind === "feature-sheet") {
    return "Portal mirror only: no legacy feature-sheet, proof, print, invoice, or delivery write is triggered."
  }

  if (kind === "virtual-staging") {
    return "Portal mirror only: no AI/provider, storage, delivery, credit, or legacy write is triggered."
  }

  return "Portal mirror only: no print CSV, invoice, payment, fulfillment, or legacy write is triggered."
}

function countArray(value: unknown) {
  return Array.isArray(value) ? value.length : 0
}

function readPayloadString(payload: unknown, key: string) {
  const record = parseRecord(payload)
  const value = record[key]

  return typeof value === "string" && value.trim() ? value : null
}

function parseRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function looksLikeUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
}

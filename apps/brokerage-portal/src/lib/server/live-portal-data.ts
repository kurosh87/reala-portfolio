import "server-only"

import type { Event } from "@/components/ui/event-manager"
import type {
  CreativeMetric,
  CreativeQueueItem,
} from "@/components/creative-services-command-center-shell"
import type { Vendor } from "@/components/vendors-page-shell"
import { sql } from "@/db"
import { getRecentProductParitySummaries } from "@/lib/server/product-parity"
import type { WorkspaceAccess } from "@/lib/server/workspace-access"

type VendorRow = {
  id: string
  company_name: string | null
  vendor_type: string
  status: string
  coverage_area_json: unknown
  skills_json: unknown
  full_name: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  organization_name: string | null
  open_assignments: number
  active_jobs: number
}

type WorkflowJobRow = {
  id: string
  type: string
  status: string
  input_json: Record<string, unknown> | null
  output_json: Record<string, unknown> | null
  last_error: string | null
  started_at: Date | null
  finished_at: Date | null
  created_at: Date
  scheduled_at: Date | null
  due_at: Date | null
  listing_address: string | null
  listing_city: string | null
  listing_province: string | null
  assignee_name: string | null
  vendor_company: string | null
}

type CreativeCounts = {
  feature_sheet_projects: number
  virtual_staging_requests: number
  print_catalog_products: number
  creative_workflow_jobs: number
}

type OpsExceptionRow = {
  id: string
  exception_type: string
  status: string
  severity: string
  title: string
  summary: string
  recommended_action: string | null
  legacy_source: string | null
  legacy_id: string | null
  last_seen_at: Date | string | null
  sync_status: string
  sync_error: string | null
  created_at: Date | string
  updated_at: Date | string
}

type PortalAssignmentDraftRow = {
  public_request_id: string
  submitted_by_clerk_user_id: string | null
  status: string
  title: string
  requester_name: string
  payload: Record<string, unknown> | string | null
  metadata: Record<string, unknown> | string | null
  created_at: Date
}

type ScopedQuery = {
  scope: "all" | "organization" | "none"
  organizationId: string | null
  label: string
}

export type LiveVendorMirror = {
  vendors: Vendor[]
  sourceLabel: string
  emptyReason: string | null
}

export type LiveJobMirror = {
  events: Event[]
  pendingReviewEvents: Event[]
  sourceLabel: string
  emptyReason: string | null
}

export type LiveCreativeMirror = {
  metrics: CreativeMetric[]
  queues: CreativeQueueItem[]
  sourceLabel: string
}

export type LiveOpsException = {
  id: string
  exceptionType: string
  status: string
  severity: string
  title: string
  summary: string
  recommendedAction: string | null
  legacySource: string | null
  legacyId: string | null
  lastSeenAt: string | null
  syncStatus: string
  syncError: string | null
  updatedAt: string
}

export type LiveOpsExceptionMirror = {
  exceptions: LiveOpsException[]
  sourceLabel: string
  emptyReason: string | null
}

export type VendorAssignmentCandidate = {
  id: string
  listingId: string
  orderId: string
  orderItemId: string | null
  listingAddress: string
  serviceName: string
  serviceCategory: string
  orderStatus: string
  itemStatus: string | null
  estimateLabel: string
  sourceLabel: string
}

type VendorAssignmentCandidateRow = {
  listing_id: string
  order_id: string
  order_item_id: string | null
  listing_address: string
  order_status: string
  item_status: string | null
  estimate_total_cents: number
  service_name: string | null
  service_category: string | null
  item_notes: string | null
}

export async function getLiveVendorMirror(
  access: WorkspaceAccess
): Promise<LiveVendorMirror> {
  const scoped = await getLiveScope(access)

  if (scoped.scope === "none") {
    return {
      vendors: [],
      sourceLabel: scoped.label,
      emptyReason:
        "No database-backed organization is mapped for this workspace yet.",
    }
  }

  try {
    const rows =
      scoped.scope === "all"
        ? await sql<VendorRow[]>`
            select
              vp.id,
              vp.company_name,
              vp.vendor_type::text as vendor_type,
              vp.status::text as status,
              vp.coverage_area_json,
              vp.skills_json,
              u.full_name,
              u.email,
              u.phone,
              u.avatar_url,
              o.name as organization_name,
              count(distinct va.id)::int as open_assignments,
              count(distinct wj.id)::int as active_jobs
            from public.vendor_profiles vp
            left join public.users u on u.id = vp.user_id
            left join public.organizations o on o.id = vp.organization_id
            left join public.vendor_assignments va
              on va.vendor_profile_id = vp.id
              and va.status::text not in ('complete', 'cancelled')
            left join public.workflow_jobs wj
              on wj.vendor_assignment_id = va.id
              and wj.status::text not in ('complete', 'cancelled')
            group by vp.id, u.id, o.id
            order by coalesce(vp.company_name, u.full_name), vp.created_at desc
            limit 40
          `
        : await sql<VendorRow[]>`
            select
              vp.id,
              vp.company_name,
              vp.vendor_type::text as vendor_type,
              vp.status::text as status,
              vp.coverage_area_json,
              vp.skills_json,
              u.full_name,
              u.email,
              u.phone,
              u.avatar_url,
              o.name as organization_name,
              count(distinct va.id)::int as open_assignments,
              count(distinct wj.id)::int as active_jobs
            from public.vendor_profiles vp
            left join public.users u on u.id = vp.user_id
            left join public.organizations o on o.id = vp.organization_id
            left join public.vendor_assignments va
              on va.vendor_profile_id = vp.id
              and va.status::text not in ('complete', 'cancelled')
            left join public.workflow_jobs wj
              on wj.vendor_assignment_id = va.id
              and wj.status::text not in ('complete', 'cancelled')
            where vp.organization_id = ${scoped.organizationId}
            group by vp.id, u.id, o.id
            order by coalesce(vp.company_name, u.full_name), vp.created_at desc
            limit 40
          `

    return {
      vendors: rows.map(mapVendorRow),
      sourceLabel: scoped.label,
      emptyReason: rows.length
        ? null
        : "No vendor profiles are mirrored for this workspace yet.",
    }
  } catch (error) {
    console.warn("Live vendor mirror could not be loaded.", error)
    return {
      vendors: [],
      sourceLabel: "Prototype fallback",
      emptyReason: "Supabase vendor mirror is temporarily unavailable.",
    }
  }
}

export async function getLiveJobMirror(
  access: WorkspaceAccess
): Promise<LiveJobMirror> {
  const scoped = await getLiveScope(access)

  if (scoped.scope === "none") {
    return {
      events: [],
      pendingReviewEvents: [],
      sourceLabel: scoped.label,
      emptyReason:
        "No database-backed organization is mapped for this workspace yet.",
    }
  }

  try {
    const rows =
      scoped.scope === "all"
        ? await sql<WorkflowJobRow[]>`
            select
              wj.id,
              wj.type::text as type,
              wj.status::text as status,
              wj.input_json,
              wj.output_json,
              wj.last_error,
              wj.started_at,
              wj.finished_at,
              wj.created_at,
              va.scheduled_at,
              va.due_at,
              concat_ws(', ', l.address_line1, l.city, l.province) as listing_address,
              l.city as listing_city,
              l.province as listing_province,
              u.full_name as assignee_name,
              vp.company_name as vendor_company
            from public.workflow_jobs wj
            left join public.vendor_assignments va on va.id = wj.vendor_assignment_id
            left join public.vendor_profiles vp on vp.id = va.vendor_profile_id
            left join public.users u on u.id = vp.user_id
            left join public.listings l on l.id = wj.listing_id
            order by coalesce(va.scheduled_at, va.due_at, wj.started_at, wj.created_at) desc
            limit 30
          `
        : await sql<WorkflowJobRow[]>`
            select
              wj.id,
              wj.type::text as type,
              wj.status::text as status,
              wj.input_json,
              wj.output_json,
              wj.last_error,
              wj.started_at,
              wj.finished_at,
              wj.created_at,
              va.scheduled_at,
              va.due_at,
              concat_ws(', ', l.address_line1, l.city, l.province) as listing_address,
              l.city as listing_city,
              l.province as listing_province,
              u.full_name as assignee_name,
              vp.company_name as vendor_company
            from public.workflow_jobs wj
            left join public.vendor_assignments va on va.id = wj.vendor_assignment_id
            left join public.vendor_profiles vp on vp.id = va.vendor_profile_id
            left join public.users u on u.id = vp.user_id
            left join public.listings l on l.id = wj.listing_id
            where wj.organization_id = ${scoped.organizationId}
            order by coalesce(va.scheduled_at, va.due_at, wj.started_at, wj.created_at) desc
            limit 30
          `

    return {
      events: rows.map(mapWorkflowJobRow),
      pendingReviewEvents: await getPendingVendorAssignmentReviewEvents(access),
      sourceLabel: scoped.label,
      emptyReason: rows.length
        ? null
        : "No workflow jobs are mirrored for this workspace yet.",
    }
  } catch (error) {
    console.warn("Live job mirror could not be loaded.", error)
    return {
      events: [],
      pendingReviewEvents: [],
      sourceLabel: "Prototype fallback",
      emptyReason: "Supabase workflow-job mirror is temporarily unavailable.",
    }
  }
}

export async function getPendingVendorAssignmentReviewEvents(
  access: WorkspaceAccess
): Promise<Event[]> {
  try {
    const rows = await sql<PortalAssignmentDraftRow[]>`
      select
        public_request_id,
        submitted_by_clerk_user_id,
        status,
        title,
        requester_name,
        payload,
        metadata,
        created_at
      from public.portal_intake_requests
      where intake_type = 'Vendor assignment'
        and status not in ('rejected', 'manually_entered_in_legacy')
      order by created_at desc
      limit 25
    `

    return rows
      .filter((row) => portalDraftVisibleToWorkspace(row, access))
      .map(mapPortalAssignmentDraftRow)
  } catch (error) {
    console.warn("Pending vendor assignment drafts could not be loaded.", error)
    return []
  }
}

export async function getLiveCreativeMirror(
  access: WorkspaceAccess
): Promise<LiveCreativeMirror> {
  const scoped = await getLiveScope(access)

  if (scoped.scope === "none") {
    return {
      metrics: buildCreativeMetrics({
        feature_sheet_projects: 0,
        virtual_staging_requests: 0,
        print_catalog_products: 0,
        creative_workflow_jobs: 0,
      }),
      queues: buildCreativeQueues(),
      sourceLabel: scoped.label,
    }
  }

  try {
    const [counts] =
      scoped.scope === "all"
        ? await sql<CreativeCounts[]>`
            select
              (select count(*)::int from public.feature_sheet_projects) as feature_sheet_projects,
              (select count(*)::int from public.virtual_staging_requests) as virtual_staging_requests,
              (select count(*)::int from public.print_catalog_products) as print_catalog_products,
              (
                select count(*)::int
                from public.workflow_jobs
                where type::text in (
                  'feature_sheet',
                  'print_order',
                  'virtual_staging',
                  'listing_website',
                  'banner_asset',
                  'gallery_publish',
                  'ai_image_processing'
                )
              ) as creative_workflow_jobs
          `
        : await sql<CreativeCounts[]>`
            select
              (
                select count(*)::int
                from public.feature_sheet_projects
                where organization_id = ${scoped.organizationId}
              ) as feature_sheet_projects,
              (
                select count(*)::int
                from public.virtual_staging_requests
                where organization_id = ${scoped.organizationId}
              ) as virtual_staging_requests,
              (
                select count(*)::int
                from public.print_catalog_products
                where organization_id = ${scoped.organizationId}
                  or organization_id is null
              ) as print_catalog_products,
              (
                select count(*)::int
                from public.workflow_jobs
                where organization_id = ${scoped.organizationId}
                  and type::text in (
                    'feature_sheet',
                    'print_order',
                    'virtual_staging',
                    'listing_website',
                    'banner_asset',
                    'gallery_publish',
                    'ai_image_processing'
                  )
              ) as creative_workflow_jobs
          `

    const [featureSheets, stagingRequests, printProducts] = await Promise.all([
      getRecentProductParitySummaries("feature-sheet", access),
      getRecentProductParitySummaries("virtual-staging", access),
      getRecentProductParitySummaries("print", access),
    ])

    return {
      metrics: buildCreativeMetrics(counts),
      queues: buildCreativeQueues(counts, {
        featureSheetHref: featureSheets[0]?.href,
        virtualStagingHref: stagingRequests[0]?.href,
        printHref: printProducts[0]?.href,
      }),
      sourceLabel: scoped.label,
    }
  } catch (error) {
    console.warn("Live creative mirror could not be loaded.", error)
    return {
      metrics: buildCreativeMetrics({
        feature_sheet_projects: 0,
        virtual_staging_requests: 0,
        print_catalog_products: 0,
        creative_workflow_jobs: 0,
      }),
      queues: buildCreativeQueues(),
      sourceLabel: "Prototype fallback",
    }
  }
}

export async function getLiveOpsExceptionMirror(
  access: WorkspaceAccess
): Promise<LiveOpsExceptionMirror> {
  const scoped = await getLiveScope(access)

  if (scoped.scope === "none") {
    return {
      exceptions: [],
      sourceLabel: scoped.label,
      emptyReason:
        "No database-backed organization is mapped for this workspace yet.",
    }
  }

  try {
    const rows =
      scoped.scope === "all"
        ? await sql<OpsExceptionRow[]>`
            select
              id,
              exception_type,
              status::text as status,
              severity,
              title,
              summary,
              recommended_action,
              legacy_source,
              legacy_id,
              last_seen_at,
              sync_status::text as sync_status,
              sync_error,
              created_at,
              updated_at
            from public.integration_exceptions
            where status::text not in ('resolved', 'ignored')
            order by
              case severity
                when 'critical' then 0
                when 'high' then 1
                when 'medium' then 2
                else 3
              end,
              coalesce(last_seen_at, updated_at, created_at) desc
            limit 40
          `
        : await sql<OpsExceptionRow[]>`
            select
              id,
              exception_type,
              status::text as status,
              severity,
              title,
              summary,
              recommended_action,
              legacy_source,
              legacy_id,
              last_seen_at,
              sync_status::text as sync_status,
              sync_error,
              created_at,
              updated_at
            from public.integration_exceptions
            where status::text not in ('resolved', 'ignored')
              and (
                organization_id = ${scoped.organizationId}
                or organization_id is null
              )
            order by
              case severity
                when 'critical' then 0
                when 'high' then 1
                when 'medium' then 2
                else 3
              end,
              coalesce(last_seen_at, updated_at, created_at) desc
            limit 40
          `

    return {
      exceptions: rows.map(mapOpsExceptionRow),
      sourceLabel: scoped.label,
      emptyReason: rows.length
        ? null
        : "No open integration exceptions are mirrored for this workspace yet.",
    }
  } catch (error) {
    console.warn("Live ops exception mirror could not be loaded.", error)
    return {
      exceptions: [],
      sourceLabel: "Prototype fallback",
      emptyReason: "Supabase integration-exception mirror is temporarily unavailable.",
    }
  }
}

export async function getVendorAssignmentCandidates(
  access: WorkspaceAccess
): Promise<VendorAssignmentCandidate[]> {
  const scoped = await getLiveScope(access)

  if (scoped.scope === "none") return []

  try {
    const rows =
      scoped.scope === "all"
        ? await sql<VendorAssignmentCandidateRow[]>`
            select
              l.id as listing_id,
              o.id as order_id,
              oi.id as order_item_id,
              concat_ws(', ', l.address_line1, l.city, l.province) as listing_address,
              o.status::text as order_status,
              oi.status::text as item_status,
              o.estimate_total_cents,
              cs.name as service_name,
              cs.category::text as service_category,
              oi.notes as item_notes
            from public.orders o
            join public.listings l on l.id = o.listing_id
            left join public.order_items oi on oi.order_id = o.id
            left join public.catalog_services cs on cs.id = oi.catalog_service_id
            where o.status::text not in ('cancelled', 'complete')
            order by coalesce(o.submitted_at, o.created_at) desc, cs.sort_order nulls last
            limit 60
          `
        : await sql<VendorAssignmentCandidateRow[]>`
            select
              l.id as listing_id,
              o.id as order_id,
              oi.id as order_item_id,
              concat_ws(', ', l.address_line1, l.city, l.province) as listing_address,
              o.status::text as order_status,
              oi.status::text as item_status,
              o.estimate_total_cents,
              cs.name as service_name,
              cs.category::text as service_category,
              oi.notes as item_notes
            from public.orders o
            join public.listings l on l.id = o.listing_id
            left join public.order_items oi on oi.order_id = o.id
            left join public.catalog_services cs on cs.id = oi.catalog_service_id
            where o.organization_id = ${scoped.organizationId}
              and o.status::text not in ('cancelled', 'complete')
            order by coalesce(o.submitted_at, o.created_at) desc, cs.sort_order nulls last
            limit 60
          `

    return rows.map((row) => {
      const serviceName = row.service_name ?? "General vendor task"
      const id = [row.order_id, row.order_item_id ?? "order"].join(":")

      return {
        id,
        listingId: row.listing_id,
        orderId: row.order_id,
        orderItemId: row.order_item_id,
        listingAddress: row.listing_address,
        serviceName,
        serviceCategory: row.service_category ?? "manual_ops",
        orderStatus: toTitleCase(row.order_status.replaceAll("_", " ")),
        itemStatus: row.item_status
          ? toTitleCase(row.item_status.replaceAll("_", " "))
          : null,
        estimateLabel: formatCents(row.estimate_total_cents),
        sourceLabel: row.item_notes ?? "Supabase order mirror",
      }
    })
  } catch (error) {
    console.warn("Vendor assignment candidates could not be loaded.", error)
    return []
  }
}

async function getLiveScope(access: WorkspaceAccess): Promise<ScopedQuery> {
  if (access.isPreviewFallback && !access.databaseOrganizationId) {
    return {
      scope: "none",
      organizationId: null,
      label: `Local preview fallback · ${access.activeOrganization.name}`,
    }
  }

  if (
    access.canPreviewOrg ||
    access.activeRole === "Reala Super Admin" ||
    access.activeRole === "Reala Ops Admin"
  ) {
    return {
      scope: "all",
      organizationId: null,
      label: "Live Supabase mirror · all portal orgs",
    }
  }

  if (access.databaseOrganizationId) {
    return {
      scope: "organization",
      organizationId: access.databaseOrganizationId,
      label: `Live Supabase mirror · ${access.activeOrganization.name}`,
    }
  }

  return {
    scope: "none",
    organizationId: null,
    label: `Portal scope · ${access.activeOrganization.name}`,
  }
}

function mapVendorRow(row: VendorRow): Vendor {
  const skills = toSpecialties(row.skills_json, row.vendor_type)
  const name = row.full_name ?? row.company_name ?? "Unnamed vendor"
  const company = row.company_name ?? row.organization_name ?? name

  return {
    name,
    company,
    email: row.email ?? "portal-draft@reala.local",
    phone: row.phone ?? "Phone pending",
    image: row.avatar_url ?? "",
    title: toVendorTitle(row.vendor_type),
    region: toCoverageLabel(row.coverage_area_json),
    serviceArea: toCoverageLabel(row.coverage_area_json),
    type: row.organization_name ? "External" : "Internal",
    status: toVendorStatus(row.status, row.active_jobs, row.open_assignments),
    specialties: skills,
    todayLoad: row.active_jobs,
    capacity: 5,
    openJobs: row.open_assignments,
    reliability: row.status === "active" ? 95 : 82,
    nextAvailability: row.open_assignments > 0 ? "Assigned" : "Review",
    jobsCompleted: 0,
    onTimeRate: row.status === "active" ? 95 : 0,
    qualityScore: "Mirror",
    billingTerms: "Portal mirror only; Stripe and payout setup remain gated.",
  }
}

function mapWorkflowJobRow(row: WorkflowJobRow): Event {
  const startTime = row.scheduled_at ?? row.started_at ?? row.created_at
  const endTime = row.due_at ?? row.finished_at ?? addHours(startTime, 2)
  const title =
    stringFromJson(row.input_json, "title") ??
    toTitleCase(row.type.replaceAll("_", " "))
  const descriptionParts = [
    stringFromJson(row.input_json, "sourceOrderId"),
    row.last_error ? `Last error: ${row.last_error}` : null,
  ].filter(Boolean)

  return {
    id: row.id,
    title,
    description:
      descriptionParts.length > 0
        ? descriptionParts.join(" · ")
        : `Portal workflow job: ${row.type}`,
    startTime,
    endTime,
    color: colorForJobType(row.type),
    category: categoryForJobType(row.type),
    location: row.listing_address ?? "Portal workspace",
    status: toTitleCase(row.status.replaceAll("_", " ")),
    attendees: [
      row.assignee_name ?? row.vendor_company ?? "Unassigned portal vendor",
    ],
    tags: [
      row.scheduled_at ? "Vendor assignment" : "Workflow deadline",
      "Supabase mirror",
      row.type.replaceAll("_", " "),
    ],
  }
}

function mapPortalAssignmentDraftRow(row: PortalAssignmentDraftRow): Event {
  const payload = parseJsonRecord(row.payload)
  const requestedDate = stringFromJson(payload, "requestedDate")
  const startTime = requestedDate ? new Date(`${requestedDate}T09:00:00`) : row.created_at
  const endTime = addHours(startTime, 1)
  const vendorName = stringFromJson(payload, "vendorName") ?? "Vendor pending"
  const listingAddress =
    stringFromJson(payload, "listingAddress") ?? "Portal listing pending"
  const serviceType =
    stringFromJson(payload, "serviceType") ??
    stringFromJson(payload, "vendorSpecialty") ??
    "Vendor assignment"

  return {
    id: row.public_request_id,
    title: `Review assignment: ${serviceType}`,
    description:
      `${vendorName} assignment draft for ${listingAddress}. Staff review required before any legacy or TimeTap action.`,
    startTime,
    endTime,
    color: "red",
    category: "Review",
    location: listingAddress,
    status: toTitleCase(row.status.replaceAll("_", " ")),
    attendees: [vendorName],
    tags: [
      "Portal assignment draft",
      "staff review",
      row.public_request_id,
    ],
  }
}

function mapOpsExceptionRow(row: OpsExceptionRow): LiveOpsException {
  return {
    id: row.id,
    exceptionType: row.exception_type,
    status: toTitleCase(row.status.replaceAll("_", " ")),
    severity: row.severity.toLowerCase(),
    title: row.title,
    summary: row.summary,
    recommendedAction: row.recommended_action,
    legacySource: row.legacy_source,
    legacyId: row.legacy_id,
    lastSeenAt: row.last_seen_at ? toIsoString(row.last_seen_at) : null,
    syncStatus: toTitleCase(row.sync_status.replaceAll("_", " ")),
    syncError: row.sync_error,
    updatedAt: toIsoString(row.updated_at),
  }
}

function portalDraftVisibleToWorkspace(
  row: PortalAssignmentDraftRow,
  access: WorkspaceAccess
) {
  if (access.canPreviewOrg || access.canApproveBridge) return true

  const metadata = parseJsonRecord(row.metadata)
  const workspaceContext = parseJsonRecord(metadata.workspaceContext)
  const activeOrganizationId = workspaceContext.activeOrganizationId

  return (
    activeOrganizationId === access.activeOrganizationId ||
    (Boolean(access.userId) && row.submitted_by_clerk_user_id === access.userId)
  )
}

function buildCreativeMetrics(counts: CreativeCounts): CreativeMetric[] {
  return [
    {
      label: "Feature sheet projects",
      value: counts.feature_sheet_projects.toLocaleString("en-US"),
      detail:
        counts.feature_sheet_projects > 0
          ? "Live portal feature-sheet project records."
          : "Table exists; no feature-sheet projects are populated yet.",
      iconKey: "feature-sheet",
    },
    {
      label: "Virtual staging requests",
      value: counts.virtual_staging_requests.toLocaleString("en-US"),
      detail:
        counts.virtual_staging_requests > 0
          ? "Live portal virtual-staging request records."
          : "Table exists; staging request intake is not populated yet.",
      iconKey: "staging",
    },
    {
      label: "Print catalog products",
      value: counts.print_catalog_products.toLocaleString("en-US"),
      detail:
        counts.print_catalog_products > 0
          ? "Live portal print catalog products."
          : "Print catalog table exists; product rows still need import/modeling.",
      iconKey: "print",
    },
    {
      label: "Creative workflow jobs",
      value: counts.creative_workflow_jobs.toLocaleString("en-US"),
      detail:
        counts.creative_workflow_jobs > 0
          ? "Live workflow jobs tied to creative/AI/print work."
          : "Workflow-job table is ready for creative queue records.",
      iconKey: "upload",
    },
  ]
}

function buildCreativeQueues(
  counts: CreativeCounts = {
    feature_sheet_projects: 0,
    virtual_staging_requests: 0,
    print_catalog_products: 0,
    creative_workflow_jobs: 0,
  },
  links: {
    featureSheetHref?: string
    virtualStagingHref?: string
    printHref?: string
  } = {}
): CreativeQueueItem[] {
  return [
    {
      name: "Feature sheet proof",
      listing: "Listing workspace",
      status:
        counts.feature_sheet_projects > 0 ? "Mirrored" : "Model ready / empty",
      next: "Collect listing data, selected photos, floor plan, template, proof, revisions, and approval state.",
      boundary:
        "Safe next step is portal draft + approval state; provider automation remains gated.",
      href: links.featureSheetHref,
    },
    {
      name: "Virtual staging request",
      listing: "AI services",
      status:
        counts.virtual_staging_requests > 0
          ? "Mirrored"
          : "Model ready / empty",
      next: "Track source photo, room type, style, generated outputs, selected final asset, and credit cost.",
      boundary:
        "No third-party staging or AI generation call is made by this dashboard slice.",
      href: links.virtualStagingHref,
    },
    {
      name: "Print product order",
      listing: "Print shop",
      status:
        counts.print_catalog_products > 0
          ? "Catalog visible"
          : "Catalog import needed",
      next: "Import or model print products before order/invoice parity work.",
      boundary:
        "Legacy print CSV/invoice behavior remains read-only until operator signoff.",
      href: links.printHref,
    },
    {
      name: "Realtor upload path",
      listing: "AI services",
      status:
        counts.creative_workflow_jobs > 0 ? "Workflow rows visible" : "Prototype",
      next: "Model upload, processing, QC, delivery, and notification state as portal-native jobs.",
      boundary:
        "Full upload/AI processing pipeline is a separate module, not a hidden legacy write.",
    },
  ]
}

function toSpecialties(input: unknown, vendorType: string): Vendor["specialties"] {
  const values = Array.isArray(input)
    ? input
        .map((item) => {
          if (typeof item === "string") return item
          if (isRecord(item) && typeof item.label === "string") return item.label
          return null
        })
        .filter(Boolean)
    : []
  const mapped = values
    .flatMap((value) => specialtyFromString(value ?? ""))
    .filter(Boolean)

  if (mapped.length) return Array.from(new Set(mapped))
  return specialtyFromString(vendorType)
}

function specialtyFromString(input: string): Vendor["specialties"] {
  const value = input.toLowerCase()
  if (value.includes("floor")) return ["Floor Plans"]
  if (value.includes("video")) return ["Videography"]
  if (value.includes("sign")) return ["Sign Installation"]
  if (value.includes("print")) return ["Print"]
  if (value.includes("matterport") || value.includes("3d")) return ["Matterport"]
  if (value.includes("stage") || value.includes("design")) {
    return ["Virtual Staging"]
  }
  if (value.includes("ai")) return ["AI Design"]
  return ["Photography"]
}

function toVendorTitle(vendorType: string) {
  return toTitleCase(vendorType.replaceAll("_", " "))
}

function toCoverageLabel(input: unknown) {
  if (!isRecord(input)) return "Coverage pending"
  for (const key of ["label", "region", "area", "serviceArea", "city"]) {
    const value = input[key]
    if (typeof value === "string" && value.trim()) return value
  }
  if (input.source === "portal-demo-seed") return "Portal demo coverage"
  return "Coverage pending"
}

function toVendorStatus(
  status: string,
  activeJobs: number,
  openAssignments: number
): Vendor["status"] {
  if (status === "paused" || status === "archived") return "Pending"
  if (activeJobs > 5 || openAssignments > 5) return "Overloaded"
  if (openAssignments > 0) return "Scheduled"
  return "Available"
}

function categoryForJobType(type: string) {
  if (type.includes("shoot") || type.includes("matterport")) return "Shoot"
  if (type.includes("delivery") || type.includes("publish")) return "Delivery"
  if (
    type.includes("edit") ||
    type.includes("feature") ||
    type.includes("staging") ||
    type.includes("ai")
  ) {
    return "Edit"
  }
  return "Meeting"
}

function colorForJobType(type: string) {
  if (type.includes("shoot")) return "blue"
  if (type.includes("floor")) return "green"
  if (type.includes("staging") || type.includes("ai")) return "purple"
  if (type.includes("print") || type.includes("feature")) return "orange"
  if (type.includes("sync") || type.includes("repair")) return "red"
  return "slate"
}

function stringFromJson(input: Record<string, unknown> | null, key: string) {
  const value = input?.[key]
  return typeof value === "string" && value.trim() ? value : null
}

function parseJsonRecord(input: unknown): Record<string, unknown> {
  if (!input) return {}

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input) as unknown
      return isRecord(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }

  return isRecord(input) ? input : {}
}

function addHours(date: Date, hours: number) {
  const next = new Date(date)
  next.setHours(next.getHours() + hours)
  return next
}

function toTitleCase(input: string) {
  return input.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function toIsoString(value: Date | string) {
  if (value instanceof Date) return value.toISOString()

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString()
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === "object" && !Array.isArray(input)
}

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

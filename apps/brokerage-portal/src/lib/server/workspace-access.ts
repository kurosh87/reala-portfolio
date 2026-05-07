import "server-only"

import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"

import {
  defaultDashboardRole,
  getOrganization,
  getProfile,
  isDashboardRole,
  isWorkspaceOrganizationId,
  mapClerkRoleToDashboardRole,
  mapMembershipRoleToDashboardRole,
  resolveOrganizationIdFromClerk,
  roleHasCapability,
  routeAllowedForProfile,
  workspaceProfiles,
  type DashboardRole,
  type WorkspaceAccessSnapshot,
  type WorkspaceCapability,
  type WorkspaceMembership,
  type WorkspaceOrganizationId,
} from "@/lib/workspace-access"

export type WorkspaceAccess = WorkspaceAccessSnapshot & {
  activeOrganization: ReturnType<typeof getOrganization>
  activeProfile: ReturnType<typeof getProfile>
  databaseOrganizationId: string | null
  databaseUserId: string | null
}

export class WorkspaceAccessDeniedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "WorkspaceAccessDeniedError"
  }
}

type GetWorkspaceAccessOptions = {
  requestedOrganizationId?: string | null
  requestedRole?: string | null
  pathname?: string | null
  allowDevelopmentFallback?: boolean
}

type RequireWorkspaceAccessOptions = GetWorkspaceAccessOptions & {
  capability?: WorkspaceCapability
}

type DbMembershipRow = {
  organizationId: WorkspaceOrganizationId
  role: DashboardRole
  databaseOrganizationId: string
  databaseUserId: string
  clerkOrganizationId: string | null
  source: "supabase_membership"
}

export async function getCurrentWorkspaceAccess(
  options: GetWorkspaceAccessOptions = {}
): Promise<WorkspaceAccess> {
  const allowDevelopmentFallback =
    options.allowDevelopmentFallback ?? process.env.NODE_ENV !== "production"
  const authBypassEnabled =
    process.env.BROKERAGE_PORTAL_DEV_AUTH_BYPASS === "1" &&
    (allowDevelopmentFallback ||
      process.env.BROKERAGE_PORTAL_LOCAL_PREVIEW_AUTH === "1") &&
    (process.env.NODE_ENV !== "production" ||
      process.env.BROKERAGE_PORTAL_LOCAL_PREVIEW_AUTH === "1")

  if (authBypassEnabled) {
    return buildDevelopmentFallbackAccess(options)
  }

  const authState = await auth()
  const userId = authState.userId ?? null
  const clerkOrganizationId = authState.orgId ?? null
  const clerkOrganizationSlug = getAuthString(authState, "orgSlug")
  const clerkOrganizationRole = authState.orgRole ?? null

  if (!userId) {
    return buildNoAccessSnapshot()
  }

  const databaseMemberships = await loadDatabaseMemberships(userId)
  let memberships: WorkspaceMembership[] = databaseMemberships
  let source: WorkspaceAccessSnapshot["source"] = databaseMemberships.length
    ? "supabase_membership"
    : "no_access"

  if (!memberships.length && clerkOrganizationId) {
    const organizationId = resolveOrganizationIdFromClerk({
      clerkOrganizationId,
      clerkOrganizationSlug,
    })

    if (organizationId) {
      memberships = [
        {
          organizationId,
          role: mapClerkRoleToDashboardRole(
            clerkOrganizationRole,
            organizationId
          ),
          clerkOrganizationId,
          source: "clerk_org",
        },
      ]
      source = "clerk_org"
    }
  }

  if (!memberships.length && allowDevelopmentFallback) {
    memberships = buildDevelopmentFallbackMemberships()
    source = "development_fallback"
  }

  if (!memberships.length) {
    return buildNoAccessSnapshot(userId, clerkOrganizationId)
  }

  const canPreviewOrg = memberships.some((membership) =>
    roleHasCapability(membership.role, "preview_org")
  )
  const requestedOrganizationIdValue = options.requestedOrganizationId ?? null
  const requestedOrganizationId = isWorkspaceOrganizationId(
    requestedOrganizationIdValue
  )
    ? requestedOrganizationIdValue
    : null
  const requestedRoleValue = options.requestedRole ?? null
  const requestedRole = isDashboardRole(requestedRoleValue)
    ? requestedRoleValue
    : null
  const activeMembership = chooseActiveMembership({
    memberships,
    canPreviewOrg,
    requestedOrganizationId,
    requestedRole,
    clerkOrganizationId,
  })
  const activeProfile = getProfile(activeMembership.role)
  const activeOrganization = getOrganization(activeMembership.organizationId)
  const allowedRoutes = activeProfile.allowedRoutes
  const routeAllowed = options.pathname
    ? routeAllowedForProfile(options.pathname, activeProfile)
    : true

  if (!routeAllowed && !canPreviewOrg) {
    return {
      ...buildSnapshot({
        userId,
        clerkOrganizationId,
        activeMembership,
        memberships,
        source,
        canPreviewOrg,
      }),
      activeOrganization,
      activeProfile,
      databaseOrganizationId: activeMembership.databaseOrganizationId ?? null,
      databaseUserId: activeMembership.databaseUserId ?? null,
    }
  }

  return {
    userId,
    clerkOrganizationId: activeMembership.clerkOrganizationId ?? clerkOrganizationId,
    activeOrganizationId: activeMembership.organizationId,
    activeRole: activeMembership.role,
    activeOrganization,
    activeProfile,
    memberships,
    allowedRoutes,
    dataScope: activeProfile.dataScope,
    bridgePolicy: activeProfile.bridgePolicy,
    canPreviewOrg,
    canApproveBridge: roleHasCapability(activeMembership.role, "approve_bridge"),
    canWritePortalDraft: roleHasCapability(
      activeMembership.role,
      "write_portal_draft"
    ),
    canViewLegacy: roleHasCapability(activeMembership.role, "view_legacy"),
    isPreviewFallback: source === "development_fallback",
    source,
    databaseOrganizationId: activeMembership.databaseOrganizationId ?? null,
    databaseUserId: activeMembership.databaseUserId ?? null,
  }
}

export async function requireWorkspaceAccess(
  options: RequireWorkspaceAccessOptions = {}
) {
  const access = await getCurrentWorkspaceAccess(options)

  if (access.source === "no_access" || (!access.userId && !access.isPreviewFallback)) {
    throw new WorkspaceAccessDeniedError("No active Reala workspace access.")
  }

  if (options.pathname && !routeAllowedForProfile(options.pathname, access.activeProfile)) {
    throw new WorkspaceAccessDeniedError(
      `The ${access.activeRole} role cannot access ${options.pathname}.`
    )
  }

  if (options.capability && !roleHasCapability(access.activeRole, options.capability)) {
    throw new WorkspaceAccessDeniedError(
      `The ${access.activeRole} role does not have ${options.capability}.`
    )
  }

  return access
}

export async function requireBridgeApprovalCapability() {
  return requireWorkspaceAccess({ capability: "approve_bridge" })
}

export function getOrgScopedWhereClause(access: WorkspaceAccess) {
  return {
    databaseOrganizationId: access.databaseOrganizationId,
    workspaceOrganizationId: access.activeOrganizationId,
    clerkOrganizationId: access.clerkOrganizationId,
    canPreviewOrg: access.canPreviewOrg,
  }
}

export async function recordAccessAuditEvent(
  access: WorkspaceAccess,
  input: {
    eventType: string
    summary: string
    payload?: Record<string, unknown>
  }
) {
  if (!access.databaseOrganizationId) return { persisted: false }

  try {
    const { db } = await import("@/db")
    const { auditEvents } = await import("../../../drizzle/schema")

    await db.insert(auditEvents).values({
      organizationId: access.databaseOrganizationId,
      actorUserId: access.databaseUserId,
      eventType: input.eventType,
      summary: input.summary,
      payload: {
        activeRole: access.activeRole,
        activeOrganizationId: access.activeOrganizationId,
        source: access.source,
        ...(input.payload ?? {}),
      },
    })

    return { persisted: true }
  } catch (error) {
    const liveAuditResult = await recordLiveAuditLog(access, input)

    if (liveAuditResult.persisted) {
      return liveAuditResult
    }

    console.warn("Workspace audit event was not persisted.", error)
    return { persisted: false, error }
  }
}

async function recordLiveAuditLog(
  access: WorkspaceAccess,
  input: {
    eventType: string
    summary: string
    payload?: Record<string, unknown>
  }
) {
  try {
    const { sql } = await import("@/db")

    const metadataJson = JSON.stringify({
      summary: input.summary,
      activeRole: access.activeRole,
      activeOrganizationId: access.activeOrganizationId,
      source: access.source,
      ...(input.payload ?? {}),
    })

    await sql`
      insert into public.audit_logs (
        organization_id,
        actor_user_id,
        action,
        subject_type,
        metadata_json
      )
      values (
        ${access.databaseOrganizationId},
        ${access.databaseUserId},
        ${input.eventType},
        'workspace_access',
        ${metadataJson}
      )
    `

    return { persisted: true }
  } catch (error) {
    return { persisted: false, error }
  }
}

async function loadDatabaseMemberships(
  clerkUserId: string
): Promise<DbMembershipRow[]> {
  const liveSchemaMemberships = await loadLiveRoleMemberships(clerkUserId)

  if (liveSchemaMemberships.length) {
    return liveSchemaMemberships
  }

  try {
    const { db } = await import("@/db")
    const schema = await import("../../../drizzle/schema")

    const rows = await db
      .select({
        databaseOrganizationId: schema.organizations.id,
        databaseUserId: schema.users.id,
        clerkOrganizationId: schema.organizations.clerkOrganizationId,
        organizationSlug: schema.organizations.slug,
        organizationName: schema.organizations.name,
        organizationMetadata: schema.organizations.metadata,
        role: schema.memberships.role,
      })
      .from(schema.memberships)
      .innerJoin(schema.users, eq(schema.memberships.userId, schema.users.id))
      .innerJoin(
        schema.organizations,
        eq(schema.memberships.organizationId, schema.organizations.id)
      )
      .where(
        and(
          eq(schema.users.clerkUserId, clerkUserId),
          eq(schema.memberships.isActive, true)
        )
      )

    return rows.flatMap((row) => {
      const organizationId = resolveDatabaseOrganizationId({
        clerkOrganizationId: row.clerkOrganizationId,
        slug: row.organizationSlug,
        name: row.organizationName,
        metadata: row.organizationMetadata,
      })

      if (!organizationId) return []

      return [
        {
          organizationId,
          role: mapMembershipRoleToDashboardRole(row.role, organizationId),
          databaseOrganizationId: row.databaseOrganizationId,
          databaseUserId: row.databaseUserId,
          clerkOrganizationId: row.clerkOrganizationId,
          source: "supabase_membership" as const,
        },
      ]
    })
  } catch (error) {
    console.warn("Workspace memberships could not be loaded from Supabase.", error)
    return []
  }
}

async function loadLiveRoleMemberships(
  clerkUserId: string
): Promise<DbMembershipRow[]> {
  try {
    const { sql } = await import("@/db")
    const rows = await sql<{
      database_organization_id: string
      database_user_id: string
      organization_slug: string | null
      organization_name: string | null
      role_key: string
    }[]>`
      select
        o.id as database_organization_id,
        u.id as database_user_id,
        o.slug as organization_slug,
        o.name as organization_name,
        r.key as role_key
      from public.memberships m
      join public.users u on u.id = m.user_id
      join public.organizations o on o.id = m.organization_id
      join public.roles r on r.id = m.role_id
      where u.clerk_user_id = ${clerkUserId}
        and m.status::text = 'active'
    `

    return rows.flatMap((row) => {
      const organizationId = resolveDatabaseOrganizationId({
        clerkOrganizationId: null,
        slug: row.organization_slug,
        name: row.organization_name,
        metadata: null,
      })

      if (!organizationId) return []

      return [
        {
          organizationId,
          role: mapMembershipRoleToDashboardRole(row.role_key, organizationId),
          databaseOrganizationId: row.database_organization_id,
          databaseUserId: row.database_user_id,
          clerkOrganizationId: null,
          source: "supabase_membership" as const,
        },
      ]
    })
  } catch (error) {
    console.warn("Live role memberships could not be loaded from Supabase.", error)
    return []
  }
}

function chooseActiveMembership(input: {
  memberships: WorkspaceMembership[]
  canPreviewOrg: boolean
  requestedOrganizationId: WorkspaceOrganizationId | null
  requestedRole: DashboardRole | null
  clerkOrganizationId: string | null
}) {
  if (input.canPreviewOrg && input.requestedOrganizationId) {
    const role =
      input.requestedRole &&
      getProfile(input.requestedRole).organizationId === input.requestedOrganizationId
        ? input.requestedRole
        : getOrganization(input.requestedOrganizationId).defaultRole

    return {
      organizationId: input.requestedOrganizationId,
      role,
      source: "supabase_membership" as const,
    }
  }

  if (input.requestedOrganizationId) {
    const requested = input.memberships.find(
      (membership) =>
        membership.organizationId === input.requestedOrganizationId &&
        (!input.requestedRole || membership.role === input.requestedRole)
    )
    if (requested) return requested
  }

  if (input.clerkOrganizationId) {
    const activeClerkMembership = input.memberships.find(
      (membership) => membership.clerkOrganizationId === input.clerkOrganizationId
    )
    if (activeClerkMembership) return activeClerkMembership
  }

  return input.memberships[0]
}

function buildSnapshot(input: {
  userId: string | null
  clerkOrganizationId: string | null
  activeMembership: WorkspaceMembership
  memberships: WorkspaceMembership[]
  source: WorkspaceAccessSnapshot["source"]
  canPreviewOrg: boolean
}): WorkspaceAccessSnapshot {
  const profile = getProfile(input.activeMembership.role)

  return {
    userId: input.userId,
    clerkOrganizationId:
      input.activeMembership.clerkOrganizationId ?? input.clerkOrganizationId,
    activeOrganizationId: input.activeMembership.organizationId,
    activeRole: input.activeMembership.role,
    memberships: input.memberships,
    allowedRoutes: profile.allowedRoutes,
    dataScope: profile.dataScope,
    bridgePolicy: profile.bridgePolicy,
    canPreviewOrg: input.canPreviewOrg,
    canApproveBridge: roleHasCapability(input.activeMembership.role, "approve_bridge"),
    canWritePortalDraft: roleHasCapability(
      input.activeMembership.role,
      "write_portal_draft"
    ),
    canViewLegacy: roleHasCapability(input.activeMembership.role, "view_legacy"),
    isPreviewFallback: input.source === "development_fallback",
    source: input.source,
  }
}

function buildNoAccessSnapshot(
  userId: string | null = null,
  clerkOrganizationId: string | null = null
): WorkspaceAccess {
  const profile = getProfile(defaultDashboardRole)
  const organization = getOrganization(profile.organizationId)

  return {
    userId,
    clerkOrganizationId,
    activeOrganizationId: organization.id,
    activeRole: defaultDashboardRole,
    activeOrganization: organization,
    activeProfile: profile,
    memberships: [],
    allowedRoutes: [],
    dataScope: "No active workspace membership.",
    bridgePolicy: "read-only-mirror",
    canPreviewOrg: false,
    canApproveBridge: false,
    canWritePortalDraft: false,
    canViewLegacy: false,
    isPreviewFallback: false,
    source: "no_access",
    databaseOrganizationId: null,
    databaseUserId: null,
  }
}

function buildDevelopmentFallbackAccess(
  options: GetWorkspaceAccessOptions
): WorkspaceAccess {
  const fallbackOrganizationIdValue = options.requestedOrganizationId ?? null
  const requestedOrganizationId: WorkspaceOrganizationId | null =
    isWorkspaceOrganizationId(fallbackOrganizationIdValue)
      ? fallbackOrganizationIdValue
      : null
  const fallbackRoleValue = options.requestedRole ?? null
  const requestedRole: DashboardRole | null = isDashboardRole(fallbackRoleValue)
    ? fallbackRoleValue
    : null
  const fallbackMemberships = buildDevelopmentFallbackMemberships()
  const activeMembership = chooseActiveMembership({
    memberships: fallbackMemberships,
    canPreviewOrg: true,
    requestedOrganizationId,
    requestedRole,
    clerkOrganizationId: null,
  })
  const activeProfile = getProfile(activeMembership.role)
  const activeOrganization = getOrganization(activeMembership.organizationId)

  return {
    userId: null,
    clerkOrganizationId: null,
    activeOrganizationId: activeMembership.organizationId,
    activeRole: activeMembership.role,
    activeOrganization,
    activeProfile,
    memberships: fallbackMemberships,
    allowedRoutes: activeProfile.allowedRoutes,
    dataScope: activeProfile.dataScope,
    bridgePolicy: activeProfile.bridgePolicy,
    canPreviewOrg: true,
    canApproveBridge: roleHasCapability(activeMembership.role, "approve_bridge"),
    canWritePortalDraft: roleHasCapability(
      activeMembership.role,
      "write_portal_draft"
    ),
    canViewLegacy: roleHasCapability(activeMembership.role, "view_legacy"),
    isPreviewFallback: true,
    source: "development_fallback",
    databaseOrganizationId: null,
    databaseUserId: null,
  }
}

function buildDevelopmentFallbackMemberships(): WorkspaceMembership[] {
  return workspaceProfiles.map((profile) => ({
    organizationId: profile.organizationId,
    role: profile.role,
    source: "development_fallback",
  }))
}

function resolveDatabaseOrganizationId(input: {
  clerkOrganizationId: string | null
  slug: string | null
  name: string | null
  metadata: Record<string, unknown> | null
}) {
  const metadataOrganizationId = input.metadata?.workspaceOrganizationId

  if (
    typeof metadataOrganizationId === "string" &&
    isWorkspaceOrganizationId(metadataOrganizationId)
  ) {
    return metadataOrganizationId
  }

  return resolveOrganizationIdFromClerk({
    clerkOrganizationId: input.clerkOrganizationId,
    clerkOrganizationSlug: input.slug,
    organizationName: input.name,
  })
}

function getAuthString(authState: Awaited<ReturnType<typeof auth>>, key: string) {
  const value = (authState as unknown as Record<string, unknown>)[key]
  return typeof value === "string" ? value : null
}

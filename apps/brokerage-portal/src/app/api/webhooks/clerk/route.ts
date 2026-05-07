import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { NextRequest, NextResponse } from "next/server"

import {
  mapClerkRoleToDashboardRole,
  resolveOrganizationIdFromClerk,
  type WorkspaceOrganizationId,
} from "@/lib/workspace-access"

type ClerkWebhookEvent = {
  type?: string
  data?: Record<string, unknown>
}

type UpsertedUser = { id: string }
type UpsertedOrganization = { id: string }

export async function POST(request: NextRequest) {
  let event: ClerkWebhookEvent

  try {
    event = (await verifyWebhook(request) as unknown) as ClerkWebhookEvent
  } catch (error) {
    console.warn("Rejected Clerk webhook.", error)
    return NextResponse.json({ error: "Invalid Clerk webhook" }, { status: 400 })
  }

  try {
    await handleClerkWebhook(event)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Clerk webhook sync failed.", error)
    return NextResponse.json(
      { error: "Clerk webhook sync failed" },
      { status: 500 }
    )
  }
}

async function handleClerkWebhook(event: ClerkWebhookEvent) {
  const type = event.type ?? "unknown"
  const data = event.data ?? {}

  if (type === "user.created" || type === "user.updated") {
    await upsertUserFromClerk(data)
    return
  }

  if (type === "user.deleted") {
    await markUserDeleted(data)
    return
  }

  if (type === "organization.created" || type === "organization.updated") {
    await upsertOrganizationFromClerk(data)
    return
  }

  if (type === "organization.deleted") {
    await markOrganizationDeleted(data)
    return
  }

  if (
    type === "organizationMembership.created" ||
    type === "organizationMembership.updated"
  ) {
    await upsertMembershipFromClerk(data)
    return
  }

  if (type === "organizationMembership.deleted") {
    await markMembershipDeleted(data)
  }
}

async function upsertUserFromClerk(data: Record<string, unknown>) {
  const clerkUserId = getString(data, "id") ?? getString(data, "user_id")

  if (!clerkUserId) throw new Error("Clerk user webhook missing id")

  const email = getPrimaryEmail(data) ?? `unknown+${clerkUserId}@reala.local`
  const firstName = getString(data, "first_name")
  const lastName = getString(data, "last_name")
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || email
  const avatarUrl = getString(data, "image_url")

  return upsertLiveUser({ clerkUserId, email, fullName, avatarUrl })
}

async function upsertOrganizationFromClerk(data: Record<string, unknown>) {
  const clerkOrganizationId = getString(data, "id")

  if (!clerkOrganizationId) {
    throw new Error("Clerk organization webhook missing id")
  }

  const name = getString(data, "name") ?? "Reala workspace"
  const slug = getString(data, "slug") ?? slugify(`${name}-${clerkOrganizationId}`)
  const workspaceOrganizationId = resolveOrganizationIdFromClerk({
    clerkOrganizationId,
    clerkOrganizationSlug: slug,
    organizationName: name,
  })

  return upsertLiveOrganization({
    clerkOrganizationId,
    name,
    slug,
    workspaceOrganizationId,
  })
}

async function upsertMembershipFromClerk(data: Record<string, unknown>) {
  const role = getString(data, "role") ?? "org:member"
  const organizationData = getRecord(data, "organization")
  const userData = getRecord(data, "public_user_data")
  const clerkOrganizationId =
    getString(data, "organization_id") ?? getString(organizationData, "id")
  const clerkUserId =
    getString(data, "user_id") ?? getString(userData, "user_id")

  if (!clerkOrganizationId || !clerkUserId) {
    throw new Error("Clerk membership webhook missing user or organization id")
  }

  const user = await upsertUserFromMembership(clerkUserId, userData)
  const organization = await upsertOrganizationFromMembership(
    clerkOrganizationId,
    organizationData
  )
  const workspaceOrganizationId = resolveOrganizationIdFromClerk({
    clerkOrganizationId,
    clerkOrganizationSlug: getString(organizationData, "slug"),
    organizationName: getString(organizationData, "name"),
  })
  const dashboardRole = workspaceOrganizationId
    ? mapClerkRoleToDashboardRole(role, workspaceOrganizationId)
    : null
  const membershipRole = mapDashboardRoleToDatabaseRole(
    dashboardRole,
    workspaceOrganizationId,
    role
  )
  const roleId = await getOrCreateLiveRole({
    organizationId: organization.id,
    roleKey: membershipRole,
  })

  await upsertLiveMembership({
    organizationId: organization.id,
    userId: user.id,
    roleId,
  })
}

async function upsertUserFromMembership(
  clerkUserId: string,
  data: Record<string, unknown>
): Promise<UpsertedUser> {
  const email =
    getString(data, "identifier") ?? `unknown+${clerkUserId}@reala.local`
  const fullName =
    [getString(data, "first_name"), getString(data, "last_name")]
      .filter(Boolean)
      .join(" ") || email
  const avatarUrl = getString(data, "image_url")

  return upsertLiveUser({ clerkUserId, email, fullName, avatarUrl })
}

async function upsertOrganizationFromMembership(
  clerkOrganizationId: string,
  data: Record<string, unknown>
): Promise<UpsertedOrganization> {
  return upsertOrganizationFromClerk({
    id: clerkOrganizationId,
    name: getString(data, "name") ?? "Reala workspace",
    slug: getString(data, "slug") ?? slugify(`${clerkOrganizationId}`),
  })
}

async function upsertLiveUser(input: {
  clerkUserId: string
  email: string
  fullName: string
  avatarUrl: string | null
}): Promise<UpsertedUser> {
  const { sql } = await import("@/db")
  const [user] = await sql<UpsertedUser[]>`
    insert into public.users (
      clerk_user_id,
      email,
      full_name,
      avatar_url,
      updated_at
    ) values (
      ${input.clerkUserId},
      ${input.email},
      ${input.fullName},
      ${input.avatarUrl},
      now()
    )
    on conflict (clerk_user_id) do update set
      email = excluded.email,
      full_name = excluded.full_name,
      avatar_url = excluded.avatar_url,
      updated_at = now()
    returning id
  `

  return user
}

async function upsertLiveOrganization(input: {
  clerkOrganizationId: string
  name: string
  slug: string
  workspaceOrganizationId: WorkspaceOrganizationId | null
}): Promise<UpsertedOrganization> {
  const { sql } = await import("@/db")
  const metadata = {
    clerkOrganizationId: input.clerkOrganizationId,
    workspaceOrganizationId: input.workspaceOrganizationId,
    clerkSyncedAt: new Date().toISOString(),
  }
  const metadataJson = JSON.stringify(metadata)
  const existing = (await sql`
    select id
    from public.organizations
    where brand_json ->> 'clerkOrganizationId' = ${input.clerkOrganizationId}
       or slug = ${input.slug}
    order by created_at asc
    limit 1
  `) as UpsertedOrganization[]

  if (existing[0]) {
    const [organization] = (await sql`
      update public.organizations
      set
        name = ${input.name},
        slug = ${input.slug},
        status = 'active',
        brand_json = brand_json || (${metadataJson})::jsonb,
        updated_at = now()
      where id = ${existing[0].id}
      returning id
    `) as UpsertedOrganization[]
    return organization
  }

  const [organization] = (await sql`
    insert into public.organizations (
      name,
      slug,
      status,
      brand_json,
      updated_at
    ) values (
      ${input.name},
      ${input.slug},
      'active',
      (${metadataJson})::jsonb,
      now()
    )
    returning id
  `) as UpsertedOrganization[]

  return organization
}

async function getOrCreateLiveRole(input: {
  organizationId: string
  roleKey: string
}) {
  const { sql } = await import("@/db")
  const existing = await sql<{ id: string }[]>`
    select id
    from public.roles
    where key = ${input.roleKey}
      and (organization_id = ${input.organizationId} or organization_id is null)
    order by organization_id is null asc, created_at asc
    limit 1
  `

  if (existing[0]) return existing[0].id

  const [role] = await sql<{ id: string }[]>`
    insert into public.roles (
      organization_id,
      key,
      name,
      description,
      is_system,
      updated_at
    ) values (
      ${input.organizationId},
      ${input.roleKey},
      ${roleKeyToLabel(input.roleKey)},
      'Created from Clerk organization membership sync.',
      true,
      now()
    )
    returning id
  `

  return role.id
}

async function upsertLiveMembership(input: {
  organizationId: string
  userId: string
  roleId: string
}) {
  const { sql } = await import("@/db")
  const existing = await sql<{ id: string }[]>`
    select id
    from public.memberships
    where organization_id = ${input.organizationId}
      and user_id = ${input.userId}
    order by created_at asc
    limit 1
  `

  if (existing[0]) {
    await sql`
      update public.memberships
      set
        role_id = ${input.roleId},
        status = 'active',
        accepted_at = coalesce(accepted_at, now())
      where id = ${existing[0].id}
    `
    return
  }

  await sql`
    insert into public.memberships (
      organization_id,
      user_id,
      role_id,
      scope_type,
      status,
      accepted_at
    ) values (
      ${input.organizationId},
      ${input.userId},
      ${input.roleId},
      'organization',
      'active',
      now()
    )
  `
}

async function markUserDeleted(data: Record<string, unknown>) {
  const clerkUserId = getString(data, "id")

  if (!clerkUserId) return

  const { sql } = await import("@/db")
  await sql`
    update public.memberships
    set status = 'removed'
    where user_id in (
      select id from public.users where clerk_user_id = ${clerkUserId}
    )
  `
}

async function markOrganizationDeleted(data: Record<string, unknown>) {
  const clerkOrganizationId = getString(data, "id")

  if (!clerkOrganizationId) return

  const { sql } = await import("@/db")
  await sql`
    update public.organizations
    set status = 'archived', updated_at = now()
    where brand_json ->> 'clerkOrganizationId' = ${clerkOrganizationId}
  `
}

async function markMembershipDeleted(data: Record<string, unknown>) {
  const organizationData = getRecord(data, "organization")
  const userData = getRecord(data, "public_user_data")
  const clerkOrganizationId =
    getString(data, "organization_id") ?? getString(organizationData, "id")
  const clerkUserId =
    getString(data, "user_id") ?? getString(userData, "user_id")

  if (!clerkOrganizationId || !clerkUserId) return

  const { sql } = await import("@/db")
  await sql`
    update public.memberships
    set status = 'removed'
    where user_id in (
      select id from public.users where clerk_user_id = ${clerkUserId}
    )
      and organization_id in (
        select id
        from public.organizations
        where brand_json ->> 'clerkOrganizationId' = ${clerkOrganizationId}
      )
  `
}

function mapDashboardRoleToDatabaseRole(
  role: ReturnType<typeof mapClerkRoleToDashboardRole> | null,
  organizationId: WorkspaceOrganizationId | null,
  clerkRole: string
) {
  if (role === "Reala Super Admin") return "owner"
  if (role === "Reala Ops Admin") return "ops_admin"
  if (role === "Brokerage Admin" || role === "North Group Team") {
    return "broker_admin"
  }
  if (role === "Individual Agent") return "agent"
  if (role === "Vendor Admin") return "vendor"
  if (role === "Field Technician" || role === "Partner Photographer") return "vendor"
  if (role === "New Reala Client") return "viewer"
  if (organizationId === "reala") return "ops_admin"
  if (clerkRole.includes("admin")) return "broker_admin"
  return "agent"
}

function roleKeyToLabel(roleKey: string) {
  return roleKey
    .split(/[_-]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getPrimaryEmail(data: Record<string, unknown>) {
  const primaryEmailId = getString(data, "primary_email_address_id")
  const emailAddresses = data.email_addresses

  if (!Array.isArray(emailAddresses)) return null

  const primary = emailAddresses.find(
    (emailAddress) =>
      getString(asRecord(emailAddress), "id") === primaryEmailId
  )
  const fallback = emailAddresses[0]

  return (
    getString(asRecord(primary), "email_address") ??
    getString(asRecord(fallback), "email_address")
  )
}

function getString(data: Record<string, unknown> | null | undefined, key: string) {
  if (!data) return null

  const value = data[key]
  return typeof value === "string" && value ? value : null
}

function getRecord(data: Record<string, unknown>, key: string) {
  return asRecord(data[key])
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
}

"use client"

import * as React from "react"
import { useOrganizationList } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"

import {
  defaultDashboardRole,
  getDefaultRoleForOrganization,
  getOrganization,
  getProfile,
  getProfilesForOrganization,
  isDashboardRole,
  isWorkspaceOrganizationId,
  mapClerkRoleToDashboardRole,
  resolveOrganizationIdFromClerk,
  roleBelongsToOrganization,
  roleHasCapability,
  routeAllowedForProfile,
  workspaceOrganizations,
  workspaceProfiles,
  type DashboardRole,
  type WorkspaceAccessSnapshot,
  type WorkspaceMembership,
  type WorkspaceOrganization,
  type WorkspaceOrganizationId,
  type WorkspaceProfile,
  type WorkspaceAccessSource,
} from "@/lib/workspace-access"

export {
  defaultDashboardRole,
  getDefaultRoleForOrganization,
  getOrganization,
  getProfile,
  getProfilesForOrganization,
  isDashboardRole,
  isWorkspaceOrganizationId,
  roleAllowedForOrganization,
  routeAllowedForProfile,
  workspaceOrganizations,
  workspaceProfiles,
  type DashboardRole,
  type NavGroupKey,
  type WorkspaceAccessSnapshot,
  type WorkspaceAccessSource,
  type WorkspaceBridgePolicy,
  type WorkspaceMembership,
  type WorkspaceOrganization,
  type WorkspaceOrganizationId,
  type WorkspacePrimaryAction,
  type WorkspaceProfile,
  type WorkspaceType,
} from "@/lib/workspace-access"

type RoleContextValue = {
  role: DashboardRole
  setRole: (role: DashboardRole) => void
  organizationId: WorkspaceOrganizationId
  setOrganization: (organizationId: WorkspaceOrganizationId) => void
  activeOrganization: WorkspaceOrganization
  activeProfile: WorkspaceProfile
  availableOrganizations: WorkspaceOrganization[]
  availableRoleProfiles: WorkspaceProfile[]
  memberships: WorkspaceMembership[]
  accessSource: WorkspaceAccessSource
  isPreviewFallback: boolean
  canPreviewOrg: boolean
  canApproveBridge: boolean
  canWritePortalDraft: boolean
  canViewLegacy: boolean
}

const RoleContext = React.createContext<RoleContextValue | null>(null)
const STORAGE_KEY = "brokerage-portal-workspace-role"
const ORGANIZATION_STORAGE_KEY = "brokerage-portal-workspace-organization"
const isDevelopmentPreview = process.env.NODE_ENV !== "production"

type WorkspaceSelection = {
  organizationId: WorkspaceOrganizationId
  role: DashboardRole
}

type RoleProviderProps = {
  children: React.ReactNode
  initialAccess?: WorkspaceAccessSnapshot
}

function getInitialSelection(
  initialAccess?: WorkspaceAccessSnapshot
): WorkspaceSelection {
  if (initialAccess) {
    return {
      organizationId: initialAccess.activeOrganizationId,
      role: initialAccess.activeRole,
    }
  }

  if (typeof window === "undefined" || !isDevelopmentPreview) {
    const profile = getProfile(defaultDashboardRole)
    return {
      organizationId: profile.organizationId,
      role: defaultDashboardRole,
    }
  }

  const storedRole = window.localStorage.getItem(STORAGE_KEY)
  const storedOrganization = window.localStorage.getItem(
    ORGANIZATION_STORAGE_KEY
  )

  if (isWorkspaceOrganizationId(storedOrganization)) {
    const role =
      isDashboardRole(storedRole) &&
      roleBelongsToOrganization(storedRole, storedOrganization)
        ? storedRole
        : getDefaultRoleForOrganization(storedOrganization)

    return {
      organizationId: storedOrganization,
      role,
    }
  }

  if (isDashboardRole(storedRole)) {
    const profile = getProfile(storedRole)
    return {
      organizationId: profile.organizationId,
      role: storedRole,
    }
  }

  const profile = getProfile(defaultDashboardRole)
  return {
    organizationId: profile.organizationId,
    role: defaultDashboardRole,
  }
}

function getInitialMemberships(
  initialAccess?: WorkspaceAccessSnapshot
): WorkspaceMembership[] {
  if (initialAccess?.memberships.length) return initialAccess.memberships

  if (!initialAccess?.isPreviewFallback && !isDevelopmentPreview) return []

  return workspaceProfiles.map((profile) => ({
    organizationId: profile.organizationId,
    role: profile.role,
    source: "development_fallback",
  }))
}

function mergeMemberships(
  baseMemberships: WorkspaceMembership[],
  clerkMemberships: WorkspaceMembership[]
) {
  const merged = [...baseMemberships]

  for (const clerkMembership of clerkMemberships) {
    const index = merged.findIndex(
      (membership) =>
        membership.organizationId === clerkMembership.organizationId &&
        membership.role === clerkMembership.role
    )

    if (index >= 0) {
      merged[index] = {
        ...merged[index],
        ...clerkMembership,
      }
      continue
    }

    merged.push(clerkMembership)
  }

  return merged
}

function hasMembershipForRole(
  memberships: WorkspaceMembership[],
  role: DashboardRole,
  organizationId: WorkspaceOrganizationId,
  canPreviewOrg: boolean
) {
  if (canPreviewOrg) return roleBelongsToOrganization(role, organizationId)

  return memberships.some(
    (membership) =>
      membership.organizationId === organizationId && membership.role === role
  )
}

export function RoleProvider({ children, initialAccess }: RoleProviderProps) {
  if (initialAccess?.isPreviewFallback) {
    return (
      <RoleProviderContent
        initialAccess={initialAccess}
        clerkMemberships={[]}
        setActive={undefined}
      >
        {children}
      </RoleProviderContent>
    )
  }

  return (
    <ClerkBackedRoleProvider initialAccess={initialAccess}>
      {children}
    </ClerkBackedRoleProvider>
  )
}

function ClerkBackedRoleProvider({
  children,
  initialAccess,
}: RoleProviderProps) {
  const { isLoaded: clerkOrganizationsLoaded, setActive, userMemberships } =
    useOrganizationList({
      userMemberships: { infinite: true },
    })
  const clerkMemberships = React.useMemo<WorkspaceMembership[]>(() => {
    if (!clerkOrganizationsLoaded) return []

    return (userMemberships.data ?? []).flatMap((membership) => {
      const organization = membership.organization
      const resolvedOrganizationId = resolveOrganizationIdFromClerk({
        clerkOrganizationId: organization.id,
        clerkOrganizationSlug: organization.slug,
        organizationName: organization.name,
      })

      if (!resolvedOrganizationId) return []

      return [
        {
          organizationId: resolvedOrganizationId,
          role: mapClerkRoleToDashboardRole(
            membership.role,
            resolvedOrganizationId
          ),
          clerkOrganizationId: organization.id,
          source: "clerk_org" as const,
        },
      ]
    })
  }, [clerkOrganizationsLoaded, userMemberships.data])

  return (
    <RoleProviderContent
      initialAccess={initialAccess}
      clerkMemberships={clerkMemberships}
      setActive={setActive}
    >
      {children}
    </RoleProviderContent>
  )
}

function RoleProviderContent({
  children,
  initialAccess,
  clerkMemberships,
  setActive,
}: RoleProviderProps & {
  clerkMemberships: WorkspaceMembership[]
  setActive:
    | ((input: { organization: string }) => Promise<unknown>)
    | undefined
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [selection, setSelection] = React.useState<WorkspaceSelection>(() =>
    getInitialSelection(initialAccess)
  )
  const { organizationId, role } = selection
  const memberships = React.useMemo(
    () =>
      clerkMemberships.length
        ? mergeMemberships(getInitialMemberships(initialAccess), clerkMemberships)
        : getInitialMemberships(initialAccess),
    [clerkMemberships, initialAccess]
  )
  const canPreviewOrg =
    initialAccess?.canPreviewOrg ??
    (isDevelopmentPreview && roleHasCapability(role, "preview_org"))

  const availableOrganizations = React.useMemo(() => {
    if (canPreviewOrg) return workspaceOrganizations

    const availableIds = new Set(
      memberships.map((membership) => membership.organizationId)
    )

    return workspaceOrganizations.filter((organization) =>
      availableIds.has(organization.id)
    )
  }, [canPreviewOrg, memberships])

  const setRole = React.useCallback(
    (nextRole: DashboardRole) => {
      const nextProfile = getProfile(nextRole)

      if (
        !hasMembershipForRole(
          memberships,
          nextRole,
          nextProfile.organizationId,
          canPreviewOrg
        )
      ) {
        return
      }

      setSelection({
        organizationId: nextProfile.organizationId,
        role: nextRole,
      })

      if (typeof window !== "undefined" && isDevelopmentPreview) {
        window.localStorage.setItem(STORAGE_KEY, nextRole)
        window.localStorage.setItem(
          ORGANIZATION_STORAGE_KEY,
          nextProfile.organizationId
        )
      }

      if (!routeAllowedForProfile(pathname, nextProfile)) {
        router.push(nextProfile.defaultRoute)
      }
    },
    [canPreviewOrg, memberships, pathname, router]
  )

  const setOrganization = React.useCallback(
    (nextOrganizationId: WorkspaceOrganizationId) => {
      const nextOrganizationAllowed =
        canPreviewOrg ||
        memberships.some(
          (membership) => membership.organizationId === nextOrganizationId
        )

      if (!nextOrganizationAllowed) return

      const nextRole =
        memberships.find(
          (membership) => membership.organizationId === nextOrganizationId
        )?.role ?? getDefaultRoleForOrganization(nextOrganizationId)
      const nextProfile = getProfile(nextRole)

      setSelection({
        organizationId: nextOrganizationId,
        role: nextRole,
      })

      if (typeof window !== "undefined" && isDevelopmentPreview) {
        window.localStorage.setItem(ORGANIZATION_STORAGE_KEY, nextOrganizationId)
        window.localStorage.setItem(STORAGE_KEY, nextRole)
      }

      const clerkOrganizationId = memberships.find(
        (membership) => membership.organizationId === nextOrganizationId
      )?.clerkOrganizationId

      if (clerkOrganizationId && setActive) {
        void setActive({ organization: clerkOrganizationId }).then(() => {
          router.refresh()
        })
      }

      if (!routeAllowedForProfile(pathname, nextProfile)) {
        router.push(nextProfile.defaultRoute)
      }
    },
    [canPreviewOrg, memberships, pathname, router, setActive]
  )

  const activeProfile = React.useMemo(() => getProfile(role), [role])
  const activeOrganization = React.useMemo(
    () => getOrganization(organizationId),
    [organizationId]
  )
  const availableRoleProfiles = React.useMemo(() => {
    const orgProfiles = getProfilesForOrganization(organizationId)
    if (canPreviewOrg) return orgProfiles

    const membershipRoles = new Set(
      memberships
        .filter((membership) => membership.organizationId === organizationId)
        .map((membership) => membership.role)
    )

    return orgProfiles.filter((profile) => membershipRoles.has(profile.role))
  }, [canPreviewOrg, memberships, organizationId])

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        organizationId,
        setOrganization,
        activeOrganization,
        activeProfile,
        availableOrganizations,
        availableRoleProfiles,
        memberships,
        accessSource:
          initialAccess?.source ??
          (isDevelopmentPreview ? "development_fallback" : "no_access"),
        isPreviewFallback:
          initialAccess?.isPreviewFallback ?? isDevelopmentPreview,
        canPreviewOrg,
        canApproveBridge:
          initialAccess?.canApproveBridge ??
          (isDevelopmentPreview && roleHasCapability(role, "approve_bridge")),
        canWritePortalDraft:
          initialAccess?.canWritePortalDraft ??
          (isDevelopmentPreview && roleHasCapability(role, "write_portal_draft")),
        canViewLegacy:
          initialAccess?.canViewLegacy ??
          (isDevelopmentPreview && roleHasCapability(role, "view_legacy")),
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useDashboardRole() {
  const context = React.useContext(RoleContext)

  if (!context) {
    throw new Error("useDashboardRole must be used inside RoleProvider")
  }

  return context
}

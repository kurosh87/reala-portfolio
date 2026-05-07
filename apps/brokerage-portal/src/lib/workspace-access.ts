export type DashboardRole =
  | "Reala Super Admin"
  | "Reala Ops Admin"
  | "Vendor Admin"
  | "Field Technician"
  | "Partner Photographer"
  | "Brokerage Admin"
  | "North Group Team"
  | "Individual Agent"
  | "New Reala Client"

export type WorkspaceOrganizationId =
  | "reala"
  | "vendor-network"
  | "engel-volkers"
  | "north-group"
  | "reala-client"

export type WorkspaceType =
  | "reala-internal"
  | "vendor-workspace"
  | "brokerage-workspace"
  | "client-workspace"

export type WorkspaceProfile = {
  role: DashboardRole
  organizationId: WorkspaceOrganizationId
  workspaceName: string
  workspaceType: WorkspaceType
  scopeLabel: string
  description: string
  logo: string
  canViewLegacy: boolean
  writeBoundary: string
  defaultRoute: string
  allowedRoutes: string[]
  visibleNavGroups: NavGroupKey[]
  primaryActions: WorkspacePrimaryAction[]
  dataScope: string
  bridgePolicy: WorkspaceBridgePolicy
}

export type WorkspaceOrganization = {
  id: WorkspaceOrganizationId
  name: string
  type: WorkspaceType
  scopeLabel: string
  description: string
  logo: string
  defaultRole: DashboardRole
}

export type NavGroupKey =
  | "operations"
  | "order-management"
  | "workspace"
  | "billing"
  | "settings"
  | "help"

export type WorkspacePrimaryAction = {
  label: string
  href: string
}

export type WorkspaceBridgePolicy =
  | "admin-approved"
  | "read-only-mirror"
  | "dry-run"
  | "portal-draft"

export const workspaceOrganizations: WorkspaceOrganization[] = [
  {
    id: "reala",
    name: "Reala",
    type: "reala-internal",
    scopeLabel: "Internal operator workspace",
    description:
      "Global Reala operations, legacy mirrors, client access, bridge safety, billing posture, and exception queues.",
    logo: "/brand/reala.png",
    defaultRole: "Reala Super Admin",
  },
  {
    id: "vendor-network",
    name: "Vendor Network",
    type: "vendor-workspace",
    scopeLabel: "Provider workspace",
    description:
      "Vendor companies, field technicians, third-party photographers, assigned jobs, capacity, and upload workflows.",
    logo: "/brand/reala.png",
    defaultRole: "Vendor Admin",
  },
  {
    id: "engel-volkers",
    name: "Engel & Volkers",
    type: "brokerage-workspace",
    scopeLabel: "Brokerage workspace",
    description:
      "Brokerage listings, orders, approvals, agents, credits, assets, and client-facing command center.",
    logo: "/brand/ev.svg",
    defaultRole: "Brokerage Admin",
  },
  {
    id: "north-group",
    name: "North Group Team",
    type: "brokerage-workspace",
    scopeLabel: "Team workspace",
    description:
      "Team-scoped listing pipeline, service requests, proofing, credits, assets, and agent coordination.",
    logo: "/brand/engel-volkers-logo.png",
    defaultRole: "North Group Team",
  },
  {
    id: "reala-client",
    name: "Reala Client",
    type: "client-workspace",
    scopeLabel: "New client intake",
    description:
      "Client-side order intake, request status, assets, approvals, and billing visibility before legacy handoff.",
    logo: "/brand/reala.png",
    defaultRole: "New Reala Client",
  },
]

const realaAdminRoutes = [
  "/dashboard",
  "/command-center",
  "/legacy-cockpit",
  "/legacy-sheets",
  "/exceptions",
  "/coexistence-audit",
  "/access-requests",
  "/bridge-safety",
  "/bridge-approvals",
  "/listings",
  "/orders",
  "/jobs",
  "/approvals",
  "/vendors",
  "/lead-inbox",
  "/agents",
  "/clients",
  "/plans-credits",
  "/service-catalog",
  "/marketing-studio",
  "/print-shop",
  "/ai-services",
  "/billing",
  "/settings",
  "/search",
  "/help",
  "/create-order",
  "/request-submitted",
  "/listing",
]

const vendorRoutes = [
  "/dashboard",
  "/command-center",
  "/vendors",
  "/jobs",
  "/approvals",
  "/service-catalog",
  "/marketing-studio",
  "/print-shop",
  "/ai-services",
  "/settings",
  "/help",
]

const fieldTechRoutes = [
  "/dashboard",
  "/command-center",
  "/jobs",
  "/approvals",
  "/settings",
  "/help",
]

const brokerageRoutes = [
  "/dashboard",
  "/command-center",
  "/listings",
  "/orders",
  "/jobs",
  "/approvals",
  "/agents",
  "/plans-credits",
  "/service-catalog",
  "/marketing-studio",
  "/print-shop",
  "/ai-services",
  "/billing",
  "/settings",
  "/search",
  "/help",
  "/create-order",
  "/request-submitted",
  "/listing",
]

const clientRoutes = [
  "/dashboard",
  "/command-center",
  "/listings",
  "/orders",
  "/approvals",
  "/service-catalog",
  "/print-shop",
  "/billing",
  "/help",
  "/create-order",
  "/request-submitted",
  "/listing",
]

export const workspaceProfiles: WorkspaceProfile[] = [
  {
    role: "Reala Super Admin",
    organizationId: "reala",
    workspaceName: "Reala Internal",
    workspaceType: "reala-internal",
    scopeLabel: "Global operator",
    description:
      "See legacy mirrors, client access, brokerage workspaces, exceptions, billing posture, and bridge safety.",
    logo: "/brand/reala.png",
    canViewLegacy: true,
    writeBoundary: "Admin-approved legacy writes only",
    defaultRoute: "/dashboard",
    allowedRoutes: realaAdminRoutes,
    visibleNavGroups: [
      "operations",
      "order-management",
      "workspace",
      "billing",
      "settings",
      "help",
    ],
    primaryActions: [
      { label: "Create Draft Order", href: "/create-order" },
      { label: "Review Bridge Safety", href: "/bridge-safety" },
    ],
    dataScope: "All Reala, brokerage, client, vendor, and legacy-mirror records.",
    bridgePolicy: "admin-approved",
  },
  {
    role: "Reala Ops Admin",
    organizationId: "reala",
    workspaceName: "Reala Internal",
    workspaceType: "reala-internal",
    scopeLabel: "Daily operations",
    description:
      "Work the fulfillment, folder sync, Matterport, invoice, print, and client-access queues.",
    logo: "/brand/reala.png",
    canViewLegacy: true,
    writeBoundary: "No automatic production writes",
    defaultRoute: "/exceptions",
    allowedRoutes: realaAdminRoutes.filter(
      (route) => !["/billing", "/legacy-sheets"].includes(route)
    ),
    visibleNavGroups: [
      "operations",
      "order-management",
      "workspace",
      "settings",
      "help",
    ],
    primaryActions: [
      { label: "Review Exceptions", href: "/exceptions" },
      { label: "Add Draft Vendor", href: "/vendors" },
    ],
    dataScope: "Operational queues, vendors, jobs, clients, and read-only legacy mirrors.",
    bridgePolicy: "read-only-mirror",
  },
  {
    role: "Vendor Admin",
    organizationId: "vendor-network",
    workspaceName: "Reala Vendor Network",
    workspaceType: "vendor-workspace",
    scopeLabel: "Vendor company",
    description:
      "Manage provider profile, team members, service capabilities, capacity, assigned jobs, uploads, and handoff status.",
    logo: "/brand/reala.png",
    canViewLegacy: false,
    writeBoundary: "Assigned jobs and portal uploads only",
    defaultRoute: "/vendors",
    allowedRoutes: vendorRoutes,
    visibleNavGroups: ["order-management", "workspace", "settings", "help"],
    primaryActions: [
      { label: "Create Draft Vendor", href: "/vendors" },
      { label: "View Assigned Jobs", href: "/jobs" },
    ],
    dataScope: "Own vendor company, members, capabilities, jobs, uploads, and dry-run bridge payloads.",
    bridgePolicy: "dry-run",
  },
  {
    role: "Field Technician",
    organizationId: "vendor-network",
    workspaceName: "Assigned Field Work",
    workspaceType: "vendor-workspace",
    scopeLabel: "Technician",
    description:
      "View assigned appointments, requirements, field notes, floor plan/photo/video tasks, and upload job evidence.",
    logo: "/brand/reala.png",
    canViewLegacy: false,
    writeBoundary: "Own job status and uploads only",
    defaultRoute: "/jobs",
    allowedRoutes: fieldTechRoutes,
    visibleNavGroups: ["order-management", "settings", "help"],
    primaryActions: [
      { label: "View My Jobs", href: "/jobs" },
      { label: "Upload Job Evidence", href: "/jobs" },
    ],
    dataScope: "Only assigned field jobs, requirements, notes, and uploads.",
    bridgePolicy: "portal-draft",
  },
  {
    role: "Partner Photographer",
    organizationId: "vendor-network",
    workspaceName: "Partner Photographer Portal",
    workspaceType: "vendor-workspace",
    scopeLabel: "Third-party partner",
    description:
      "Upload images for processing, create client-facing service requests, and track delivery without seeing Reala ops internals.",
    logo: "/brand/reala.png",
    canViewLegacy: false,
    writeBoundary: "Own clients, uploads, and requests only",
    defaultRoute: "/jobs",
    allowedRoutes: [
      "/dashboard",
      "/command-center",
      "/jobs",
      "/approvals",
      "/service-catalog",
      "/marketing-studio",
      "/print-shop",
      "/settings",
      "/help",
      "/create-order",
    ],
    visibleNavGroups: ["order-management", "workspace", "settings", "help"],
    primaryActions: [
      { label: "Upload Processing Request", href: "/jobs" },
      { label: "Draft Feature Sheet Request", href: "/create-order" },
    ],
    dataScope: "Own clients, uploads, processing requests, feature-sheet requests, and delivery status.",
    bridgePolicy: "dry-run",
  },
  {
    role: "Brokerage Admin",
    organizationId: "engel-volkers",
    workspaceName: "Engel & Volkers Brokerage",
    workspaceType: "brokerage-workspace",
    scopeLabel: "Brokerage owner",
    description:
      "Manage brokerage listings, orders, credits, assets, agents, and approvals from the client-facing layer.",
    logo: "/brand/ev.svg",
    canViewLegacy: false,
    writeBoundary: "Portal-native drafts and approved requests",
    defaultRoute: "/dashboard",
    allowedRoutes: brokerageRoutes,
    visibleNavGroups: [
      "operations",
      "order-management",
      "workspace",
      "billing",
      "settings",
      "help",
    ],
    primaryActions: [
      { label: "Create Draft Order", href: "/create-order" },
      { label: "Open Listings", href: "/listings" },
    ],
    dataScope: "Brokerage listings, orders, credits, assets, agents, and approvals.",
    bridgePolicy: "portal-draft",
  },
  {
    role: "North Group Team",
    organizationId: "north-group",
    workspaceName: "North Group Team",
    workspaceType: "brokerage-workspace",
    scopeLabel: "Team admin",
    description:
      "Coordinate a team pipeline, assigned listings, service requests, proofs, credits, and agent follow-up.",
    logo: "/brand/engel-volkers-logo.png",
    canViewLegacy: false,
    writeBoundary: "Team-scoped portal requests",
    defaultRoute: "/dashboard",
    allowedRoutes: brokerageRoutes,
    visibleNavGroups: [
      "operations",
      "order-management",
      "workspace",
      "billing",
      "settings",
      "help",
    ],
    primaryActions: [
      { label: "Create Team Order", href: "/create-order" },
      { label: "Open Team Listings", href: "/listings" },
    ],
    dataScope: "Team listings, assigned agents, service requests, approvals, credits, and assets.",
    bridgePolicy: "portal-draft",
  },
  {
    role: "Individual Agent",
    organizationId: "engel-volkers",
    workspaceName: "Agent Workspace",
    workspaceType: "brokerage-workspace",
    scopeLabel: "Agent",
    description:
      "Create listing requests, track services, review proofs, receive assets, and manage order status.",
    logo: "/brand/ev.svg",
    canViewLegacy: false,
    writeBoundary: "Own listings and requests only",
    defaultRoute: "/listings",
    allowedRoutes: brokerageRoutes.filter((route) => !["/agents", "/billing"].includes(route)),
    visibleNavGroups: ["operations", "order-management", "workspace", "settings", "help"],
    primaryActions: [
      { label: "Create Listing Order", href: "/create-order" },
      { label: "My Listings", href: "/listings" },
    ],
    dataScope: "Own listings, order drafts, assets, approvals, and visible credits.",
    bridgePolicy: "portal-draft",
  },
  {
    role: "New Reala Client",
    organizationId: "reala-client",
    workspaceName: "Reala Client Portal",
    workspaceType: "client-workspace",
    scopeLabel: "New client",
    description:
      "Start a new order request under Reala without touching legacy systems until staff approval.",
    logo: "/brand/reala.png",
    canViewLegacy: false,
    writeBoundary: "Draft intake only",
    defaultRoute: "/create-order",
    allowedRoutes: clientRoutes,
    visibleNavGroups: ["operations", "order-management", "workspace", "billing", "help"],
    primaryActions: [
      { label: "Start Draft Order", href: "/create-order" },
      { label: "View Request Status", href: "/orders" },
    ],
    dataScope: "Own draft orders, listing requests, approvals, assets, and billing status.",
    bridgePolicy: "portal-draft",
  },
]

export const defaultDashboardRole: DashboardRole = "Reala Super Admin"

export type WorkspaceAccessSource =
  | "clerk_org"
  | "supabase_membership"
  | "development_fallback"
  | "no_access"

export type WorkspaceCapability =
  | "preview_org"
  | "approve_bridge"
  | "write_portal_draft"
  | "view_legacy"
  | "manage_billing"
  | "manage_vendors"
  | "manage_clients"

export type WorkspaceMembership = {
  organizationId: WorkspaceOrganizationId
  role: DashboardRole
  databaseOrganizationId?: string | null
  databaseUserId?: string | null
  clerkOrganizationId?: string | null
  source?: WorkspaceAccessSource
}

export type WorkspaceAccessSnapshot = {
  userId: string | null
  clerkOrganizationId: string | null
  activeOrganizationId: WorkspaceOrganizationId
  activeRole: DashboardRole
  memberships: WorkspaceMembership[]
  allowedRoutes: string[]
  dataScope: string
  bridgePolicy: WorkspaceBridgePolicy
  canPreviewOrg: boolean
  canApproveBridge: boolean
  canWritePortalDraft: boolean
  canViewLegacy: boolean
  isPreviewFallback: boolean
  source: WorkspaceAccessSource
}

export function isDashboardRole(value: string | null): value is DashboardRole {
  return workspaceProfiles.some((profile) => profile.role === value)
}

export function isWorkspaceOrganizationId(
  value: string | null
): value is WorkspaceOrganizationId {
  return workspaceOrganizations.some((organization) => organization.id === value)
}

export function getProfile(role: DashboardRole) {
  return (
    workspaceProfiles.find((profile) => profile.role === role) ??
    workspaceProfiles[0]
  )
}

export function getOrganization(organizationId: WorkspaceOrganizationId) {
  return (
    workspaceOrganizations.find(
      (organization) => organization.id === organizationId
    ) ?? workspaceOrganizations[0]
  )
}

export function getDefaultRoleForOrganization(
  organizationId: WorkspaceOrganizationId
) {
  return getOrganization(organizationId).defaultRole
}

export function roleBelongsToOrganization(
  role: DashboardRole,
  organizationId: WorkspaceOrganizationId
) {
  return getProfile(role).organizationId === organizationId
}

export function roleAllowedForOrganization(
  role: DashboardRole,
  organizationId: WorkspaceOrganizationId
) {
  return roleBelongsToOrganization(role, organizationId)
}

export function getProfilesForOrganization(
  organizationId: WorkspaceOrganizationId
) {
  return workspaceProfiles.filter(
    (profile) => profile.organizationId === organizationId
  )
}

export function routeAllowedForProfile(
  pathname: string,
  profile: WorkspaceProfile
) {
  if (pathname === "/") return true

  return profile.allowedRoutes.some((route) => {
    if (route === pathname) return true
    return route !== "/" && pathname.startsWith(`${route}/`)
  })
}

export function getRoleCapabilities(role: DashboardRole): WorkspaceCapability[] {
  switch (role) {
    case "Reala Super Admin":
      return [
        "preview_org",
        "approve_bridge",
        "write_portal_draft",
        "view_legacy",
        "manage_billing",
        "manage_vendors",
        "manage_clients",
      ]
    case "Reala Ops Admin":
      return [
        "approve_bridge",
        "write_portal_draft",
        "view_legacy",
        "manage_vendors",
        "manage_clients",
      ]
    case "Brokerage Admin":
    case "North Group Team":
      return ["write_portal_draft", "manage_clients"]
    case "Vendor Admin":
      return ["write_portal_draft", "manage_vendors"]
    case "Individual Agent":
    case "Partner Photographer":
    case "Field Technician":
    case "New Reala Client":
      return ["write_portal_draft"]
  }
}

export function roleHasCapability(
  role: DashboardRole,
  capability: WorkspaceCapability
) {
  return getRoleCapabilities(role).includes(capability)
}

export function mapMembershipRoleToDashboardRole(
  membershipRole: string,
  organizationId: WorkspaceOrganizationId
): DashboardRole {
  if (organizationId === "reala") {
    if (membershipRole === "owner" || membershipRole === "broker_admin") {
      return "Reala Super Admin"
    }
    return "Reala Ops Admin"
  }

  if (organizationId === "vendor-network") {
    if (["owner", "broker_admin", "vendor", "ops_admin"].includes(membershipRole)) {
      return "Vendor Admin"
    }
    if (membershipRole === "agent") return "Partner Photographer"
    return "Field Technician"
  }

  if (organizationId === "north-group") return "North Group Team"

  if (organizationId === "reala-client") return "New Reala Client"

  if (["owner", "broker_admin", "coordinator", "team_lead"].includes(membershipRole)) {
    return "Brokerage Admin"
  }

  return "Individual Agent"
}

export function mapClerkRoleToDashboardRole(
  clerkRole: string | null | undefined,
  organizationId: WorkspaceOrganizationId
): DashboardRole {
  const normalized = clerkRole?.replace(/^org:/, "") ?? "member"

  if (normalized.includes("reala_super")) return "Reala Super Admin"
  if (normalized.includes("reala_ops")) return "Reala Ops Admin"
  if (normalized.includes("vendor_admin")) return "Vendor Admin"
  if (normalized.includes("field_technician")) return "Field Technician"
  if (normalized.includes("partner_photographer")) return "Partner Photographer"
  if (normalized.includes("brokerage_admin")) return "Brokerage Admin"
  if (normalized.includes("agent")) return "Individual Agent"
  if (normalized.includes("client")) return "New Reala Client"

  if (organizationId === "reala") {
    return normalized === "admin" ? "Reala Super Admin" : "Reala Ops Admin"
  }

  if (organizationId === "vendor-network") {
    return normalized === "admin" ? "Vendor Admin" : "Field Technician"
  }

  if (organizationId === "north-group") return "North Group Team"
  if (organizationId === "reala-client") return "New Reala Client"

  return normalized === "admin" ? "Brokerage Admin" : "Individual Agent"
}

export function resolveOrganizationIdFromClerk(input: {
  clerkOrganizationId?: string | null
  clerkOrganizationSlug?: string | null
  organizationName?: string | null
}): WorkspaceOrganizationId | null {
  const envMap: Record<string, WorkspaceOrganizationId> = {
    CLERK_ORG_REALA_ID: "reala",
    CLERK_ORG_VENDOR_NETWORK_ID: "vendor-network",
    CLERK_ORG_ENGEL_VOLKERS_ID: "engel-volkers",
    CLERK_ORG_NORTH_GROUP_ID: "north-group",
    CLERK_ORG_REALA_CLIENT_ID: "reala-client",
  }

  for (const [envKey, organizationId] of Object.entries(envMap)) {
    if (
      input.clerkOrganizationId &&
      process.env[envKey] &&
      process.env[envKey] === input.clerkOrganizationId
    ) {
      return organizationId
    }
  }

  const candidates = [input.clerkOrganizationSlug, input.organizationName]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())

  if (candidates.some((value) => value.includes("reala") && value.includes("client"))) {
    return "reala-client"
  }
  if (candidates.some((value) => value.includes("vendor"))) return "vendor-network"
  if (candidates.some((value) => value.includes("north"))) return "north-group"
  if (candidates.some((value) => value.includes("engel") || value.includes("volkers"))) {
    return "engel-volkers"
  }
  if (candidates.some((value) => value.includes("reala"))) return "reala"

  return null
}

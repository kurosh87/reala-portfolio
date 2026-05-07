import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const membershipRole = pgEnum("membership_role", [
  "owner",
  "broker_admin",
  "coordinator",
  "team_lead",
  "agent",
  "assistant",
  "vendor",
  "ops_admin",
  "viewer",
])

export const listingStatus = pgEnum("listing_status", [
  "draft",
  "active",
  "scheduled",
  "in_production",
  "ready_for_review",
  "delivered",
  "archived",
])

export const orderStatus = pgEnum("order_status", [
  "draft",
  "submitted",
  "scheduling",
  "scheduled",
  "in_production",
  "ready_for_review",
  "revision_requested",
  "delivered",
  "invoiced",
  "paid",
  "archived",
])

export const jobStatus = pgEnum("job_status", [
  "unassigned",
  "assigned",
  "accepted",
  "scheduled",
  "in_progress",
  "uploaded",
  "qc",
  "ready_for_review",
  "revision_requested",
  "complete",
])

export const assetType = pgEnum("asset_type", [
  "photo",
  "floor_plan",
  "video",
  "matterport",
  "feature_sheet",
  "virtual_staging",
  "listing_website",
  "print",
  "other",
])

export const syncStatus = pgEnum("sync_status", [
  "pending",
  "synced",
  "changed",
  "missing",
  "error",
  "ignored",
])

export const exceptionStatus = pgEnum("exception_status", [
  "open",
  "watching",
  "resolved",
  "ignored",
])

export const paymentStatus = pgEnum("payment_status", [
  "not_required",
  "requires_authorization",
  "authorized",
  "authorization_failed",
  "authorization_expiring",
  "captured_partial",
  "captured_full",
  "capture_failed",
  "refunded",
  "account_terms",
])

export const approvalStatus = pgEnum("approval_status", [
  "draft",
  "requested",
  "in_review",
  "revision_requested",
  "approved",
  "delivered",
  "cancelled",
])

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}

const mirrorColumns = {
  legacySource: varchar("legacy_source", { length: 120 }),
  legacyId: varchar("legacy_id", { length: 160 }),
  legacyPayload: jsonb("legacy_payload").$type<Record<string, unknown>>().default({}),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  syncStatus: syncStatus("sync_status").default("pending").notNull(),
  syncError: text("sync_error"),
}

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkOrganizationId: varchar("clerk_organization_id", { length: 128 })
    .notNull()
    .unique(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  billingPlan: varchar("billing_plan", { length: 80 }).default("pilot"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
})

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 128 }).notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
})

export const memberships = pgTable("memberships", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: membershipRole("role").notNull(),
  scopeType: varchar("scope_type", { length: 80 }).default("organization"),
  scopeId: uuid("scope_id"),
  isActive: boolean("is_active").default(true).notNull(),
  ...timestamps,
}, (table) => [
  index("memberships_organization_id_idx").on(table.organizationId),
  index("memberships_user_id_idx").on(table.userId),
  index("memberships_scope_idx").on(table.scopeType, table.scopeId),
])

export const listings = pgTable("listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ownerUserId: uuid("owner_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  addressLine1: text("address_line_1").notNull(),
  city: varchar("city", { length: 120 }),
  province: varchar("province", { length: 80 }),
  postalCode: varchar("postal_code", { length: 32 }),
  mlsNumber: varchar("mls_number", { length: 80 }),
  status: listingStatus("status").default("draft").notNull(),
  launchDate: timestamp("launch_date", { withTimezone: true }),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("listings_organization_id_idx").on(table.organizationId),
  index("listings_owner_user_id_idx").on(table.ownerUserId),
  index("listings_status_idx").on(table.status),
  index("listings_mls_number_idx").on(table.mlsNumber),
  index("listings_legacy_idx").on(table.legacySource, table.legacyId),
])

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  requestedByUserId: uuid("requested_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  orderNumber: varchar("order_number", { length: 80 }).notNull().unique(),
  status: orderStatus("status").default("draft").notNull(),
  estimateCents: integer("estimate_cents").default(0).notNull(),
  requiresCardHold: boolean("requires_card_hold").default(false).notNull(),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("orders_organization_id_idx").on(table.organizationId),
  index("orders_listing_id_idx").on(table.listingId),
  index("orders_requested_by_user_id_idx").on(table.requestedByUserId),
  index("orders_status_idx").on(table.status),
  index("orders_legacy_idx").on(table.legacySource, table.legacyId),
])

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  serviceKey: varchar("service_key", { length: 120 }).notNull(),
  serviceName: text("service_name").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  priceCents: integer("price_cents").default(0).notNull(),
  status: orderStatus("status").default("submitted").notNull(),
  requirements: jsonb("requirements").$type<Record<string, unknown>>().default({}),
  ...mirrorColumns,
  ...timestamps,
}, (table) => [
  index("order_items_order_id_idx").on(table.orderId),
  index("order_items_service_key_idx").on(table.serviceKey),
  index("order_items_status_idx").on(table.status),
  index("order_items_legacy_idx").on(table.legacySource, table.legacyId),
])

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  orderItemId: uuid("order_item_id").references(() => orderItems.id, {
    onDelete: "set null",
  }),
  assignedUserId: uuid("assigned_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  jobType: varchar("job_type", { length: 120 }).notNull(),
  status: jobStatus("status").default("unassigned").notNull(),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  requirements: jsonb("requirements").$type<Record<string, unknown>>().default({}),
  ...mirrorColumns,
  ...timestamps,
}, (table) => [
  index("jobs_organization_id_idx").on(table.organizationId),
  index("jobs_listing_id_idx").on(table.listingId),
  index("jobs_order_item_id_idx").on(table.orderItemId),
  index("jobs_assigned_user_id_idx").on(table.assignedUserId),
  index("jobs_status_idx").on(table.status),
  index("jobs_scheduled_for_idx").on(table.scheduledFor),
  index("jobs_legacy_idx").on(table.legacySource, table.legacyId),
])

export const assets = pgTable("assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
  type: assetType("type").notNull(),
  title: text("title").notNull(),
  storageKey: text("storage_key"),
  externalUrl: text("external_url"),
  isApproved: boolean("is_approved").default(false).notNull(),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("assets_organization_id_idx").on(table.organizationId),
  index("assets_listing_id_idx").on(table.listingId),
  index("assets_job_id_idx").on(table.jobId),
  index("assets_type_idx").on(table.type),
  index("assets_legacy_idx").on(table.legacySource, table.legacyId),
])

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  status: varchar("status", { length: 120 }).default("mirrored"),
  sourceSystem: varchar("source_system", { length: 120 }).default("timetap"),
  notes: text("notes"),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("appointments_organization_id_idx").on(table.organizationId),
  index("appointments_listing_id_idx").on(table.listingId),
  index("appointments_order_id_idx").on(table.orderId),
  index("appointments_scheduled_for_idx").on(table.scheduledFor),
  index("appointments_legacy_idx").on(table.legacySource, table.legacyId),
])

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),
  appointmentId: uuid("appointment_id").references(() => appointments.id, {
    onDelete: "set null",
  }),
  invoiceNumber: varchar("invoice_number", { length: 120 }),
  status: varchar("status", { length: 120 }).default("mirrored"),
  subtotalCents: integer("subtotal_cents").default(0).notNull(),
  taxCents: integer("tax_cents").default(0).notNull(),
  totalCents: integer("total_cents").default(0).notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  pdfUrl: text("pdf_url"),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("invoices_organization_id_idx").on(table.organizationId),
  index("invoices_listing_id_idx").on(table.listingId),
  index("invoices_order_id_idx").on(table.orderId),
  index("invoices_appointment_id_idx").on(table.appointmentId),
  index("invoices_status_idx").on(table.status),
  index("invoices_legacy_idx").on(table.legacySource, table.legacyId),
])

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),
  invoiceId: uuid("invoice_id").references(() => invoices.id, {
    onDelete: "set null",
  }),
  status: paymentStatus("status").default("not_required").notNull(),
  provider: varchar("provider", { length: 80 }).default("stripe"),
  providerReference: varchar("provider_reference", { length: 180 }),
  amountCents: integer("amount_cents").default(0).notNull(),
  authorizedAt: timestamp("authorized_at", { withTimezone: true }),
  capturedAt: timestamp("captured_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("payments_organization_id_idx").on(table.organizationId),
  index("payments_order_id_idx").on(table.orderId),
  index("payments_invoice_id_idx").on(table.invoiceId),
  index("payments_status_idx").on(table.status),
  index("payments_provider_reference_idx").on(table.providerReference),
])

export const printProducts = pgTable("print_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  sku: varchar("sku", { length: 120 }),
  name: text("name").notNull(),
  category: varchar("category", { length: 120 }),
  basePriceCents: integer("base_price_cents").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("print_products_organization_id_idx").on(table.organizationId),
  index("print_products_sku_idx").on(table.sku),
  index("print_products_legacy_idx").on(table.legacySource, table.legacyId),
])

export const printOrders = pgTable("print_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),
  invoiceId: uuid("invoice_id").references(() => invoices.id, {
    onDelete: "set null",
  }),
  status: varchar("status", { length: 120 }).default("mirrored"),
  quantity: integer("quantity").default(1).notNull(),
  totalCents: integer("total_cents").default(0).notNull(),
  proofUrl: text("proof_url"),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("print_orders_organization_id_idx").on(table.organizationId),
  index("print_orders_listing_id_idx").on(table.listingId),
  index("print_orders_order_id_idx").on(table.orderId),
  index("print_orders_status_idx").on(table.status),
  index("print_orders_legacy_idx").on(table.legacySource, table.legacyId),
])

export const entitlements = pgTable("entitlements", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  key: varchar("key", { length: 120 }).notNull(),
  label: text("label").notNull(),
  isEnabled: boolean("is_enabled").default(false).notNull(),
  discountPercent: integer("discount_percent").default(0).notNull(),
  notes: text("notes"),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("entitlements_organization_id_idx").on(table.organizationId),
  index("entitlements_user_id_idx").on(table.userId),
  index("entitlements_key_idx").on(table.key),
  index("entitlements_legacy_idx").on(table.legacySource, table.legacyId),
])

export const packageCredits = pgTable("package_credits", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  listingId: uuid("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  creditType: varchar("credit_type", { length: 120 }).notNull(),
  quantityGranted: integer("quantity_granted").default(0).notNull(),
  quantityUsed: integer("quantity_used").default(0).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("package_credits_organization_id_idx").on(table.organizationId),
  index("package_credits_user_id_idx").on(table.userId),
  index("package_credits_listing_id_idx").on(table.listingId),
  index("package_credits_type_idx").on(table.creditType),
])

export const matterportTours = pgTable("matterport_tours", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  assetId: uuid("asset_id").references(() => assets.id, {
    onDelete: "set null",
  }),
  modelId: varchar("model_id", { length: 180 }),
  generatedUrl: text("generated_url"),
  deliveredUrl: text("delivered_url"),
  canonicalUrl: text("canonical_url"),
  mismatchReason: varchar("mismatch_reason", { length: 160 }),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("matterport_tours_organization_id_idx").on(table.organizationId),
  index("matterport_tours_listing_id_idx").on(table.listingId),
  index("matterport_tours_asset_id_idx").on(table.assetId),
  index("matterport_tours_model_id_idx").on(table.modelId),
  index("matterport_tours_legacy_idx").on(table.legacySource, table.legacyId),
])

export const storageFolders = pgTable("storage_folders", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id").references(() => listings.id, {
    onDelete: "cascade",
  }),
  provider: varchar("provider", { length: 80 }).notNull(),
  path: text("path").notNull(),
  exists: boolean("exists").default(false).notNull(),
  checkedAt: timestamp("checked_at", { withTimezone: true }),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("storage_folders_organization_id_idx").on(table.organizationId),
  index("storage_folders_listing_id_idx").on(table.listingId),
  index("storage_folders_provider_idx").on(table.provider),
  index("storage_folders_legacy_idx").on(table.legacySource, table.legacyId),
])

export const approvalRequests = pgTable("approval_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  assetId: uuid("asset_id").references(() => assets.id, {
    onDelete: "set null",
  }),
  requestedByUserId: uuid("requested_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  status: approvalStatus("status").default("draft").notNull(),
  subject: text("subject").notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("approval_requests_organization_id_idx").on(table.organizationId),
  index("approval_requests_listing_id_idx").on(table.listingId),
  index("approval_requests_asset_id_idx").on(table.assetId),
  index("approval_requests_status_idx").on(table.status),
])

export const creativeProjects = pgTable("creative_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  orderItemId: uuid("order_item_id").references(() => orderItems.id, {
    onDelete: "set null",
  }),
  projectType: assetType("project_type").notNull(),
  status: approvalStatus("status").default("draft").notNull(),
  title: text("title").notNull(),
  provider: varchar("provider", { length: 120 }),
  sourceAssetId: uuid("source_asset_id").references(() => assets.id, {
    onDelete: "set null",
  }),
  outputAssetId: uuid("output_asset_id").references(() => assets.id, {
    onDelete: "set null",
  }),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("creative_projects_organization_id_idx").on(table.organizationId),
  index("creative_projects_listing_id_idx").on(table.listingId),
  index("creative_projects_order_item_id_idx").on(table.orderItemId),
  index("creative_projects_type_idx").on(table.projectType),
  index("creative_projects_status_idx").on(table.status),
])

export const portalIntakeRequests = pgTable("portal_intake_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicRequestId: varchar("public_request_id", { length: 80 }).notNull().unique(),
  intakeType: varchar("intake_type", { length: 80 }).notNull(),
  status: varchar("status", { length: 80 }).default("submitted").notNull(),
  risk: varchar("risk", { length: 40 }).default("medium").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  requesterName: text("requester_name").default("Portal user").notNull(),
  requesterType: varchar("requester_type", { length: 80 }).default("existing_client").notNull(),
  sourceRecord: text("source_record").notNull(),
  targetRecord: text("target_record").notNull(),
  adminNextStep: text("admin_next_step").notNull(),
  safeBoundary: text("safe_boundary").notNull(),
  operatorChecklist: jsonb("operator_checklist").$type<string[]>().default([]),
  rollbackNote: text("rollback_note").notNull(),
  bridgeIntegration: varchar("bridge_integration", { length: 120 }).notNull(),
  bridgeAction: varchar("bridge_action", { length: 120 }).notNull(),
  bridgeTargetEnvironment: varchar("bridge_target_environment", { length: 80 })
    .default("production")
    .notNull(),
  bridgeRequestedMode: varchar("bridge_requested_mode", { length: 80 })
    .default("dry_run")
    .notNull(),
  submittedByClerkUserId: varchar("submitted_by_clerk_user_id", { length: 128 }),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("portal_intake_requests_public_id_idx").on(table.publicRequestId),
  index("portal_intake_requests_status_idx").on(table.status),
  index("portal_intake_requests_type_idx").on(table.intakeType),
  index("portal_intake_requests_created_at_idx").on(table.createdAt),
])

export const accessRequests = pgTable("access_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicRequestId: varchar("public_request_id", { length: 80 }).notNull().unique(),
  requestType: varchar("request_type", { length: 80 }).notNull(),
  status: varchar("status", { length: 80 }).default("submitted").notNull(),
  riskLevel: varchar("risk_level", { length: 40 }).default("medium").notNull(),
  requesterClerkUserId: varchar("requester_clerk_user_id", { length: 128 }),
  requesterName: text("requester_name").default("Portal user").notNull(),
  requesterEmail: text("requester_email"),
  activeWorkspaceOrganizationId: varchar("active_workspace_organization_id", {
    length: 80,
  }),
  activeRole: varchar("active_role", { length: 120 }),
  requestedOrganizationName: text("requested_organization_name"),
  requestedWorkspaceType: varchar("requested_workspace_type", { length: 80 }),
  requestedRole: varchar("requested_role", { length: 120 }),
  requestedEmail: text("requested_email"),
  requestedDisplayName: text("requested_display_name"),
  requestedCapabilities: jsonb("requested_capabilities").$type<string[]>().default([]),
  legacyCandidateUserId: varchar("legacy_candidate_user_id", { length: 160 }),
  legacyCandidateClientName: text("legacy_candidate_client_name"),
  legacyCandidateEmail: text("legacy_candidate_email"),
  legacyCandidateTimetapId: varchar("legacy_candidate_timetap_id", {
    length: 160,
  }),
  legacyCandidateStripeCustomerIdPresent: boolean(
    "legacy_candidate_stripe_customer_id_present"
  )
    .default(false)
    .notNull(),
  safeBoundary: text("safe_boundary").notNull(),
  adminNextStep: text("admin_next_step").notNull(),
  operatorChecklist: jsonb("operator_checklist").$type<string[]>().default([]),
  dryRunPayload: jsonb("dry_run_payload")
    .$type<Record<string, unknown>>()
    .default({}),
  rollbackNote: text("rollback_note").notNull(),
  decisionByClerkUserId: varchar("decision_by_clerk_user_id", { length: 128 }),
  decisionAt: timestamp("decision_at", { withTimezone: true }),
  auditPayload: jsonb("audit_payload").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("access_requests_public_id_idx").on(table.publicRequestId),
  index("access_requests_status_idx").on(table.status),
  index("access_requests_type_idx").on(table.requestType),
  index("access_requests_requester_idx").on(table.requesterClerkUserId),
  index("access_requests_created_at_idx").on(table.createdAt),
])

export const integrationSyncRuns = pgTable("integration_sync_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" }),
  integrationKey: varchar("integration_key", { length: 120 }).notNull(),
  mode: varchar("mode", { length: 80 }).default("read_only").notNull(),
  status: syncStatus("status").default("pending").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  recordsSeen: integer("records_seen").default(0).notNull(),
  recordsChanged: integer("records_changed").default(0).notNull(),
  safeError: text("safe_error"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
}, (table) => [
  index("integration_sync_runs_organization_id_idx").on(table.organizationId),
  index("integration_sync_runs_key_idx").on(table.integrationKey),
  index("integration_sync_runs_status_idx").on(table.status),
  index("integration_sync_runs_started_at_idx").on(table.startedAt),
])

export const integrationExceptions = pgTable("integration_exceptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id").references(() => listings.id, {
    onDelete: "cascade",
  }),
  appointmentId: uuid("appointment_id").references(() => appointments.id, {
    onDelete: "set null",
  }),
  syncRunId: uuid("sync_run_id").references(() => integrationSyncRuns.id, {
    onDelete: "set null",
  }),
  exceptionType: varchar("exception_type", { length: 160 }).notNull(),
  status: exceptionStatus("status").default("open").notNull(),
  severity: varchar("severity", { length: 40 }).default("medium").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  recommendedAction: text("recommended_action"),
  ...mirrorColumns,
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...timestamps,
}, (table) => [
  index("integration_exceptions_organization_id_idx").on(table.organizationId),
  index("integration_exceptions_listing_id_idx").on(table.listingId),
  index("integration_exceptions_type_idx").on(table.exceptionType),
  index("integration_exceptions_status_idx").on(table.status),
  index("integration_exceptions_severity_idx").on(table.severity),
])

export const bridgeAttempts = pgTable("bridge_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceRequestType: varchar("source_request_type", { length: 120 }).notNull(),
  sourceRequestId: varchar("source_request_id", { length: 120 }).notNull(),
  sourceRecord: text("source_record"),
  targetRecord: text("target_record"),
  actorId: varchar("actor_id", { length: 160 }).default("system").notNull(),
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "set null",
  }),
  workspaceOrganizationId: varchar("workspace_organization_id", { length: 120 }),
  activeRole: varchar("active_role", { length: 120 }),
  integration: varchar("integration", { length: 120 }).notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  targetEnvironment: varchar("target_environment", { length: 80 }).notNull(),
  mode: varchar("mode", { length: 80 }).notNull(),
  status: varchar("status", { length: 80 }).notNull(),
  decisionReason: text("decision_reason").notNull(),
  adminApprovalId: varchar("admin_approval_id", { length: 160 }),
  payloadHash: varchar("payload_hash", { length: 96 }).notNull(),
  redactedPayload: jsonb("redacted_payload")
    .$type<Record<string, unknown>>()
    .default({}),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("bridge_attempts_source_idx").on(
    table.sourceRequestType,
    table.sourceRequestId
  ),
  index("bridge_attempts_integration_idx").on(table.integration),
  index("bridge_attempts_status_idx").on(table.status),
  index("bridge_attempts_payload_hash_idx").on(table.payloadHash),
  index("bridge_attempts_created_at_idx").on(table.createdAt),
  uniqueIndex("bridge_attempts_idempotency_idx").on(
    table.sourceRequestType,
    table.sourceRequestId,
    table.integration,
    table.action,
    table.mode,
    table.status,
    table.payloadHash
  ),
])

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" }),
  actorUserId: uuid("actor_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  listingId: uuid("listing_id").references(() => listings.id, {
    onDelete: "cascade",
  }),
  eventType: varchar("event_type", { length: 160 }).notNull(),
  summary: text("summary").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("audit_events_organization_id_idx").on(table.organizationId),
  index("audit_events_actor_user_id_idx").on(table.actorUserId),
  index("audit_events_listing_id_idx").on(table.listingId),
  index("audit_events_event_type_idx").on(table.eventType),
  index("audit_events_created_at_idx").on(table.createdAt),
])

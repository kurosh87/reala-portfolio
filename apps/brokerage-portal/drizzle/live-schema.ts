import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const liveOrganizationStatus = pgEnum("organization_status", [
  "active",
  "paused",
  "archived",
])

export const liveMembershipStatus = pgEnum("membership_status", [
  "invited",
  "active",
  "suspended",
  "removed",
])

export const liveScopeType = pgEnum("scope_type", [
  "platform",
  "organization",
  "team",
  "agent",
  "listing",
  "vendor_job",
])

export const liveJobStatus = pgEnum("job_status", [
  "queued",
  "assigned",
  "scheduled",
  "in_progress",
  "uploaded",
  "qc",
  "ready_for_review",
  "revision_requested",
  "complete",
  "failed",
  "manual_required",
  "cancelled",
])

export const liveJobType = pgEnum("job_type", [
  "shoot_appointment",
  "floor_plan_draft",
  "matterport_publish",
  "video_edit",
  "sign_install",
  "sign_removal",
  "feature_sheet",
  "print_order",
  "virtual_staging",
  "listing_website",
  "banner_asset",
  "gallery_publish",
  "payment_hold",
  "invoice_generation",
  "timetap_sync",
  "folder_sync",
  "matterport_url_repair",
  "ai_image_processing",
  "manual_ops",
])

export const liveVendorType = pgEnum("vendor_type", [
  "photographer",
  "floor_plan_drafter",
  "video_editor",
  "sign_installer",
  "print_ops",
  "internal_ops",
  "designer",
  "ai_operator",
  "other",
])

export const liveOrganizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  status: liveOrganizationStatus("status").default("active").notNull(),
  billingPlan: text("billing_plan"),
  timezone: varchar("timezone", { length: 120 })
    .default("America/Vancouver")
    .notNull(),
  brandJson: jsonb("brand_json").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveUsers = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").unique(),
  supabaseAuthUserId: uuid("supabase_auth_user_id").unique(),
  email: varchar("email", { length: 320 }).notNull(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  phone: varchar("phone", { length: 80 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveRoles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id"),
  key: varchar("key", { length: 120 }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const livePermissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 160 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 120 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveRolePermissions = pgTable("role_permissions", {
  roleId: uuid("role_id").notNull(),
  permissionId: uuid("permission_id").notNull(),
}, (table) => [
  primaryKey({ columns: [table.roleId, table.permissionId] }),
])

export const liveMemberships = pgTable("memberships", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  userId: uuid("user_id").notNull(),
  roleId: uuid("role_id").notNull(),
  scopeType: liveScopeType("scope_type").default("organization").notNull(),
  scopeId: uuid("scope_id"),
  status: liveMembershipStatus("status").default("invited").notNull(),
  invitedById: uuid("invited_by_id"),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveTeams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  name: text("name").notNull(),
  leadUserId: uuid("lead_user_id"),
  status: liveOrganizationStatus("status").default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveTeamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id").notNull(),
  userId: uuid("user_id").notNull(),
  roleLabel: text("role_label").default("member").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveAgentProfiles = pgTable("agent_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  userId: uuid("user_id").notNull(),
  licenseName: text("license_name"),
  phone: varchar("phone", { length: 80 }),
  website: text("website"),
  socialsJson: jsonb("socials_json").$type<Record<string, unknown>>().default({}).notNull(),
  headshotAssetId: uuid("headshot_asset_id"),
  brandJson: jsonb("brand_json").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveVendorProfiles = pgTable("vendor_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id"),
  userId: uuid("user_id"),
  vendorType: liveVendorType("vendor_type").notNull(),
  companyName: text("company_name"),
  coverageAreaJson: jsonb("coverage_area_json").$type<Record<string, unknown>>().default({}).notNull(),
  skillsJson: jsonb("skills_json").$type<unknown[]>().default([]).notNull(),
  status: liveOrganizationStatus("status").default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveVendorAssignments = pgTable("vendor_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  listingId: uuid("listing_id").notNull(),
  orderItemId: uuid("order_item_id"),
  appointmentId: uuid("appointment_id"),
  vendorProfileId: uuid("vendor_profile_id"),
  status: liveJobStatus("status").default("assigned").notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  dueAt: timestamp("due_at", { withTimezone: true }),
  requirementsJson: jsonb("requirements_json").$type<Record<string, unknown>>().default({}).notNull(),
  createdById: uuid("created_by_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveWorkflowJobs = pgTable("workflow_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  listingId: uuid("listing_id"),
  orderItemId: uuid("order_item_id"),
  vendorAssignmentId: uuid("vendor_assignment_id"),
  type: liveJobType("type").notNull(),
  status: liveJobStatus("status").default("queued").notNull(),
  externalProvider: varchar("external_provider", { length: 120 }),
  externalRef: text("external_ref"),
  inputJson: jsonb("input_json").$type<Record<string, unknown>>().default({}).notNull(),
  outputJson: jsonb("output_json").$type<Record<string, unknown>>().default({}).notNull(),
  lastError: text("last_error"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveFeatureSheetProjects = pgTable("feature_sheet_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  listingId: uuid("listing_id").notNull(),
  orderItemId: uuid("order_item_id"),
  listingDataProfileId: uuid("listing_data_profile_id"),
  templateId: uuid("template_id"),
  status: liveJobStatus("status").default("queued").notNull(),
  matchConfirmationJson: jsonb("match_confirmation_json").$type<Record<string, unknown>>().default({}).notNull(),
  selectedAssetsJson: jsonb("selected_assets_json").$type<unknown[]>().default([]).notNull(),
  copyJson: jsonb("copy_json").$type<Record<string, unknown>>().default({}).notNull(),
  layoutJson: jsonb("layout_json").$type<Record<string, unknown>>().default({}).notNull(),
  proofAssetId: uuid("proof_asset_id"),
  finalAssetId: uuid("final_asset_id"),
  approvedById: uuid("approved_by_id"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveVirtualStagingRequests = pgTable("virtual_staging_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  listingId: uuid("listing_id").notNull(),
  orderItemId: uuid("order_item_id"),
  sourceAssetId: uuid("source_asset_id").notNull(),
  workflowJobId: uuid("workflow_job_id"),
  roomType: varchar("room_type", { length: 120 }),
  stagingStyle: varchar("staging_style", { length: 120 }),
  removeExistingFurniture: boolean("remove_existing_furniture").default(false).notNull(),
  status: liveJobStatus("status").default("queued").notNull(),
  creditCost: integer("credit_cost").default(1).notNull(),
  generationSettingsJson: jsonb("generation_settings_json").$type<Record<string, unknown>>().default({}).notNull(),
  selectedOutputAssetId: uuid("selected_output_asset_id"),
  approvedById: uuid("approved_by_id"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const livePrintCatalogProducts = pgTable("print_catalog_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id"),
  parentId: uuid("parent_id"),
  sku: varchar("sku", { length: 120 }),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").default(0).notNull(),
  taxFlagsJson: jsonb("tax_flags_json").$type<Record<string, unknown>>().default({}).notNull(),
  mediaRequired: boolean("media_required").default(false).notNull(),
  designOption: varchar("design_option", { length: 120 }),
  deliveryOptionsJson: jsonb("delivery_options_json").$type<Record<string, unknown>>().default({}).notNull(),
  addonsJson: jsonb("addons_json").$type<unknown[]>().default([]).notNull(),
  publishedVersion: integer("published_version").default(1).notNull(),
  status: liveOrganizationStatus("status").default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const liveAuditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  listingId: uuid("listing_id"),
  actorUserId: uuid("actor_user_id"),
  actingForUserId: uuid("acting_for_user_id"),
  action: varchar("action", { length: 160 }).notNull(),
  subjectType: varchar("subject_type", { length: 160 }).notNull(),
  subjectId: uuid("subject_id"),
  metadataJson: jsonb("metadata_json").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

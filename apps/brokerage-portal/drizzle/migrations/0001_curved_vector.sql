CREATE TYPE "public"."approval_status" AS ENUM('draft', 'requested', 'in_review', 'revision_requested', 'approved', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."exception_status" AS ENUM('open', 'watching', 'resolved', 'ignored');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('not_required', 'requires_authorization', 'authorized', 'authorization_failed', 'authorization_expiring', 'captured_partial', 'captured_full', 'capture_failed', 'refunded', 'account_terms');--> statement-breakpoint
CREATE TYPE "public"."sync_status" AS ENUM('pending', 'synced', 'changed', 'missing', 'error', 'ignored');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"listing_id" uuid,
	"order_id" uuid,
	"scheduled_for" timestamp with time zone,
	"status" varchar(120) DEFAULT 'mirrored',
	"source_system" varchar(120) DEFAULT 'timetap',
	"notes" text,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approval_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"asset_id" uuid,
	"requested_by_user_id" uuid,
	"status" "approval_status" DEFAULT 'draft' NOT NULL,
	"subject" text NOT NULL,
	"due_at" timestamp with time zone,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creative_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"order_item_id" uuid,
	"project_type" "asset_type" NOT NULL,
	"status" "approval_status" DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"provider" varchar(120),
	"source_asset_id" uuid,
	"output_asset_id" uuid,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid,
	"key" varchar(120) NOT NULL,
	"label" text NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"discount_percent" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integration_exceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"listing_id" uuid,
	"appointment_id" uuid,
	"sync_run_id" uuid,
	"exception_type" varchar(160) NOT NULL,
	"status" "exception_status" DEFAULT 'open' NOT NULL,
	"severity" varchar(40) DEFAULT 'medium' NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"recommended_action" text,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integration_sync_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"integration_key" varchar(120) NOT NULL,
	"mode" varchar(80) DEFAULT 'read_only' NOT NULL,
	"status" "sync_status" DEFAULT 'pending' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now(),
	"finished_at" timestamp with time zone,
	"records_seen" integer DEFAULT 0 NOT NULL,
	"records_changed" integer DEFAULT 0 NOT NULL,
	"safe_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"listing_id" uuid,
	"order_id" uuid,
	"appointment_id" uuid,
	"invoice_number" varchar(120),
	"status" varchar(120) DEFAULT 'mirrored',
	"subtotal_cents" integer DEFAULT 0 NOT NULL,
	"tax_cents" integer DEFAULT 0 NOT NULL,
	"total_cents" integer DEFAULT 0 NOT NULL,
	"issued_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"pdf_url" text,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matterport_tours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"asset_id" uuid,
	"model_id" varchar(180),
	"generated_url" text,
	"delivered_url" text,
	"canonical_url" text,
	"mismatch_reason" varchar(160),
	"last_checked_at" timestamp with time zone,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid,
	"listing_id" uuid,
	"credit_type" varchar(120) NOT NULL,
	"quantity_granted" integer DEFAULT 0 NOT NULL,
	"quantity_used" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"order_id" uuid,
	"invoice_id" uuid,
	"status" "payment_status" DEFAULT 'not_required' NOT NULL,
	"provider" varchar(80) DEFAULT 'stripe',
	"provider_reference" varchar(180),
	"amount_cents" integer DEFAULT 0 NOT NULL,
	"authorized_at" timestamp with time zone,
	"captured_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "print_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"listing_id" uuid,
	"order_id" uuid,
	"invoice_id" uuid,
	"status" varchar(120) DEFAULT 'mirrored',
	"quantity" integer DEFAULT 1 NOT NULL,
	"total_cents" integer DEFAULT 0 NOT NULL,
	"proof_url" text,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "print_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"sku" varchar(120),
	"name" text NOT NULL,
	"category" varchar(120),
	"base_price_cents" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"listing_id" uuid,
	"provider" varchar(80) NOT NULL,
	"path" text NOT NULL,
	"exists" boolean DEFAULT false NOT NULL,
	"checked_at" timestamp with time zone,
	"legacy_source" varchar(120),
	"legacy_id" varchar(160),
	"legacy_payload" jsonb DEFAULT '{}'::jsonb,
	"last_seen_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"sync_error" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "legacy_source" varchar(120);--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "legacy_id" varchar(160);--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "legacy_payload" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "last_seen_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "sync_status" "sync_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "sync_error" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "legacy_source" varchar(120);--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "legacy_id" varchar(160);--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "legacy_payload" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "last_seen_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "sync_status" "sync_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "sync_error" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "legacy_source" varchar(120);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "legacy_id" varchar(160);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "legacy_payload" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "last_seen_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "sync_status" "sync_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "sync_error" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "legacy_source" varchar(120);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "legacy_id" varchar(160);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "legacy_payload" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "last_seen_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "sync_status" "sync_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "sync_error" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "legacy_source" varchar(120);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "legacy_id" varchar(160);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "legacy_payload" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "last_seen_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "sync_status" "sync_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "sync_error" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_requested_by_user_id_users_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_projects" ADD CONSTRAINT "creative_projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_projects" ADD CONSTRAINT "creative_projects_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_projects" ADD CONSTRAINT "creative_projects_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_projects" ADD CONSTRAINT "creative_projects_source_asset_id_assets_id_fk" FOREIGN KEY ("source_asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_projects" ADD CONSTRAINT "creative_projects_output_asset_id_assets_id_fk" FOREIGN KEY ("output_asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_exceptions" ADD CONSTRAINT "integration_exceptions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_exceptions" ADD CONSTRAINT "integration_exceptions_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_exceptions" ADD CONSTRAINT "integration_exceptions_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_exceptions" ADD CONSTRAINT "integration_exceptions_sync_run_id_integration_sync_runs_id_fk" FOREIGN KEY ("sync_run_id") REFERENCES "public"."integration_sync_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_sync_runs" ADD CONSTRAINT "integration_sync_runs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matterport_tours" ADD CONSTRAINT "matterport_tours_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matterport_tours" ADD CONSTRAINT "matterport_tours_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matterport_tours" ADD CONSTRAINT "matterport_tours_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_credits" ADD CONSTRAINT "package_credits_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_credits" ADD CONSTRAINT "package_credits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_credits" ADD CONSTRAINT "package_credits_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_orders" ADD CONSTRAINT "print_orders_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_orders" ADD CONSTRAINT "print_orders_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_orders" ADD CONSTRAINT "print_orders_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_orders" ADD CONSTRAINT "print_orders_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_products" ADD CONSTRAINT "print_products_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_folders" ADD CONSTRAINT "storage_folders_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_folders" ADD CONSTRAINT "storage_folders_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appointments_organization_id_idx" ON "appointments" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "appointments_listing_id_idx" ON "appointments" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "appointments_order_id_idx" ON "appointments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "appointments_scheduled_for_idx" ON "appointments" USING btree ("scheduled_for");--> statement-breakpoint
CREATE INDEX "appointments_legacy_idx" ON "appointments" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "approval_requests_organization_id_idx" ON "approval_requests" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "approval_requests_listing_id_idx" ON "approval_requests" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "approval_requests_asset_id_idx" ON "approval_requests" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "approval_requests_status_idx" ON "approval_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "creative_projects_organization_id_idx" ON "creative_projects" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "creative_projects_listing_id_idx" ON "creative_projects" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "creative_projects_order_item_id_idx" ON "creative_projects" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "creative_projects_type_idx" ON "creative_projects" USING btree ("project_type");--> statement-breakpoint
CREATE INDEX "creative_projects_status_idx" ON "creative_projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "entitlements_organization_id_idx" ON "entitlements" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "entitlements_user_id_idx" ON "entitlements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "entitlements_key_idx" ON "entitlements" USING btree ("key");--> statement-breakpoint
CREATE INDEX "entitlements_legacy_idx" ON "entitlements" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "integration_exceptions_organization_id_idx" ON "integration_exceptions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "integration_exceptions_listing_id_idx" ON "integration_exceptions" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "integration_exceptions_type_idx" ON "integration_exceptions" USING btree ("exception_type");--> statement-breakpoint
CREATE INDEX "integration_exceptions_status_idx" ON "integration_exceptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "integration_exceptions_severity_idx" ON "integration_exceptions" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "integration_sync_runs_organization_id_idx" ON "integration_sync_runs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "integration_sync_runs_key_idx" ON "integration_sync_runs" USING btree ("integration_key");--> statement-breakpoint
CREATE INDEX "integration_sync_runs_status_idx" ON "integration_sync_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "integration_sync_runs_started_at_idx" ON "integration_sync_runs" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "invoices_organization_id_idx" ON "invoices" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invoices_listing_id_idx" ON "invoices" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "invoices_order_id_idx" ON "invoices" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "invoices_appointment_id_idx" ON "invoices" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "invoices_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoices_legacy_idx" ON "invoices" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "matterport_tours_organization_id_idx" ON "matterport_tours" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "matterport_tours_listing_id_idx" ON "matterport_tours" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "matterport_tours_asset_id_idx" ON "matterport_tours" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "matterport_tours_model_id_idx" ON "matterport_tours" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "matterport_tours_legacy_idx" ON "matterport_tours" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "package_credits_organization_id_idx" ON "package_credits" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "package_credits_user_id_idx" ON "package_credits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "package_credits_listing_id_idx" ON "package_credits" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "package_credits_type_idx" ON "package_credits" USING btree ("credit_type");--> statement-breakpoint
CREATE INDEX "payments_organization_id_idx" ON "payments" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "payments_order_id_idx" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "payments_invoice_id_idx" ON "payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_provider_reference_idx" ON "payments" USING btree ("provider_reference");--> statement-breakpoint
CREATE INDEX "print_orders_organization_id_idx" ON "print_orders" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "print_orders_listing_id_idx" ON "print_orders" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "print_orders_order_id_idx" ON "print_orders" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "print_orders_status_idx" ON "print_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "print_orders_legacy_idx" ON "print_orders" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "print_products_organization_id_idx" ON "print_products" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "print_products_sku_idx" ON "print_products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "print_products_legacy_idx" ON "print_products" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "storage_folders_organization_id_idx" ON "storage_folders" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "storage_folders_listing_id_idx" ON "storage_folders" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "storage_folders_provider_idx" ON "storage_folders" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "storage_folders_legacy_idx" ON "storage_folders" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "assets_legacy_idx" ON "assets" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "jobs_legacy_idx" ON "jobs" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "listings_legacy_idx" ON "listings" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "order_items_legacy_idx" ON "order_items" USING btree ("legacy_source","legacy_id");--> statement-breakpoint
CREATE INDEX "orders_legacy_idx" ON "orders" USING btree ("legacy_source","legacy_id");
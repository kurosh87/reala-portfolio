CREATE OR REPLACE FUNCTION public.app_is_reala_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships m
    JOIN public.users u ON u.id = m.user_id
    JOIN public.organizations o ON o.id = m.organization_id
    JOIN public.roles r ON r.id = m.role_id
    WHERE u.clerk_user_id = public.app_current_clerk_user_id()
      AND m.status::text = 'active'
      AND r.key IN ('owner', 'ops_admin', 'reala_super_admin')
      AND COALESCE(o.brand_json ->> 'workspaceOrganizationId', o.slug) IN ('reala', 'reala-internal')
  )
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.app_can_approve_bridge()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT public.app_is_reala_super_admin()
    OR EXISTS (
      SELECT 1
      FROM public.memberships m
      JOIN public.users u ON u.id = m.user_id
      JOIN public.organizations o ON o.id = m.organization_id
      JOIN public.roles r ON r.id = m.role_id
      WHERE u.clerk_user_id = public.app_current_clerk_user_id()
        AND m.status::text = 'active'
        AND r.key IN ('owner', 'ops_admin', 'reala_ops_admin')
        AND COALESCE(o.brand_json ->> 'workspaceOrganizationId', o.slug) IN ('reala', 'reala-internal')
    )
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.app_can_access_organization(target_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT public.app_is_reala_super_admin()
    OR EXISTS (
      SELECT 1
      FROM public.memberships m
      JOIN public.users u ON u.id = m.user_id
      WHERE m.organization_id = target_organization_id
        AND m.status::text = 'active'
        AND u.clerk_user_id = public.app_current_clerk_user_id()
    )
$$;
--> statement-breakpoint
DO $$
BEGIN
  CREATE TYPE sync_status AS ENUM ('pending', 'synced', 'changed', 'missing', 'error', 'ignored');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  CREATE TYPE exception_status AS ENUM ('open', 'watching', 'resolved', 'ignored');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_sync_runs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organization_id" uuid REFERENCES "organizations"("id") ON DELETE cascade,
  "integration_key" varchar(120) NOT NULL,
  "mode" varchar(80) DEFAULT 'read_only' NOT NULL,
  "status" sync_status DEFAULT 'pending' NOT NULL,
  "started_at" timestamp with time zone DEFAULT now(),
  "finished_at" timestamp with time zone,
  "records_seen" integer DEFAULT 0 NOT NULL,
  "records_changed" integer DEFAULT 0 NOT NULL,
  "safe_error" text,
  "metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_sync_runs_organization_id_idx" ON "integration_sync_runs" USING btree ("organization_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_sync_runs_key_idx" ON "integration_sync_runs" USING btree ("integration_key");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_sync_runs_status_idx" ON "integration_sync_runs" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_sync_runs_started_at_idx" ON "integration_sync_runs" USING btree ("started_at");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_exceptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organization_id" uuid REFERENCES "organizations"("id") ON DELETE cascade,
  "listing_id" uuid REFERENCES "listings"("id") ON DELETE cascade,
  "appointment_id" uuid REFERENCES "appointments"("id") ON DELETE set null,
  "sync_run_id" uuid REFERENCES "integration_sync_runs"("id") ON DELETE set null,
  "exception_type" varchar(160) NOT NULL,
  "status" exception_status DEFAULT 'open' NOT NULL,
  "severity" varchar(40) DEFAULT 'medium' NOT NULL,
  "title" text NOT NULL,
  "summary" text NOT NULL,
  "recommended_action" text,
  "legacy_source" varchar(120),
  "legacy_id" varchar(160),
  "legacy_payload" jsonb DEFAULT '{}'::jsonb,
  "last_seen_at" timestamp with time zone,
  "sync_status" sync_status DEFAULT 'pending' NOT NULL,
  "sync_error" text,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_exceptions_organization_id_idx" ON "integration_exceptions" USING btree ("organization_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_exceptions_listing_id_idx" ON "integration_exceptions" USING btree ("listing_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_exceptions_type_idx" ON "integration_exceptions" USING btree ("exception_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_exceptions_status_idx" ON "integration_exceptions" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_exceptions_severity_idx" ON "integration_exceptions" USING btree ("severity");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bridge_attempts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "source_request_type" varchar(120) NOT NULL,
  "source_request_id" varchar(120) NOT NULL,
  "source_record" text,
  "target_record" text,
  "actor_id" varchar(160) DEFAULT 'system' NOT NULL,
  "organization_id" uuid REFERENCES "organizations"("id") ON DELETE set null,
  "workspace_organization_id" varchar(120),
  "active_role" varchar(120),
  "integration" varchar(120) NOT NULL,
  "action" varchar(120) NOT NULL,
  "target_environment" varchar(80) NOT NULL,
  "mode" varchar(80) NOT NULL,
  "status" varchar(80) NOT NULL,
  "decision_reason" text NOT NULL,
  "admin_approval_id" varchar(160),
  "payload_hash" varchar(96) NOT NULL,
  "redacted_payload" jsonb DEFAULT '{}'::jsonb,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bridge_attempts_source_idx" ON "bridge_attempts" USING btree ("source_request_type", "source_request_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bridge_attempts_integration_idx" ON "bridge_attempts" USING btree ("integration");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bridge_attempts_status_idx" ON "bridge_attempts" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bridge_attempts_payload_hash_idx" ON "bridge_attempts" USING btree ("payload_hash");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bridge_attempts_created_at_idx" ON "bridge_attempts" USING btree ("created_at");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "bridge_attempts_idempotency_idx" ON "bridge_attempts" USING btree ("source_request_type", "source_request_id", "integration", "action", "mode", "status", "payload_hash");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organization_id" uuid REFERENCES "organizations"("id") ON DELETE cascade,
  "actor_user_id" uuid REFERENCES "users"("id") ON DELETE set null,
  "listing_id" uuid REFERENCES "listings"("id") ON DELETE cascade,
  "event_type" varchar(160) NOT NULL,
  "summary" text NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_organization_id_idx" ON "audit_events" USING btree ("organization_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_actor_user_id_idx" ON "audit_events" USING btree ("actor_user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_listing_id_idx" ON "audit_events" USING btree ("listing_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_event_type_idx" ON "audit_events" USING btree ("event_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_created_at_idx" ON "audit_events" USING btree ("created_at");
--> statement-breakpoint
ALTER TABLE "integration_sync_runs" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "integration_exceptions" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "bridge_attempts" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "audit_events" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP POLICY IF EXISTS "bridge_attempts_admin_read" ON "bridge_attempts";
--> statement-breakpoint
CREATE POLICY "bridge_attempts_admin_read" ON "bridge_attempts"
  FOR SELECT USING (public.app_can_approve_bridge());
--> statement-breakpoint
DROP POLICY IF EXISTS "bridge_attempts_admin_insert" ON "bridge_attempts";
--> statement-breakpoint
CREATE POLICY "bridge_attempts_admin_insert" ON "bridge_attempts"
  FOR INSERT WITH CHECK (public.app_can_approve_bridge());
--> statement-breakpoint
DROP POLICY IF EXISTS "integration_sync_runs_admin_read" ON "integration_sync_runs";
--> statement-breakpoint
CREATE POLICY "integration_sync_runs_admin_read" ON "integration_sync_runs"
  FOR SELECT USING (public.app_can_approve_bridge() OR organization_id IS NULL OR public.app_can_access_organization(organization_id));
--> statement-breakpoint
DROP POLICY IF EXISTS "integration_sync_runs_admin_insert" ON "integration_sync_runs";
--> statement-breakpoint
CREATE POLICY "integration_sync_runs_admin_insert" ON "integration_sync_runs"
  FOR INSERT WITH CHECK (public.app_can_approve_bridge() OR organization_id IS NULL OR public.app_can_access_organization(organization_id));
--> statement-breakpoint
DROP POLICY IF EXISTS "integration_exceptions_admin_read" ON "integration_exceptions";
--> statement-breakpoint
CREATE POLICY "integration_exceptions_admin_read" ON "integration_exceptions"
  FOR SELECT USING (public.app_can_approve_bridge() OR organization_id IS NULL OR public.app_can_access_organization(organization_id));
--> statement-breakpoint
DROP POLICY IF EXISTS "integration_exceptions_admin_insert" ON "integration_exceptions";
--> statement-breakpoint
CREATE POLICY "integration_exceptions_admin_insert" ON "integration_exceptions"
  FOR INSERT WITH CHECK (public.app_can_approve_bridge() OR organization_id IS NULL OR public.app_can_access_organization(organization_id));
--> statement-breakpoint
DROP POLICY IF EXISTS "audit_events_admin_read" ON "audit_events";
--> statement-breakpoint
CREATE POLICY "audit_events_admin_read" ON "audit_events"
  FOR SELECT USING (public.app_can_approve_bridge() OR organization_id IS NULL OR public.app_can_access_organization(organization_id));
--> statement-breakpoint
DROP POLICY IF EXISTS "audit_events_admin_insert" ON "audit_events";
--> statement-breakpoint
CREATE POLICY "audit_events_admin_insert" ON "audit_events"
  FOR INSERT WITH CHECK (public.app_can_approve_bridge() OR organization_id IS NULL OR public.app_can_access_organization(organization_id));

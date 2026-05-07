CREATE TABLE "access_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_request_id" varchar(80) NOT NULL,
	"request_type" varchar(80) NOT NULL,
	"status" varchar(80) DEFAULT 'submitted' NOT NULL,
	"risk_level" varchar(40) DEFAULT 'medium' NOT NULL,
	"requester_clerk_user_id" varchar(128),
	"requester_name" text DEFAULT 'Portal user' NOT NULL,
	"requester_email" text,
	"active_workspace_organization_id" varchar(80),
	"active_role" varchar(120),
	"requested_organization_name" text,
	"requested_workspace_type" varchar(80),
	"requested_role" varchar(120),
	"requested_email" text,
	"requested_display_name" text,
	"requested_capabilities" jsonb DEFAULT '[]'::jsonb,
	"legacy_candidate_user_id" varchar(160),
	"legacy_candidate_client_name" text,
	"legacy_candidate_email" text,
	"legacy_candidate_timetap_id" varchar(160),
	"legacy_candidate_stripe_customer_id_present" boolean DEFAULT false NOT NULL,
	"safe_boundary" text NOT NULL,
	"admin_next_step" text NOT NULL,
	"operator_checklist" jsonb DEFAULT '[]'::jsonb,
	"dry_run_payload" jsonb DEFAULT '{}'::jsonb,
	"rollback_note" text NOT NULL,
	"decision_by_clerk_user_id" varchar(128),
	"decision_at" timestamp with time zone,
	"audit_payload" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "access_requests_public_request_id_unique" UNIQUE("public_request_id")
);
--> statement-breakpoint
CREATE INDEX "access_requests_public_id_idx" ON "access_requests" USING btree ("public_request_id");--> statement-breakpoint
CREATE INDEX "access_requests_status_idx" ON "access_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "access_requests_type_idx" ON "access_requests" USING btree ("request_type");--> statement-breakpoint
CREATE INDEX "access_requests_requester_idx" ON "access_requests" USING btree ("requester_clerk_user_id");--> statement-breakpoint
CREATE INDEX "access_requests_created_at_idx" ON "access_requests" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "access_requests" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP POLICY IF EXISTS "access_requests_requester_read" ON "access_requests";
--> statement-breakpoint
CREATE POLICY "access_requests_requester_read" ON "access_requests"
  FOR SELECT USING (
    public.app_can_approve_bridge()
    OR requester_clerk_user_id = public.app_current_clerk_user_id()
  );
--> statement-breakpoint
DROP POLICY IF EXISTS "access_requests_requester_insert" ON "access_requests";
--> statement-breakpoint
CREATE POLICY "access_requests_requester_insert" ON "access_requests"
  FOR INSERT WITH CHECK (
    requester_clerk_user_id = public.app_current_clerk_user_id()
    OR public.app_can_approve_bridge()
  );
--> statement-breakpoint
DROP POLICY IF EXISTS "access_requests_admin_update" ON "access_requests";
--> statement-breakpoint
CREATE POLICY "access_requests_admin_update" ON "access_requests"
  FOR UPDATE USING (public.app_can_approve_bridge())
  WITH CHECK (public.app_can_approve_bridge());

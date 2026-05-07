CREATE TABLE "portal_intake_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_request_id" varchar(80) NOT NULL,
	"intake_type" varchar(80) NOT NULL,
	"status" varchar(80) DEFAULT 'submitted' NOT NULL,
	"risk" varchar(40) DEFAULT 'medium' NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"requester_name" text DEFAULT 'Portal user' NOT NULL,
	"requester_type" varchar(80) DEFAULT 'existing_client' NOT NULL,
	"source_record" text NOT NULL,
	"target_record" text NOT NULL,
	"admin_next_step" text NOT NULL,
	"safe_boundary" text NOT NULL,
	"operator_checklist" jsonb DEFAULT '[]'::jsonb,
	"rollback_note" text NOT NULL,
	"bridge_integration" varchar(120) NOT NULL,
	"bridge_action" varchar(120) NOT NULL,
	"bridge_target_environment" varchar(80) DEFAULT 'production' NOT NULL,
	"bridge_requested_mode" varchar(80) DEFAULT 'dry_run' NOT NULL,
	"submitted_by_clerk_user_id" varchar(128),
	"payload" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portal_intake_requests_public_request_id_unique" UNIQUE("public_request_id")
);
--> statement-breakpoint
CREATE INDEX "portal_intake_requests_public_id_idx" ON "portal_intake_requests" USING btree ("public_request_id");--> statement-breakpoint
CREATE INDEX "portal_intake_requests_status_idx" ON "portal_intake_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "portal_intake_requests_type_idx" ON "portal_intake_requests" USING btree ("intake_type");--> statement-breakpoint
CREATE INDEX "portal_intake_requests_created_at_idx" ON "portal_intake_requests" USING btree ("created_at");

CREATE OR REPLACE FUNCTION public.app_current_clerk_user_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    NULLIF(auth.jwt() ->> 'sub', ''),
    NULLIF(auth.jwt() ->> 'user_id', ''),
    NULLIF(auth.jwt() ->> 'clerk_user_id', '')
  )
$$;
--> statement-breakpoint
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
    WHERE u.clerk_user_id = public.app_current_clerk_user_id()
      AND m.is_active = true
      AND m.role = 'owner'
      AND COALESCE(o.metadata ->> 'workspaceOrganizationId', o.slug) IN ('reala', 'reala-internal')
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
      WHERE u.clerk_user_id = public.app_current_clerk_user_id()
        AND m.is_active = true
        AND m.role IN ('owner', 'ops_admin')
        AND COALESCE(o.metadata ->> 'workspaceOrganizationId', o.slug) IN ('reala', 'reala-internal')
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
        AND m.is_active = true
        AND u.clerk_user_id = public.app_current_clerk_user_id()
    )
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.app_can_access_user(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT public.app_is_reala_super_admin()
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = target_user_id
        AND u.clerk_user_id = public.app_current_clerk_user_id()
    )
    OR EXISTS (
      SELECT 1
      FROM public.memberships mine
      JOIN public.users me ON me.id = mine.user_id
      JOIN public.memberships theirs ON theirs.organization_id = mine.organization_id
      WHERE me.clerk_user_id = public.app_current_clerk_user_id()
        AND mine.is_active = true
        AND theirs.is_active = true
        AND theirs.user_id = target_user_id
    )
$$;
--> statement-breakpoint
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "memberships" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "listings" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "jobs" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "assets" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "appointments" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "print_products" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "print_orders" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "entitlements" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "package_credits" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "matterport_tours" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "storage_folders" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "approval_requests" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "creative_projects" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "integration_sync_runs" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "integration_exceptions" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "portal_intake_requests" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "audit_events" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP POLICY IF EXISTS "organizations_workspace_read" ON "organizations";
--> statement-breakpoint
CREATE POLICY "organizations_workspace_read" ON "organizations"
  FOR SELECT USING (public.app_can_access_organization(id));
--> statement-breakpoint
DROP POLICY IF EXISTS "users_workspace_read" ON "users";
--> statement-breakpoint
CREATE POLICY "users_workspace_read" ON "users"
  FOR SELECT USING (public.app_can_access_user(id));
--> statement-breakpoint
DROP POLICY IF EXISTS "memberships_workspace_read" ON "memberships";
--> statement-breakpoint
CREATE POLICY "memberships_workspace_read" ON "memberships"
  FOR SELECT USING (public.app_can_access_organization(organization_id));
--> statement-breakpoint
DROP POLICY IF EXISTS "portal_intake_requester_read" ON "portal_intake_requests";
--> statement-breakpoint
CREATE POLICY "portal_intake_requester_read" ON "portal_intake_requests"
  FOR SELECT USING (
    public.app_is_reala_super_admin()
    OR submitted_by_clerk_user_id = public.app_current_clerk_user_id()
  );
--> statement-breakpoint
DROP POLICY IF EXISTS "portal_intake_requester_insert" ON "portal_intake_requests";
--> statement-breakpoint
CREATE POLICY "portal_intake_requester_insert" ON "portal_intake_requests"
  FOR INSERT WITH CHECK (
    submitted_by_clerk_user_id = public.app_current_clerk_user_id()
    OR public.app_is_reala_super_admin()
  );
--> statement-breakpoint
DROP POLICY IF EXISTS "portal_intake_admin_update" ON "portal_intake_requests";
--> statement-breakpoint
CREATE POLICY "portal_intake_admin_update" ON "portal_intake_requests"
  FOR UPDATE USING (public.app_can_approve_bridge())
  WITH CHECK (public.app_can_approve_bridge());
--> statement-breakpoint
DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'listings',
    'orders',
    'jobs',
    'assets',
    'appointments',
    'invoices',
    'payments',
    'print_products',
    'print_orders',
    'entitlements',
    'package_credits',
    'matterport_tours',
    'storage_folders',
    'approval_requests',
    'creative_projects',
    'integration_sync_runs',
    'integration_exceptions',
    'audit_events'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_workspace_read', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT USING (public.app_can_access_organization(organization_id))',
      table_name || '_workspace_read',
      table_name
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_workspace_insert', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT WITH CHECK (public.app_can_access_organization(organization_id))',
      table_name || '_workspace_insert',
      table_name
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_workspace_update', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE USING (public.app_can_access_organization(organization_id)) WITH CHECK (public.app_can_access_organization(organization_id))',
      table_name || '_workspace_update',
      table_name
    );
  END LOOP;
END $$;
--> statement-breakpoint
DROP POLICY IF EXISTS "order_items_workspace_read" ON "order_items";
--> statement-breakpoint
CREATE POLICY "order_items_workspace_read" ON "order_items"
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.id = order_items.order_id
        AND public.app_can_access_organization(o.organization_id)
    )
  );
--> statement-breakpoint
DROP POLICY IF EXISTS "order_items_workspace_insert" ON "order_items";
--> statement-breakpoint
CREATE POLICY "order_items_workspace_insert" ON "order_items"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.id = order_items.order_id
        AND public.app_can_access_organization(o.organization_id)
    )
  );
--> statement-breakpoint
DROP POLICY IF EXISTS "order_items_workspace_update" ON "order_items";
--> statement-breakpoint
CREATE POLICY "order_items_workspace_update" ON "order_items"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.id = order_items.order_id
        AND public.app_can_access_organization(o.organization_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.id = order_items.order_id
        AND public.app_can_access_organization(o.organization_id)
    )
  );

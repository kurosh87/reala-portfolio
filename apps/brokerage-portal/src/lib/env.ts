export const portalSupabaseProjectRef =
  process.env.PORTAL_SUPABASE_PROJECT_REF ??
  process.env.NEXT_PUBLIC_PORTAL_SUPABASE_PROJECT_REF

export function assertPortalDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return "postgres://postgres:postgres@127.0.0.1:5432/reala_demo"
    }

    throw new Error("DATABASE_URL is required for portal database access")
  }

  if (
    portalSupabaseProjectRef &&
    !databaseUrl.includes(portalSupabaseProjectRef)
  ) {
    throw new Error(
      "DATABASE_URL must point to the portal Supabase project, not the MLS/read-only project"
    )
  }

  return databaseUrl
}

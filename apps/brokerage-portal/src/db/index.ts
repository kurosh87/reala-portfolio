import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { assertPortalDatabaseUrl } from "@/lib/env"
import * as schema from "../../drizzle/schema"

const globalForDb = globalThis as typeof globalThis & {
  realaSql?: postgres.Sql
}

const connectionString = assertPortalDatabaseUrl()

export const sql =
  globalForDb.realaSql ??
  postgres(connectionString, {
    // Supabase transaction pooler does not support prepared statements.
    prepare: false,
  })

if (process.env.NODE_ENV !== "production") {
  globalForDb.realaSql = sql
}

export const db = drizzle(sql, { schema })

export type Db = typeof db

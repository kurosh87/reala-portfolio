import "dotenv/config"
import { defineConfig } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for Drizzle")
}

if (
  process.env.PORTAL_SUPABASE_PROJECT_REF &&
  !process.env.DATABASE_URL.includes(process.env.PORTAL_SUPABASE_PROJECT_REF)
) {
  throw new Error(
    "DATABASE_URL must point to the portal Supabase project, not the MLS/read-only project"
  )
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})

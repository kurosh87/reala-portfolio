ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "clerkUserId" text;

UPDATE "User"
SET "clerkUserId" = COALESCE("clerkUserId", 'legacy:' || "id"::text)
WHERE "clerkUserId" IS NULL;

ALTER TABLE "User" ALTER COLUMN "clerkUserId" SET NOT NULL;

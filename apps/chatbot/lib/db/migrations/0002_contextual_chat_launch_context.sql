CREATE TABLE IF NOT EXISTS "ChatContext" (
	"chatId" uuid PRIMARY KEY NOT NULL,
	"scopeType" varchar NOT NULL,
	"entityType" varchar(64) NOT NULL,
	"entityId" text,
	"title" text NOT NULL,
	"route" text NOT NULL,
	"snapshot" json NOT NULL,
	"filters" json,
	"timeRange" json,
	"selectedView" text,
	"sourceApp" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
DO $$ BEGIN
 ALTER TABLE "ChatContext" ADD CONSTRAINT "ChatContext_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

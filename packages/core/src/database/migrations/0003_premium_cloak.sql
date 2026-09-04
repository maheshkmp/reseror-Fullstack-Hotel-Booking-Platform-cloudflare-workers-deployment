CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" text DEFAULT 'Reseror' NOT NULL,
	"site_logo" text,
	"site_meta_description" text,
	"seo_keywords_short" text,
	"seo_keywords_long" text,
	"contact_email" text,
	"contact_phone" text,
	"contact_address" text,
	"copyright_text" text,
	"privacy_policy" text,
	"terms_and_conditions" text,
	"booking_policy" text,
	"refund_policy" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "setup" boolean DEFAULT false;
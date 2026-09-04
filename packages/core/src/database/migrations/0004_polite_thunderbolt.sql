ALTER TABLE "hotels" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_slug_unique" UNIQUE("slug");
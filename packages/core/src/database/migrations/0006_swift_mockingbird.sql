ALTER TABLE "restaurants" ADD COLUMN "total_seats" integer;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "allocated_seats" integer;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "breakfast_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "lunch_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "dinner_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "buffet_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "cuisine_type" varchar(255);--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "dress_code" varchar(150);--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "menu_url" varchar(500);
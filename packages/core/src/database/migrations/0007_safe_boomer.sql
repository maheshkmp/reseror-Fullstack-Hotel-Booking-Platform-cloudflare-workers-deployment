ALTER TABLE "affiliate_usage" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "affiliate_usage" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "hotels" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "hotels" ALTER COLUMN "status" SET DEFAULT 'pending_approval';--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "status" SET DEFAULT 'pending_approval';--> statement-breakpoint
ALTER TABLE "room_bookings" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "room_bookings" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "room_rate_plans" ALTER COLUMN "rate_plan_type" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "room_types" ALTER COLUMN "view_type" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "status" SET DEFAULT 'available';--> statement-breakpoint
ALTER TABLE "villas" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "villas" ALTER COLUMN "status" SET DEFAULT 'pending_approval';--> statement-breakpoint
DROP TYPE "public"."affiliate_status";--> statement-breakpoint
DROP TYPE "public"."day_of_week";--> statement-breakpoint
DROP TYPE "public"."hotel_status";--> statement-breakpoint
DROP TYPE "public"."inquiry_status";--> statement-breakpoint
DROP TYPE "public"."media_type";--> statement-breakpoint
DROP TYPE "public"."rate_plan_type";--> statement-breakpoint
DROP TYPE "public"."restaurant_status";--> statement-breakpoint
DROP TYPE "public"."room_booking_status";--> statement-breakpoint
DROP TYPE "public"."room_status";--> statement-breakpoint
DROP TYPE "public"."view_type";--> statement-breakpoint
DROP TYPE "public"."villa_status";
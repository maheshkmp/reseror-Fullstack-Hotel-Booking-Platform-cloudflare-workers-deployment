CREATE TABLE "restaurant_bookings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" text NOT NULL,
	"user_id" text NOT NULL,
	"number_of_chairs" integer NOT NULL,
	"booking_date" timestamp NOT NULL,
	"total_deposit" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"check_in_at" timestamp,
	"refund_id" text,
	"payment_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "hotel_analytics" ALTER COLUMN "hotel_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments_admin" ADD COLUMN "restaurant_booking_id" text;--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD COLUMN "restaurant_booking_id" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "price_per_seat" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "custom_prices" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "ads" ADD COLUMN "is_unique_per_user" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "ads" ADD COLUMN "usage_limit" integer;--> statement-breakpoint
ALTER TABLE "ads" ADD COLUMN "usage_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "ads" ADD COLUMN "min_booking_value" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "restaurant_bookings" ADD CONSTRAINT "restaurant_bookings_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant_bookings" ADD CONSTRAINT "restaurant_bookings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "restaurant_bookings_restaurant_idx" ON "restaurant_bookings" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "restaurant_bookings_user_idx" ON "restaurant_bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "restaurant_bookings_status_idx" ON "restaurant_bookings" USING btree ("status");--> statement-breakpoint
ALTER TABLE "payments_admin" ADD CONSTRAINT "payments_admin_restaurant_booking_id_restaurant_bookings_id_fk" FOREIGN KEY ("restaurant_booking_id") REFERENCES "public"."restaurant_bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD CONSTRAINT "payments_hotel_restaurant_booking_id_restaurant_bookings_id_fk" FOREIGN KEY ("restaurant_booking_id") REFERENCES "public"."restaurant_bookings"("id") ON DELETE no action ON UPDATE no action;
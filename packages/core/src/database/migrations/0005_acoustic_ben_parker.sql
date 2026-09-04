CREATE TYPE "public"."affiliate_status" AS ENUM('pending', 'paid', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('pending', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TABLE "affiliate_usage" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" text NOT NULL,
	"influencer_id" text NOT NULL,
	"user_id" text,
	"commission_amount" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) NOT NULL,
	"status" "affiliate_status" DEFAULT 'pending',
	"payout_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100),
	"icon" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_common_areas" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"area_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_faqs" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_languages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"language_code" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_nearby_pois" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"distance_text" varchar(100),
	"duration_text" varchar(100),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_payment_methods" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"card_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_safety_features" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"feature_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_sustainability" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"initiative_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_transport_parking" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"feature_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "influencers" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"name" varchar(255) NOT NULL,
	"promo_code" varchar(50) NOT NULL,
	"commission_rate" numeric(5, 2) DEFAULT '10.00',
	"discount_rate" numeric(5, 2) DEFAULT '5.00',
	"discount_cap" numeric(10, 2),
	"min_booking_value" numeric(10, 2) DEFAULT '0.00',
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "influencers_promo_code_unique" UNIQUE("promo_code")
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"status" "inquiry_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ads" DROP CONSTRAINT "ads_room_id_rooms_id_fk";
--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "star_rating" SET DATA TYPE numeric(2, 1);--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "star_rating" SET DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "nationality" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "date_of_birth" timestamp;--> statement-breakpoint
ALTER TABLE "hotel_amenities" ADD COLUMN "is_popular" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "formatted_address" text;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "check_in_end" varchar(5);--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "check_out_start" varchar(5);--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "min_age" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "children_allowed" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "extra_beds_available" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "extra_beds_policy" text;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "commission_rate" numeric(10, 2) DEFAULT '10.00';--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "tags" text[] DEFAULT '{}'::text[];--> statement-breakpoint
ALTER TABLE "room_types" ADD COLUMN "is_smoking" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "room_bookings" ADD COLUMN "promo_code" varchar(50);--> statement-breakpoint
ALTER TABLE "room_bookings" ADD COLUMN "discount_amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "room_bookings" ADD COLUMN "influencer_id" text;--> statement-breakpoint
ALTER TABLE "room_bookings" ADD COLUMN "browser_fingerprint" varchar(255);--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD COLUMN "proof" text;--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD COLUMN "bank_name" text;--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD COLUMN "reference_id" text;--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD COLUMN "status" text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "read_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "keywords" text;--> statement-breakpoint
ALTER TABLE "ads" ADD COLUMN "promo_code" varchar(50);--> statement-breakpoint
ALTER TABLE "ads" ADD COLUMN "discount_percent" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "destination" ADD COLUMN "external_link" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "default_commission_rate" numeric(10, 2) DEFAULT '10.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "is_online_payment_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "affiliate_usage" ADD CONSTRAINT "affiliate_usage_booking_id_room_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."room_bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_usage" ADD CONSTRAINT "affiliate_usage_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_usage" ADD CONSTRAINT "affiliate_usage_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_common_areas" ADD CONSTRAINT "hotel_common_areas_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_faqs" ADD CONSTRAINT "hotel_faqs_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_languages" ADD CONSTRAINT "hotel_languages_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_nearby_pois" ADD CONSTRAINT "hotel_nearby_pois_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_payment_methods" ADD CONSTRAINT "hotel_payment_methods_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_safety_features" ADD CONSTRAINT "hotel_safety_features_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_sustainability" ADD CONSTRAINT "hotel_sustainability_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_transport_parking" ADD CONSTRAINT "hotel_transport_parking_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "affiliate_usage_booking_idx" ON "affiliate_usage" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "affiliate_usage_influencer_idx" ON "affiliate_usage" USING btree ("influencer_id");--> statement-breakpoint
CREATE INDEX "affiliate_usage_status_idx" ON "affiliate_usage" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hotel_common_areas_hotel_idx" ON "hotel_common_areas" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_faqs_hotel_idx" ON "hotel_faqs" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_languages_hotel_idx" ON "hotel_languages" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_languages_code_idx" ON "hotel_languages" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "hotel_nearby_pois_hotel_idx" ON "hotel_nearby_pois" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_nearby_pois_type_idx" ON "hotel_nearby_pois" USING btree ("type");--> statement-breakpoint
CREATE INDEX "hotel_payment_methods_hotel_idx" ON "hotel_payment_methods" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_safety_features_hotel_idx" ON "hotel_safety_features" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_safety_features_type_idx" ON "hotel_safety_features" USING btree ("feature_type");--> statement-breakpoint
CREATE INDEX "hotel_sustainability_hotel_idx" ON "hotel_sustainability" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_sustainability_type_idx" ON "hotel_sustainability" USING btree ("initiative_type");--> statement-breakpoint
CREATE INDEX "hotel_transport_parking_hotel_idx" ON "hotel_transport_parking" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_transport_parking_type_idx" ON "hotel_transport_parking" USING btree ("feature_type");--> statement-breakpoint
CREATE INDEX "influencers_promo_code_idx" ON "influencers" USING btree ("promo_code");--> statement-breakpoint
CREATE INDEX "influencers_user_idx" ON "influencers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "influencers_is_active_idx" ON "influencers" USING btree ("is_active");--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_room_id_room_types_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;
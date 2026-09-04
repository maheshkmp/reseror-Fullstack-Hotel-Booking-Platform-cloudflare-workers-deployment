CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'audio', 'document');--> statement-breakpoint
CREATE TYPE "public"."hotel_status" AS ENUM('active', 'inactive', 'under_maintenance', 'pending_approval');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('available', 'occupied', 'maintenance', 'out_of_order', 'dirty');--> statement-breakpoint
CREATE TYPE "public"."view_type" AS ENUM('ocean', 'city', 'garden', 'mountain', 'pool', 'courtyard', 'street', 'interior');--> statement-breakpoint
CREATE TYPE "public"."day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TYPE "public"."rate_plan_type" AS ENUM('standard', 'advance_purchase', 'non_refundable', 'last_minute', 'package');--> statement-breakpoint
CREATE TYPE "public"."room_booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."villa_status" AS ENUM('active', 'inactive', 'under_maintenance', 'pending_approval');--> statement-breakpoint
CREATE TYPE "public"."restaurant_status" AS ENUM('active', 'inactive', 'under_maintenance', 'pending_approval');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tasks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"type" "media_type" NOT NULL,
	"filename" text NOT NULL,
	"size" integer NOT NULL,
	"uploaded_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_amenities" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"amenity_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_images" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"room_type_id" text,
	"image_url" text NOT NULL,
	"alt_text" varchar(255),
	"display_order" integer DEFAULT 0,
	"is_thumbnail" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_policies" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"policy_type" varchar(100) NOT NULL,
	"policy_text" text NOT NULL,
	"effective_date" date DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_types" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100),
	"thumbnail" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"created_by" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"brand_name" varchar(255),
	"street" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100),
	"country" varchar(100) NOT NULL,
	"postal_code" varchar(20),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"phone" varchar(20),
	"email" varchar(255),
	"website" varchar(500),
	"hotel_type" text,
	"star_rating" integer DEFAULT 0,
	"property_class" text,
	"check_in_time" varchar(5) DEFAULT '15:00',
	"check_out_time" varchar(5) DEFAULT '11:00',
	"status" "hotel_status" DEFAULT 'pending_approval' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "property_classes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100),
	"thumbnail" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_type_amenities" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_type_id" text NOT NULL,
	"amenity_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_type_images" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_type_id" text,
	"hotel_id" text NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" varchar(255),
	"display_order" integer DEFAULT 0,
	"is_thumbnail" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_types" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2),
	"base_occupancy" integer DEFAULT 2 NOT NULL,
	"max_occupancy" integer DEFAULT 2 NOT NULL,
	"extra_bed_capacity" integer DEFAULT 0,
	"bed_configuration" jsonb,
	"room_size_sqm" numeric(6, 2),
	"view_type" "view_type",
	"is_active" boolean DEFAULT true NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"room_type_id" text NOT NULL,
	"room_number" varchar(20) NOT NULL,
	"floor_number" integer,
	"is_accessible" boolean DEFAULT false,
	"status" "room_status" DEFAULT 'available' NOT NULL,
	"last_cleaned_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_rate_plans" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_type_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"rate_plan_type" "rate_plan_type" NOT NULL,
	"base_rate" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"min_advance_booking" text,
	"max_advance_booking" text,
	"min_stay_length" text,
	"max_stay_length" text,
	"is_refundable" boolean DEFAULT true,
	"cancellation_deadline" text,
	"valid_from" date NOT NULL,
	"valid_to" date NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_rates" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rate_plan_id" text NOT NULL,
	"rate_date" date NOT NULL,
	"rate" numeric(10, 2) NOT NULL,
	"available_rooms" text,
	"is_closed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_seasonal_rates" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rate_plan_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"monday_rate" numeric(10, 2),
	"tuesday_rate" numeric(10, 2),
	"wednesday_rate" numeric(10, 2),
	"thursday_rate" numeric(10, 2),
	"friday_rate" numeric(10, 2),
	"saturday_rate" numeric(10, 2),
	"sunday_rate" numeric(10, 2),
	"flat_rate" numeric(10, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_availability" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_type_id" text NOT NULL,
	"availability_date" date NOT NULL,
	"total_rooms" integer NOT NULL,
	"booked_rooms" integer DEFAULT 0 NOT NULL,
	"blocked_rooms" integer DEFAULT 0 NOT NULL,
	"available_rooms" integer NOT NULL,
	"is_closed" boolean DEFAULT false,
	"is_closed_for_arrival" boolean DEFAULT false,
	"is_closed_for_departure" boolean DEFAULT false,
	"min_stay_required" integer DEFAULT 1,
	"max_stay_allowed" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_bookings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"room_type_id" text NOT NULL,
	"organization_id" text,
	"created_by" text NOT NULL,
	"rooms" text[] DEFAULT '{}',
	"guest_name" varchar(255) NOT NULL,
	"payment_type" text,
	"guest_email" varchar(255),
	"guest_phone" varchar(50),
	"check_in_date" date,
	"check_in_time" time,
	"check_out_date" date,
	"check_out_time" time,
	"num_rooms" integer DEFAULT 1,
	"num_adults" integer DEFAULT 1,
	"num_children" integer DEFAULT 0,
	"total_amount" numeric(10, 2),
	"commission_amount" numeric(10, 2),
	"net_payable" numeric(10, 2),
	"currency" varchar(10) DEFAULT 'USD',
	"status" "room_booking_status" DEFAULT 'pending',
	"special_requests" text,
	"notes" text,
	"is_paid" boolean DEFAULT false,
	"payment_details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "villa_images" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"villa_id" text NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" varchar(255),
	"display_order" integer DEFAULT 0,
	"is_thumbnail" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "villas" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"created_by" text NOT NULL,
	"hotel_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"brand_name" varchar(255),
	"street" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"phone" varchar(20),
	"email" varchar(255),
	"website" varchar(500),
	"star_rating" integer DEFAULT 0,
	"check_in_time" varchar(5) DEFAULT '15:00',
	"check_out_time" varchar(5) DEFAULT '11:00',
	"status" "villa_status" DEFAULT 'pending_approval' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments_admin" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"booking_id" text,
	"organization_id" text NOT NULL,
	"type" text,
	"method" text,
	"amount" numeric(10, 2) NOT NULL,
	"settled" boolean DEFAULT false,
	"settled_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments_hotel" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"booking_id" text,
	"organization_id" text NOT NULL,
	"type" text,
	"amount" numeric(10, 2) NOT NULL,
	"due_date" date,
	"paid" boolean DEFAULT false,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "restaurant_images" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" text NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" varchar(255),
	"display_order" integer DEFAULT 0,
	"is_thumbnail" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"created_by" text NOT NULL,
	"organization_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"brand_name" varchar(255),
	"buffet_metadata" text,
	"street" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"phone" varchar(20),
	"email" varchar(255),
	"website" varchar(500),
	"star_rating" integer DEFAULT 0,
	"check_in_time" varchar(5) DEFAULT '15:00',
	"check_out_time" varchar(5) DEFAULT '11:00',
	"status" "restaurant_status" DEFAULT 'pending_approval' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "article" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text,
	"user_id" text NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(220),
	"excerpt" text,
	"content" text,
	"featured_image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "article_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "restaurant_tables" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" text NOT NULL,
	"created_by" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"capacity" integer NOT NULL,
	"location" varchar(100),
	"status" varchar(20) DEFAULT 'available',
	"is_reservable" boolean DEFAULT true,
	"min_spend" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_reviews_and_ratings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text,
	"room_id" text,
	"restaurant_id" text,
	"user_id" text,
	"organization_id" text,
	"rating" text NOT NULL,
	"review_title" varchar(255),
	"review_positive_text" text,
	"review_negative_text" text,
	"review_date" date,
	"Property_response" text,
	"stay_date" timestamp,
	"response" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ads" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text,
	"room_id" text,
	"restaurant_id" text,
	"organization_id" text,
	"user_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"redirect_url" text,
	"start_date" date,
	"end_date" date,
	"is_active" boolean DEFAULT true,
	"priority" varchar(50) DEFAULT 'normal',
	"placement" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" text,
	"hotel_id" text,
	"restaurant_id" text,
	"room_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "destination" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text,
	"user_id" text NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(220),
	"content" text,
	"featured_image" text,
	"latitude" double precision,
	"longitude" double precision,
	"category" text,
	"popularity_score" integer DEFAULT 0,
	"recommended" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "destination_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_amenities" ADD CONSTRAINT "hotel_amenities_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_policies" ADD CONSTRAINT "hotel_policies_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_hotel_type_hotel_types_id_fk" FOREIGN KEY ("hotel_type") REFERENCES "public"."hotel_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_property_class_property_classes_id_fk" FOREIGN KEY ("property_class") REFERENCES "public"."property_classes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_amenities" ADD CONSTRAINT "room_type_amenities_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_images" ADD CONSTRAINT "room_type_images_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_images" ADD CONSTRAINT "room_type_images_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_rate_plans" ADD CONSTRAINT "room_rate_plans_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_rates" ADD CONSTRAINT "room_rates_rate_plan_id_room_rate_plans_id_fk" FOREIGN KEY ("rate_plan_id") REFERENCES "public"."room_rate_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_seasonal_rates" ADD CONSTRAINT "room_seasonal_rates_rate_plan_id_room_rate_plans_id_fk" FOREIGN KEY ("rate_plan_id") REFERENCES "public"."room_rate_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_availability" ADD CONSTRAINT "room_availability_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_bookings" ADD CONSTRAINT "room_bookings_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_bookings" ADD CONSTRAINT "room_bookings_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_bookings" ADD CONSTRAINT "room_bookings_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_bookings" ADD CONSTRAINT "room_bookings_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "villa_images" ADD CONSTRAINT "villa_images_villa_id_villas_id_fk" FOREIGN KEY ("villa_id") REFERENCES "public"."villas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "villas" ADD CONSTRAINT "villas_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "villas" ADD CONSTRAINT "villas_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "villas" ADD CONSTRAINT "villas_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_admin" ADD CONSTRAINT "payments_admin_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_admin" ADD CONSTRAINT "payments_admin_booking_id_room_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."room_bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_admin" ADD CONSTRAINT "payments_admin_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD CONSTRAINT "payments_hotel_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD CONSTRAINT "payments_hotel_booking_id_room_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."room_bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_hotel" ADD CONSTRAINT "payments_hotel_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant_images" ADD CONSTRAINT "restaurant_images_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant_tables" ADD CONSTRAINT "restaurant_tables_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant_tables" ADD CONSTRAINT "restaurant_tables_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_reviews_and_ratings" ADD CONSTRAINT "hotel_reviews_and_ratings_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_reviews_and_ratings" ADD CONSTRAINT "hotel_reviews_and_ratings_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_reviews_and_ratings" ADD CONSTRAINT "hotel_reviews_and_ratings_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_reviews_and_ratings" ADD CONSTRAINT "hotel_reviews_and_ratings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_reviews_and_ratings" ADD CONSTRAINT "hotel_reviews_and_ratings_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_room_type_room_types_id_fk" FOREIGN KEY ("room_type") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination" ADD CONSTRAINT "destination_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination" ADD CONSTRAINT "destination_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hotel_amenities_hotel_idx" ON "hotel_amenities" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_amenities_type_idx" ON "hotel_amenities" USING btree ("amenity_type");--> statement-breakpoint
CREATE INDEX "hotel_images_hotel_idx" ON "hotel_images" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_images_room_type_idx" ON "hotel_images" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "hotel_images_display_order_idx" ON "hotel_images" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "hotel_policies_hotel_idx" ON "hotel_policies" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_policies_type_idx" ON "hotel_policies" USING btree ("policy_type");--> statement-breakpoint
CREATE INDEX "hotels_city_idx" ON "hotels" USING btree ("city");--> statement-breakpoint
CREATE INDEX "hotels_location_idx" ON "hotels" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "hotels_status_idx" ON "hotels" USING btree ("status");--> statement-breakpoint
CREATE INDEX "room_type_amenities_room_type_idx" ON "room_type_amenities" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "roomType_images_hotel_idx" ON "room_type_images" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "roomType_images_room_type_idx" ON "room_type_images" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "roomType_images_display_order_idx" ON "room_type_images" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "room_types_hotel_idx" ON "room_types" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "rooms_hotel_idx" ON "rooms" USING btree ("hotel_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rooms_hotel_room_number_idx" ON "rooms" USING btree ("hotel_id","room_number");--> statement-breakpoint
CREATE INDEX "rooms_status_idx" ON "rooms" USING btree ("status");--> statement-breakpoint
CREATE INDEX "room_rate_plans_room_type_idx" ON "room_rate_plans" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "room_rate_plans_dates_idx" ON "room_rate_plans" USING btree ("valid_from","valid_to");--> statement-breakpoint
CREATE INDEX "room_rates_plan_date_idx" ON "room_rates" USING btree ("rate_plan_id","rate_date");--> statement-breakpoint
CREATE INDEX "room_rates_date_idx" ON "room_rates" USING btree ("rate_date");--> statement-breakpoint
CREATE INDEX "room_seasonal_rates_plan_idx" ON "room_seasonal_rates" USING btree ("rate_plan_id");--> statement-breakpoint
CREATE INDEX "room_seasonal_rates_dates_idx" ON "room_seasonal_rates" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX "room_availability_room_type_idx" ON "room_availability" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "room_availability_date_idx" ON "room_availability" USING btree ("availability_date");--> statement-breakpoint
CREATE INDEX "room_availability_room_date_idx" ON "room_availability" USING btree ("room_type_id","availability_date");--> statement-breakpoint
CREATE INDEX "room_bookings_hotel_idx" ON "room_bookings" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "room_bookings_room_type_idx" ON "room_bookings" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "room_bookings_status_idx" ON "room_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "room_bookings_check_in_idx" ON "room_bookings" USING btree ("check_in_date");--> statement-breakpoint
CREATE INDEX "room_bookings_check_out_idx" ON "room_bookings" USING btree ("check_out_date");--> statement-breakpoint
CREATE INDEX "villa_images_villa_idx" ON "villa_images" USING btree ("villa_id");--> statement-breakpoint
CREATE INDEX "villa_images_display_order_idx" ON "villa_images" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "villas_city_idx" ON "villas" USING btree ("city");--> statement-breakpoint
CREATE INDEX "villas_location_idx" ON "villas" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "villas_status_idx" ON "villas" USING btree ("status");--> statement-breakpoint
CREATE INDEX "restaurant_images_restaurant_idx" ON "restaurant_images" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "restaurant_images_display_order_idx" ON "restaurant_images" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "restaurants_city_idx" ON "restaurants" USING btree ("city");--> statement-breakpoint
CREATE INDEX "restaurants_location_idx" ON "restaurants" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "restaurants_status_idx" ON "restaurants" USING btree ("status");--> statement-breakpoint
CREATE INDEX "restaurant_tables_restaurant_idx" ON "restaurant_tables" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "restaurant_tables_status_idx" ON "restaurant_tables" USING btree ("status");
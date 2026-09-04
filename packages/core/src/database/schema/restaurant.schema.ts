import { relations, sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  varchar,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { organization, user } from "./auth.schema";
import { hotels } from "./hotel.schema";

// Core Restaurant & Property Management Tables
export const restaurants = pgTable(
  "restaurants",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: text("created_by")
      .references(() => user.id, { onDelete: "set null" })
      .notNull(),
    organizationId: text("organization_id")
      .references(() => organization.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    brandName: varchar("brand_name", { length: 255 }),
    // Buffet details

    buffetMetadata: text("buffet_metadata"), // e.g., number of items, cuisine types

    // Address fields
    street: varchar("street", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),

    // Contact info
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),
    website: varchar("website", { length: 500 }),

    starRating: decimal("star_rating", { precision: 2, scale: 1 }).default("0.0"),
    // Operational details
    checkInTime: varchar("check_in_time", { length: 5 }).default("15:00"), // HH:MM format
    checkOutTime: varchar("check_out_time", { length: 5 }).default("11:00"), // HH:MM format

    // Capacity & Pricing
    totalSeats: integer("total_seats"),
    allocatedSeats: integer("allocated_seats"),
    breakfastPrice: decimal("breakfast_price", { precision: 10, scale: 2 }),
    lunchPrice: decimal("lunch_price", { precision: 10, scale: 2 }),
    dinnerPrice: decimal("dinner_price", { precision: 10, scale: 2 }),
    buffetPrice: decimal("buffet_price", { precision: 10, scale: 2 }),
    pricePerSeat: decimal("price_per_seat", { precision: 10, scale: 2 }),
    customPrices: jsonb("custom_prices").$type<{ label: string; price: number }[]>().default([]),

    // Descriptive Metadata
    cuisineType: varchar("cuisine_type", { length: 255 }),
    dressCode: varchar("dress_code", { length: 150 }),
    menuUrl: varchar("menu_url", { length: 500 }),

    status: varchar("status", { length: 50 })
      .default("pending_approval")
      .notNull(),

    ...timestamps,
  },
  (table) => [
    index("restaurants_city_idx").on(table.city),
    index("restaurants_location_idx").on(table.latitude, table.longitude),
    index("restaurants_status_idx").on(table.status),
  ]
);

export const restaurantImages = pgTable(
  "restaurant_images",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    restaurantId: text("restaurant_id")
      .references(() => restaurants.id, { onDelete: "cascade" })
      .notNull(),

    imageUrl: text("image_url").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0),
    isThumbnail: boolean("is_thumbnail").default(false),

    ...timestamps,
  },
  (table) => [
    index("restaurant_images_restaurant_idx").on(table.restaurantId),
    index("restaurant_images_display_order_idx").on(table.displayOrder),
  ]
);

export const restaurantBookings = pgTable(
  "restaurant_bookings",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    restaurantId: text("restaurant_id")
      .references(() => restaurants.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    numberOfChairs: integer("number_of_chairs").notNull(),
    bookingDate: timestamp("booking_date").notNull(),
    totalDeposit: decimal("total_deposit", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 50 })
      .default("pending")
      .notNull(), // pending, arrived, no_show, refunded
    checkInAt: timestamp("check_in_at"),
    refundId: text("refund_id"),
    paymentId: text("payment_id"),
    ...timestamps,
  },
  (table) => [
    index("restaurant_bookings_restaurant_idx").on(table.restaurantId),
    index("restaurant_bookings_user_idx").on(table.userId),
    index("restaurant_bookings_status_idx").on(table.status),
  ]
);

export const restaurantRelations = relations(restaurants, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [restaurants.hotelId],
    references: [hotels.id],
  }),
  images: many(restaurantImages),
  bookings: many(restaurantBookings),
}));

export const restaurantBookingRelations = relations(restaurantBookings, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [restaurantBookings.restaurantId],
    references: [restaurants.id],
  }),
  user: one(user, {
    fields: [restaurantBookings.userId],
    references: [user.id],
  }),
}));

export const restaurantImagesRelations = relations(restaurantImages, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [restaurantImages.restaurantId],
    references: [restaurants.id],
  }),
}));

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";
import { hotels } from "./hotel.schema";
import { restaurants } from "./restaurant.schema";
import { rooms, roomTypes } from "./room.schema";

export const ads = pgTable("ads", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // Relations
  hotelId: text("hotel_id").references(() => hotels.id, {
    onDelete: "cascade",
  }),
  roomId: text("room_id").references(() => roomTypes.id, {
    onDelete: "cascade",
  }),
  restaurantId: text("restaurant_id").references(() => restaurants.id, {
    onDelete: "cascade",
  }),

  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),
  // Ad details
  title: varchar("title", { length: 255 }).notNull(), // Short catchy ad title
  description: text("description"), // Detailed ad description
  imageUrl: text("image_url"), // Banner or ad image
  redirectUrl: text("redirect_url"), // Where ad should take user

  // Ad configuration
  startDate: date("start_date"), // Ad campaign start
  endDate: date("end_date"), // Ad campaign end
  isActive: boolean("is_active").default(true), // To toggle ads

  // Optional metadata
  priority: varchar("priority", { length: 50 }).default("normal"), // high, normal, low
  placement: varchar("placement", { length: 100 }), // e.g., homepage, search results, room details

  // Promo / discount
  promoCode: varchar("promo_code", { length: 50 }), // e.g. SUMMER40 — applied at booking checkout
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }), // e.g. 40.00
  isUniquePerUser: boolean("is_unique_per_user").default(false), // true = only once per user
  usageLimit: integer("usage_limit"), // null = unlimited
  usageCount: integer("usage_count").default(0),
  minBookingValue: numeric("min_booking_value", { precision: 10, scale: 2 }).default("0.00"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adsRelations = relations(ads, ({ one }) => ({
  hotel: one(hotels, {
    fields: [ads.hotelId],
    references: [hotels.id],
  }),
  room: one(rooms, {
    fields: [ads.roomId],
    references: [rooms.id],
  }),
  restaurant: one(restaurants, {
    fields: [ads.restaurantId],
    references: [restaurants.id],
  }),
}));


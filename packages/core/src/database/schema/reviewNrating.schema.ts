import { sql } from "drizzle-orm";
import { date, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
// assuming you already have a hotels schema
import { organization, user } from "./auth.schema";
import { hotels } from "./hotel.schema";
import { restaurants } from "./restaurant.schema";
import { rooms } from "./room.schema";

export const reviewNratings = pgTable("hotel_reviews_and_ratings", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  hotelId: text("hotel_id").references(() => hotels.id),
  roomId: text("room_id").references(() => rooms.id),
  restaurantId: text("restaurant_id").references(() => restaurants.id),

  userId: text("user_id").references(() => user.id),
  organizationId: text("organization_id").references(() => organization.id),

  // For example (Booking.com style)//using rating for that
  // 9.0 – 10.0 → Exceptional 🌟🌟🌟🌟
  // 8.0 – 8.9 → Fabulous
  // 7.0 – 7.9 → Good
  // 6.0 – 6.9 → Pleasant
  // Below 6.0 → Various “fair/poor” labels

  rating: text("rating").notNull(), // rating 1–5
  reviewTitle: varchar("review_title", { length: 255 }),
  reviewPositiveText: text("review_positive_text"),
  reviewNegativeText: text("review_negative_text"),
  reviewDate: date("review_date"),
  propertyResponse: text("Property_response"),

  stayDate: timestamp("stay_date"),
  response: text("response"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

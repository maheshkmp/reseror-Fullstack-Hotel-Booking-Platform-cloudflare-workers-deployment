import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { user } from "./auth.schema";
import { hotels } from "./hotel.schema";
import { restaurants } from "./restaurant.schema";
import { roomTypes } from "./room.schema";

export const wishlist = pgTable("wishlist", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),

  hotelId: text("hotel_id").references(() => hotels.id, {
    onDelete: "cascade",
  }),

  restaurantId: text("restaurant_id").references(() => restaurants.id, {
    onDelete: "cascade",
  }),

  roomTypeId: text("room_type").references(() => roomTypes.id, {
    onDelete: "cascade",
  }),

  ...timestamps,
});

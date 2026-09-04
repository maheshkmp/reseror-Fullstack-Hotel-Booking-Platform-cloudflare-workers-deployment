import { sql } from "drizzle-orm";
import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { roomBookings } from "./booking.schema";
import { hotels } from "./hotel.schema";
import { restaurantBookings } from "./restaurant.schema";

export const paymentsAdmin = pgTable("payments_admin", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  hotelId: text("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),
  bookingId: text("booking_id").references(() => roomBookings.id),
  restaurantBookingId: text("restaurant_booking_id").references(() => restaurantBookings.id),
  organizationId: text("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  // Type: incoming from customer (online), or outgoing to hotel
  type: text("type"), // incoming | outgoing

  method: text("method"), // e.g. stripe, bank_transfer, etc.

  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

  // Whether this was settled (monthly batch or manual)
  settled: boolean("settled").default(false),
  settledAt: timestamp("settled_at"),

  createdAt: timestamp("created_at").defaultNow(),
});

import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { roomBookings } from "./booking.schema";
import { hotels } from "./hotel.schema";

export const paymentsAdmin = pgTable("payments_admin", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  hotelId: text("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => roomBookings.id),
  organizationId: text("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  // Type: incoming from customer (online), or outgoing to hotel
  type: text("type").notNull(), // incoming | outgoing

  method: text("method"), // e.g. stripe, bank_transfer, etc.

  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

  // Whether this was settled (monthly batch or manual)
  settled: boolean("settled").default(false),
  settledAt: timestamp("settled_at"),

  createdAt: timestamp("created_at").defaultNow(),
});

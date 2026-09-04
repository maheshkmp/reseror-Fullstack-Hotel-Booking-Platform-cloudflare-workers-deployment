import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { roomBookings } from "./booking.schema";
import { hotels } from "./hotel.schema";

export const paymentsHotel = pgTable("payments_hotel", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  bookingId: integer("booking_id").references(() => roomBookings.id),
  hotelId: text("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),
  // Who is the hotel/org to pay/receive
  organizationId: integer("organization_id")
    .notNull()
    .references(() => organization.id),

  // cash booking = owe commission; online = receive net payout
  type: text("type"), // receive_commission_from_cash | repay_net_from_online

  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

  // Due date for payout or collection
  dueDate: date("due_date"),

  paid: boolean("paid").default(false),
  paidAt: timestamp("paid_at"),

  createdAt: timestamp("created_at").defaultNow(),
});

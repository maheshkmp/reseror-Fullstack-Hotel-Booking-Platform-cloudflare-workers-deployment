import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { roomBookings } from "./booking.schema";
import { hotels } from "./hotel.schema";
import { restaurantBookings } from "./restaurant.schema";

export const paymentsHotel = pgTable("payments_hotel", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  hotelId: text("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),

  bookingId: text("booking_id").references(() => roomBookings.id),
  restaurantBookingId: text("restaurant_booking_id").references(() => restaurantBookings.id),
  // Who is the hotel/org to pay/receive
  organizationId: text("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),

  // cash booking = owe commission; online = receive net payout
  type: text("type"), // receive_commission_from_cash | repay_net_from_online

  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

  // Due date for payout or collection
  dueDate: date("due_date"),

  paid: boolean("paid").default(false),
  paidAt: timestamp("paid_at"),

  proof: text("proof"),
  bankName: text("bank_name"),
  referenceId: text("reference_id"),
  status: text("status").default("pending"), // pending | submitted | confirmed | rejected
  rejectionReason: text("rejection_reason"),

  createdAt: timestamp("created_at").defaultNow(),
});

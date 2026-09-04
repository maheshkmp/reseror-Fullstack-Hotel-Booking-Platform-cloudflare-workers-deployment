import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  time,
  varchar,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";
import { hotels } from "./hotel.schema";
import { roomTypes } from "./room.schema";
import { timestamps } from "./helpers";


export const roomBookings = pgTable(
  "room_bookings",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    roomTypeId: text("room_type_id")
      .references(() => roomTypes.id, { onDelete: "cascade" })
      .notNull(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "cascade",
    }),
    createdBy: text("created_by")
      .references(() => user.id, {
        onDelete: "cascade",
      })
      .notNull(),
    rooms: text("rooms").array().default([]),
    guestName: varchar("guest_name", { length: 255 }).notNull(),
    paymentType: text("payment_type"),
    guestEmail: varchar("guest_email", { length: 255 }),
    guestPhone: varchar("guest_phone", { length: 50 }),
    checkInDate: date("check_in_date"),
    checkInTime: time("check_in_time"),
    checkOutDate: date("check_out_date"),
    checkOutTime: time("check_out_time"),
    numRooms: integer("num_rooms").default(1),
    numAdults: integer("num_adults").default(1),
    numChildren: integer("num_children").default(0),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
    commissionAmount: numeric("commission_amount", { precision: 10, scale: 2 }),
    netPayableToHotel: numeric("net_payable", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 10 }).default("USD"),
    status: varchar("status", { length: 50 }).default("pending"),
    specialRequests: text("special_requests"),
    notes: text("notes"),
    isPaid: boolean("is_paid").default(false),
    paymentDetails: jsonb("payment_details"), // e.g. { method, transactionId, ... }
    promoCode: varchar("promo_code", { length: 50 }),
    discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }),
    influencerId: text("influencer_id"),
    browserFingerprint: varchar("browser_fingerprint", { length: 255 }),
    ...timestamps,
  },
  (table) => [
    index("room_bookings_hotel_idx").on(table.hotelId),
    index("room_bookings_room_type_idx").on(table.roomTypeId),
    index("room_bookings_status_idx").on(table.status),
    index("room_bookings_check_in_idx").on(table.checkInDate),
    index("room_bookings_check_out_idx").on(table.checkOutDate),
  ]
);

import { relations } from "drizzle-orm";

export const roomBookingsRelations = relations(roomBookings, ({ one }) => ({
  hotel: one(hotels, {
    fields: [roomBookings.hotelId],
    references: [hotels.id],
  }),
  roomType: one(roomTypes, {
    fields: [roomBookings.roomTypeId],
    references: [roomTypes.id],
  }),
  guest: one(user, {
    fields: [roomBookings.createdBy],
    references: [user.id],
  }),
}));

import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { hotels } from "./hotel.schema";
import { roomTypes } from "./room.schema";

export const commission = pgTable(
  "commission",
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
    organizationId: text("organization_id")
      .references(() => hotels.organizationId, { onDelete: "cascade" })
      .notNull(),
    commissionValue: decimal("value", { precision: 8, scale: 2 }).notNull(), // e.g. 10.00 for 10% or $10
    currency: varchar("currency", { length: 10 }).default("USD"),
    isActive: boolean("is_active").default(true).notNull(),
    validFrom: date("valid_from"),
    validTo: date("valid_to"),
    ...timestamps,
  },
  (table) => [
    // Add indexes for efficient queries
    index("commission_hotel_idx").on(table.hotelId),
    index("commission_room_type_idx").on(table.roomTypeId),
    index("commission_organization_idx").on(table.organizationId),
    index("commission_is_active_idx").on(table.isActive),
  ]
);

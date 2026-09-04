import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { timestamps } from "./helpers";
import { roomTypes } from "./room.schema";

// Room availability calendar
export const roomAvailability = pgTable(
  "room_availability",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    roomTypeId: text("room_type_id")
      .references(() => roomTypes.id, { onDelete: "cascade" })
      .notNull(),

    availabilityDate: date("availability_date").notNull(),

    // Availability details
    totalRooms: integer("total_rooms").notNull(), // Total rooms of this type available
    bookedRooms: integer("booked_rooms").default(0).notNull(), // Currently booked
    blockedRooms: integer("blocked_rooms").default(0).notNull(), // Maintenance/blocked
    availableRooms: integer("available_rooms").notNull(), // Calculated: total - booked - blocked

    // Stop sell controls
    isClosed: boolean("is_closed").default(false), // Stop sell for this date
    isClosedForArrival: boolean("is_closed_for_arrival").default(false), // No check-ins allowed
    isClosedForDeparture: boolean("is_closed_for_departure").default(false), // No check-outs allowed

    // Minimum stay restrictions
    minStayRequired: integer("min_stay_required").default(1), // Minimum nights stay
    maxStayAllowed: integer("max_stay_allowed"), // Maximum nights stay (null = no limit)

    ...timestamps
  },
  (table) => [
    index("room_availability_room_type_idx").on(table.roomTypeId),
    index("room_availability_date_idx").on(table.availabilityDate),
    index("room_availability_room_date_idx").on(
      table.roomTypeId,
      table.availabilityDate
    )
  ]
);

// Relations
export const roomAvailabilityRelations = relations(
  roomAvailability,
  ({ one }) => ({
    roomType: one(roomTypes, {
      fields: [roomAvailability.roomTypeId],
      references: [roomTypes.id]
    })
  })
);

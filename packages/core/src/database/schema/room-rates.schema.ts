import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  pgTable,
  text,
  varchar
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { timestamps } from "./helpers";
import { roomTypes } from "./room.schema";


// Room rate plans (pricing strategies)
export const roomRatePlans = pgTable(
  "room_rate_plans",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    roomTypeId: text("room_type_id")
      .references(() => roomTypes.id, { onDelete: "cascade" })
      .notNull(),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    ratePlanType: varchar("rate_plan_type", { length: 50 }).notNull(),

    // Base pricing
    baseRate: decimal("base_rate", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),

    // Booking rules
    minAdvanceBooking: text("min_advance_booking"), // e.g., "7 days"
    maxAdvanceBooking: text("max_advance_booking"), // e.g., "365 days"
    minStayLength: text("min_stay_length"), // e.g., "2 nights"
    maxStayLength: text("max_stay_length"), // e.g., "14 nights"

    // Refund policy
    isRefundable: boolean("is_refundable").default(true),
    cancellationDeadline: text("cancellation_deadline"), // e.g., "24 hours"

    // Validity
    validFrom: date("valid_from").notNull(),
    validTo: date("valid_to").notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    ...timestamps
  },
  (table) => [
    index("room_rate_plans_room_type_idx").on(table.roomTypeId),
    index("room_rate_plans_dates_idx").on(table.validFrom, table.validTo)
  ]
);

// Daily rate overrides for specific dates
export const roomRates = pgTable(
  "room_rates",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    ratePlanId: text("rate_plan_id")
      .references(() => roomRatePlans.id, { onDelete: "cascade" })
      .notNull(),

    rateDate: date("rate_date").notNull(),
    rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),

    // Availability
    availableRooms: text("available_rooms"), // Number of rooms available at this rate
    isClosed: boolean("is_closed").default(false), // Stop sell on this date

    ...timestamps
  },
  (table) => [
    index("room_rates_plan_date_idx").on(table.ratePlanId, table.rateDate),
    index("room_rates_date_idx").on(table.rateDate)
  ]
);

// Seasonal pricing rules
export const roomSeasonalRates = pgTable(
  "room_seasonal_rates",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    ratePlanId: text("rate_plan_id")
      .references(() => roomRatePlans.id, { onDelete: "cascade" })
      .notNull(),

    name: varchar("name", { length: 255 }).notNull(), // e.g., "Summer Season", "Holiday Season"

    // Date range
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),

    // Weekly patterns (optional)
    mondayRate: decimal("monday_rate", { precision: 10, scale: 2 }),
    tuesdayRate: decimal("tuesday_rate", { precision: 10, scale: 2 }),
    wednesdayRate: decimal("wednesday_rate", { precision: 10, scale: 2 }),
    thursdayRate: decimal("thursday_rate", { precision: 10, scale: 2 }),
    fridayRate: decimal("friday_rate", { precision: 10, scale: 2 }),
    saturdayRate: decimal("saturday_rate", { precision: 10, scale: 2 }),
    sundayRate: decimal("sunday_rate", { precision: 10, scale: 2 }),

    // Override rate (if weekly pattern not used)
    flatRate: decimal("flat_rate", { precision: 10, scale: 2 }),

    isActive: boolean("is_active").default(true).notNull(),

    ...timestamps
  },
  (table) => [
    index("room_seasonal_rates_plan_idx").on(table.ratePlanId),
    index("room_seasonal_rates_dates_idx").on(table.startDate, table.endDate)
  ]
);

// Relations
export const roomRatePlansRelations = relations(
  roomRatePlans,
  ({ one, many }) => ({
    roomType: one(roomTypes, {
      fields: [roomRatePlans.roomTypeId],
      references: [roomTypes.id]
    }),
    rates: many(roomRates),
    seasonalRates: many(roomSeasonalRates)
  })
);

export const roomRatesRelations = relations(roomRates, ({ one }) => ({
  ratePlan: one(roomRatePlans, {
    fields: [roomRates.ratePlanId],
    references: [roomRatePlans.id]
  })
}));

export const roomSeasonalRatesRelations = relations(
  roomSeasonalRates,
  ({ one }) => ({
    ratePlan: one(roomRatePlans, {
      fields: [roomSeasonalRates.ratePlanId],
      references: [roomRatePlans.id]
    })
  })
);

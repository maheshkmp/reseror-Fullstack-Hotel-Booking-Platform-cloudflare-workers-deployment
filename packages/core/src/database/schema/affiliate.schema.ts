import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { roomBookings } from "./booking.schema";
import { timestamps } from "./helpers";

export const influencers = pgTable(
  "influencers",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    name: varchar("name", { length: 255 }).notNull(),
    promoCode: varchar("promo_code", { length: 50 }).notNull().unique(),
    commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("10.00"), // Influencer percentage
    discountRate: decimal("discount_rate", { precision: 5, scale: 2 }).default("5.00"), // User percentage
    discountCap: numeric("discount_cap", { precision: 10, scale: 2 }),
    minBookingValue: numeric("min_booking_value", { precision: 10, scale: 2 }).default("0.00"),
    isActive: boolean("is_active").default(true).notNull(),
    expiresAt: timestamp("expires_at"),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").default(0),
    ...timestamps,
  },
  (table) => [
    index("influencers_promo_code_idx").on(table.promoCode),
    index("influencers_user_idx").on(table.userId),
    index("influencers_is_active_idx").on(table.isActive),
  ]
);

export const affiliateUsage = pgTable(
  "affiliate_usage",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    bookingId: text("booking_id")
      .references(() => roomBookings.id, { onDelete: "cascade" })
      .notNull(),
    influencerId: text("influencer_id")
      .references(() => influencers.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }), // User who booked
    commissionAmount: numeric("commission_amount", { precision: 10, scale: 2 }).notNull(),
    discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 50, enum: ["pending", "paid", "cancelled"] }).default("pending"),
    payoutDate: timestamp("payout_date"),
    ...timestamps,
  },
  (table) => [
    index("affiliate_usage_booking_idx").on(table.bookingId),
    index("affiliate_usage_influencer_idx").on(table.influencerId),
    index("affiliate_usage_status_idx").on(table.status),
  ]
);

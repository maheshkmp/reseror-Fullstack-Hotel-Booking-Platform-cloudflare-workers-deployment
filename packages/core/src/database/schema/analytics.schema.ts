import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { hotels } from "./hotel.schema";

export const hotelAnalytics = pgTable("hotel_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  hotelId: text("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // 'visit', 'search'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type HotelAnalytics = typeof hotelAnalytics.$inferSelect;
export type HotelAnalyticsInsert = typeof hotelAnalytics.$inferInsert;

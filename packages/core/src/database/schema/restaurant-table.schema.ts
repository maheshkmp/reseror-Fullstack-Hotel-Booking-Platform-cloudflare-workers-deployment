import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { user } from "./auth.schema";
import { restaurants } from "./restaurant.schema";

// Table status enum (optional)
export const tableStatusEnum = [
  "available",
  "reserved",
  "occupied",
  "maintenance",
];

// Restaurant tables schema
export const restaurantTables = pgTable(
  "restaurant_tables",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    restaurantId: text("restaurant_id")
      .references(() => restaurants.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: text("created_by")
      .references(() => user.id)
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(), // Table name or number
    description: text("description"),
    capacity: integer("capacity").notNull(), // Number of seats
    location: varchar("location", { length: 100 }), // e.g. "Window", "Patio"
    status: varchar("status", { length: 20 }).default("available"), // see tableStatusEnum
    isReservable: boolean("is_reservable").default(true),
    minSpend: decimal("min_spend", { precision: 10, scale: 2 }), // optional minimum spend

    ...timestamps,
  },
  (table) => [
    index("restaurant_tables_restaurant_idx").on(table.restaurantId),
    index("restaurant_tables_status_idx").on(table.status),
  ]
);

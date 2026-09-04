import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";


export const inquiries = pgTable(
  "inquiries",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    type: varchar("type", { length: 100 }).notNull(),
    message: text("message").notNull(),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    ...timestamps,
  }
);

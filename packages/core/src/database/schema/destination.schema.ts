import { sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { organization, user } from "./auth.schema";

export const destination = pgTable("destination", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").references(() => organization.id),

  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).unique(),
  content: text("content"),
  featuredImage: text("featured_image"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  category: text("category"),
  externalLink: text("external_link"),
  popularityScore: integer("popularity_score").default(0), // For ranking popular
  recommended: boolean("recommended").default(false), // Flag for recommended

  ...timestamps,
});

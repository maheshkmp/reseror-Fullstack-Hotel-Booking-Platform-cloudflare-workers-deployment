import { sql } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { user } from "./auth.schema";


export const media = pgTable("media", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  type: text("type").notNull(), // image, video, audio, document
  filename: text("filename").notNull(),
  size: integer("size").notNull(),

  uploadedBy: text("uploaded_by").references(() => user.id, {
    onDelete: "set null"
  }),

  ...timestamps
});

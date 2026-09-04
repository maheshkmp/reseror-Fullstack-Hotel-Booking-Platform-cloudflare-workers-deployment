import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { organization, user } from "./auth.schema";

export const articles = pgTable("article", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").references(() => organization.id),

  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  featuredImage: text("featured_image"),
  isPublished: boolean("is_published").default(false),
  readCount: integer("read_count").default(0).notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  ...timestamps,
});

// export const articleImages = pgTable("article_images", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   articleId: text("article_id")
//     .references(() => articles.id, { onDelete: "cascade" })
//     .notNull(),

//   imageUrl: text("image_url").notNull(),
//   altText: varchar("alt_text", { length: 255 }),
//   displayArticle: text("display_article").default("0"),
//   isThumbnail: boolean("is_thumbnail").default(false),
//   updatedAt: timestamp("updated_at").defaultNow(),
//   createdAt: timestamp("created_at").defaultNow(),
// });
// firstName: varchar("first_name", { length: 255 }).notNull(),
// lastName: varchar("last_name", { length: 255 }),
// currentPosition: varchar("current_position", { length: 255 }),
// DOB: date("Date_of_birth"),
// currentWorkplace: varchar("currentWorkplace", { length: 255 }),
// description: text("description"),
// additionalInfo: text("additional_info"),
// tagline: varchar("tagline", { length: 255 }),
// headline: varchar("headline", { length: 255 }),
// about: text("about"),
// location: varchar("location", { length: 255 }),
// profilePhotoUrl: varchar("profile_photo_url", { length: 500 }),
// bannerPhotoUrl: varchar("banner_photo_url", { length: 500 }),
// website: varchar("website", { length: 255 }),
// linkedinUrl: varchar("linkedin_url", { length: 255 }),
// githubUrl: varchar("github_url", { length: 255 }),
// portfolioUrl: varchar("portfolio_url", { length: 255 }),

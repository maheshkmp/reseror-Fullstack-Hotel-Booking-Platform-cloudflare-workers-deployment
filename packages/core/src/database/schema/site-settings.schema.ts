import { pgTable, text, uuid, serial, decimal, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  
  // Site Information
  siteName: text("site_name").notNull().default("Reseror"),
  siteLogo: text("site_logo"),
  siteMetaDescription: text("site_meta_description"),
  seoKeywordsShort: text("seo_keywords_short"),
  seoKeywordsLong: text("seo_keywords_long"),
  
  // Contact Information
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contactAddress: text("contact_address"),
  
  // Copyright
  copyrightText: text("copyright_text"),
  
  // Legal Policies
  privacyPolicy: text("privacy_policy"),
  termsAndConditions: text("terms_and_conditions"),
  bookingPolicy: text("booking_policy"),
  refundPolicy: text("refund_policy"),
  
  // Commission Settings
  defaultCommissionRate: decimal("default_commission_rate", { precision: 10, scale: 2 }).default("10.00").notNull(),

  // Payment Options
  isOnlinePaymentEnabled: boolean("is_online_payment_enabled").default(false).notNull(),

  ...timestamps,
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

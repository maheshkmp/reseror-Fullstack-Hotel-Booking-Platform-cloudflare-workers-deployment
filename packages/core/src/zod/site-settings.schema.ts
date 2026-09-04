import { z } from "zod";

export const siteSettingsSchema = z.object({
  id: z.number(),
  siteName: z.string().min(1, "Site name is required"),
  siteLogo: z.string().nullable().optional(),
  siteMetaDescription: z.string().nullable().optional(),
  seoKeywordsShort: z.string().nullable().optional(),
  seoKeywordsLong: z.string().nullable().optional(),
  contactEmail: z.string().email("Invalid email address").nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  contactAddress: z.string().nullable().optional(),
  copyrightText: z.string().nullable().optional(),
  privacyPolicy: z.string().nullable().optional(),
  termsAndConditions: z.string().nullable().optional(),
  bookingPolicy: z.string().nullable().optional(),
  refundPolicy: z.string().nullable().optional(),
  defaultCommissionRate: z.string().or(z.number()),
  isOnlinePaymentEnabled: z.boolean().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()).nullable(),
});

export const insertSiteSettingsSchema = siteSettingsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSiteSettingsSchema = insertSiteSettingsSchema.partial();

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type UpdateSiteSettings = z.infer<typeof updateSiteSettingsSchema>;

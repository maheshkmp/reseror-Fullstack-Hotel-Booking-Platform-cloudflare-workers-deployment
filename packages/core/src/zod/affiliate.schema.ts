import { z } from "zod";

export const influencerSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  name: z.string(),
  promoCode: z.string(),
  commissionRate: z.string().nullable(),
  discountRate: z.string().nullable(),
  discountCap: z.string().nullable(),
  minBookingValue: z.string().nullable(),
  isActive: z.boolean(),
  expiresAt: z.string().nullable(),
  usageLimit: z.number().nullable(),
  usageCount: z.number().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export const influencerInsertSchema = influencerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true,
});

export const influencerUpdateSchema = influencerInsertSchema.partial();

export const affiliateUsageSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  influencerId: z.string(),
  userId: z.string().nullable(),
  commissionAmount: z.string(),
  discountAmount: z.string(),
  status: z.enum(["pending", "paid", "cancelled"]),
  payoutDate: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type Influencer = z.infer<typeof influencerSchema>;
export type InfluencerInsert = z.infer<typeof influencerInsertSchema>;
export type InfluencerUpdate = z.infer<typeof influencerUpdateSchema>;
export type AffiliateUsage = z.infer<typeof affiliateUsageSchema>;

import { z } from "zod";

export const ad = z.object({
  id: z.string(),
  hotelId: z.string().nullable(),
  roomId: z.string().nullable(),
  restaurantId: z.string().nullable(),
  organizationId: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  redirectUrl: z.string().nullable(),
  startDate: z.coerce.string().nullable(),
  endDate: z.coerce.string().nullable(),
  isActive: z.boolean(),
  priority: z.enum(["high", "normal", "low"]),
  placement: z.string().nullable(),
  // Promo / discount
  promoCode: z.string().max(50).nullable().optional(),
  discountPercent: z.coerce.number().min(0).max(100).nullable().optional(),
  isUniquePerUser: z.boolean().default(false).optional(),
  usageLimit: z.number().int().min(1).nullable().optional(),
  usageCount: z.number().int().default(0).optional(),
  minBookingValue: z.coerce.number().min(0).default(0).optional(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export const adInsertSchema = ad.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  userId: true,
});

export const adUpdateSchema = ad
  .omit({
    id: true,
    organizationId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type adUpdateType = z.infer<typeof adUpdateSchema>;
export type ad = z.infer<typeof ad>;
export type adInsertType = z.infer<typeof adInsertSchema>;

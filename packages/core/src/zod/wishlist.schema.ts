import { z } from "zod";

export const wishlistSchema = z.object({
  id: z.string(),
  createdBy: z.string().nullable(),
  hotelId: z.string().nullable(),
  restaurantId: z.string().nullable(),
  roomTypeId: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export const wishlistInsertSchema = wishlistSchema.omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export const wishlistUpdateSchema = wishlistSchema
  .omit({
    id: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type WishlistUpdateType = z.infer<typeof wishlistUpdateSchema>;
export type Wishlist = z.infer<typeof wishlistSchema>;
export type WishlistInsertType = z.infer<typeof wishlistInsertSchema>;

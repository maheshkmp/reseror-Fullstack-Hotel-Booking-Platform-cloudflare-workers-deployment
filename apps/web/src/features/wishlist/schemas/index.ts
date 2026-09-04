import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { wishlist } from "core/database/schema";
export const wishlistSchema = createSelectSchema(wishlist);

export const wishlistInsertSchema = createInsertSchema(wishlist).omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export const wishlistUpdateSchema = createInsertSchema(wishlist)
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

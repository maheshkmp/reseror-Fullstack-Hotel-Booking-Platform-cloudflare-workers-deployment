import { z } from "zod";
export declare const wishlistSchema: z.ZodObject<{
    id: z.ZodString;
    createdBy: z.ZodNullable<z.ZodString>;
    hotelId: z.ZodNullable<z.ZodString>;
    restaurantId: z.ZodNullable<z.ZodString>;
    roomTypeId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export declare const wishlistInsertSchema: z.ZodObject<{
    hotelId: z.ZodNullable<z.ZodString>;
    roomTypeId: z.ZodNullable<z.ZodString>;
    restaurantId: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const wishlistUpdateSchema: z.ZodObject<{
    hotelId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    roomTypeId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    restaurantId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type WishlistUpdateType = z.infer<typeof wishlistUpdateSchema>;
export type Wishlist = z.infer<typeof wishlistSchema>;
export type WishlistInsertType = z.infer<typeof wishlistInsertSchema>;

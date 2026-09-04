import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { hotelImages, restaurants } from "core/database/schema";

// Hotel Image Schema (to avoid circular dependency)
export const hotelImageSchema = createSelectSchema(hotelImages);

export type HotelImage = z.infer<typeof hotelImageSchema>;

// Restaurants Schemas
export const restaurantSchema = createSelectSchema(restaurants);

export type Restaurant = z.infer<typeof restaurantSchema>;

export const customPricesSchema = z.array(
  z.object({
    label: z.string().min(1, "Label is required"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
  })
).optional().default([]);

export const restaurantInsertSchema = createInsertSchema(restaurants, {
  customPrices: customPricesSchema,
}).omit({
  id: true,
  organizationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type RestaurantInsert = z.infer<typeof restaurantInsertSchema>;

export const restaurantUpdateSchema = createInsertSchema(restaurants, {
  customPrices: customPricesSchema,
})
  .omit({
    id: true,
    createdBy: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type RestaurantUpdate = z.infer<typeof restaurantUpdateSchema>;

export const restaurantWithRelationsSchema = restaurantSchema.extend({});

export type RestaurantWithRelations = z.infer<
  typeof restaurantWithRelationsSchema
>;

// Query Params Schemas
export const restaurantTypeQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
});

export const restaurantQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
  status: z
    .enum(["available", "occupied", "maintenance", "out_of_order", "dirty"])
    .optional(),
  floorNumber: z.string().optional(),
});

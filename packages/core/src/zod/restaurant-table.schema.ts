import { z } from "zod";

export const selectRestaurantTablesSchema = z.object({
  id: z.string(),
  restaurantId: z.string(),
  createdBy: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  capacity: z.number(),
  location: z.string().nullable(),
  status: z.string().nullable(),
  isReservable: z.boolean().nullable(),
  minSpend: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export const insertRestaurantTablesSchema = selectRestaurantTablesSchema.omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
});

export const updateRestaurantTablesSchema = selectRestaurantTablesSchema
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type RestaurantTables = z.infer<typeof selectRestaurantTablesSchema>;

export type InsertRestaurantTables = z.infer<
  typeof insertRestaurantTablesSchema
>;

export type UpdateRestaurantTables = z.infer<
  typeof updateRestaurantTablesSchema
>;

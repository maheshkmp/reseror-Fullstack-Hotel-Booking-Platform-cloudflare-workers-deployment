import { z } from "zod";
export declare const selectRestaurantTablesSchema: z.ZodObject<{
    id: z.ZodString;
    restaurantId: z.ZodString;
    createdBy: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    capacity: z.ZodNumber;
    location: z.ZodNullable<z.ZodString>;
    status: z.ZodNullable<z.ZodString>;
    isReservable: z.ZodNullable<z.ZodBoolean>;
    minSpend: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export declare const insertRestaurantTablesSchema: z.ZodObject<{
    name: z.ZodString;
    status: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    restaurantId: z.ZodString;
    capacity: z.ZodNumber;
    location: z.ZodNullable<z.ZodString>;
    isReservable: z.ZodNullable<z.ZodBoolean>;
    minSpend: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const updateRestaurantTablesSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    restaurantId: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isReservable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    minSpend: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RestaurantTables = z.infer<typeof selectRestaurantTablesSchema>;
export type InsertRestaurantTables = z.infer<typeof insertRestaurantTablesSchema>;
export type UpdateRestaurantTables = z.infer<typeof updateRestaurantTablesSchema>;

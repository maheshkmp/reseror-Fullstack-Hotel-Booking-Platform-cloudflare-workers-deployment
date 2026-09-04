import { z } from "zod";
export declare const amenitySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodNullable<z.ZodString>;
    icon: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type Amenity = z.infer<typeof amenitySchema>;
export declare const amenityInsertSchema: z.ZodObject<{
    name: z.ZodString;
    icon: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const amenityUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;

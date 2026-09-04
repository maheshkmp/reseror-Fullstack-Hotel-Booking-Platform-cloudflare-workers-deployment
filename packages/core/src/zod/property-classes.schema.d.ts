import { z } from "zod";
export declare const propertyClassSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodNullable<z.ZodString>;
    thumbnail: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type PropertyClass = z.infer<typeof propertyClassSchema>;
export declare const propertyClassInsertSchema: z.ZodObject<{
    name: z.ZodString;
    thumbnail: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const propertyClassUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    thumbnail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;

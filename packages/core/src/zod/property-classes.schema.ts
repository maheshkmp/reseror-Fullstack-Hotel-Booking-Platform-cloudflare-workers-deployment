import { z } from "zod";

// Property Class Schemas
export const propertyClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().nullable(),
  thumbnail: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type PropertyClass = z.infer<typeof propertyClassSchema>;

export const propertyClassInsertSchema = propertyClassSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true
});

export const propertyClassUpdateSchema = propertyClassSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    slug: true
  })
  .partial();

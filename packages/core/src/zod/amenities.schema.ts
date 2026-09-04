import { z } from "zod";

// Amenities Schemas (Global pool)
export const amenitySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().nullable(),
  icon: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type Amenity = z.infer<typeof amenitySchema>;

export const amenityInsertSchema = amenitySchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true
});

export const amenityUpdateSchema = amenitySchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    slug: true
  })
  .partial();

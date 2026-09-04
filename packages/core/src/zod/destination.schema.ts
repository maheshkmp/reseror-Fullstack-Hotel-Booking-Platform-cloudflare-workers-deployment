import { destination } from "core/database/schema";
import { z } from "zod";

export const destinations = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  title: z.string(),
  slug: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  category: z.string().optional(),
  externalLink: z.string().optional(),
  popularityScore: z.number().optional(),
  recommended: z.boolean().optional(),

  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export const destinationInsertSchema = destinations.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  userId: true,
});

export const destinationUpdateSchema = destinations
  .omit({
    id: true,
    organizationId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type destinationUpdateType = z.infer<typeof destinationUpdateSchema>;
export type destination = z.infer<typeof destinations>;
export type destinationInsertType = z.infer<typeof destinationInsertSchema>;

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { propertyClasses } from "core/database/schema";

// Property Class Schemas
export const propertyClassSchema = createSelectSchema(propertyClasses);

export type PropertyClass = z.infer<typeof propertyClassSchema>;

export const propertyClassInsertSchema = createInsertSchema(
  propertyClasses
).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const propertyClassUpdateSchema = createInsertSchema(propertyClasses)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    slug: true,
  })
  .partial();

import { destination } from "core/database/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const destinations = createSelectSchema(destination);

export const destinationInsertSchema = createInsertSchema(destination).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  userId: true,
});

export const destinationUpdateSchema = createInsertSchema(destination)
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

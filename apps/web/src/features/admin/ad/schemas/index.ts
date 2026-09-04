import { ads } from "core/database/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const ad = createSelectSchema(ads);

export const adInsertSchema = createInsertSchema(ads).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  userId: true,
});

export const adUpdateSchema = createInsertSchema(ads)
  .omit({
    id: true,
    organizationId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type adUpdateType = z.infer<typeof adUpdateSchema>;
export type ad = z.infer<typeof ad>;
export type adInsertType = z.infer<typeof adInsertSchema>;

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { reviewNratings } from "core/database/schema";

export const reviewNrating = createSelectSchema(reviewNratings);

export const reviewNratingInsertSchema = createInsertSchema(
  reviewNratings
).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  userId: true,

  // Assuming hotelId is part of reviewNratings schema // Assuming reviewId is part of reviewNratings schema
});

export const reviewNratingUpdateSchema = createInsertSchema(reviewNratings)
  .omit({
    id: true,
    organizationId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type reviewNratingUpdateType = z.infer<typeof reviewNratingUpdateSchema>;
export type reviewNrating = z.infer<typeof reviewNrating>;
export type reviewNratingInsertType = z.infer<typeof reviewNratingInsertSchema>;

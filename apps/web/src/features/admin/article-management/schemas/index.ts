import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { articles } from "core/database/schema";
export const article = createSelectSchema(articles);

export const articleInsertSchema = createInsertSchema(articles).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  userId: true,
});

export const articleUpdateSchema = createInsertSchema(articles)
  .omit({
    id: true,
    organizationId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type articleUpdateType = z.infer<typeof articleUpdateSchema>;
export type article = z.infer<typeof article>;
export type articleInsertType = z.infer<typeof articleInsertSchema>;

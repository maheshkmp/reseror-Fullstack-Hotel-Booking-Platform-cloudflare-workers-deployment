import { z } from "zod";

import { articles } from "core/database/schema";
export const article = z.object({
  id: z.string(),
  organizationId: z.string().nullable(),
  userId: z.string(),
  title: z.string(),
  slug: z.string().nullable(),
  excerpt: z.string().nullable(),
  content: z.string().nullable(),
  featuredImage: z.string().nullable(),
  isPublished: z.boolean().default(false),
  readCount: z.number().default(0),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  keywords: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export const articleInsertSchema = article.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  userId: true,
});

export const articleUpdateSchema = article
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

export type NewsArticle = article;

import { eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";


import type { APIRouteHandler } from "@/types";
import { articles } from "core/database/schema";

import type {
  CreateRoute,
  GetByIdRoute,
  GetBySlugRoute,
  IncrementReadCountRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "../routes/article.routes";
import { toKebabCase } from "@/lib/helpers";

// 🔍 List all articles
export const list: APIRouteHandler<ListRoute> = async (c) => {
  const db = c.get("db");
  const results = await db.query.articles.findMany({});
  const page = 1; // or from query params
  const limit = results.length; // or from query params
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / limit);

  return c.json(
    {
      data: results as unknown as any,
      meta: {
        totalCount,
        limit,
        currentPage: page,
        totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create new article
export const create: APIRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const db = c.get("db");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db
    .insert(articles)
    .values({
      ...body,
      slug: body.slug || toKebabCase(body.title),
      organizationId: session.activeOrganizationId,
      userId: session.userId,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted as unknown as any, HttpStatusCodes.CREATED);
};

// 🔍 Get a single article
export const getOne: APIRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");

  const article = await db.query.articles.findFirst({
    where: eq(articles.id, String(id)),
  });

  if (!article) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(article as unknown as any, HttpStatusCodes.OK);
};

// 🔍 Get a single article by slug
export const getBySlug: APIRouteHandler<GetBySlugRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const db = c.get("db");

  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, String(slug)),
  });

  if (!article) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(article as unknown as any, HttpStatusCodes.OK);
};

// 📈 Increment read count
export const incrementReadCount: APIRouteHandler<IncrementReadCountRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");

  const [updated] = await db
    .update(articles)
    .set({
      readCount: sql`${articles.readCount} + 1`,
    })
    .where(eq(articles.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json({ success: true }, HttpStatusCodes.OK);
};

// Update article
export const patch: APIRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("session");
  const db = c.get("db");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [updated] = await db
    .update(articles)
    .set({
      ...updates,
      slug: updates.slug || (updates.title ? toKebabCase(updates.title) : undefined),
      updatedAt: new Date(),
    })
    .where(eq(articles.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated as unknown as any, HttpStatusCodes.OK);
};

//  Delete article
export const remove: APIRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");
  const db = c.get("db");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [deleted] = await db
    .delete(articles)
    .where(eq(articles.id, String(id)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(null, 204 as any) as any;
};

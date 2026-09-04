import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";


import type { APIRouteHandler } from "@/types";
import { wishlist } from "core/database/schema";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "../routes/wishlist.routes";
import { Wishlist, WishlistUpdateType, wishlistSchema, wishlistUpdateSchema } from "core/zod";

// List all wishlist items for current user
export const list: APIRouteHandler<ListRoute> = async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const results = await db.query.wishlist.findMany({
    where: eq(wishlist.createdBy, session.userId),
    orderBy: (wishlist, { desc }) => [desc(wishlist.createdAt)],
  });

  const page = 1;
  const limit = results.length;
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / (limit || 1));

  return c.json(
    {
      data: results as unknown as Wishlist[],
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

// Create new wishlist item
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
    .insert(wishlist)
    .values({
      ...body,
      createdBy: session.userId,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted as unknown as Wishlist, HttpStatusCodes.CREATED);
};

// Get a single wishlist item
export const getOne: APIRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");
  const item = await db.query.wishlist.findFirst({
    where: eq(wishlist.id, String(id)),
  });

  if (!item) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(item as unknown as Wishlist, HttpStatusCodes.OK);
};

// Update wishlist item
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
    .update(wishlist)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(wishlist.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated as unknown as WishlistUpdateType, HttpStatusCodes.OK);
};

// Delete wishlist item
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
    .delete(wishlist)
    .where(eq(wishlist.id, String(id)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(null, 204 as any) as any;
};

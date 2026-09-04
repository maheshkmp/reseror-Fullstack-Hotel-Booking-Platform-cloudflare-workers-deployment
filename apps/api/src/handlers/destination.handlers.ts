import { and, desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";


import type { APIRouteHandler } from "@/types";
import { destination } from "core/database/schema";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "../routes/destination.routes";

export const list: APIRouteHandler<ListRoute> = async (c) => {
  const { search, page = "1", limit = "10" } = c.req.valid("query");
  const db = c.get("db");
  
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const results = await db.query.destination.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike }) => {
      return search ? ilike(fields.title, `%${search}%`) : undefined;
    },
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(destination)
    .where(search ? ilike(destination.title, `%${search}%`) : undefined);

  const [_totalCount] = await totalCountQuery;
  const totalCount = _totalCount?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: results as unknown as any,
      meta: {
        totalCount,
        limit: limitNum,
        currentPage: pageNum,
        totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create new destination
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
    .insert(destination)
    .values({
      ...body,
      organizationId: session.activeOrganizationId,
      userId: session.userId,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted as unknown as any, HttpStatusCodes.CREATED);
};

// 🔍 Get a single destination
export const getOne: APIRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");

  const destinationItem = await db.query.destination.findFirst({
    where: eq(destination.id, String(id)),
  });

  if (!destinationItem) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(destinationItem as unknown as any, HttpStatusCodes.OK);
};

// Update destination
export const patch: APIRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("user");
  const db = c.get("db");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [updated] = await db
    .update(destination)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(destination.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated as unknown as any, HttpStatusCodes.OK);
};

//  Delete destination
export const remove: APIRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("user") as { organizationId?: string } | undefined;
  const db = c.get("db");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  return c.json(null, 204 as any) as any;
};

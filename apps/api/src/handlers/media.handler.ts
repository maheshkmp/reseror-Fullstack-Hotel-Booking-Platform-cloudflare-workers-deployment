import { and, desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { media } from "core/database/schema";
import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute
} from "../routes/media.routes";

// List media route handler
export const list: APIRouteHandler<ListRoute> = async (c) => {
  const session = c.get("session");
  const db = c.get("db");
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search
  } = c.req.valid("query");

  // Check authentication
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;


  // Build query conditions
  const query = db.query.media.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, eq }) => {
      const conditions = [];

      conditions.push(eq(fields.uploadedBy, session.userId));

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(fields.filename, `%${search}%`));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      // Handle sorting direction
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }
      return desc(fields.createdAt);
    }
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(media)
    .where(() => {
      const conditions = [];

      conditions.push(eq(media.uploadedBy, session.userId));

      if (search) {
        conditions.push(ilike(media.filename, `%${search}%`));
      }

      return conditions.length ? and(...conditions) : undefined;
    });

  const [mediaEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: mediaEntries as unknown as any,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    },
    HttpStatusCodes.OK
  );
};

// Get media by ID handler
export const getById: APIRouteHandler<GetByIdRoute> = async (c) => {
  const params = c.req.param();
  const session = c.get("session");
  const db = c.get("db");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const selectMedia = await db.query.media.findFirst({
    where(fields, { eq, and }) {
      const conditions = [];

      conditions.push(eq(fields.id, params.id));

      return conditions.length ? and(...conditions) : undefined;
    }
  });

  if (!selectMedia) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(selectMedia as unknown as any, HttpStatusCodes.OK);
};

// Create media
export const create: APIRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const db = c.get("db");
  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db
    .insert(media)
    .values({ ...body, uploadedBy: session.userId })
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: "Media not created"
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(inserted as unknown as any, HttpStatusCodes.CREATED);
};

// Update Media
export const update: APIRouteHandler<UpdateRoute> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [updated] = await db
    .update(media)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(media.id, params.id))
    .returning();

  if (!updated) {
    return c.json({ message: "Media not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(updated as unknown as any, HttpStatusCodes.OK);
};

// Delete Handler
export const remove: APIRouteHandler<RemoveRoute> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [deleted] = await db
    .delete(media)
    .where(eq(media.id, params.id))
    .returning();

  if (!deleted) {
    return c.json({ message: "Media not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "Media deleted successfully" }, HttpStatusCodes.OK);
};

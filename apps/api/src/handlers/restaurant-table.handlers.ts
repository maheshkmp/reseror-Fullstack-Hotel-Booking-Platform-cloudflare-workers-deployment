import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";


import type { APIRouteHandler } from "@/types";
import { restaurantTables } from "core/database/schema";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "../routes/restaurant-table.routes";

// Price fields that require admin access
const PRICE_FIELDS = ["minSpend"] as const;

// Check if object contains any price fields with actual values (not null/undefined)
const hasPriceFields = (obj: Record<string, any>): boolean => {
  return PRICE_FIELDS.some((field) => field in obj && obj[field] !== null && obj[field] !== undefined && obj[field] !== "");
};

// List restaurant tables route handler
export const list: APIRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;
  const db = c.get("db");
  // Build query conditions
  const query = db.query.restaurantTables.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or, eq }) => {
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            ilike(fields.name, `%${search}%`),
            ilike(fields.description, `%${search}%`),
            ilike(fields.location, `%${search}%`)
          )
        );
      }

      // if (restaurantId) {
      //   conditions.push(eq(fields.restaurantId, restaurantId));
      // }

      // if (status) {
      //   conditions.push(eq(fields.status, status));
      // }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }
      return desc(fields.createdAt);
    },
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(restaurantTables)
    .where(
      (() => {
        const conditions = [];

        if (search) {
          conditions.push(
            or(
              ilike(restaurantTables.name, `%${search}%`),
              ilike(restaurantTables.description, `%${search}%`),
              ilike(restaurantTables.location, `%${search}%`)
            )
          );
        }

        // if (restaurantId) {
        //   conditions.push(eq(restaurantTables.restaurantId, restaurantId));
        // }

        // if (status) {
        //   conditions.push(eq(restaurantTables.status, status));
        // }

        return conditions.length ? and(...conditions) : undefined;
      })()
    );

  const [tableEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  // Normalize data
  const normalizedEntries = tableEntries.map((entry) => ({
    ...entry,
    id: entry.id ?? "",
    name: entry.name ?? "",
    description: entry.description ?? null,
    restaurantId: entry.restaurantId ?? "",
    capacity: entry.capacity ?? 0,
    location: entry.location ?? "",
    status: entry.status ?? "available",
    isReservable: entry.isReservable ?? true,
    minSpend: entry.minSpend ?? null,
    createdAt:
      entry.createdAt instanceof Date
        ? entry.createdAt.toISOString()
        : entry.createdAt,
    updatedAt: entry.updatedAt
      ? entry.updatedAt instanceof Date
        ? entry.updatedAt.toISOString()
        : entry.updatedAt
      : null,
  }));

  return c.json(
    {
      data: normalizedEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create restaurant table route handler
export const create: APIRouteHandler<CreateRoute> = async (c) => {
  const tableEntry = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if user is trying to set price fields without admin role
  if (user && user.role !== "admin" && hasPriceFields(tableEntry)) {
    return c.json(
      { message: "Only admins can set table seat prices" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const insertData = {
    ...tableEntry,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: session.userId,
  };

  const [inserted] = await db
    .insert(restaurantTables)
    .values(insertData)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single restaurant table route handler
export const getOne: APIRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");
  const tableEntry = await db.query.restaurantTables.findFirst({
    where: eq(restaurantTables.id, id),
  });

  if (!tableEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  const normalizedEntry = {
    ...tableEntry,
    id: tableEntry.id ?? "",
    name: tableEntry.name ?? "",
    description: tableEntry.description ?? null,
    restaurantId: tableEntry.restaurantId ?? "",
    capacity: tableEntry.capacity ?? 0,
    location: tableEntry.location ?? "",
    status: tableEntry.status ?? "available",
    isReservable: tableEntry.isReservable ?? true,
    minSpend: tableEntry.minSpend ?? null,
    createdAt:
      tableEntry.createdAt instanceof Date
        ? tableEntry.createdAt.toISOString()
        : tableEntry.createdAt,
    updatedAt: tableEntry.updatedAt
      ? tableEntry.updatedAt instanceof Date
        ? tableEntry.updatedAt.toISOString()
        : tableEntry.updatedAt
      : null,
  };

  return c.json(normalizedEntry, HttpStatusCodes.OK);
};

// Update restaurant table route handler
export const update: APIRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if user is trying to update price fields without admin role
  if (user && user.role !== "admin" && hasPriceFields(body)) {
    return c.json(
      { message: "Only admins can manage table seat prices" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const existingEntry = await db.query.restaurantTables.findFirst({
    where: eq(restaurantTables.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const updateData = {
    ...body,
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(restaurantTables)
    .set(updateData)
    .where(eq(restaurantTables.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete restaurant table route handler
export const remove: APIRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");
  const db = c.get("db");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingEntry = await db.query.restaurantTables.findFirst({
    where: eq(restaurantTables.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(restaurantTables).where(eq(restaurantTables.id, id));

  return c.json(
    { message: "Restaurant table deleted successfully" },
    HttpStatusCodes.OK
  );
};

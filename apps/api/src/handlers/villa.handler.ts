import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { hotels, villas } from "core/database/schema";
import type {
  CreateVillaRoute,
  DeleteVillaRoute,
  GetVillaRoute,
  ListVillasRoute,
  UpdateVillaRoute,
} from "../routes/villa.routes";

// List villas handler
export const listVillasHandler: APIRouteHandler<ListVillasRoute> = async (
  c
) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    hotelId,
    status,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [];

  if (hotelId) {
    whereConditions.push(eq(villas.hotelId, hotelId));
  }

  if (status) {
    // Only allow valid enum values for villas.status
    const validStatus: (
      | "active"
      | "inactive"
      | "under_maintenance"
      | "pending_approval"
    )[] = ["active", "inactive", "under_maintenance", "pending_approval"];
    if (validStatus.includes(status as any)) {
      whereConditions.push(
        eq(villas.status, status as (typeof validStatus)[number])
      );
    }
    // Optionally, you can handle invalid status values here (e.g., ignore or throw error)
  }
  const db = c.get("db");

  const query = db.query.villas.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort === "asc" ? [fields.name] : [sql`${fields.name} DESC`],
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(villas)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [villaEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: villaEntries as any,
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

// Get villa handler
export const getVillaHandler: APIRouteHandler<GetVillaRoute> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const villa = await db.query.villas.findFirst({
    where: eq(villas.id, params.id),
  });

  if (!villa) {
    return c.json({ message: "Villa not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(villa as any, HttpStatusCodes.OK);
};

// Create villa handler
export const createVillaHandler: APIRouteHandler<CreateVillaRoute> = async (
  c
) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");
  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Verify hotel exists and user has access
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, body.hotelId),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check permissions
  if (user.role !== "admin" && hotel.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Check if villa number already exists in the hotel
  const existingVilla = await db.query.villas.findFirst({
    where: and(eq(villas.hotelId, body.hotelId), eq(villas.city, body.city)),
  });

  if (existingVilla) {
    return c.json(
      { message: "Villa number already exists in this hotel" },
      HttpStatusCodes.CONFLICT
    );
  }

  // Add organizationId and createdBy from session/user
  const villaData = {
    ...body,
    organizationId: session.activeOrganizationId ?? "",
    createdBy: user.id,
  };

  const [inserted] = await db.insert(villas).values(villaData).returning();

  return c.json(inserted as any, HttpStatusCodes.CREATED);
};

// Update villa handler
export const updateVillaHandler: APIRouteHandler<UpdateVillaRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Get villa
  const villa = await db.query.villas.findFirst({
    where: eq(villas.id, params.id),
  });

  if (!villa) {
    return c.json({ message: "Villa not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check permissions
  if (user.role !== "admin" && villa.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(villas)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(villas.id, params.id))
    .returning();

  return c.json(updated as any, HttpStatusCodes.OK);
};

// Delete villa handler
export const deleteVillaHandler: APIRouteHandler<DeleteVillaRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Get villa
  const villa = await db.query.villas.findFirst({
    where: eq(villas.id, params.id),
  });

  if (!villa) {
    return c.json({ message: "Villa not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check permissions
  if (user.role !== "admin" && villa.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(villas).where(eq(villas.id, params.id));

  return c.json({ message: "Villa deleted successfully" }, HttpStatusCodes.OK);
};

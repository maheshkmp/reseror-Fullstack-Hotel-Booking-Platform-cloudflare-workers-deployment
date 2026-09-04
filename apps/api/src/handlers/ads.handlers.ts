import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { APIRouteHandler } from "@/types";
import { ads, hotels, user as userTable } from "core/database/schema";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "../routes/ads.routes";

// 🔍 List all ads
export const list: APIRouteHandler<ListRoute> = async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const { 
    page = "1", 
    limit = "10", 
    search, 
    sort = "desc",
    ownerType 
  } = c.req.valid("query") as any;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  // Base query conditions
  const conditions = [];
  
  if (user && user.role !== "admin") {
    const activeOrgId = c.get("session")?.activeOrganizationId;
    if (activeOrgId) {
      conditions.push(
        or(
          eq(ads.organizationId, activeOrgId),
          eq(ads.userId, user.id)
        )
      );
    } else {
      conditions.push(eq(ads.userId, user.id));
    }
  }

  // Handle ownerType filter by creator role
  if (ownerType === "admin") {
    conditions.push(eq(userTable.role, "admin"));
  } else if (ownerType === "hotel") {
    conditions.push(sql`${userTable.role} != 'admin'`);
  }

  // Search filter
  if (search) {
    conditions.push(ilike(ads.title, `%${search}%`));
  }

  const finalWhere = conditions.length > 0 ? and(...conditions) : undefined;

  const [results, countData] = await Promise.all([
    db
      .select({
        ads: ads,
        hotel: hotels,
        creatorRole: userTable.role,
      })
      .from(ads)
      .innerJoin(userTable, eq(ads.userId, userTable.id))
      .leftJoin(hotels, eq(ads.hotelId, hotels.id))
      .where(finalWhere)
      .limit(limitNum)
      .offset(offset)
      .orderBy(sort === "desc" ? desc(ads.createdAt) : ads.createdAt),
    db.select({ count: sql<number>`count(*)` })
      .from(ads)
      .innerJoin(userTable, eq(ads.userId, userTable.id))
      .where(finalWhere)
  ]);

  const formattedResults = results.map(r => ({
    ...r.ads,
    hotel: r.hotel,
    creatorRole: r.creatorRole,
  }));

  const totalCount = Number(countData[0]?.count || 0);
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: formattedResults as any,
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

// Create new ad
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

  // Normalize empty strings to null for relational fields
  const sanitizedBody = {
    ...body,
    hotelId: body.hotelId?.trim() || null,
    roomId: body.roomId?.trim() || null,
    restaurantId: body.restaurantId?.trim() || null,
    placement: body.placement?.trim() || null,
    imageUrl: body.imageUrl?.trim() || null,
    redirectUrl: body.redirectUrl?.trim() || null,
  };

  const organizationId = session.activeOrganizationId?.trim() || null;

  const [inserted] = await db
    .insert(ads)
    .values({
      ...sanitizedBody,
      organizationId,
      userId: session.userId,
      createdAt: new Date(),
    } as any)
    .returning();

  return c.json(inserted as unknown as any, HttpStatusCodes.CREATED);
};

// 🔍 Get a single ad
export const getOne: APIRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");

  const adItem = await db.query.ads.findFirst({
    where: eq(ads.id, String(id)),
  });

  if (!adItem) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(adItem as unknown as any, HttpStatusCodes.OK);
};


// Update ad
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

  // Normalize empty strings to null for relational fields
  const sanitizedUpdates = {
    ...updates,
    hotelId: updates.hotelId === undefined ? undefined : (updates.hotelId?.trim() || null),
    roomId: updates.roomId === undefined ? undefined : (updates.roomId?.trim() || null),
    restaurantId: updates.restaurantId === undefined ? undefined : (updates.restaurantId?.trim() || null),
  };

  const [updated] = await db
    .update(ads)
    .set({
      ...sanitizedUpdates,
      updatedAt: new Date(),
    } as any)
    .where(eq(ads.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated as unknown as any, HttpStatusCodes.OK);
};

//  Delete ad
export const remove: APIRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  const db = c.get("db");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if user has permission to delete this ad
  const adItem = await db.query.ads.findFirst({
    where: eq(ads.id, String(id)),
  });

  if (!adItem) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  if (user.role !== "admin" && adItem.userId !== user.id) {
    // Also check organization membership
    const activeOrgId = c.get("session")?.activeOrganizationId;
    if (adItem.organizationId !== activeOrgId) {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }
  }

  await db.delete(ads).where(eq(ads.id, String(id)));

  return c.json(null, 204 as any) as any;
};

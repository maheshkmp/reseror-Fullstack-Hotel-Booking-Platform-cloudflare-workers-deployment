import { and, eq, sql, ilike } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { hotels, restaurants } from "core/database/schema";
import type {
  CreateRestaurantRoute,
  DeleteRestaurantRoute,
  GetMyRestaurantsRoute,
  GetRestaurantRoute,
  ListRestaurantsRoute,
  UpdateRestaurantRoute,
} from "../routes/restaurant.routes";

// Price fields that require admin access
const PRICE_FIELDS = ["breakfastPrice", "lunchPrice", "dinnerPrice", "buffetPrice"] as const;

// Check if object contains any price fields with actual values (not null/undefined)
const hasPriceFields = (obj: Record<string, any>): boolean => {
  return PRICE_FIELDS.some((field) => field in obj && obj[field] !== null && obj[field] !== undefined && obj[field] !== "");
};


// List restaurants handler
export const listRestaurantsHandler: APIRouteHandler<
  ListRestaurantsRoute
> = async (c) => {
  console.log("Entering listRestaurantsHandler...");
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search,
    hotelId,
    status,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;
  const db = c.get("db");

  try {
    const restaurantEntries = await db.query.restaurants.findMany({
      limit: limitNum,
      offset,
      where: (fields, { and, eq, ilike, or }) => {
        const conditions = [];
        if (hotelId) conditions.push(eq(fields.hotelId, hotelId));
        
        if (status) {
          conditions.push(eq(fields.status, status as any));
        } else {
          // Default filtering for public users
          const session = c.get("session");
          const user = c.get("user");
          
          if (!session || !user) {
            conditions.push(eq(fields.status, "active"));
          } else {
            const isAdmin = user.role === "admin";
            if (!isAdmin) {
              const activeOrgId = session.activeOrganizationId;
              if (activeOrgId) {
                conditions.push(
                  or(
                    eq(fields.status, "active"),
                    eq(fields.organizationId, activeOrgId),
                    eq(fields.createdBy, user.id)
                  )
                );
              } else {
                conditions.push(
                  or(
                    eq(fields.status, "active"),
                    eq(fields.createdBy, user.id)
                  )
                );
              }
            }
          }
        }

        if (search) conditions.push(ilike(fields.name, `%${search}%`));
        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      orderBy: (fields, { asc, desc }) =>
        sort === "asc" ? [asc(fields.name)] : [desc(fields.name)],
    });

    const totalCountQuery = await db
      .select({ count: sql<string>`count(*)` })
      .from(restaurants)
      .where(and(
        hotelId ? eq(restaurants.hotelId, hotelId) : undefined,
        status ? eq(restaurants.status, status as any) : undefined,
        search ? ilike(restaurants.name, `%${search}%`) : undefined
      ));

    const totalCount = parseInt(totalCountQuery[0]?.count || "0");
    const totalPages = Math.ceil(totalCount / limitNum);

    return c.json(
      {
        data: restaurantEntries.map((r) => ({
          ...r,
          starRating: r.starRating ? r.starRating.toString() : null,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
        })) as any,
        meta: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
        },
      },
      HttpStatusCodes.OK
    );
  } catch (error: any) {
    console.error("Error in listRestaurantsHandler:", error);
    return c.json(
      { message: error.message || "Failed to list restaurants" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Get restaurant handler
export const getRestaurantHandler: APIRouteHandler<GetRestaurantRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const restaurant = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, params.id),
  });

  if (!restaurant) {
    return c.json(
      { message: "Restaurant not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    {
      ...restaurant,
      starRating: restaurant.starRating ? restaurant.starRating.toString() : null,
      createdAt: restaurant.createdAt.toISOString(),
      updatedAt: restaurant.updatedAt ? restaurant.updatedAt.toISOString() : null,
    } as any,
    HttpStatusCodes.OK
  );
};

// Create restaurant handler
export const createRestaurantHandler: APIRouteHandler<
  CreateRestaurantRoute
> = async (c) => {
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

  // Check if user is trying to set price fields without admin role
  if (user.role !== "admin" && hasPriceFields(body)) {
    return c.json(
      { message: "Only admins can set restaurant seat prices" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Verify hotel exists and user has access
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, body.hotelId),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check permissions: admin, creator, or same organization
  if (
    user.role !== "admin" &&
    hotel.createdBy !== user.id &&
    hotel.organizationId !== session.activeOrganizationId
  ) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Check if restaurant with same name already exists in the same hotel
  const existingRestaurant = await db.query.restaurants.findFirst({
    where: and(
      eq(restaurants.hotelId, body.hotelId),
      eq(restaurants.name, body.name)
    ),
  });

  if (existingRestaurant) {
    return c.json(
      { message: "A restaurant with this name already exists in your hotel" },
      HttpStatusCodes.CONFLICT
    );
  }

  // Add organizationId and createdBy from session/user
  let organizationId = session.activeOrganizationId;

  if (!organizationId) {
    const member = await db.query.member.findFirst({
      where: (fields, { eq }) => eq(fields.userId, user.id),
    });
    organizationId = member?.organizationId || "";
  }

  const restaurantData = {
    ...body,
    organizationId: organizationId,
    createdBy: user.id,
    status: hotel.status === "active" ? "active" : "pending_approval", // Bypass approval if hotel is active
  };

  try {
    const [inserted] = await db
      .insert(restaurants)
      .values(restaurantData)
      .returning();
    return c.json(
      {
        ...inserted,
        starRating: inserted.starRating ? inserted.starRating.toString() : null,
        createdAt: inserted.createdAt.toISOString(),
        updatedAt: inserted.updatedAt ? inserted.updatedAt.toISOString() : null,
      } as any,
      HttpStatusCodes.CREATED
    );
  } catch (error: any) {
    console.error("Error creating restaurant:", error);
    return c.json(
      { message: error.message || "Failed to create restaurant" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Update restaurant handler
export const updateRestaurantHandler: APIRouteHandler<
  UpdateRestaurantRoute
> = async (c) => {
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

  // Check if user is trying to update price fields without admin role
  if (user.role !== "admin" && hasPriceFields(body)) {
    return c.json(
      { message: "Only admins can manage restaurant seat prices" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Get restaurant
  const restaurant = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, params.id),
  });

  if (!restaurant) {
    return c.json(
      { message: "Restaurant not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions: admin, creator, or same organization
  if (
    user.role !== "admin" &&
    restaurant.createdBy !== user.id &&
    restaurant.organizationId !== session.activeOrganizationId
  ) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(restaurants)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(restaurants.id, params.id))
    .returning();

  return c.json(
    {
      ...updated,
      starRating: updated.starRating ? updated.starRating.toString() : null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt ? updated.updatedAt.toISOString() : null,
    } as any,
    HttpStatusCodes.OK
  );
};

// Delete restaurant handler
export const deleteRestaurantHandler: APIRouteHandler<
  DeleteRestaurantRoute
> = async (c) => {
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

  // Get restaurant
  const restaurant = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, params.id),
  });

  if (!restaurant) {
    return c.json(
      { message: "Restaurant not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions: admin, creator, or same organization
  if (
    user.role !== "admin" &&
    restaurant.createdBy !== user.id &&
    restaurant.organizationId !== session.activeOrganizationId
  ) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(restaurants).where(eq(restaurants.id, params.id));

  return c.json(
    { message: "Restaurant deleted successfully" },
    HttpStatusCodes.OK
  );
};

// Get my restaurants handler (all created by user id from session)
export const getMyRestaurantsHandler: APIRouteHandler<
  GetMyRestaurantsRoute
> = async (c) => {
  const session = c.get("session");
  const userId = session?.userId;
  const db = c.get("db");

  if (!session || !userId)
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );

  // Find all restaurants by createdBy
  const myRestaurants = await db.query.restaurants.findMany({
    where: (fields, { eq }) => eq(fields.createdBy, userId),
  });

  return c.json(
    myRestaurants.map((r) => ({
      ...r,
      starRating: r.starRating ? r.starRating.toString() : null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
    })) as any,
    HttpStatusCodes.OK
  );
};

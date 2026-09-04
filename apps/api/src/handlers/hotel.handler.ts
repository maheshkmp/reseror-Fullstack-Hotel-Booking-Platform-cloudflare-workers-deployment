/* eslint-disable prefer-const */
import { and, desc, eq, ilike, sql, or, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { toKebabCase } from "@/lib/helpers";
import { hotelTypes, hotels, member, roomTypes, rooms, roomTypeImages, user as userTable, roomBookings, paymentsHotel, hotelAnalytics } from "core/database/schema";
import { PropertyClass } from "core/zod";
import type {
  CreateHotelTypeRoute,
  CreateNewHotelByAdminRoute,
  CreateNewHotelRoute,
  GetHotelByIdRoute,
  GetHotelPerformanceRoute,
  GetHotelRoomTypesRoute,
  GetHotelRoomsRoute,
  GetMyHotelRoute,
  ListAllHotelsRoute,
  ListHotelTypesRoute,
  RemoveHotelRoute,
  RemoveHotelTypeRoute,
  UpdateHotelRoute,
  UpdateHotelTypeRoute,
  ExportHotelsRoute,
  ImportHotelsRoute,
  DownloadHotelTemplateRoute,
} from "../routes/hotel.routes";
import { jsonToExcelBuffer, excelBufferToJson } from "@/lib/excel.utils";
import { HotelSelectType, HotelType } from "core/zod";

/**
 * ================================================================
 * Hotel Types Handlers
 * ================================================================
 */
// List hotel types route handler
export const listHotelTypesHandler: APIRouteHandler<
  ListHotelTypesRoute
> = async (c) => {
  const db = c.get("db");
  const allHotelTypes = await db.query.hotelTypes.findMany({});

  return c.json(allHotelTypes, HttpStatusCodes.OK);
};

// Create hotel type route handler
export const createHotelTypeHandler: APIRouteHandler<
  CreateHotelTypeRoute
> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [inserted] = await db
    .insert(hotelTypes)
    .values({ ...body, slug: toKebabCase(body.name) })
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: "Could not create property type",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update hotel type route handler
export const updateHotelTypeHandler: APIRouteHandler<
  UpdateHotelTypeRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(hotelTypes)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(hotelTypes.id, params.id))
    .returning();

  if (!updated) {
    return c.json(
      { message: "Property type does not exist" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete hotel type Handler
export const removeHotelTypeHandler: APIRouteHandler<
  RemoveHotelTypeRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [deleted] = await db
    .delete(hotelTypes)
    .where(eq(hotelTypes.id, params.id))
    .returning();

  if (!deleted) {
    return c.json(
      { message: "Property type does not exist" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    { message: "Property type deleted successfully" },
    HttpStatusCodes.OK
  );
};

/**
 * ================================================================
 * Hotel Handlers
 * ================================================================
 */

// Helper to format hotel data for API response
const formatHotel = (hotel: any): HotelSelectType => {
  if (!hotel) return {} as any;
  return {
    ...hotel,
    name: hotel.name || "Unnamed Property",
    hotelType: hotel.hotelType && typeof hotel.hotelType === "object"
      ? {
        ...hotel.hotelType,
        createdAt: hotel.hotelType.createdAt instanceof Date 
          ? hotel.hotelType.createdAt.toISOString() 
          : hotel.hotelType.createdAt || null,
        updatedAt: hotel.hotelType.updatedAt instanceof Date 
          ? hotel.hotelType.updatedAt.toISOString() 
          : hotel.hotelType.updatedAt || null,
      }
      : null,
    propertyClass: hotel.propertyClass && typeof hotel.propertyClass === "object"
      ? {
        ...hotel.propertyClass,
        createdAt: hotel.propertyClass.createdAt instanceof Date 
          ? hotel.propertyClass.createdAt.toISOString() 
          : hotel.propertyClass.createdAt || null,
        updatedAt: hotel.propertyClass.updatedAt instanceof Date 
          ? hotel.propertyClass.updatedAt.toISOString() 
          : hotel.propertyClass.updatedAt || null,
      }
      : null,
    updatedAt: hotel.updatedAt instanceof Date 
      ? hotel.updatedAt.toISOString() 
      : hotel.updatedAt || null,
    minAge: hotel.minAge || 0,
    childrenAllowed: hotel.childrenAllowed ?? true,
    extraBedsAvailable: hotel.extraBedsAvailable ?? false,
    extraBedsPolicy: hotel.extraBedsPolicy || null,
    languages: hotel.languages || [],
    safetyFeatures: hotel.safetyFeatures || [],
    nearbyPois: hotel.nearbyPois || [],
    sustainability: hotel.sustainability || [],
    transportParking: hotel.transportParking || [],
    paymentMethods: hotel.paymentMethods || [],
    faqs: hotel.faqs || [],
    commonAreas: hotel.commonAreas || [],
    restaurants: hotel.restaurants || [],
    tags: hotel.tags || [],
  } as unknown as HotelSelectType;
};

// List all hotels route handler
export const listAllHotelsHandler: APIRouteHandler<ListAllHotelsRoute> = async (
  c
) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
    hotelType,
    propertyClass,
    status,
    starRating,
    tags,
    isOverdue,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;
  const db = c.get("db");

  // Build query conditions
  const query = db.query.hotels.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(fields.name, `%${search}%`));
      }

      if (hotelType) {
        conditions.push(eq(fields.hotelType, hotelType));
      }

      if (propertyClass) {
        conditions.push(eq(fields.propertyClass, propertyClass));
      }

      // If no status is provided, default to 'active' for public users
      if (status) {
        conditions.push(eq(fields.status, status as any));
      } else {
        const session = c.get("session");
        const user = c.get("user");
        
        if (!session || !user) {
          conditions.push(eq(fields.status, "active"));
        } else {
          const isAdmin = user.role === "admin";
          
          if (!isAdmin) {
            // If logged in but not admin, filter by organization OR creator
            const activeOrgId = session.activeOrganizationId;
            if (activeOrgId) {
              conditions.push(
                or(
                  eq(fields.organizationId, activeOrgId),
                  eq(fields.createdBy, user.id)
                )
              );
            } else {
              // Fallback to only their own hotels
              conditions.push(eq(fields.createdBy, user.id));
            }
          }
        }
      }

      if (starRating) {
        conditions.push(eq(fields.starRating, parseInt(starRating)));
      }

      if (tags) {
        const tagList = tags.split(",").map((t) => t.trim());
        conditions.push(sql`${fields.tags} && ${tagList}::text[]`);
      }

      if (isOverdue === "true") {
        conditions.push(
          sql`EXISTS (
            SELECT 1 FROM ${paymentsHotel} 
            WHERE ${paymentsHotel.hotelId} = ${fields.id} 
            AND ${paymentsHotel.paid} = false 
            AND ${paymentsHotel.dueDate} < CURRENT_DATE
          )`
        );
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      // Handle sorting direction
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }
      return desc(fields.createdAt);
    },
    with: {
      images: true,
      amenities: true,
      roomTypes: true,
      policies: true,
      hotelType: true,
      propertyClass: true,
      languages: true,
      safetyFeatures: true,
      nearbyPois: true,
      sustainability: true,
      transportParking: true,
      paymentMethods: true,
      faqs: true,
      commonAreas: true,
    },
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(hotels)
    .where(() => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(hotels.name, `%${search}%`));
      }

      // Add hotel type condition if provided
      if (hotelType) {
        conditions.push(eq(hotels.hotelType, hotelType));
      }

      // Add property class condition if provided
      if (propertyClass) {
        conditions.push(eq(hotels.propertyClass, propertyClass));
      }

      if (status) {
        conditions.push(eq(hotels.status, status as any));
      } else {
        const session = c.get("session");
        const user = c.get("user");

        if (!session || !user) {
          conditions.push(eq(hotels.status, "active"));
        } else {
          const isAdmin = user.role === "admin";
          
          if (!isAdmin) {
            const activeOrgId = session.activeOrganizationId;
            if (activeOrgId) {
              conditions.push(
                or(
                  eq(hotels.organizationId, activeOrgId),
                  eq(hotels.createdBy, user.id)
                )
              );
            } else {
              conditions.push(eq(hotels.createdBy, user.id));
            }
          }
        }
      }

      if (starRating) {
        conditions.push(eq(hotels.starRating, parseInt(starRating)));
      }

      if (tags) {
        const tagList = tags.split(",").map((t) => t.trim());
        conditions.push(sql`${hotels.tags} && ${tagList}::text[]`);
      }

      if (isOverdue === "true") {
        conditions.push(
          sql`EXISTS (
            SELECT 1 FROM ${paymentsHotel} 
            WHERE ${paymentsHotel.hotelId} = ${hotels.id} 
            AND ${paymentsHotel.paid} = false 
            AND ${paymentsHotel.dueDate} < CURRENT_DATE
          )`
        );
      }

      return conditions.length ? and(...conditions) : undefined;
    });

  const [hotelEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  // Fetch performance data for the current page of hotels
  const hotelIds = hotelEntries.map((h: any) => h.id);
  
  let performanceData: any[] = [];
  let roomsCountData: any[] = [];
  let overdueData: any[] = [];

  const session = c.get("session");
  const user = c.get("user");
  const isAdmin = session && user && user.role === "admin";

  if (hotelIds.length > 0) {
    const queries: any[] = [
      db
        .select({
          hotelId: roomBookings.hotelId,
          totalBookings: sql<number>`count(${roomBookings.id})`,
          totalRevenue: sql<number>`sum(COALESCE(${roomBookings.totalAmount}, 0))`,
        })
        .from(roomBookings)
        .where(and(inArray(roomBookings.hotelId, hotelIds), or(eq(roomBookings.status, "confirmed"), eq(roomBookings.status, "checked_in"), eq(roomBookings.status, "checked_out"))))
        .groupBy(roomBookings.hotelId),
      db
        .select({
          hotelId: rooms.hotelId,
          totalRooms: sql<number>`count(${rooms.id})`,
        })
        .from(rooms)
        .where(inArray(rooms.hotelId, hotelIds))
        .groupBy(rooms.hotelId)
    ];

    if (isAdmin) {
      queries.push(
        db
          .select({
            hotelId: paymentsHotel.hotelId,
            overdueCount: sql<number>`count(${paymentsHotel.id})`,
          })
          .from(paymentsHotel)
          .where(and(
            inArray(paymentsHotel.hotelId, hotelIds),
            eq(paymentsHotel.paid, false),
            sql`${paymentsHotel.dueDate} < CURRENT_DATE`
          ))
          .groupBy(paymentsHotel.hotelId)
      );
    }

    const results = await Promise.all(queries);
    performanceData = results[0];
    roomsCountData = results[1];
    overdueData = results[2] || [];

    // Log analytics: Search appearance (only for public search, not admin list)
    if (!isAdmin && hotelIds.length > 0) {
      db.insert(hotelAnalytics).values(
        hotelIds.map(hId => ({
          hotelId: hId,
          type: 'search'
        }))
      ).execute().catch(err => console.error("Failed to log search analytics:", err));
    }
  }

  const performanceMap = new Map(performanceData.map(p => [p.hotelId, p]));
  const roomsCountMap = new Map(roomsCountData.map(r => [r.hotelId, r.totalRooms]));
  const overdueMap = new Map(overdueData.map(o => [o.hotelId, Number(o.overdueCount) > 0]));

  const formatted = hotelEntries.map((hotel: any) => {
    const perf = performanceMap.get(hotel.id);
    const totalRooms = roomsCountMap.get(hotel.id) || 0;
    
    const formattedHotel = formatHotel(hotel);
    return {
      ...formattedHotel,
      roomTypes: hotel.roomTypes || [], // Ensure presence
      performance: {
        totalBookings: Number(perf?.totalBookings || 0),
        totalRevenue: Number(perf?.totalRevenue || 0),
        totalRooms: Number(totalRooms || 0),
        isOverdue: overdueMap.get(hotel.id) || false,
      }
    };
  });

  return c.json(
    {
      data: formatted,
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

// Create new hotel route handler
export const createNewHotelHandler: APIRouteHandler<
  CreateNewHotelRoute
> = async (c) => {
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");
  const body = c.req.valid("json");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  let activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    const organizationMember = await db.query.member.findFirst({
      where: (fields, { eq }) => eq(fields.userId, user.id),
    });
    if (organizationMember && organizationMember.role !== "member") {
      activeOrganizationId = organizationMember.organizationId;
    }
  }

  if (!activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Check user id exists as member in member table
  const userOrg = await db
    .select()
    .from(member)
    .where(() => {
      const conditions = [];
      conditions.push(eq(member.userId, user.id));
      conditions.push(eq(member.organizationId, activeOrganizationId!));

      return conditions.length ? and(...conditions) : undefined;
    });

  let organizationUser = userOrg[0];

  if (organizationUser?.role === "member") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [inserted] = await db
    .insert(hotels)
    .values({
      ...body,
      organizationId: activeOrganizationId!,
      createdBy: user.id,
      slug: toKebabCase(body.name),
    } as any)
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  // Update user setup status to true
  await db.update(userTable).set({ setup: true }).where(eq(userTable.id, user.id));

  // --- Send Success Email ---
  try {
    const { sendEmail, getStandardHtmlLayout } = await import("core/email/service");
    const content = `
      <p>Congratulations ${user.name}!</p>
      <p>Your hotel <strong>${inserted.name}</strong> has been successfully set up on Reseror.</p>
      <p>You can now start managing your property, adding rooms, and receiving bookings through your dashboard.</p>
      <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/dashboard" class="button">Go to Dashboard</a>
      </div>
    `;
    await sendEmail({
      to: user.email,
      subject: "Hotel Setup Successful - Reseror",
      html: getStandardHtmlLayout(content, "Success! Your Hotel is Live"),
    });
  } catch (emailError) {
    console.error("⚠️ Hotel setup success email failed:", emailError);
  }

  return c.json(inserted as any, HttpStatusCodes.CREATED);
};

export const createNewHotelByAdminHandler: APIRouteHandler<
  CreateNewHotelByAdminRoute
> = async (c) => {
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");
  const body = c.req.valid("json");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [inserted] = await db
    .insert(hotels)
    .values({
      ...body,
      organizationId: body.organizationId,
      createdBy: body.createdBy,
      slug: toKebabCase(body.name),
    } as any)
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(inserted as any, HttpStatusCodes.CREATED);
};

export const getHotelByIdHandler: APIRouteHandler<GetHotelByIdRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const hotel = await db.query.hotels.findFirst({
    where: (fields, { or, eq }) => or(eq(fields.id, params.id), eq(fields.slug, params.id)),
    with: {
      hotelType: true,
      propertyClass: true,
      amenities: true,
      images: true,
      policies: true,
      rooms: true,
      roomTypes: {
        with: {
          images: true,
          amenities: true
        }
      },
      languages: true,
      safetyFeatures: true,
      nearbyPois: true,
      sustainability: true,
      transportParking: true,
      paymentMethods: true,
      faqs: true,
      commonAreas: true,
      restaurants: {
        with: {
          images: true,
        },
      },
    },
  });

  if (!hotel) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check if hotel is active for public users
  if (hotel.status !== "active") {
    const session = c.get("session");
    const user = c.get("user");
    const isAdmin = session && user && user.role === "admin";
    const isOwner = session && user && hotel.createdBy === user.id;

    if (!isAdmin && !isOwner) {
      console.warn(`[GET-HOTEL-BY-ID] ❌ Unauthorized access attempt to non-active hotel: ${hotel.id}`);
      return c.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND
      );
    }
  }

  const formattedHotel = formatHotel(hotel);

  // Log analytics: Visit (fire and forget)
  db.insert(hotelAnalytics).values({
    hotelId: hotel.id,
    type: 'visit'
  }).execute().catch(err => console.error("Failed to log visit analytics:", err));

  return c.json(formattedHotel, HttpStatusCodes.OK);
};

// Get my hotel route handler
export const getMyHotelHandler: APIRouteHandler<GetMyHotelRoute> = async (
  c
) => {
  const session = c.get("session");
  const user = c.get("user");
  let activeOrganizationId = session?.activeOrganizationId;
  const db = c.get("db");
  console.log(activeOrganizationId, "activeOrganizationId");

  if (!session || !user)
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );

  if (!activeOrganizationId) {
    if (user.role === "admin") {
       // Superadmins might not have an active organization but can still access the route
       // We'll try to find any hotel if they are in admin mode, but usually they'll have an org selected
       // For now, let's just proceed with null activeOrganizationId if they are admin
       // and let the query handle it (which will return 404)
    } else {
      // Check is this user a member of any organization
      const organizationMember = await db.query.member.findFirst({
        where: (fields, { eq }) => eq(fields.userId, user.id),
      });

      if (!organizationMember) {
        // The user hasn't set up an organization/hotel yet.
        console.log(`[GET-MY-HOTEL] ℹ️ User ${user.id} is not a member of any organization (no hotel setup yet)`);
        return c.json(
          {
            message: "No hotel found",
          },
          HttpStatusCodes.NOT_FOUND
        );
      }

      if (organizationMember.role === "member") {
        return c.json(
          {
            message: HttpStatusPhrases.FORBIDDEN,
          },
          HttpStatusCodes.FORBIDDEN
        );
      }

      activeOrganizationId = organizationMember.organizationId;
    }
  }

  // If we still don't have an activeOrganizationId and it's not an admin, we return not found
  if (!activeOrganizationId && user.role !== "admin") {
      return c.json(
          {
            message: "No hotel found",
          },
          HttpStatusCodes.NOT_FOUND
        );
  }

  const myHotel = await db.query.hotels.findFirst({
    where: (fields, { eq }) => activeOrganizationId ? eq(fields.organizationId, activeOrganizationId!) : sql`false`,
    with: {
      hotelType: true,
      propertyClass: true,
      images: true,
      amenities: true,
      roomTypes: true,
      policies: true,
      languages: true,
      safetyFeatures: true,
      nearbyPois: true,
      sustainability: true,
      transportParking: true,
      paymentMethods: true,
      faqs: true,
      commonAreas: true,
    },
  });

  if (!myHotel) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const formattedHotel = formatHotel(myHotel);

  return c.json(formattedHotel, HttpStatusCodes.OK);
};

/**
 * ================================================================
 * Hotel Room Management Handlers
 * ================================================================
 */

// Get hotel room types handler
export const getHotelRoomTypesHandler: APIRouteHandler<
  GetHotelRoomTypesRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const { page = "1", limit = "10" } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Verify hotel exists
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Get room types for this hotel
  const roomTypesData = await db.query.roomTypes.findMany({
    where: (fields, { eq }) => eq(fields.hotelId, params.id),
    limit: limitNum,
    offset,
    with: {
      amenities: true,
      rooms: true,
    },
  });

  // Find room types with images
  for (const roomType of roomTypesData) {
    const images = await db.query.roomTypeImages.findMany({
      where: (fields, { eq }) => eq(fields.roomTypeId, roomType.id),
    });

    (roomType as any).images = images;
  }

  // Get total count for room types
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(roomTypes)
    .where(eq(roomTypes.hotelId, params.id));

  const [_totalCount] = await totalCountQuery;
  const totalCount = _totalCount?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: roomTypesData as any,
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

// Get hotel rooms handler
export const getHotelRoomsHandler: APIRouteHandler<GetHotelRoomsRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const {
    page = "1",
    limit = "10",
    roomTypeId,
    status,
    floorNumber,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Verify hotel exists
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Build query conditions
  const whereConditions = [eq(rooms.hotelId, params.id)];

  if (roomTypeId) {
    whereConditions.push(eq(rooms.roomTypeId, roomTypeId));
  }

  if (status) {
    whereConditions.push(eq(rooms.status, status));
  }

  if (floorNumber) {
    whereConditions.push(eq(rooms.floorNumber, parseInt(floorNumber)));
  }

  // Get rooms for this hotel
  const roomsData = await db.query.rooms.findMany({
    where: and(...whereConditions),
    limit: limitNum,
    offset,
    with: {
      roomType: true,
    },
  });

  // Get total count
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(rooms)
    .where(and(...whereConditions));

  const [_totalCount] = await totalCountQuery;
  const totalCount = _totalCount?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: roomsData as any,
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

export const updateHotelHandler: APIRouteHandler<UpdateHotelRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json(
      { message: "Hotel does not exist" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  console.log("Update Request Debug:", {
    userId: user.id,
    userRole: user.role,
    hotelId: params.id,
    hotelCreator: hotel.createdBy,
    activeOrg: session?.activeOrganizationId,
    hotelOrg: hotel.organizationId
  });

  // allow admins or hotel owners to update
  if (user.role !== "admin" && hotel.createdBy !== user.id && hotel.organizationId !== session?.activeOrganizationId) {
    console.warn("Permission Denied: User is not creator or in the same organization");
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(hotels)
    .set({ ...body, updatedAt: new Date() } as any)
    .where(eq(hotels.id, params.id))
    .returning();

  if (!updated) {
    return c.json(
      { message: "Hotel does not exist" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // --- Send Commission Notification if update contains commissionRate ---
  if (body.commissionRate !== undefined) {
    try {
      const hotelWithOwner = await db.query.hotels.findFirst({
        where: eq(hotels.id, updated.id),
        with: {
          user: true, // Fetch owner
        }
      });

      if (hotelWithOwner?.user?.email) {
        const { sendEmail, getStandardHtmlLayout } = await import("core/email/service");
        const content = `
          <p>Hi ${hotelWithOwner.user.name},</p>
          <p>This is to inform you that the commission rate for <strong>${hotelWithOwner.name}</strong> has been updated.</p>
          <p>New Commission Rate: <strong>${body.commissionRate}%</strong></p>
          <p>If you have any questions regarding this change, please contact support.</p>
        `;
        await sendEmail({
          to: hotelWithOwner.user.email,
          subject: "Commission Rate Updated - Reseror",
          html: getStandardHtmlLayout(content, "Commission Update"),
        });
      }
    } catch (emailError) {
      console.error("⚠️ Commission update email failed:", emailError);
    }
  }

  return c.json(updated as any, HttpStatusCodes.OK);
};

// Remove hotel handler
export const removeHotelHandler: APIRouteHandler<RemoveHotelRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.OK
    );
  }

  // Allow only admins or hotel owners to delete
  if (user.role !== "admin" && user.role !== "user") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.OK
    );
  }

  // Check if the hotel exists
  const hotel = await db.query.hotels.findFirst({
    where: (fields, { eq }) => eq(fields.id, params.id),
  });

  if (!hotel) {
    return c.json(
      {
        message: "Hotel does not exist",
      },
      HttpStatusCodes.OK
    );
  }

  // Ensure the user is authorized to delete the hotel
  if (user.role !== "admin" && hotel.createdBy !== user.id) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Delete the hotel
  const [deleted] = await db
    .delete(hotels)
    .where(eq(hotels.id, params.id))
    .returning();

  if (!deleted) {
    return c.json(
      {
        message: "Failed to delete the hotel",
      },
      HttpStatusCodes.OK
    );
  }

  return c.json(
    {
      message: "Hotel deleted successfully",
    },
    HttpStatusCodes.OK
  );
};

// Get hotel performance handler
export const getHotelPerformanceHandler: APIRouteHandler<GetHotelPerformanceRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");

  // Fetch hotel basic info
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Get date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateStr = thirtyDaysAgo.toISOString().split("T")[0];

  // 1. Overall Stats
  const [overallStats] = await db
    .select({
      totalRevenue: sql<number>`sum(COALESCE(${roomBookings.totalAmount}, 0))`,
      totalBookings: sql<number>`count(${roomBookings.id})`,
    })
    .from(roomBookings)
    .where(and(
      eq(roomBookings.hotelId, id),
      or(eq(roomBookings.status, "confirmed"), eq(roomBookings.status, "checked_in"), eq(roomBookings.status, "checked_out"))
    ));

  // 2. Daily Trend (Last 30 Days)
  const dailyTrend = await db
    .select({
      date: sql<string>`DATE(${roomBookings.createdAt})::text`,
      revenue: sql<number>`sum(COALESCE(${roomBookings.totalAmount}, 0))`,
      bookings: sql<number>`count(${roomBookings.id})`,
    })
    .from(roomBookings)
    .where(and(
      eq(roomBookings.hotelId, id),
      sql`${roomBookings.createdAt} >= ${dateStr}`,
      or(eq(roomBookings.status, "confirmed"), eq(roomBookings.status, "checked_in"), eq(roomBookings.status, "checked_out"))
    ))
    .groupBy(sql`DATE(${roomBookings.createdAt})`)
    .orderBy(sql`DATE(${roomBookings.createdAt})`);

  // 3. Room Type Performance
  const roomTypePerf = await db
    .select({
      roomTypeName: roomTypes.name,
      revenue: sql<number>`sum(COALESCE(${roomBookings.totalAmount}, 0))`,
      bookings: sql<number>`count(${roomBookings.id})`,
    })
    .from(roomBookings)
    .innerJoin(roomTypes, eq(roomBookings.roomTypeId, roomTypes.id))
    .where(and(
      eq(roomBookings.hotelId, id),
      or(eq(roomBookings.status, "confirmed"), eq(roomBookings.status, "checked_in"), eq(roomBookings.status, "checked_out"))
    ))
    .groupBy(roomTypes.name);

  // 4. Status Breakdown
  const statusBreakdown = await db
    .select({
      status: roomBookings.status,
      count: sql<number>`count(*)`,
    })
    .from(roomBookings)
    .where(eq(roomBookings.hotelId, id))
    .groupBy(roomBookings.status);

  // 5. Occupancy Calculation (Total Rooms)
  const [roomsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(rooms)
    .where(eq(rooms.hotelId, id));

  const totalRoomsCountArr = roomsCount?.count || 0;
  
  const [activeBookingsCountArr] = await db
    .select({ count: sql<number>`count(*)` })
    .from(roomBookings)
    .where(and(
      eq(roomBookings.hotelId, id),
      eq(roomBookings.status, "checked_in")
    ));
  
  const totalBksCount = activeBookingsCountArr?.count || 0;
  const occupancyRate = totalRoomsCountArr > 0 ? (totalBksCount / totalRoomsCountArr) * 100 : 0;

  return c.json({
    hotelId: id,
    name: hotel.name,
    stats: {
      totalRevenue: Number(overallStats?.totalRevenue || 0),
      totalBookings: Number(overallStats?.totalBookings || 0),
      avgOrderValue: overallStats?.totalBookings ? Number(overallStats.totalRevenue) / overallStats.totalBookings : 0,
      occupancyRate: Math.round(occupancyRate),
    },
    revenueByDay: dailyTrend.map(d => ({
      date: d.date,
      revenue: Number(d.revenue),
      bookings: Number(d.bookings),
    })),
    roomTypePerformance: roomTypePerf.map(r => ({
      roomTypeName: r.roomTypeName,
      revenue: Number(r.revenue),
      bookings: Number(r.bookings),
    })),
    bookingStatusBreakdown: statusBreakdown.map(s => ({
      status: s.status || "unknown",
      count: Number(s.count),
    })),
  }, HttpStatusCodes.OK);
};

/**
 * ================================================================
 * Excel Handlers
 * ================================================================
 */

export const exportHotelsHandler: APIRouteHandler<ExportHotelsRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");

  console.log(`[EXPORT-HOTELS] 🛫 Request received. User: ${user?.email || "anonymous"}, Role: ${user?.role || "none"}`);

  if (!session || !user || user.role !== "admin") {
    console.warn(`[EXPORT-HOTELS] ❌ Unauthorized: User ${user?.email} lacks admin role`);
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { search } = c.req.valid("query");

  try {
    const allHotels = await db.query.hotels.findMany({
      where: search ? ilike(hotels.name, `%${search}%`) : undefined,
      with: {
        hotelType: true,
        propertyClass: true,
      }
    });

    console.log(`[EXPORT-HOTELS] ✅ Found ${allHotels.length} properties to export`);

    const exportData = allHotels.map(h => ({
      ID: h.id,
      Name: h.name,
      Description: h.description,
      Brand: h.brandName,
      Street: h.street,
      City: h.city,
      State: h.state,
      Country: h.country,
      PostalCode: h.postalCode,
      Latitude: h.latitude,
      Longitude: h.longitude,
      FormattedAddress: h.formattedAddress,
      Phone: h.phone,
      Email: h.email,
      Website: h.website,
      Type: h.hotelType?.name || "",
      Class: h.propertyClass?.name || "",
      StarRating: h.starRating,
      CheckInTime: h.checkInTime,
      CheckInEnd: h.checkInEnd,
      CheckOutStart: h.checkOutStart,
      CheckOutTime: h.checkOutTime,
      MinAge: h.minAge,
      ChildrenAllowed: h.childrenAllowed ? "Yes" : "No",
      ExtraBedsAvailable: h.extraBedsAvailable ? "Yes" : "No",
      ExtraBedsPolicy: h.extraBedsPolicy,
      Tags: h.tags?.join(", ") || "",
      Status: h.status,
      CommissionRate: h.commissionRate,
      CreatedAt: h.createdAt?.toISOString(),
    }));

    const buffer = jsonToExcelBuffer(exportData, "Properties");

    return c.body(buffer as any, HttpStatusCodes.OK, {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="properties.xlsx"',
    });
  } catch (error) {
    console.error(`[EXPORT-HOTELS] 💥 Unexpected error:`, error);
    return c.json({ message: "Internal server error during export" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const importHotelsHandler: APIRouteHandler<ImportHotelsRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");

  console.log(`[IMPORT-HOTELS] 🛫 Request received. User: ${user?.email}`);

  if (!session || !user || user.role !== "admin") {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  const body = await c.req.parseBody();
  const file = body.file as File;

  if (!file) {
    return c.json({ message: "No file uploaded" }, HttpStatusCodes.BAD_REQUEST);
  }

  const arrayBuffer = await file.arrayBuffer();
  const dataUint8 = new Uint8Array(arrayBuffer);
  
  try {
    const data = excelBufferToJson<any>(dataUint8);
    let count = 0;

    for (const row of data) {
      const hotelData = {
        name: row.Name,
        description: row.Description,
        brandName: row.Brand,
        street: row.Street,
        city: row.City,
        state: row.State,
        country: row.Country,
        postalCode: row.PostalCode,
        latitude: row.Latitude?.toString(),
        longitude: row.Longitude?.toString(),
        formattedAddress: row.FormattedAddress,
        phone: row.Phone?.toString(),
        email: row.Email,
        website: row.Website,
        starRating: parseInt(row.StarRating) || 0,
        checkInTime: row.CheckInTime?.toString(),
        checkInEnd: row.CheckInEnd?.toString(),
        checkOutStart: row.CheckOutStart?.toString(),
        checkOutTime: row.CheckOutTime?.toString(),
        minAge: parseInt(row.MinAge) || null,
        childrenAllowed: row.ChildrenAllowed === "Yes",
        extraBedsAvailable: row.ExtraBedsAvailable === "Yes",
        extraBedsPolicy: row.ExtraBedsPolicy,
        tags: row.Tags ? row.Tags.split(",").map((s: string) => s.trim()) : [],
        status: row.Status || "pending_approval",
        commissionRate: row.CommissionRate?.toString() || "10.00",
        slug: toKebabCase(row.Name),
        organizationId: session.activeOrganizationId || "",
        createdBy: user.id,
      };

      if (row.ID) {
        await db.update(hotels).set(hotelData).where(eq(hotels.id, row.ID));
      } else {
        await db.insert(hotels).values(hotelData as any);
      }
      count++;
    }

    console.log(`[IMPORT-HOTELS] ✅ Successfully processed ${count} records`);
    return c.json({ message: "Import successful", count }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("[IMPORT-HOTELS] ❌ Error parsing file:", error);
    return c.json({ message: "Failed to parse Excel file" }, HttpStatusCodes.BAD_REQUEST);
  }
};

export const downloadHotelTemplateHandler: APIRouteHandler<DownloadHotelTemplateRoute> = async (c) => {
  const templateData = [{
    ID: "",
    Name: "Example Hotel",
    Description: "A beautiful place to stay",
    Brand: "Example Brand",
    Street: "123 Main St",
    City: "Colombo",
    State: "Western",
    Country: "Sri Lanka",
    PostalCode: "00100",
    Latitude: "6.9271",
    Longitude: "79.8612",
    FormattedAddress: "123 Main St, Colombo, Sri Lanka",
    Phone: "+94112233445",
    Email: "info@example.com",
    Website: "https://example.com",
    StarRating: "5",
    CheckInTime: "14:00",
    CheckInEnd: "00:00",
    CheckOutStart: "06:00",
    CheckOutTime: "11:00",
    MinAge: "18",
    ChildrenAllowed: "Yes",
    ExtraBedsAvailable: "No",
    ExtraBedsPolicy: "Available on request",
    Tags: "beachfront, luxury, pool",
    Status: "active",
    CommissionRate: "10.00",
  }];

  const buffer = jsonToExcelBuffer(templateData, "Template");

  return c.body(buffer as any, HttpStatusCodes.OK, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": 'attachment; filename="property_import_template.xlsx"',
  });
};

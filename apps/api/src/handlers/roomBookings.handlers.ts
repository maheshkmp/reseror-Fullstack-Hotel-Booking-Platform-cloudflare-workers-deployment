import { and, eq, gte, lte, sql, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { roomBookings, influencers, ads, hotels, member, paymentsHotel, hotelAnalytics } from "core/database/schema";
import type {
  CreateRoomBookingRoute,
  DeleteRoomBookingRoute,
  GetRoomBookingRoute,
  GetRoomBookingsStatsRoute,
  GetRoomBookingsStatsByUserRoute,
  ListRoomBookingsByUserRoute,
  ListRoomBookingsRoute,
  UpdateRoomBookingRoute,
} from "../routes/roomBookings.routes";
import { syncBookingPaymentRecord } from "../lib/payments";

// Get roomBookings stats handler
export const getRoomBookingsStatsHandler: APIRouteHandler<
  GetRoomBookingsStatsRoute
> = async (c) => {
  const { hotelId, organizationId } = c.req.valid("query");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Define where conditions for stats
  const whereConditions = [];

  if (user.role !== "admin") {
    // Get all organizations the user is a member of
    const userMemberships = await db.query.member.findMany({
      where: (m, { eq }) => eq(m.userId, user.id),
      columns: { organizationId: true }
    });
    const userOrgIds = userMemberships.map(m => m.organizationId);

    const myHotels = await db.query.hotels.findMany({
      where: (h, { eq, or, inArray }) => or(
        eq(h.createdBy, user.id),
        userOrgIds.length > 0 ? inArray(h.organizationId, userOrgIds) : undefined,
        session.activeOrganizationId ? eq(h.organizationId, session.activeOrganizationId) : undefined
      ),
      columns: { id: true }
    });
    
    const accessibleHotelIds = myHotels.map(h => h.id);

    if (accessibleHotelIds.length === 0) {
      return c.json({
        data: {
          total: 0,
          confirmed: 0,
          pending: 0,
          cancelled: 0,
          totalRevenue: 0,
          thisMonthBookings: 0,
        }
      }, HttpStatusCodes.OK);
    }

    if (hotelId) {
      if (!accessibleHotelIds.includes(hotelId)) {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
      whereConditions.push(eq(roomBookings.hotelId, hotelId));
    } else {
      whereConditions.push(inArray(roomBookings.hotelId, accessibleHotelIds));
    }
  } else {
    if (hotelId) {
      whereConditions.push(eq(roomBookings.hotelId, hotelId));
    }
  }

  if (organizationId) {
    whereConditions.push(eq(roomBookings.organizationId, organizationId));
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [allBookings, analyticsData] = await Promise.all([
    db.query.roomBookings.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      columns: {
        status: true,
        totalAmount: true,
        createdAt: true,
      },
    }),
    hotelId ? db.query.hotelAnalytics.findMany({
      where: and(
        eq(hotelAnalytics.hotelId, hotelId),
        gte(hotelAnalytics.createdAt, thirtyDaysAgo)
      ),
    }) : Promise.resolve([]),
  ]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = allBookings.reduce(
    (acc: any, booking: any) => {
      acc.total++;
      if (booking.status === "confirmed") acc.confirmed++;
      if (booking.status === "pending") acc.pending++;
      if (booking.status === "cancelled") acc.cancelled++;
      
      const amount = booking.totalAmount ? parseFloat(booking.totalAmount) : 0;
      acc.totalRevenue += amount;

      const createdAt = new Date(booking.createdAt);
      if (createdAt >= startOfMonth) {
        acc.thisMonthBookings++;
      }

      // Daily Insights (Last 30 days)
      if (createdAt >= thirtyDaysAgo) {
        const dateKey = createdAt.toISOString().split("T")[0];
        if (!acc.dailyInsights[dateKey]) {
          acc.dailyInsights[dateKey] = { revenue: 0, bookings: 0, visits: 0, searches: 0 };
        }
        if (booking.status === "confirmed") {
          acc.dailyInsights[dateKey].revenue += amount;
          acc.dailyInsights[dateKey].bookings += 1;
        }
      }

      return acc;
    },
    {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      totalRevenue: 0,
      thisMonthBookings: 0,
      dailyInsights: {} as Record<string, { revenue: number, bookings: number, visits: number, searches: number }>,
    }
  );

  // Merge Analytics Data into Daily Insights
  analyticsData.forEach((record: any) => {
    const dateKey = new Date(record.createdAt).toISOString().split("T")[0];
    if (!stats.dailyInsights[dateKey]) {
      stats.dailyInsights[dateKey] = { revenue: 0, bookings: 0, visits: 0, searches: 0 };
    }
    if (record.type === "visit") {
      stats.dailyInsights[dateKey].visits += 1;
    } else if (record.type === "search") {
      stats.dailyInsights[dateKey].searches += 1;
    }
  });

  // Convert to sorted array for charts
  const history = Object.entries(stats.dailyInsights)
    .map(([date, data]) => ({ date, ...(data as any) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const resultData = {
    ...stats,
    history,
  };
  delete (resultData as any).dailyInsights;

  return c.json(
    {
      data: resultData as any,
    },
    HttpStatusCodes.OK
  );
};


// List roomBookings handler
export const listRoomBookingsHandler: APIRouteHandler<
  ListRoomBookingsRoute
> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    // search,
    hotelId,
    organizationId,
    status,
    checkInDateFrom,
    checkInDateTo,
    paymentType,
    isPaid,
    minAmount,
    maxAmount,
  } = c.req.valid("query");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [];

  // Manage permissions: if not admin, restrict to hotels owned by the user or their organization
  if (user.role !== "admin") {
    // Get all organizations the user is a member of
    const userMemberships = await db.query.member.findMany({
      where: (m, { eq }) => eq(m.userId, user.id),
      columns: { organizationId: true }
    });
    const userOrgIds = userMemberships.map(m => m.organizationId);

    const myHotels = await db.query.hotels.findMany({
      where: (h, { eq, or, inArray }) => or(
        eq(h.createdBy, user.id),
        userOrgIds.length > 0 ? inArray(h.organizationId, userOrgIds) : undefined,
        session.activeOrganizationId ? eq(h.organizationId, session.activeOrganizationId) : undefined
      ),
      columns: { id: true }
    });
    
    const accessibleHotelIds = myHotels.map(h => h.id);

    if (accessibleHotelIds.length === 0) {
      return c.json(
        {
          data: [],
          meta: {
            currentPage: Math.max(1, parseInt(page)),
            totalPages: 0,
            totalCount: 0,
            limit: Math.max(1, Math.min(100, parseInt(limit))),
          },
        },
        HttpStatusCodes.OK
      );
    }

    if (hotelId) {
      if (!accessibleHotelIds.includes(hotelId)) {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
      whereConditions.push(eq(roomBookings.hotelId, hotelId));
    } else {
      whereConditions.push(inArray(roomBookings.hotelId, accessibleHotelIds));
    }
  } else if (hotelId) {
    whereConditions.push(eq(roomBookings.hotelId, hotelId));
  }

  if (organizationId) {
    whereConditions.push(eq(roomBookings.organizationId, organizationId));
  }

  if (status) {
    whereConditions.push(eq(roomBookings.status, status));
  }

  if (checkInDateFrom) {
    whereConditions.push(gte(roomBookings.checkInDate, checkInDateFrom));
  }

  if (checkInDateTo) {
    whereConditions.push(lte(roomBookings.checkInDate, checkInDateTo));
  }

  if (paymentType) {
    whereConditions.push(eq(roomBookings.paymentType, paymentType));
  }

  if (isPaid !== undefined) {
    whereConditions.push(eq(roomBookings.isPaid, isPaid === "true"));
  }

  if (minAmount) {
    whereConditions.push(gte(roomBookings.totalAmount, minAmount));
  }

  if (maxAmount) {
    whereConditions.push(lte(roomBookings.totalAmount, maxAmount));
  }

  const query = db.query.roomBookings.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    with: {
      hotel: true,
      guest: true,
      roomType: true,
    },
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(roomBookings)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [roomBookingEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  // Ensure status is handled correctly for type compatibility
  const mappedRoomBookingEntries = roomBookingEntries.map((entry) => ({
    ...entry,
    status: (entry.status ?? null) as any,
  }));

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: mappedRoomBookingEntries as any,
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

// List roomBookings by user ID handler
export const listRoomBookingsByUserHandler: APIRouteHandler<
  ListRoomBookingsByUserRoute
> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const params = c.req.valid("param");
  const db = c.get("db");
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    // search,
    hotelId,
    status,
    checkInDateFrom,
    checkInDateTo,
    paymentType,
    isPaid,
    minAmount,
    maxAmount,
  } = c.req.valid("query");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if user is requesting their own bookings or is an admin
  if (user.role !== "admin" && params.userId !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [eq(roomBookings.createdBy, params.userId)];

  if (hotelId) {
    whereConditions.push(eq(roomBookings.hotelId, hotelId));
  }

  if (status) {
    whereConditions.push(eq(roomBookings.status, status));
  }

  if (checkInDateFrom) {
    whereConditions.push(gte(roomBookings.checkInDate, checkInDateFrom));
  }

  if (checkInDateTo) {
    whereConditions.push(lte(roomBookings.checkInDate, checkInDateTo));
  }

  if (paymentType) {
    whereConditions.push(eq(roomBookings.paymentType, paymentType));
  }

  if (isPaid !== undefined) {
    whereConditions.push(eq(roomBookings.isPaid, isPaid === "true"));
  }

  if (minAmount) {
    whereConditions.push(gte(roomBookings.totalAmount, minAmount));
  }

  if (maxAmount) {
    whereConditions.push(lte(roomBookings.totalAmount, maxAmount));
  }

  const query = db.query.roomBookings.findMany({
    limit: limitNum,
    offset,
    where: and(...whereConditions),
    with: {
      hotel: true,
      guest: true,
      roomType: true,
    },
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(roomBookings)
    .where(and(...whereConditions));

  const [roomBookingEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  // Ensure status is handled correctly for type compatibility
  const mappedRoomBookingEntries = roomBookingEntries.map((entry) => ({
    ...entry,
    status: (entry.status ?? null) as any,
  }));
  

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: mappedRoomBookingEntries as any,
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

// Get roomBookings stats for a specific user handler
export const getRoomBookingsStatsByUserHandler: APIRouteHandler<
  GetRoomBookingsStatsByUserRoute
> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const params = c.req.valid("param");
  const db = c.get("db");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if user is requesting their own bookings or is an admin
  if (user.role !== "admin" && params.userId !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [allBookings] = await Promise.all([
    db.query.roomBookings.findMany({
      where: eq(roomBookings.createdBy, params.userId),
      columns: {
        status: true,
        totalAmount: true,
        createdAt: true,
      },
    }),
  ]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = allBookings.reduce(
    (acc, booking) => {
      acc.total++;
      if (booking.status === "confirmed") acc.confirmed++;
      if (booking.status === "pending") acc.pending++;
      if (booking.status === "cancelled") acc.cancelled++;
      
      const amount = booking.totalAmount ? parseFloat(booking.totalAmount) : 0;
      acc.totalRevenue += amount;

      const createdAt = new Date(booking.createdAt);
      if (createdAt >= startOfMonth) {
        acc.thisMonthBookings++;
      }

      return acc;
    },
    {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      totalRevenue: 0,
      thisMonthBookings: 0,
    }
  );

  return c.json(
    {
      data: stats,
    },
    HttpStatusCodes.OK
  );
};

// Get roomBooking handler
export const getRoomBookingHandler: APIRouteHandler<
  GetRoomBookingRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const roomBooking = await db.query.roomBookings.findFirst({
    where: eq(roomBookings.id, params.id),
    with: {
      hotel: true,
      guest: true,
      roomType: true,
    },
  });

  if (!roomBooking) {
    return c.json(
      { message: "RoomBooking not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check permissions: Admin, Guest (creator), or Hotel Owner
  if (user.role !== "admin" && roomBooking.createdBy !== user.id) {
    // Check if user is the hotel owner
    const userMemberships = await db.query.member.findMany({
      where: (m, { eq }) => eq(m.userId, user.id),
      columns: { organizationId: true }
    });
    const userOrgIds = userMemberships.map(m => m.organizationId);

    const isOwner = await db.query.hotels.findFirst({
      where: (h, { eq, and, or, inArray }) => and(
        eq(h.id, roomBooking.hotelId),
        or(
          eq(h.createdBy, user.id),
          userOrgIds.length > 0 ? inArray(h.organizationId, userOrgIds) : undefined,
          session.activeOrganizationId ? eq(h.organizationId, session.activeOrganizationId) : undefined
        )
      )
    });

    if (!isOwner) {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }
  }

  return c.json(
    {
      ...roomBooking,
      status: (roomBooking.status ?? "pending") as any,
    } as any,
    HttpStatusCodes.OK
  );
};

// Update the createRoomBookingHandler to make organizationId optional
export const createRoomBookingHandler: APIRouteHandler<
  CreateRoomBookingRoute
> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const db = c.get("db");
  const user = c.get("user");
    
  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  let activeOrganizationId = session.activeOrganizationId || null;

  // Try to get organization from various sources if not available
  if (!activeOrganizationId) {
    // First try to get from user's organization membership
    if (user.role === "user") {
      const organizationMember = await db.query.member.findFirst({
        where: (fields, { eq }) => eq(fields.userId, user.id),
      });

      if (organizationMember && organizationMember.role !== "member") {
        activeOrganizationId = organizationMember.organizationId;
      }
    }

    // If still no organization, try to get from the hotel
    if (!activeOrganizationId && body.hotelId) {
      const hotel = await db.query.hotels.findFirst({
        where: (fields, { eq }) => eq(fields.id, body.hotelId),
        columns: { organizationId: true },
      });

      if (hotel) {
        activeOrganizationId = hotel.organizationId;
      }
    }
  }

  // Note: activeOrganizationId can be null now - it's optional

  // Fetch commission rate (Hotel Specific or Global Default)
  let commissionRate = 10.0; // Fallback default
  
  if (body.hotelId) {
    const hotel = await db.query.hotels.findFirst({
      where: (fields, { eq }) => eq(fields.id, body.hotelId),
      columns: { commissionRate: true }
    });

    if (hotel?.commissionRate) {
      commissionRate = parseFloat(hotel.commissionRate);
    } else {
      const settings = await db.query.siteSettings.findFirst({
        columns: { defaultCommissionRate: true }
      });
      if (settings?.defaultCommissionRate) {
        commissionRate = parseFloat(settings.defaultCommissionRate);
      }
    }
  }

  // --- Promo Code Logic ---
  const totalAmount = Number(body.totalAmount || 0);
  let finalTotalAmount = totalAmount;
  let discountAmount = 0;
  let influencerId = null;
  let isHotelOwnedPromo = false;

  const promoCode = (body as any).promoCode;

  if (promoCode) {
    // 1. Check influencers (Affiliates)
    const influencer = await db.query.influencers.findFirst({
      where: and(
        eq(influencers.promoCode, promoCode),
        eq(influencers.isActive, true)
      ),
    });

    if (influencer) {
      const isExpired = influencer.expiresAt && new Date(influencer.expiresAt) < new Date();
      const isLimitReached = influencer.usageLimit && (influencer.usageCount || 0) >= influencer.usageLimit;
      const isSelfUse = influencer.userId === user.id;
      const isMinBookingReached = totalAmount >= Number(influencer.minBookingValue || 0);

      if (!isExpired && !isLimitReached && !isSelfUse && isMinBookingReached) {
        influencerId = influencer.id;
        const discountRate = parseFloat(influencer.discountRate || "0");
        discountAmount = (totalAmount * discountRate) / 100;

        // Apply discount cap if exists
        if (influencer.discountCap) {
          discountAmount = Math.min(discountAmount, Number(influencer.discountCap));
        }

        finalTotalAmount = totalAmount - discountAmount;
      }
    } 
    // 2. Check ads (Hotel Owner or Admin Promos)
    else {
      const ad = await db.query.ads.findFirst({
        where: and(
          eq(ads.promoCode, promoCode),
          eq(ads.isActive, true)
        ),
      });

      if (ad) {
        // Check validity period
        const now = new Date();
        const isStarted = !ad.startDate || new Date(ad.startDate) <= now;
        const isNotEnded = !ad.endDate || new Date(ad.endDate) >= now;
        const isLimitNotReached = !ad.usageLimit || (ad.usageCount || 0) < ad.usageLimit;
        const isMinBookingReached = totalAmount >= Number(ad.minBookingValue || 0);

        if (isStarted && isNotEnded && isLimitNotReached && isMinBookingReached) {
          const discountPercent = parseFloat((ad as any).discountPercent || "0");
          discountAmount = (totalAmount * discountPercent) / 100;
          finalTotalAmount = totalAmount - discountAmount;

          // Check if it's a hotel-owned promo for THIS hotel
          if (ad.hotelId === body.hotelId) {
            isHotelOwnedPromo = true;
          }

          // Increment usage count (fire and forget or await)
          db.update(ads)
            .set({ usageCount: sql`${ads.usageCount} + 1` })
            .where(eq(ads.id, ad.id))
            .execute()
            .catch(err => console.error("Failed to increment ad usage count:", err));
        }
      }
    }
  }

  // --- Commission Calculation ---
  // If it's a hotel-owned promo, commission is calculated from the ORIGINAL total.
  // Otherwise, it's calculated from the FINAL total (shared discount).
  let calculatedCommission = 0;
  if (isHotelOwnedPromo) {
    calculatedCommission = (totalAmount * commissionRate) / 100;
  } else {
    calculatedCommission = (finalTotalAmount * commissionRate) / 100;
  }
  
  const calculatedNet = finalTotalAmount - calculatedCommission;

  // Clean up the data and ensure proper types
  const cleanedData = {
    hotelId: body.hotelId,
    roomTypeId: body.roomTypeId,
    guestName: body.guestName,
    paymentType: body.paymentType,
    guestEmail: body.guestEmail || null,
    guestPhone: body.guestPhone || null,
    checkInDate: body.checkInDate || null,
    checkInTime: body.checkInTime || null,
    checkOutDate: body.checkOutDate || null,
    checkOutTime: body.checkOutTime || null,
    numRooms: body.numRooms || 1,
    numAdults: body.numAdults || 1,
    numChildren: body.numChildren || 0,
    totalAmount: finalTotalAmount.toString(),
    commissionAmount: calculatedCommission.toString(),
    netPayableToHotel: calculatedNet.toString(),
    currency: body.currency || "USD",
    specialRequests: body.specialRequests || null,
    notes: body.notes || null,
    isPaid: body.isPaid || false,
    paymentDetails: body.paymentDetails || null,
    // Set system fields
    createdBy: user.id,
    organizationId: activeOrganizationId, // Can be null now
    // Affiliate fields
    promoCode: (body as any).promoCode || null,
    discountAmount: discountAmount.toString(),
    influencerId: influencerId,
  };

  try {
    const [inserted] = await db
      .insert(roomBookings)
      .values(cleanedData as any)
      .returning();

    // --- Automatic Payment Tracking ---
    try {
      if (inserted) {
        const isCash = inserted.paymentType === "cash";
        const paymentType = isCash ? "receive_commission_from_cash" : "repay_net_from_online";
        const amount = isCash ? (inserted.commissionAmount || "0") : (inserted.netPayableToHotel || "0");

        await db.insert(paymentsHotel).values({
          hotelId: inserted.hotelId,
          bookingId: inserted.id,
          organizationId: inserted.organizationId || "",
          type: paymentType,
          amount: amount.toString(),
          paid: false,
          status: "pending",
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 45 days due
        });
      }
    } catch (paymentCaptureError) {
      console.error("⚠️ Failed to capture payment record for booking:", paymentCaptureError);
      // We don't fail the booking creation if payment tracking fails, but it should be logged
    }

    // --- Send Email Notifications ---
    try {
      const hotel = await db.query.hotels.findFirst({
        where: (fields, { eq }) => eq(fields.id, inserted.hotelId!),
        with: {
          user: true, // Assuming relation exists to get owner
        }
      });

      const ownerEmail = hotel?.user?.email;
      const guestEmail = inserted.guestEmail;

      const bookingSummary = `
        <h3>Booking Details</h3>
        <table class="summary-table">
          <tr><td>Hotel</td><td class="highlight">${hotel?.name || "N/A"}</td></tr>
          <tr><td>Guest Name</td><td>${inserted.guestName}</td></tr>
          <tr><td>Check-in</td><td>${inserted.checkInDate}</td></tr>
          <tr><td>Check-out</td><td>${inserted.checkOutDate}</td></tr>
          <tr><td>Rooms</td><td>${inserted.numRooms}</td></tr>
          <tr><td>Total Amount</td><td class="highlight">${inserted.currency} ${inserted.totalAmount}</td></tr>
          <tr><td>Payment Status</td><td>${inserted.isPaid ? "Paid" : "Pending / Pay at Hotel"}</td></tr>
        </table>
      `;

      // 1. Send to Guest
      if (guestEmail) {
        const guestContent = `
          <p>Hi ${inserted.guestName},</p>
          <p>Your booking has been successfully created. Here is your summary:</p>
          ${bookingSummary}
          <p>We look forward to hosting you!</p>
        `;
        const { sendEmail, getStandardHtmlLayout } = await import("core/email/service");
        await sendEmail({
          to: guestEmail,
          subject: `Booking Confirmed - ${hotel?.name || "Reseror"}`,
          html: getStandardHtmlLayout(guestContent, "Booking Confirmation"),
        });
      }

      // 2. Send to Hotel Owner
      if (ownerEmail) {
        const ownerContent = `
          <p>Hi ${hotel?.user?.name || "Partner"},</p>
          <p>You have received a new booking!</p>
          ${bookingSummary}
          <p>Please log in to your dashboard to manage this booking.</p>
        `;
        const { sendEmail, getStandardHtmlLayout } = await import("core/email/service");
        await sendEmail({
          to: ownerEmail,
          subject: `New Booking Received - ${inserted.guestName}`,
          html: getStandardHtmlLayout(ownerContent, "New Booking Notification"),
        });
      }
    } catch (emailError) {
      console.error("⚠️ Background email notification failed:", emailError);
      // Don't fail the request if email fails
    }

    if (inserted.isPaid) {
      const { recordAffiliateUsage } = await import("../lib/affiliate");
      await recordAffiliateUsage(db, inserted.id);
    }

    // --- Sync Payment Record for Owner Dashboard ---
    await syncBookingPaymentRecord(db, inserted.id);

    return c.json(
      {
        ...inserted,
        status: (inserted.status ?? "pending") as any,
      } as any,
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Database insertion error:", error);
    // Use 403 Forbidden for unexpected errors if 500 is not allowed by OpenAPI spec
    return c.json(
      {
        message: "Failed to create room booking",
      },
      HttpStatusCodes.FORBIDDEN
    );
  }
};

// Update roomBooking handler
export const updateRoomBookingHandler: APIRouteHandler<
  UpdateRoomBookingRoute
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

  // Get roomBooking without relations to avoid the error
  const roomBooking = await db.query.roomBookings.findFirst({
    where: eq(roomBookings.id, params.id),
  });

  if (!roomBooking) {
    return c.json(
      { message: "RoomBooking not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions: Admin, Guest (creator), or Hotel Owner
  if (user.role !== "admin" && roomBooking.createdBy !== user.id) {
    // Check if user is the hotel owner
    const userMemberships = await db.query.member.findMany({
      where: (m, { eq }) => eq(m.userId, user.id),
      columns: { organizationId: true }
    });
    const userOrgIds = userMemberships.map(m => m.organizationId);

    const isOwner = await db.query.hotels.findFirst({
      where: (h, { eq, and, or, inArray }) => and(
        eq(h.id, roomBooking.hotelId),
        or(
          eq(h.createdBy, user.id),
          userOrgIds.length > 0 ? inArray(h.organizationId, userOrgIds) : undefined,
          session.activeOrganizationId ? eq(h.organizationId, session.activeOrganizationId) : undefined
        )
      )
    });

    if (!isOwner) {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }
  }

  try {
    // Only update fields that are provided in the request body
    // All other fields will keep their existing values
    const updateData = {
      ...body, // Only includes fields sent in the request
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(roomBookings)
      .set(updateData)
      .where(eq(roomBookings.id, params.id))
      .returning();

    // --- Sync Payment Record for Owner Dashboard ---
    await syncBookingPaymentRecord(db, updated.id);

    return c.json(
      {
        ...updated,
        status: (updated.status ?? "pending") as any,
      } as any,
      HttpStatusCodes.OK
    );
  } catch (error) {
    return c.json(
      { message: "Failed to update room booking" },
      HttpStatusCodes.FORBIDDEN
    );
  }
};

export const deleteRoomBookingHandler: APIRouteHandler<
  DeleteRoomBookingRoute
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

  // Get roomBooking with hotel info
  const roomBooking = await db.query.roomBookings.findFirst({
    where: eq(roomBookings.id, params.id),
    // with: {
    //   hotel: true,
    // },
  });

  if (!roomBooking) {
    return c.json(
      { message: "RoomBooking not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions: Admin, Guest (creator), or Hotel Owner
  if (user.role !== "admin" && roomBooking.createdBy !== user.id) {
    // Check if user is the hotel owner
    const userMemberships = await db.query.member.findMany({
      where: (m, { eq }) => eq(m.userId, user.id),
      columns: { organizationId: true }
    });
    const userOrgIds = userMemberships.map(m => m.organizationId);

    const isOwner = await db.query.hotels.findFirst({
      where: (h, { eq, and, or, inArray }) => and(
        eq(h.id, roomBooking.hotelId),
        or(
          eq(h.createdBy, user.id),
          userOrgIds.length > 0 ? inArray(h.organizationId, userOrgIds) : undefined,
          session.activeOrganizationId ? eq(h.organizationId, session.activeOrganizationId) : undefined
        )
      )
    });

    if (!isOwner) {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }
  }

  await db.delete(roomBookings).where(eq(roomBookings.id, params.id));

  return c.json(
    { message: "RoomBooking deleted successfully" },
    HttpStatusCodes.OK
  );
};

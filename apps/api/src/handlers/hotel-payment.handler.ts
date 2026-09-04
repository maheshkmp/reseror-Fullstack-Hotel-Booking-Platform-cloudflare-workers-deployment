import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import * as schemas from "core/database/schema";
import { hotels, member, paymentsHotel } from "core/database/schema";
import type {
  CreatePaymentsHotelRoute,
  DeletePaymentsHotelRoute,
  GetPaymentsHotelRoute,
  ListPaymentsHotelsRoute,
  UpdatePaymentsHotelRoute,
  SettleAllPaymentsHotelRoute,
} from "../routes/hotel-payment.routes";

/**
 * Helper to determine organization ID robustly
 */
async function getRobustOrganizationId(c: any) {
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");

  let activeOrgId = session?.activeOrganizationId;
  
  if (!activeOrgId && user?.id) {
    const orgMember = await db.query.member.findFirst({
      where: eq(member.userId, user.id),
    });
    if (orgMember) {
      activeOrgId = orgMember.organizationId;
    }
  }
  
  return activeOrgId;
}

// List hotel payments handler
export const listPaymentsHotelsHandler: APIRouteHandler<
  ListPaymentsHotelsRoute
> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");

  const {
    page = "1",
    limit = "10",
    sort = "desc",
    hotelId,
    type,
    paid,
    dueDateFrom,
    dueDateTo,
    dateFrom,
    dateTo,
    status
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;


  // Build query conditions
  const whereConditions = [];
  

  // Enforce isolation for non-admins
  if (!user || user.role !== "admin") {
    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (session.activeOrganizationId) {
      whereConditions.push(eq(paymentsHotel.organizationId, session.activeOrganizationId));
    } else {
      // Fallback: Filter by organizations the user is a member of
      // We use IN clause with a subquery
      const memberships = db.select({ id: schemas.member.organizationId })
        .from(schemas.member)
        .where(eq(schemas.member.userId, user.id));
      
      whereConditions.push(sql`${paymentsHotel.organizationId} IN (${memberships})`);
    }
  }

  if (hotelId) {
    whereConditions.push(eq(paymentsHotel.hotelId, hotelId));
  }

  // Determine active organization ID robustly
  const activeOrgId = await getRobustOrganizationId(c);

  // Filter logic based on role
  if (user?.role === "hotelOwner") {
    if (activeOrgId) {
      whereConditions.push(eq(paymentsHotel.organizationId, activeOrgId));
    } else {
      // If they are a hotelOwner but have no organization, they should see NOTHING
      whereConditions.push(sql`1 = 0`);
    }
  } else if (user?.role !== "admin") {
     // If not an admin and not explicitly a hotelOwner, strictly restricted for security
     whereConditions.push(sql`1 = 0`);
  }

  if (type) {
    // Only allow valid payment types for hotel payments
    const validTypes = [
      "receive_commission_from_cash",
      "repay_net_from_online",
    ];
    if (validTypes.includes(type)) {
      whereConditions.push(eq(paymentsHotel.type, type));
    }
  }

  if (paid) {
    const isPaid = paid === "true";
    whereConditions.push(eq(paymentsHotel.paid, isPaid));
  }

  if (dueDateFrom) {
    const fromDate = new Date(dueDateFrom);
    whereConditions.push(sql`${paymentsHotel.dueDate} >= ${fromDate}`);
  }

  if (dueDateTo) {
    const toDate = new Date(dueDateTo);
    whereConditions.push(sql`${paymentsHotel.dueDate} <= ${toDate}`);
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    whereConditions.push(sql`${paymentsHotel.createdAt} >= ${fromDate}`);
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    whereConditions.push(sql`${paymentsHotel.createdAt} <= ${toDate}`);
  }

  if (status) {
    whereConditions.push(eq(paymentsHotel.status, status as any));
  }

  const query = db.query.paymentsHotel.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort === "asc" ? [fields.createdAt] : [sql`${fields.createdAt} DESC`],
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(paymentsHotel)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [paymentsHotelEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: paymentsHotelEntries as unknown as any,
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

// Get hotel payment handler
export const getPaymentsHotelHandler: APIRouteHandler<
  GetPaymentsHotelRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const user = c.get("user");

  const paymentEntry = await db.query.paymentsHotel.findFirst({
    where: eq(paymentsHotel.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "Hotel payment not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Permission check
  if (user?.role !== "admin") {
    const activeOrgId = await getRobustOrganizationId(c);
    if (user?.role === "hotelOwner" && activeOrgId) {
      if (paymentEntry.organizationId !== activeOrgId) {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
    } else {
      // Forbidden for any other non-admin role
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }
  }

  return c.json(paymentEntry as unknown as any, HttpStatusCodes.OK);
};

// Create hotel payment handler
export const createPaymentsHotelHandler: APIRouteHandler<
  CreatePaymentsHotelRoute
> = async (c) => {
  const body = c.req.valid("json");
  const db = c.get("db");
  const user = c.get("user");

  // Verify hotel exists
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, body.hotelId as any),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Permission check
  if (user?.role !== "admin") {
    const activeOrgId = await getRobustOrganizationId(c);
    if (user?.role === "hotelOwner" && activeOrgId) {
      if (hotel.organizationId !== activeOrgId) {
        return c.json(
          { message: "You don't have permission to create payments for this hotel" },
          HttpStatusCodes.FORBIDDEN
        );
      }
    } else {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }
  }

  // Add organizationId from the hotel
  const paymentsHotelData = {
    ...body,
    organizationId: hotel.organizationId,
  };

  const [inserted] = await db
    .insert(paymentsHotel)
    .values(paymentsHotelData as any)
    .returning();

  return c.json(inserted as unknown as any, HttpStatusCodes.CREATED);
};

// Update hotel payment handler
export const updatePaymentsHotelHandler: APIRouteHandler<
  UpdatePaymentsHotelRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const body = c.req.valid("json");
  const user = c.get("user");

  // Get payment entry
  const paymentEntry = await db.query.paymentsHotel.findFirst({
    where: eq(paymentsHotel.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "Hotel payment not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Permission check
  if (user?.role !== "admin") {
    const activeOrgId = await getRobustOrganizationId(c);
    if (user?.role === "hotelOwner" && activeOrgId) {
      if (paymentEntry.organizationId !== activeOrgId) {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
    } else {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }
  }

  const updatePayload = { ...body } as any;

  // Auto-set paid status if confirmed
  if (updatePayload.status === "confirmed") {
    updatePayload.paid = true;
    updatePayload.paidAt = new Date();
  }

  const [updated] = await db
    .update(paymentsHotel)
    .set(updatePayload)
    .where(eq(paymentsHotel.id, params.id))
    .returning();

  return c.json(updated as unknown as any, HttpStatusCodes.OK);
};

// Delete hotel payment handler
export const deletePaymentsHotelHandler: APIRouteHandler<
  DeletePaymentsHotelRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const user = c.get("user");

  // Get payment entry
  const paymentEntry = await db.query.paymentsHotel.findFirst({
    where: eq(paymentsHotel.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "Hotel payment not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Permission check
  if (user?.role !== "admin") {
    const activeOrgId = await getRobustOrganizationId(c);
    if (user?.role === "hotelOwner" && activeOrgId) {
      if (paymentEntry.organizationId !== activeOrgId) {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
    } else {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }
  }

  await db.delete(paymentsHotel).where(eq(paymentsHotel.id, params.id));

  return c.json(
    { message: "Hotel payment deleted successfully" },
    HttpStatusCodes.OK
  );
};

// Settle all hotel payments handler
export const settleAllPaymentsHandler: APIRouteHandler<
  SettleAllPaymentsHotelRoute
> = async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = c.req.valid("json");

  // Determine active organization ID robustly
  const activeOrgId = await getRobustOrganizationId(c);

  if (!activeOrgId && user?.role !== "admin") {
    return c.json(
      { message: "Unauthorized or no active organization found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Build query conditions
  const whereConditions = [
    eq(paymentsHotel.paid, false),
    eq(paymentsHotel.type, "receive_commission_from_cash")
  ];

  if (user?.role !== "admin") {
    whereConditions.push(eq(paymentsHotel.organizationId, activeOrgId));
  }

  if (body.hotelId) {
    whereConditions.push(eq(paymentsHotel.hotelId, body.hotelId));
  }

  // Get all pending payments to calculate total
  const pendingPayments = await db.query.paymentsHotel.findMany({
    where: and(...whereConditions),
  });

  if (pendingPayments.length === 0) {
    return c.json(
      { 
        message: "No pending commissions to settle",
        settledCount: 0,
        totalAmount: 0
      },
      HttpStatusCodes.OK
    );
  }

  const totalAmount = pendingPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  // Mark all as paid
  await db
    .update(paymentsHotel)
    .set({
      paid: true,
      paidAt: new Date(),
      status: "confirmed",
    })
    .where(and(...whereConditions));

  return c.json(
    { 
      message: "Successfully settled all pending commissions",
      settledCount: pendingPayments.length,
      totalAmount
    },
    HttpStatusCodes.OK
  );
};

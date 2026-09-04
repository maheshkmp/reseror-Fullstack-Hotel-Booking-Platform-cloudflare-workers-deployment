import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";

import { hotels, member, paymentsAdmin } from "core/database/schema";
import type {
  CreatePaymentsAdminRoute,
  DeletePaymentsAdminRoute,
  GetPaymentsAdminRoute,
  ListPaymentsAdminsRoute,
  UpdatePaymentsAdminRoute,
} from "../routes/admin-payment.routes";
import { paymentsHotel } from "core/database/schema";

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

// List paymentsAdmins handler
export const listPaymentsAdminsHandler: APIRouteHandler<
  ListPaymentsAdminsRoute
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
    method,
    settled,
    dateFrom,
    dateTo,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [];

  if (hotelId) {
    whereConditions.push(eq(paymentsAdmin.hotelId, hotelId));
  }

  // Determine active organization ID robustly
  const activeOrgId = await getRobustOrganizationId(c);

  // Filter logic based on role
  if (user?.role === "hotelOwner") {
    if (activeOrgId) {
      whereConditions.push(eq(paymentsAdmin.organizationId, activeOrgId));
    } else {
      // If they are a hotelOwner but have no organization, they should see NOTHING
      whereConditions.push(sql`1 = 0`);
    }
  } else if (user?.role !== "admin") {
     // If not an admin and not explicitly a hotelOwner, strictly restricted for security
     whereConditions.push(sql`1 = 0`);
  }

  if (type) {
    // Only allow valid payment types
    const validTypes = ["incoming", "outgoing"];
    if (validTypes.includes(type)) {
      whereConditions.push(eq(paymentsAdmin.type, type));
    }
  }

  if (method) {
    whereConditions.push(eq(paymentsAdmin.method, method));
  }

  if (settled) {
    const isSettled = settled === "true";
    whereConditions.push(eq(paymentsAdmin.settled, isSettled));
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    whereConditions.push(sql`${paymentsAdmin.createdAt} >= ${fromDate}`);
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    whereConditions.push(sql`${paymentsAdmin.createdAt} <= ${toDate}`);
  }

  const query = db.query.paymentsAdmin.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort === "asc" ? [fields.createdAt] : [sql`${fields.createdAt} DESC`],
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(paymentsAdmin)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [paymentsAdminEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  // Fetch hotel payments that are pending/submitted/confirmed/rejected to show as "reports"
  const hotelReports = await db.query.paymentsHotel.findMany({
    where: hotelId ? eq(paymentsHotel.hotelId, hotelId) : undefined,
    orderBy: (fields) => sort === "asc" ? [fields.createdAt] : [sql`${fields.createdAt} DESC`],
  });

  // Map hotel payments to match admin payment structure for the table
  const mappedReports = hotelReports.map(h => ({
    ...h,
    isReport: true, // Flag for UI to handle confirm/reject
    settled: h.paid,
    settledAt: h.paidAt,
    method: h.bankName || "Unknown",
    // Invert type for admin view: commission TO admin is incoming
    type: (h.type === "receive_commission_from_cash" || h.type === "restaurant_booking_commission") ? "incoming" : "outgoing"
  }));

  const combinedData = [...paymentsAdminEntries, ...mappedReports];

  const totalCount = (_totalCount[0]?.count || 0) + mappedReports.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: combinedData as any,
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

// Get paymentsAdmin handler
export const getPaymentsAdminHandler: APIRouteHandler<
  GetPaymentsAdminRoute
> = async (c) => {
  const db = c.get("db");
  const params = c.req.valid("param");
  const user = c.get("user");

  const paymentEntry = await db.query.paymentsAdmin.findFirst({
    where: eq(paymentsAdmin.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "PaymentsAdmin not found" },
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

  return c.json(paymentEntry as unknown as any, HttpStatusCodes.OK);
};

// Create paymentsAdmin handler
export const createPaymentsAdminHandler: APIRouteHandler<
  CreatePaymentsAdminRoute
> = async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const user = c.get("user");

  // Verify hotel exists first
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, body.hotelId),
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

  // Use hotel's organization ID
  const organizationId = hotel.organizationId;

  // Validate required fields and clean up the data
  const cleanedData = {
    hotelId: body.hotelId,
    bookingId: body.bookingId || null,
    organizationId: organizationId,
    type: body.type || null,
    method: body.method || null,
    amount: body.amount,
    settled: body.settled || false,
    settledAt: body.settled ? new Date() : null,
  };

  // Validate that required fields are not empty
  if (!cleanedData.hotelId) {
    return c.json(
      { message: "Hotel ID is required" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  if (!cleanedData.amount) {
    return c.json({ message: "Amount is required" }, HttpStatusCodes.FORBIDDEN);
  }

  try {
    const [inserted] = await db
      .insert(paymentsAdmin)
      .values(cleanedData)
      .returning();

    return c.json(inserted as unknown as any, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("Database insertion error:", error);
    return c.json(
      {
        message: "Failed to create admin payment",
      },
      HttpStatusCodes.FORBIDDEN
    );
  }
};

// Update paymentsAdmin handler
export const updatePaymentsAdminHandler: APIRouteHandler<
  UpdatePaymentsAdminRoute
> = async (c) => {
  const db = c.get("db");
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const user = c.get("user");

  // Get payment entry
  const paymentEntry = await db.query.paymentsAdmin.findFirst({
    where: eq(paymentsAdmin.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "PaymentsAdmin not found" },
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

  const [updated] = await db
    .update(paymentsAdmin)
    .set(body)
    .where(eq(paymentsAdmin.id, params.id))
    .returning();

  return c.json(updated as unknown as any, HttpStatusCodes.OK);
};

// Delete paymentsAdmin handler
export const deletePaymentsAdminHandler: APIRouteHandler<
  DeletePaymentsAdminRoute
> = async (c) => {
  const db = c.get("db");
  const params = c.req.valid("param");
  const user = c.get("user");

  // Get payment entry
  const paymentEntry = await db.query.paymentsAdmin.findFirst({
    where: eq(paymentsAdmin.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "PaymentsAdmin not found" },
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

  await db.delete(paymentsAdmin).where(eq(paymentsAdmin.id, params.id));

  return c.json(
    { message: "PaymentsAdmin deleted successfully" },
    HttpStatusCodes.OK
  );
};

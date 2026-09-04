import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";
import { restaurantBookings, restaurants, paymentsHotel, siteSettings } from "core/database/schema";
import type {
  CreateRestaurantBookingRoute,
  ListRestaurantBookingsRoute,
  UpdateRestaurantBookingStatusRoute,
} from "../routes/restaurant-booking.routes";

export const createRestaurantBookingHandler: APIRouteHandler<
  CreateRestaurantBookingRoute
> = async (c) => {
  const body = c.req.valid("json");
  const user = c.get("user");
  const db = c.get("db");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    const [inserted] = await db
      .insert(restaurantBookings)
      .values({
        ...body,
        userId: user.id,
      })
      .returning();

    return c.json({
      ...inserted,
      bookingDate: inserted.bookingDate.toISOString(),
      checkInAt: inserted.checkInAt ? inserted.checkInAt.toISOString() : null,
      createdAt: inserted.createdAt.toISOString(),
      updatedAt: inserted.updatedAt ? inserted.updatedAt.toISOString() : null,
    } as any, HttpStatusCodes.CREATED);
  } catch (error: any) {
    console.error("Error creating restaurant booking:", error);
    return c.json(
      { message: error.message || "Failed to create booking" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const listRestaurantBookingsHandler: APIRouteHandler<
  ListRestaurantBookingsRoute
> = async (c) => {
  const { restaurantId } = c.req.valid("query");
  const user = c.get("user");
  const db = c.get("db");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    let bookings;

    if (restaurantId) {
      const restaurant = await db.query.restaurants.findFirst({
        where: (fields, { eq }) => eq(fields.id, restaurantId),
      });

      if (!restaurant) {
        return c.json({ message: "Restaurant not found" }, HttpStatusCodes.NOT_FOUND);
      }

      // If user owns the restaurant or is an admin, show ALL bookings for it
      // Otherwise, only show bookings they made themselves for this restaurant
      if (user.role === "admin" || restaurant.createdBy === user.id) {
        bookings = await db.query.restaurantBookings.findMany({
          where: (fields, { eq }) => eq(fields.restaurantId, restaurantId),
          with: { restaurant: true },
        });
      } else {
        bookings = await db.query.restaurantBookings.findMany({
          where: (fields, { and, eq }) => and(
            eq(fields.userId, user.id),
            eq(fields.restaurantId, restaurantId)
          ),
          with: { restaurant: true },
        });
      }
    } else {
      // Default: List bookings the user has made across all restaurants
      bookings = await db.query.restaurantBookings.findMany({
        where: (fields, { eq }) => eq(fields.userId, user.id),
        with: {
          restaurant: true,
        },
      });
    }

    return c.json(bookings.map(b => ({
      ...b,
      bookingDate: b.bookingDate.toISOString(),
      checkInAt: b.checkInAt ? b.checkInAt.toISOString() : null,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt ? b.updatedAt.toISOString() : null,
    })) as any, HttpStatusCodes.OK);
  } catch (error: any) {
    return c.json(
      { message: "Failed to list bookings" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateRestaurantBookingStatusHandler: APIRouteHandler<
  UpdateRestaurantBookingStatusRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const { status } = c.req.valid("json");
  const db = c.get("db");
  const user = c.get("user");

  if (!user) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  try {
    // 1. Fetch the booking first to verify ownership
    const booking = await db.query.restaurantBookings.findFirst({
      where: eq(restaurantBookings.id, id),
      with: { restaurant: true },
    });

    if (!booking) {
      return c.json({ message: "Booking not found" }, HttpStatusCodes.NOT_FOUND);
    }

    // 2. Verify ownership: Only the restaurant owner (createdBy) or an admin can update status
    if (user.role !== "admin" && booking.restaurant.createdBy !== user.id) {
      return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
    }

    const [updated] = await db
      .update(restaurantBookings)
      .set({ 
        status, 
        checkInAt: status === "arrived" ? new Date() : undefined,
        updatedAt: new Date() 
      })
      .where(eq(restaurantBookings.id, id))
      .returning();

    if (!updated) {
      return c.json({ message: "Booking not found" }, HttpStatusCodes.NOT_FOUND);
    }

    // Phase 4: Handle Anti-Fraud Refund & Commission Logic
    if (status === "arrived") {
      try {
        if (booking && booking.restaurant) {
          // Fetch commission settings
          const settings = await db.query.siteSettings.findFirst({ 
            where: (fields, { eq }) => eq(fields.id, 1) 
          });
          
          // Calculate commission (e.g., 10% of the deposit as a service fee to the owner)
          const commissionRate = parseFloat(settings?.defaultCommissionRate || "10.00") / 100;
          const commissionAmount = (parseFloat(booking.totalDeposit) * commissionRate).toFixed(2);

          // Create a charge for the hotel owner
          await db.insert(paymentsHotel).values({
            hotelId: booking.restaurant.hotelId,
            organizationId: booking.restaurant.organizationId,
            restaurantBookingId: booking.id,
            type: "restaurant_booking_commission", // Owner owes Reseror
            amount: commissionAmount,
            status: "pending",
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
          });

          console.log(`[Anti-Fraud] Refund initiated for booking ${id}. Commission of ${commissionAmount} charged to hotel.`);
        }
      } catch (err) {
        console.error("Failed to process commission/refund logic:", err);
        // We don't fail the whole request if commission tracking fails, but we log it
      }
    }

    return c.json({
      ...updated,
      bookingDate: updated.bookingDate.toISOString(),
      checkInAt: updated.checkInAt ? updated.checkInAt.toISOString() : null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt ? updated.updatedAt.toISOString() : null,
    } as any, HttpStatusCodes.OK);
  } catch (error: any) {
    return c.json(
      { message: "Failed to update booking status" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

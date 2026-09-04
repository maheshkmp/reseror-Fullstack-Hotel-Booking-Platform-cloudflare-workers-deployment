import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { hotelPaymentMethods, hotels } from "core/database/schema";
import type { APIRouteHandler } from "@/types";
import {
  GetHotelPaymentMethodsRoute,
  UpsertPaymentMethodsToHotelRoute,
} from "../routes/payment-methods.routes";

export const getHotelPaymentMethodsHandler: APIRouteHandler<
  GetHotelPaymentMethodsRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const paymentMethods = await db.query.hotelPaymentMethods.findMany({
    where: eq(hotelPaymentMethods.hotelId, params.id),
  });

  return c.json(paymentMethods, HttpStatusCodes.OK);
};

export const upsertPaymentMethodsToHotelHandler: APIRouteHandler<
  UpsertPaymentMethodsToHotelRoute
> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const db = c.get("db");
  const user = c.get("user");

  if (!user) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Verify ownership
  if (user.role !== "admin" && hotel.createdBy !== user.id) {
    return c.json(
      { message: "You do not have permission to manage this hotel's payment methods" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Delete existing and insert new (sync)
  await db
    .delete(hotelPaymentMethods)
    .where(eq(hotelPaymentMethods.hotelId, params.id));

  if (body.length > 0) {
    const inserted = await db
      .insert(hotelPaymentMethods)
      .values(
        body.map((item) => ({
          ...item,
          hotelId: params.id,
        }))
      )
      .returning();

    return c.json(
      {
        message: "Payment methods synced successfully",
        count: inserted.length,
      },
      HttpStatusCodes.OK
    );
  }

  return c.json(
    {
      message: "Payment methods cleared successfully",
      count: 0,
    },
    HttpStatusCodes.OK
  );
};

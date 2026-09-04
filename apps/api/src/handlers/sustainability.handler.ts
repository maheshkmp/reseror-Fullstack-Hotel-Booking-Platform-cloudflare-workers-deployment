import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { hotelSustainability, hotels } from "core/database/schema";
import type { APIRouteHandler } from "@/types";
import {
  AddHotelSustainabilityRoute,
  GetHotelSustainabilityRoute,
} from "../routes/sustainability.routes";

export const getHotelSustainabilityHandler: APIRouteHandler<
  GetHotelSustainabilityRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const sustainability = await db.query.hotelSustainability.findMany({
    where: eq(hotelSustainability.hotelId, params.id),
  });

  return c.json(sustainability, HttpStatusCodes.OK);
};

export const addHotelSustainabilityHandler: APIRouteHandler<
  AddHotelSustainabilityRoute
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
      { message: "You do not have permission to manage this hotel's sustainability initiatives" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Delete existing and insert new (sync)
  await db
    .delete(hotelSustainability)
    .where(eq(hotelSustainability.hotelId, params.id));

  if (body.length > 0) {
    const inserted = await db
      .insert(hotelSustainability)
      .values(
        body.map((item) => ({
          ...item,
          hotelId: params.id,
        }))
      )
      .returning();

    return c.json(
      {
        message: "Sustainability initiatives synced successfully",
        count: inserted.length,
      },
      HttpStatusCodes.OK
    );
  }

  return c.json(
    {
      message: "Sustainability initiatives cleared successfully",
      count: 0,
    },
    HttpStatusCodes.OK
  );
};

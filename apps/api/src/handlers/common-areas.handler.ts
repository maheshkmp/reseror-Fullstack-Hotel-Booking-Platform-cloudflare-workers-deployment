import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { hotelCommonAreas, hotels } from "core/database/schema";
import type { APIRouteHandler } from "@/types";
import {
  GetHotelCommonAreasRoute,
  UpsertCommonAreasToHotelRoute,
} from "../routes/common-areas.routes";

export const getHotelCommonAreasHandler: APIRouteHandler<
  GetHotelCommonAreasRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const commonAreas = await db.query.hotelCommonAreas.findMany({
    where: eq(hotelCommonAreas.hotelId, params.id),
  });

  return c.json(commonAreas, HttpStatusCodes.OK);
};

export const upsertCommonAreasToHotelHandler: APIRouteHandler<
  UpsertCommonAreasToHotelRoute
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
      { message: "You do not have permission to manage this hotel's common areas" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Delete existing and insert new (sync)
  await db
    .delete(hotelCommonAreas)
    .where(eq(hotelCommonAreas.hotelId, params.id));

  if (body.length > 0) {
    const inserted = await db
      .insert(hotelCommonAreas)
      .values(
        body.map((item) => ({
          ...item,
          hotelId: params.id,
        }))
      )
      .returning();

    return c.json(
      {
        message: "Common areas synced successfully",
        count: inserted.length,
      },
      HttpStatusCodes.OK
    );
  }

  return c.json(
    {
      message: "Common areas cleared successfully",
      count: 0,
    },
    HttpStatusCodes.OK
  );
};

import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { hotelTransportParking, hotels } from "core/database/schema";
import type { APIRouteHandler } from "@/types";
import {
  AddHotelTransportRoute,
  GetHotelTransportRoute,
} from "../routes/transport.routes";

export const getHotelTransportHandler: APIRouteHandler<
  GetHotelTransportRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const transport = await db.query.hotelTransportParking.findMany({
    where: eq(hotelTransportParking.hotelId, params.id),
  });

  return c.json(transport, HttpStatusCodes.OK);
};

export const addHotelTransportHandler: APIRouteHandler<
  AddHotelTransportRoute
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
      { message: "You do not have permission to manage this hotel's transport & parking specifics" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Delete existing and insert new (sync)
  await db
    .delete(hotelTransportParking)
    .where(eq(hotelTransportParking.hotelId, params.id));

  if (body.length > 0) {
    const inserted = await db
      .insert(hotelTransportParking)
      .values(
        body.map((item) => ({
          ...item,
          hotelId: params.id,
        }))
      )
      .returning();

    return c.json(
      {
        message: "Transport & parking specifics synced successfully",
        count: inserted.length,
      },
      HttpStatusCodes.OK
    );
  }

  return c.json(
    {
      message: "Transport & parking specifics cleared successfully",
      count: 0,
    },
    HttpStatusCodes.OK
  );
};

/* eslint-disable prefer-const */
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { hotelAmenities, hotels } from "core/database/schema";
import type {
  GetHotelAmenitiesRoute,
  UpsertAmenitiesToHotelRoute
} from "../routes/amenities.routes";

// List hotel amenities route handler
export const getHotelAmenitiesHandler: APIRouteHandler<
  GetHotelAmenitiesRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const allHotelAmenties = await db.query.hotelAmenities.findMany({
    where(fields, { eq }) {
      return eq(fields.hotelId, params.id);
    }
  });

  return c.json(allHotelAmenties, HttpStatusCodes.OK);
};

// New new hotel images route handler
export const upsertAmenitiesToHotelHandler: APIRouteHandler<
  UpsertAmenitiesToHotelRoute
> = async (c) => {
  const body = c.req.valid("json");
  const params = c.req.valid("param");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
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
      { message: "You do not have permission to manage this hotel's amenities" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const currentAmenities = await db.query.hotelAmenities.findMany({
    where: (fields, { eq }) => eq(fields.hotelId, params.id)
  });

  if (currentAmenities.length > 0) {
    // If amenities already exist, delete them first
    await db
      .delete(hotelAmenities)
      .where(eq(hotelAmenities.hotelId, params.id));
  }

  let insertedAmenities = [];

  await Promise.all(
    body.map(async (amenty:any) => {
      const _insertedAmenity = await db
        .insert(hotelAmenities)
        .values({
          hotelId: params.id,
          amenityType: amenty.amenityType
        })
        .returning();

      insertedAmenities.push(_insertedAmenity[0]);
    })
  );

  return c.json(body, HttpStatusCodes.CREATED);
};

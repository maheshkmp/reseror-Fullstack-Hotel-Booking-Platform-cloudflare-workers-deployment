/* eslint-disable prefer-const */
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";

import { hotelNearbyPois, hotels } from "core/database/schema";
import { HotelNearbyPoi } from "core/zod";
import type {
  GetHotelNearbyPoisRoute,
  RemoveHotelNearbyPoiRoute,
  UpdateHotelNearbyPoiRoute,
  UpsertNearbyPoisToHotelRoute,
} from "../routes/nearby-pois.routes";

/**
 * ================================================================
 * Hotel Nearby POIs Handlers
 * ================================================================
 */

// List hotel nearby POIs route handler
export const getHotelNearbyPoisHandler: APIRouteHandler<
  GetHotelNearbyPoisRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const allNearbyPois = await db.query.hotelNearbyPois.findMany({
    where(fields, { eq }) {
      return eq(fields.hotelId, params.id);
    },
  });

  return c.json(allNearbyPois as unknown as any, HttpStatusCodes.OK);
};

// Upsert hotel nearby POIs route handler
export const upsertNearbyPoisToHotelHandler: APIRouteHandler<
  UpsertNearbyPoisToHotelRoute
> = async (c) => {
  const body = c.req.valid("json");
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

  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Verify ownership
  if (user.role !== "admin" && hotel.createdBy !== user.id) {
    return c.json(
      { message: "You do not have permission to manage this hotel's POIs" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const currentPois = await db.query.hotelNearbyPois.findMany({
    where: (fields, { eq }) => eq(fields.hotelId, params.id),
  });

  if (currentPois.length > 0) {
    // If POIs already exist, delete them first (or we could do a more sophisticated sync)
    await db.delete(hotelNearbyPois).where(eq(hotelNearbyPois.hotelId, params.id));
  }

  let insertedPois: HotelNearbyPoi[] = [];

  await Promise.all(
    body.map(async (poi) => {
      const _insertedPoi = await db
        .insert(hotelNearbyPois)
        .values({
          hotelId: params.id,
          name: poi.name,
          type: poi.type,
          distanceText: poi.distanceText,
          durationText: poi.durationText,
          latitude: poi.latitude,
          longitude: poi.longitude,
          isActive: poi.isActive ?? true,
        })
        .returning();

      if (_insertedPoi[0]) {
        insertedPois.push(_insertedPoi[0] as unknown as any);
      }
    })
  );

  return c.json(insertedPois as unknown as any, HttpStatusCodes.CREATED);
};

// Update hotel nearby POI route handler
export const updateHotelNearbyPoiHandler: APIRouteHandler<
  UpdateHotelNearbyPoiRoute
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

  // For updateHotelNearbyPoiHandler, params.id is the POI ID.
  const poi = await db.query.hotelNearbyPois.findFirst({
    where: eq(hotelNearbyPois.id, params.id),
    with: {
        hotel: true
    }
  });

  if (!poi) {
    return c.json({ message: "POI not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Verify ownership
  if (user.role !== "admin" && (poi as any).hotel?.createdBy !== user.id) {
    return c.json(
      { message: "You do not have permission to manage this hotel's POIs" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const updatedPoi = await db
      .update(hotelNearbyPois)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(hotelNearbyPois.id, params.id))
      .returning();

    if (updatedPoi.length === 0) {
      return c.json(
        {
          message: "POI not found",
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(updatedPoi[0] as unknown as any, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Failed to update hotel nearby POI:", error);
    return c.json(
      {
        message: "Failed to update hotel nearby POI",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Remove hotel nearby POI route handler
export const removeHotelNearbyPoiHandler: APIRouteHandler<
  RemoveHotelNearbyPoiRoute
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

  // For removeHotelNearbyPoiHandler, params.id is the POI ID.
  const poi = await db.query.hotelNearbyPois.findFirst({
    where: eq(hotelNearbyPois.id, params.id),
    with: {
        hotel: true
    }
  });

  if (!poi) {
    return c.json({ message: "POI not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Verify ownership
  if (user.role !== "admin" && (poi as any).hotel?.createdBy !== user.id) {
    return c.json(
      { message: "You do not have permission to manage this hotel's POIs" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const deletedPoi = await db
      .delete(hotelNearbyPois)
      .where(eq(hotelNearbyPois.id, params.id))
      .returning();

    if (deletedPoi.length === 0) {
      return c.json(
        {
          message: "POI not found",
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        message: "Nearby POI removed successfully",
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Failed to delete hotel nearby POI:", error);
    return c.json(
      {
        message: "Failed to delete hotel nearby POI",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

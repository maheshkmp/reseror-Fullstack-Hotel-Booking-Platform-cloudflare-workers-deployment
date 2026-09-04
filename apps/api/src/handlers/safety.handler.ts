/* eslint-disable prefer-const */
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";
import { hotelSafetyFeatures, hotels } from "core/database/schema";
import { HotelSafetyFeature } from "core/zod";
import type {
  GetHotelSafetyFeaturesRoute,
  UpsertSafetyToHotelRoute,
  RemoveHotelSafetyRoute,
} from "../routes/safety.routes";

/**
 * ================================================================
 * Hotel Safety Features Handlers
 * ================================================================
 */

// List hotel safety features route handler
export const getHotelSafetyFeaturesHandler: APIRouteHandler<
  GetHotelSafetyFeaturesRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const allHotelSafety = await db.query.hotelSafetyFeatures.findMany({
    where(fields, { eq }) {
      return eq(fields.hotelId, params.id);
    },
  });

  return c.json(allHotelSafety as unknown as any, HttpStatusCodes.OK);
};

// Upsert hotel safety features route handler
export const upsertSafetyToHotelHandler: APIRouteHandler<
  UpsertSafetyToHotelRoute
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
      { message: "You do not have permission to manage this hotel's safety features" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Delete existing safety features for this hotel to perform a clean update
  await db.delete(hotelSafetyFeatures).where(eq(hotelSafetyFeatures.hotelId, params.id));

  let insertedSafety: HotelSafetyFeature[] = [];

  if (body.length > 0) {
    await Promise.all(
      body.map(async (feature) => {
        const _inserted = await db
          .insert(hotelSafetyFeatures)
          .values({
            hotelId: params.id,
            featureType: feature.featureType,
          })
          .returning();

        if (_inserted[0]) {
          insertedSafety.push(_inserted[0] as unknown as any);
        }
      })
    );
  }

  return c.json(insertedSafety as unknown as any, HttpStatusCodes.CREATED);
};

// Remove hotel safety feature route handler
export const removeHotelSafetyHandler: APIRouteHandler<
  RemoveHotelSafetyRoute
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

  // For removeHotelSafetyHandler, params.id might be the feature ID, not the hotel ID.
  // We need to fetch the feature first to find the hotelId.
  const feature = await db.query.hotelSafetyFeatures.findFirst({
    where: eq(hotelSafetyFeatures.id, params.id),
    with: {
        hotel: true
    }
  });

  if (!feature) {
    return c.json({ message: "Safety feature not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Verify ownership via the feature's hotel
  if (user.role !== "admin" && (feature as any).hotel?.createdBy !== user.id) {
    return c.json(
      { message: "You do not have permission to manage this hotel's safety features" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const deleted = await db
      .delete(hotelSafetyFeatures)
      .where(eq(hotelSafetyFeatures.id, params.id))
      .returning();

    if (deleted.length === 0) {
      return c.json(
        {
          message: "Safety feature not found",
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        message: "Hotel safety feature removed successfully",
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Failed to delete hotel safety feature:", error);
    return c.json(
      {
        message: "Failed to delete hotel safety feature",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

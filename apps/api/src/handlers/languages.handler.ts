/* eslint-disable prefer-const */
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";
import { hotelLanguages, hotels } from "core/database/schema";
import { HotelLanguage } from "core/zod";
import type {
  GetHotelLanguagesRoute,
  UpsertLanguagesToHotelRoute,
  RemoveHotelLanguageRoute,
} from "../routes/languages.routes";

/**
 * ================================================================
 * Hotel Languages Handlers
 * ================================================================
 */

// List hotel languages route handler
export const getHotelLanguagesHandler: APIRouteHandler<
  GetHotelLanguagesRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const allHotelLanguages = await db.query.hotelLanguages.findMany({
    where(fields, { eq }) {
      return eq(fields.hotelId, params.id);
    },
  });

  return c.json(allHotelLanguages as unknown as any, HttpStatusCodes.OK);
};

// Upsert hotel languages route handler
export const upsertLanguagesToHotelHandler: APIRouteHandler<
  UpsertLanguagesToHotelRoute
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
      { message: "You do not have permission to manage this hotel's languages" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Delete existing languages for this hotel to perform a clean update
  await db.delete(hotelLanguages).where(eq(hotelLanguages.hotelId, params.id));

  let insertedLanguages: HotelLanguage[] = [];

  if (body.length > 0) {
    await Promise.all(
      body.map(async (lang) => {
        const _inserted = await db
          .insert(hotelLanguages)
          .values({
            hotelId: params.id,
            languageCode: lang.languageCode,
          })
          .returning();

        if (_inserted[0]) {
          insertedLanguages.push(_inserted[0] as unknown as any);
        }
      })
    );
  }

  return c.json(insertedLanguages as unknown as any, HttpStatusCodes.CREATED);
};

// Remove hotel language route handler
export const removeHotelLanguageHandler: APIRouteHandler<
  RemoveHotelLanguageRoute
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

  // For removeHotelLanguageHandler, params.id might be the record ID, not the hotel ID.
  const languageRecord = await db.query.hotelLanguages.findFirst({
    where: eq(hotelLanguages.id, params.id),
    with: {
        hotel: true
    }
  });

  if (!languageRecord) {
    return c.json({ message: "Language record not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Verify ownership
  if (user.role !== "admin" && (languageRecord as any).hotel?.createdBy !== user.id) {
    return c.json(
      { message: "You do not have permission to manage this hotel's languages" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const deleted = await db
      .delete(hotelLanguages)
      .where(eq(hotelLanguages.id, params.id))
      .returning();

    if (deleted.length === 0) {
      return c.json(
        {
          message: "Language not found",
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        message: "Hotel language removed successfully",
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Failed to delete hotel language:", error);
    return c.json(
      {
        message: "Failed to delete hotel language",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

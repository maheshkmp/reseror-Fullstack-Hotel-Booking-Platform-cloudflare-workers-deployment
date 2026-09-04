import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { hotelImages } from "core/database/schema";
import type {
  AddNewHotelImagesRoute,
  GetAllHotelImagesRoute,
  GetHotelImagesRoute,
  RemoveHotelImageRoute,
  UpdateHotelImageRoute,
} from "../routes/hotel-images.routes";

/**
 * ================================================================
 * Hotel images Handlers
 * ================================================================
 */
// List hotel images route handler
export const getHotelImagesHandler: APIRouteHandler<
  GetHotelImagesRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const allHotelImages = await db.query.hotelImages.findMany({
    where: (fields, { eq }) => eq(fields.hotelId, params.id),
  });

  return c.json(allHotelImages as unknown as any, HttpStatusCodes.OK);
};

// New new hotel images route handler
export const addNewHotelImagesHandler: APIRouteHandler<
  AddNewHotelImagesRoute
> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  let activeOrganizationId = session.activeOrganizationId;

  if (!activeOrganizationId) {
    const organizationMember = await db.query.member.findFirst({
      where: (fields, { eq }) => eq(fields.userId, user.id),
    });
    if (organizationMember && organizationMember.role !== "member") {
      activeOrganizationId = organizationMember.organizationId;
    }
  }

  if (!activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const insertedImages = await db.insert(hotelImages).values(body).returning();

  return c.json(insertedImages as unknown as any, HttpStatusCodes.CREATED);
};

// Update hotel image route handler
export const updateHotelImageHandler: APIRouteHandler<
  UpdateHotelImageRoute
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

  let activeOrganizationId = session.activeOrganizationId;

  if (!activeOrganizationId) {
    const organizationMember = await db.query.member.findFirst({
      where: (fields, { eq }) => eq(fields.userId, user.id),
    });
    if (organizationMember && organizationMember.role !== "member") {
      activeOrganizationId = organizationMember.organizationId;
    }
  }

  if (!activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updatedImage] = await db
    .update(hotelImages)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(hotelImages.id, params.id))
    .returning();

  return c.json(updatedImage as unknown as any, HttpStatusCodes.OK);
};

// Remove hotel image route handler
export const removeHotelImageHandler: APIRouteHandler<
  RemoveHotelImageRoute
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

  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [deletedImage] = await db
    .delete(hotelImages)
    .where(eq(hotelImages.id, params.id))
    .returning();

  return c.json(deletedImage as unknown as any, HttpStatusCodes.OK);
};

// Handler to get all images from all hotels
export const getAllHotelImagesHandler: APIRouteHandler<
  GetAllHotelImagesRoute
> = async (c) => {
  const db = c.get("db");
  const allHotelImages = await db.query.hotelImages.findMany();

  return c.json(allHotelImages as unknown as any, HttpStatusCodes.OK);
};

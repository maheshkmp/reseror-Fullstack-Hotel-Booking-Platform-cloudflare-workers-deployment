import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { hotelImages } from "core/database/schema";
import type {
  AddVillaImageRoute,
  GetVillaImagesRoute,
  RemoveVillaImageRoute,
  UpdateVillaImageRoute,
} from "../routes/villa-images.routes";

// Get villa images handler
export const getVillaImagesHandler: APIRouteHandler<GetVillaImagesRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const { page = "1", limit = "10" } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;



  // Get images for this villa type
  const imagesData = await db.query.hotelImages.findMany({
    where: eq(hotelImages.hotelId, params.id),
    limit: limitNum,
    offset,
    orderBy: (fields, { asc }) => asc(fields.displayOrder),
  });
  // Get total count
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(hotelImages)
    .where(eq(hotelImages.hotelId, params.id));

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: imagesData,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
      },
    },
    HttpStatusCodes.OK
  );
};

// Add villa image handler
export const addVillaImageHandler: APIRouteHandler<AddVillaImageRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }



  // Insert the new image
  const [inserted] = await db
    .insert(hotelImages)
    .values({
      ...body,
      hotelId: params.id,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update villa image handler
export const updateVillaImageHandler: APIRouteHandler<
  UpdateVillaImageRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Verify image exists and belongs to this villa type
  const image = await db.query.hotelImages.findFirst({
    where: and(
      eq(hotelImages.id, params.imageId),
      eq(hotelImages.hotelId, params.id)
    ),
  });

  if (!image) {
    return c.json({ message: "Image not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Update the image
  const [updated] = await db
    .update(hotelImages)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(hotelImages.id, params.imageId))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Remove villa image handler
export const removeVillaImageHandler: APIRouteHandler<
  RemoveVillaImageRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Verify image exists and belongs to this villa type
  const image = await db.query.hotelImages.findFirst({
    where: and(
      eq(hotelImages.id, params.imageId),
      eq(hotelImages.hotelId, params.id)
    ),
  });

  if (!image) {
    return c.json({ message: "Image not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Delete the image
  await db.delete(hotelImages).where(eq(hotelImages.id, params.imageId));

  return c.json(
    { message: "Villa image removed successfully" },
    HttpStatusCodes.OK
  );
};

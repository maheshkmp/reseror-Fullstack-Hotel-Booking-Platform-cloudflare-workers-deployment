/* eslint-disable prefer-const */
import { eq, ilike, or } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { APIRouteHandler } from "@/types";
import { amenities } from "core/database/schema";

import type {
  CreateAmenityRoute,
  ListAmenitiesRoute,
  RemoveAmenityRoute,
  UpdateAmenityRoute
} from "../routes/amenities-admin.routes";

// List amenities route handler
export const listAllAmenitiesHandler: APIRouteHandler<
  ListAmenitiesRoute
> = async (c) => {
  const query = c.req.valid("query");
  const db = c.get("db");

  let whereClause = undefined;
  if (query.search) {
    whereClause = or(
      ilike(amenities.name, `%${query.search}%`),
      ilike(amenities.slug, `%${query.search}%`)
    );
  }

  const allAmenities = await db.query.amenities.findMany({
    where: whereClause
  });

  return c.json(allAmenities, HttpStatusCodes.OK);
};

// Create new amenity route handler
export const createNewAmenityHandler: APIRouteHandler<
  CreateAmenityRoute
> = async (c) => {
  const body = c.req.valid("json");
  const db = c.get("db");

  let slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const [insertedAmenity] = await db
    .insert(amenities)
    .values({
      ...body,
      slug: slug
    })
    .returning();

  return c.json(insertedAmenity!, HttpStatusCodes.CREATED);
};

// Update existing amenity route handler
export const updateAmenityHandler: APIRouteHandler<
  UpdateAmenityRoute
> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const db = c.get("db");

  const existingAmenity = await db.query.amenities.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, params.id);
    }
  });

  if (!existingAmenity) {
    return c.json({ message: "Not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const [updatedAmenity] = await db
    .update(amenities)
    .set(body)
    .where(eq(amenities.id, params.id))
    .returning();

  return c.json(updatedAmenity!, HttpStatusCodes.OK);
};

// Remove amenity route handler
export const removeAmenityHandler: APIRouteHandler<
  RemoveAmenityRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const existingAmenity = await db.query.amenities.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, params.id);
    }
  });

  if (!existingAmenity) {
    return c.json({ message: "Not found" }, HttpStatusCodes.NOT_FOUND);
  }

  await db.delete(amenities).where(eq(amenities.id, params.id));

  return c.json({ message: "Deleted Successfully!" }, HttpStatusCodes.OK);
};

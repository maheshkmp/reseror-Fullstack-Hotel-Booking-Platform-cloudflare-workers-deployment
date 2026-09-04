import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@/lib/helpers";
import {
  amenityInsertSchema,
  amenitySchema,
  amenityUpdateSchema
} from "core/zod";

const tags: string[] = ["Global Amenities"];

/**
 * ================================================================
 * Global Amenities Routes
 * ================================================================
 */
// List all amenities route definition
export const listAllAmenitiesRoute = createRoute({
  tags,
  summary: "List all amenities",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(amenitySchema),
      "The list of global amenities"
    )
  }
});

// Create new amenity route Definition
export const createNewAmenityRoute = createRoute({
  tags,
  summary: "Create new global amenity",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(
      amenityInsertSchema,
      "Amenity insert data"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      amenitySchema,
      "Created amenity"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Could not create amenity"
    )
  }
});

// Update existing amenity route Definition
export const updateAmenityRoute = createRoute({
  tags,
  summary: "Update existing amenity",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      amenityUpdateSchema,
      "Amenity update data"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      amenitySchema,
      "The updated amenity"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Delete existing amenity route schema
export const removeAmenityRoute = createRoute({
  tags,
  summary: "Remove amenity",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The amenity deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Export Amenities route Types
export type ListAmenitiesRoute = typeof listAllAmenitiesRoute;
export type CreateAmenityRoute = typeof createNewAmenityRoute;
export type UpdateAmenityRoute = typeof updateAmenityRoute;
export type RemoveAmenityRoute = typeof removeAmenityRoute;

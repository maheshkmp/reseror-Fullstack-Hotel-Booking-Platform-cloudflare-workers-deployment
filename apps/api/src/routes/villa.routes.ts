import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  stringIdParamSchema,
} from "@/lib/helpers";
import {
  villaInsertSchema,
  villaQueryParamsSchema,
  villaSchema,
  villaUpdateSchema,
  villaWithRelationsSchema,
} from "core/zod";

const tags: string[] = ["Villa Types & Villas"];

/**
 * ================================================================
 * Villa Types Routes
 * ================================================================
 */

/**
 * ================================================================
 * Villa Type Amenities Routes
 * ================================================================
 */

/**
 * ================================================================
 * Villas Routes
 * ================================================================
 */

// List villas
export const listVillasRoute = createRoute({
  tags,
  summary: "List villas",
  path: "/",
  method: "get",
  request: {
    query: villaQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(villaWithRelationsSchema)),
      "The list of villas"
    ),
  },
});

// Get single villa
export const getVillaRoute = createRoute({
  tags,
  summary: "Get villa by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      villaWithRelationsSchema,
      "The villa details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Villa not found"
    ),
  },
});

// Create villa
export const createVillaRoute = createRoute({
  tags,
  summary: "Create new villa",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(villaInsertSchema, "Villa data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(villaSchema, "Created villa"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorMessageSchema,
      "Villa number already exists"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

// Update villa
export const updateVillaRoute = createRoute({
  tags,
  summary: "Update villa",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(villaUpdateSchema, "Villa update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(villaSchema, "Updated villa"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Villa not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

// Delete villa
export const deleteVillaRoute = createRoute({
  tags,
  summary: "Delete villa",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Villa deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Villa not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

export type ListVillasRoute = typeof listVillasRoute;
export type GetVillaRoute = typeof getVillaRoute;
export type CreateVillaRoute = typeof createVillaRoute;
export type UpdateVillaRoute = typeof updateVillaRoute;
export type DeleteVillaRoute = typeof deleteVillaRoute;

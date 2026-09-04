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
  propertyClassInsertSchema,
  propertyClassSchema,
  propertyClassUpdateSchema
} from "core/zod";

const tags: string[] = ["Property Classes"];

/**
 * ================================================================
 * Property Classes Routes
 * ================================================================
 */
// List all property classes route definition
export const listAllPropertyClassesRoute = createRoute({
  tags,
  summary: "List all property classes",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(propertyClassSchema),
      "The list of property classes"
    )
  }
});

// Create new property class route Definition
export const createNewPropertyClassRoute = createRoute({
  tags,
  summary: "Create new property class",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(
      propertyClassInsertSchema,
      "Property class insert data"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      propertyClassSchema,
      "Created property class"
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
      "Could not create property class"
    )
  }
});

// Update existing property class route Definition
export const updatePropertyClassRoute = createRoute({
  tags,
  summary: "Update existing property class",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      propertyClassUpdateSchema,
      "Property class update data"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      propertyClassSchema,
      "The updated property class"
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

// Delete existing property class route schema
export const removePropertyClassRoute = createRoute({
  tags,
  summary: "Remove property class",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The property class deleted"
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

// Export Property classes route Types
export type ListPropertyClassesRoute = typeof listAllPropertyClassesRoute;
export type CreatePropertyClassRoute = typeof createNewPropertyClassRoute;
export type UpdatePropertyClassRoute = typeof updatePropertyClassRoute;
export type RemovePropertyClassRoute = typeof removePropertyClassRoute;

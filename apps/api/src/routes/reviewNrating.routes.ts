import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@/lib/helpers";
import {
  reviewNrating,
  reviewNratingInsertSchema,
  reviewNratingUpdateSchema,
} from "core/zod";

const tags: string[] = ["ReviewNrating"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all reviewNrating",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(reviewNrating)),
      "The list of reviewNrating"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Get by ID route definition
export const getById = createRoute({
  tags,
  summary: "Get reviewNrating by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(reviewNrating, "The reviewNrating item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "ReviewNrating not found"
    ),
  },
});

// Create ReviewNrating route definition
export const create = createRoute({
  tags,
  summary: "Create reviewNrating",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(
      reviewNratingInsertSchema,
      "Create uploaded reviewNrating"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      reviewNrating,
      "The reviewNrating created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "ReviewNrating not created"
    ),
  },
});

// Update reviewNrating route definition
export const update = createRoute({
  tags,
  summary: "Update ReviewNrating",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      reviewNratingUpdateSchema,
      "Update reviewNrating details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      reviewNratingUpdateSchema,
      "The reviewNrating item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["ReviewNrating"],
  summary: "Delete a review",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    204: {
      description: "No Content",
      content: {
        "application/json": {
          schema: z.null(),
        },
      },
    },
    401: jsonContent(errorMessageSchema, "Unauthorized"),
    404: jsonContent(errorMessageSchema, "Not Found"),
  },
});

export const listByHotelId = createRoute({
  tags,
  summary: "List all reviews by hotelId",
  path: "/hotel/:hotelId",
  method: "get",
  request: {
    params: z.object({ hotelId: z.string() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(reviewNrating)),
      "The list of reviews for a hotel"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Reviews not found"
    ),
  },
});
export type ListByHotelIdRoute = typeof listByHotelId;

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;

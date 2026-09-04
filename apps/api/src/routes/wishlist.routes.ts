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
  wishlistInsertSchema,
  wishlistSchema,
  wishlistUpdateSchema,
} from "core/zod";

const tags: string[] = ["Wishlist"];

export const list = createRoute({
  tags,
  summary: "List all wishlist items",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(wishlistSchema)),
      "The list of wishlist items"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get wishlist item by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(wishlistSchema, "The wishlist item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Wishlist item not found"
    ),
  },
});

export const create = createRoute({
  tags,
  summary: "Create wishlist item",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(wishlistInsertSchema, "Create wishlist item"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      wishlistSchema,
      "The wishlist item created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Wishlist item not created"
    ),
  },
});

export const update = createRoute({
  tags,
  summary: "Update wishlist item",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      wishlistUpdateSchema,
      "Update wishlist item details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      wishlistUpdateSchema,
      "The wishlist item updated"
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
  tags: ["Wishlist"],
  summary: "Delete a wishlist item",
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

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;

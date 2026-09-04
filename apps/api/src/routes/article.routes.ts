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
  article,
  articleInsertSchema,
  articleUpdateSchema,
} from "core/zod";

const tags: string[] = ["Article"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all article",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(article)),
      "The list of article"
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
  summary: "Get article by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(article, "The article item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Article not found"
    ),
  },
});

// Get by Slug route definition
export const getBySlug = createRoute({
  tags,
  summary: "Get article by slug",
  method: "get",
  path: "/slug/:slug",
  request: {
    params: z.object({
      slug: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(article, "The article item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Article not found"
    ),
  },
});

// Increment Read Count route definition
export const incrementReadCount = createRoute({
  tags,
  summary: "Increment article read count",
  method: "post",
  path: "/:id/read",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ success: z.boolean() }),
      "The read count was incremented"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Article not found"
    ),
  },
});

// Create Article route definition
export const create = createRoute({
  tags,
  summary: "Create article",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(articleInsertSchema, "Create uploaded article"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(article, "The article created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Article not created"
    ),
  },
});

// Update article route definition
export const update = createRoute({
  tags,
  summary: "Update Article",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      articleUpdateSchema,
      "Update article details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(articleUpdateSchema, "The article item"),
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
  tags: ["Article"],
  summary: "Delete a article",
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

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type GetBySlugRoute = typeof getBySlug;
export type IncrementReadCountRoute = typeof incrementReadCount;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;

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
import { restaurantImageSchema } from "core/zod";

const tags: string[] = ["Restaurant Images"];

// Get restaurant images route
export const getRestaurantImagesRoute = createRoute({
  tags,
  summary: "Get images for a restaurant",
  path: "/:id/images",
  method: "get",
  request: {
    params: stringIdParamSchema,
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(restaurantImageSchema)),
      "Restaurant images"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Restaurant not found"
    ),
  },
});

// Add restaurant image route
export const addRestaurantImageRoute = createRoute({
  tags,
  summary: "Add image to restaurant",
  method: "post",
  path: "/:id/images",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      restaurantImageSchema.omit({
        id: true,
        restaurantId: true,
        createdAt: true,
        updatedAt: true,
      }),
      "Restaurant image data"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      restaurantImageSchema,
      "Added restaurant image"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Restaurant not found"
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

// Update restaurant image route
export const updateRestaurantImageRoute = createRoute({
  tags,
  summary: "Update restaurant image",
  method: "patch",
  path: "/:id/images/:imageId",
  request: {
    params: z.object({
      id: z.string(),
      imageId: z.string(),
    }),
    body: jsonContentRequired(
      restaurantImageSchema
        .omit({ id: true, restaurantId: true, createdAt: true })
        .partial(),
      "Restaurant image update data"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      restaurantImageSchema,
      "Updated restaurant image"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Image not found"
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

// Remove restaurant image route
export const removeRestaurantImageRoute = createRoute({
  tags,
  summary: "Remove image from restaurant",
  method: "delete",
  path: "/:id/images/:imageId",
  request: {
    params: z.object({
      id: z.string(),
      imageId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Image removed from restaurant"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Image not found"
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

// Export route types
export type GetRestaurantImagesRoute = typeof getRestaurantImagesRoute;
export type AddRestaurantImageRoute = typeof addRestaurantImageRoute;
export type UpdateRestaurantImageRoute = typeof updateRestaurantImageRoute;
export type RemoveRestaurantImageRoute = typeof removeRestaurantImageRoute;

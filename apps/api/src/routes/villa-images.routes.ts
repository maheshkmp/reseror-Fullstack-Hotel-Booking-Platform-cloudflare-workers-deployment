import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@/lib/helpers";
import {
  hotelImageInsertSchema,
  hotelImageSchema,
  hotelImageUpdateSchema
} from "core/zod";

const tags: string[] = ["Villa Images"];

// Get villa images route
export const getVillaImagesRoute = createRoute({
  tags,
  summary: "Get images for a villa type",
  path: "/types/:id/images",
  method: "get",
  request: {
    params: stringIdParamSchema,
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(hotelImageSchema)),
      "Villa type images"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Villa type not found"
    )
  }
});

// Add villa image route
export const addVillaImageRoute = createRoute({
  tags,
  summary: "Add image to villa type",
  method: "post",
  path: "/types/:id/images",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      hotelImageInsertSchema.omit({ hotelId: true }),
      "Villa image data"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      hotelImageSchema,
      "Added villa image"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Villa type not found"
    ),
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

// Update villa image route
export const updateVillaImageRoute = createRoute({
  tags,
  summary: "Update villa image",
  method: "patch",
  path: "/types/:id/images/:imageId",
  request: {
    params: z.object({
      id: z.string(),
      imageId: z.string()
    }),
    body: jsonContentRequired(hotelImageUpdateSchema, "Villa image update data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(hotelImageSchema, "Updated villa image"),
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
    )
  }
});

// Remove villa image route
export const removeVillaImageRoute = createRoute({
  tags,
  summary: "Remove image from villa type",
  method: "delete",
  path: "/types/:id/images/:imageId",
  request: {
    params: z.object({
      id: z.string(),
      imageId: z.string()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Image removed from villa type"
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
    )
  }
});

// Export route types
export type GetVillaImagesRoute = typeof getVillaImagesRoute;
export type AddVillaImageRoute = typeof addVillaImageRoute;
export type UpdateVillaImageRoute = typeof updateVillaImageRoute;
export type RemoveVillaImageRoute = typeof removeVillaImageRoute;

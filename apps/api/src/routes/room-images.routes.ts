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

const tags: string[] = ["Room Images"];

// Get room images route
export const getRoomImagesRoute = createRoute({
  tags,
  summary: "Get images for a room type",
  path: "/types/:id/images",
  method: "get",
  request: {
    params: stringIdParamSchema,
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(hotelImageSchema)),
      "Room type images"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Room type not found"
    )
  }
});

// Add room image route
export const addRoomImageRoute = createRoute({
  tags,
  summary: "Add image to room type",
  method: "post",
  path: "/types/:id/images",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      hotelImageInsertSchema.omit({ hotelId: true }),
      "Room image data"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      hotelImageSchema,
      "Added room image"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Room type not found"
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

// Update room image route
export const updateRoomImageRoute = createRoute({
  tags,
  summary: "Update room image",
  method: "patch",
  path: "/types/:id/images/:imageId",
  request: {
    params: z.object({
      id: z.string(),
      imageId: z.string()
    }),
    body: jsonContentRequired(hotelImageUpdateSchema, "Room image update data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(hotelImageSchema, "Updated room image"),
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

// Remove room image route
export const removeRoomImageRoute = createRoute({
  tags,
  summary: "Remove image from room type",
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
      "Image removed from room type"
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
export type GetRoomImagesRoute = typeof getRoomImagesRoute;
export type AddRoomImageRoute = typeof addRoomImageRoute;
export type UpdateRoomImageRoute = typeof updateRoomImageRoute;
export type RemoveRoomImageRoute = typeof removeRoomImageRoute;

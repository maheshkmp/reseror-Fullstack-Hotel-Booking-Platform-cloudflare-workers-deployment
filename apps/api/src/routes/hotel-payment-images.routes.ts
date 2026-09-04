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
  hotelImageInsertSchema,
  hotelImageSchema,
  hotelImageUpdateSchema,
} from "core/zod";

const tags: string[] = ["PaymentsHotel Images"];

// Get paymentsHotel images route
export const getPaymentsHotelImagesRoute = createRoute({
  tags,
  summary: "Get images for a paymentsHotel type",
  path: "/types/:id/images",
  method: "get",
  request: {
    params: stringIdParamSchema,
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(hotelImageSchema)),
      "PaymentsHotel type images"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PaymentsHotel type not found"
    ),
  },
});

// Add paymentsHotel image route
export const addPaymentsHotelImageRoute = createRoute({
  tags,
  summary: "Add image to paymentsHotel type",
  method: "post",
  path: "/types/:id/images",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      hotelImageInsertSchema.omit({ hotelId: true }),
      "PaymentsHotel image data"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      hotelImageSchema,
      "Added paymentsHotel image"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PaymentsHotel type not found"
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

// Update paymentsHotel image route
export const updatePaymentsHotelImageRoute = createRoute({
  tags,
  summary: "Update paymentsHotel image",
  method: "patch",
  path: "/types/:id/images/:imageId",
  request: {
    params: z.object({
      id: z.string(),
      imageId: z.string(),
    }),
    body: jsonContentRequired(
      hotelImageUpdateSchema,
      "PaymentsHotel image update data"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      hotelImageSchema,
      "Updated paymentsHotel image"
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

// Remove paymentsHotel image route
export const removePaymentsHotelImageRoute = createRoute({
  tags,
  summary: "Remove image from paymentsHotel type",
  method: "delete",
  path: "/types/:id/images/:imageId",
  request: {
    params: z.object({
      id: z.string(),
      imageId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Image removed from paymentsHotel type"
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
export type GetPaymentsHotelImagesRoute = typeof getPaymentsHotelImagesRoute;
export type AddPaymentsHotelImageRoute = typeof addPaymentsHotelImageRoute;
export type UpdatePaymentsHotelImageRoute =
  typeof updatePaymentsHotelImageRoute;
export type RemovePaymentsHotelImageRoute =
  typeof removePaymentsHotelImageRoute;

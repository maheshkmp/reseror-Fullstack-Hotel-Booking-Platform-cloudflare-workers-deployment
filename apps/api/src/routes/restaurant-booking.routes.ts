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
  restaurantBookingInsertSchema,
  restaurantBookingSchema,
} from "core/zod";

const tags: string[] = ["Restaurant Bookings"];

export const createRestaurantBookingRoute = createRoute({
  tags,
  summary: "Create new restaurant booking",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(restaurantBookingInsertSchema, "Booking data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      restaurantBookingSchema,
      "Created booking"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    ),
  },
});

export const listRestaurantBookingsRoute = createRoute({
  tags,
  summary: "List restaurant bookings",
  method: "get",
  path: "/",
  request: {
    query: z.object({
      restaurantId: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(restaurantBookingSchema),
      "The list of bookings"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Restaurant not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    ),
  },
});

export const updateRestaurantBookingStatusRoute = createRoute({
  tags,
  summary: "Update booking status",
  method: "patch",
  path: "/:id/status",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      z.object({
        status: z.enum(["pending", "arrived", "no_show", "refunded"]),
      }),
      "Status update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(restaurantBookingSchema, "Updated booking"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Booking not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized access"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, "Internal server error"),
  },
});

export type CreateRestaurantBookingRoute = typeof createRestaurantBookingRoute;
export type ListRestaurantBookingsRoute = typeof listRestaurantBookingsRoute;
export type UpdateRestaurantBookingStatusRoute = typeof updateRestaurantBookingStatusRoute;

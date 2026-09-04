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
  roomBookingInsertSchema,
  roomBookingQueryParamsSchema,
  roomBookingUpdateSchema,
  roomBookingWithRelationsSchema,
} from "core/zod";

const tags: string[] = [" RoomBookings"];

// Response schema for statistics to keep types flat
export const roomBookingsStatsResponseSchema = z.object({
  data: z.object({
    total: z.number(),
    confirmed: z.number(),
    pending: z.number(),
    cancelled: z.number(),
    totalRevenue: z.number(),
    thisMonthBookings: z.number(),
    history: z.array(z.any()).optional(),
  }),
});

// List roomBookings
export const listRoomBookingsRoute = createRoute({
  tags,
  summary: "List roomBookings",
  path: "/",
  method: "get",
  request: {
    query: roomBookingQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(roomBookingWithRelationsSchema)),
      "The list of roomBookings"
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

// Get roomBookings stats
export const getRoomBookingsStatsRoute = createRoute({
  tags,
  summary: "Get roomBookings statistics",
  path: "/stats",
  method: "get",
  request: {
    query: roomBookingQueryParamsSchema.partial(),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      roomBookingsStatsResponseSchema,
      "The roomBookings statistics"
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


// List roomBookings by user ID
export const listRoomBookingsByUserRoute = createRoute({
  tags,
  summary: "List roomBookings by user ID",
  path: "/user/:userId",
  method: "get",
  request: {
    params: z.object({
      userId: z.string().min(1, "User ID is required"),
    }),
    query: roomBookingQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(roomBookingWithRelationsSchema)),
      "The list of roomBookings for the user"
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


// Response schema for user statistics to keep types flat
export const roomBookingsStatsByUserResponseSchema = z.object({
  data: z.object({
    total: z.number(),
    confirmed: z.number(),
    pending: z.number(),
    cancelled: z.number(),
    totalRevenue: z.number(),
    thisMonthBookings: z.number(),
  }),
});

export const getRoomBookingsStatsByUserRoute = createRoute({
  tags,
  summary: "Get roomBookings statistics for a specific user",
  path: "/user/:userId/stats",
  method: "get",
  request: {
    params: z.object({
      userId: z.string().min(1, "User ID is required"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      roomBookingsStatsByUserResponseSchema,
      "The roomBookings statistics for the user"
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

// Get single roomBooking
export const getRoomBookingRoute = createRoute({
  tags,
  summary: "Get roomBooking by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      roomBookingWithRelationsSchema,
      "The roomBooking details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "RoomBooking not found"
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

// Create roomBooking
export const createRoomBookingRoute = createRoute({
  tags,
  summary: "Create new roomBooking",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(roomBookingInsertSchema, "RoomBooking data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      roomBookingInsertSchema,
      "Created roomBooking"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorMessageSchema,
      "RoomBooking number already exists"
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

// Update roomBooking
export const updateRoomBookingRoute = createRoute({
  tags,
  summary: "Update roomBooking",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      roomBookingUpdateSchema,
      "RoomBooking update data"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      roomBookingUpdateSchema,
      "Updated roomBooking"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "RoomBooking not found"
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

// Delete roomBooking
export const deleteRoomBookingRoute = createRoute({
  tags,
  summary: "Delete roomBooking",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "RoomBooking deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "RoomBooking not found"
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

export type GetRoomBookingsStatsRoute = typeof getRoomBookingsStatsRoute;
export type GetRoomBookingsStatsByUserRoute = typeof getRoomBookingsStatsByUserRoute;
export type ListRoomBookingsRoute = typeof listRoomBookingsRoute;
export type ListRoomBookingsByUserRoute = typeof listRoomBookingsByUserRoute;
export type GetRoomBookingRoute = typeof getRoomBookingRoute;
export type CreateRoomBookingRoute = typeof createRoomBookingRoute;
export type UpdateRoomBookingRoute = typeof updateRoomBookingRoute;
export type DeleteRoomBookingRoute = typeof deleteRoomBookingRoute;

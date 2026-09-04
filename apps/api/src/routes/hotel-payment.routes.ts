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
  paymentsHotelInsertSchema,
  paymentsHotelQueryParamsSchema,
  paymentsHotelSchema,
  paymentsHotelUpdateSchema,
  paymentsHotelWithRelationsSchema,
} from "core/zod";

const tags: string[] = ["Hotel Payments"];

/**
 * ================================================================
 * Hotel Payments Routes
 * ================================================================
 */

// List paymentsHotels
export const listPaymentsHotelRoute = createRoute({
  tags,
  summary: "List hotel payments",
  path: "/",
  method: "get",
  request: {
    query: paymentsHotelQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(paymentsHotelWithRelationsSchema)),
      "The list of hotel payments"
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

// Get single paymentsHotel
export const getPaymentsHotelRoute = createRoute({
  tags,
  summary: "Get hotel payment by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      paymentsHotelWithRelationsSchema,
      "The hotel payment details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel payment not found"
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

// Create paymentsHotel
export const createPaymentsHotelRoute = createRoute({
  tags,
  summary: "Create new hotel payment",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(paymentsHotelInsertSchema, "Hotel payment data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      paymentsHotelSchema,
      "Created hotel payment"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
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

// Update paymentsHotel
export const updatePaymentsHotelRoute = createRoute({
  tags,
  summary: "Update hotel payment",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      paymentsHotelUpdateSchema,
      "Hotel payment update data"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      paymentsHotelSchema,
      "Updated hotel payment"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel payment not found"
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

// Delete paymentsHotel
export const deletePaymentsHotelRoute = createRoute({
  tags,
  summary: "Delete hotel payment",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Hotel payment deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel payment not found"
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

// Settle all hotel payments
export const settleAllPaymentsHotelRoute = createRoute({
  tags,
  summary: "Settle all pending hotel commissions",
  method: "post",
  path: "/settle-all",
  request: {
    body: jsonContent(
      z.object({
        hotelId: z.string().optional(),
      }),
      "Optional hotel filter"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
        settledCount: z.number(),
        totalAmount: z.number(),
      }),
      "Settlement summary"
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

export type ListPaymentsHotelsRoute = typeof listPaymentsHotelRoute;
export type GetPaymentsHotelRoute = typeof getPaymentsHotelRoute;
export type CreatePaymentsHotelRoute = typeof createPaymentsHotelRoute;
export type UpdatePaymentsHotelRoute = typeof updatePaymentsHotelRoute;
export type DeletePaymentsHotelRoute = typeof deletePaymentsHotelRoute;
export type SettleAllPaymentsHotelRoute = typeof settleAllPaymentsHotelRoute;

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
  paymentsAdminInsertSchema,
  paymentsAdminQueryParamsSchema,
  paymentsAdminSchema,
  paymentsAdminUpdateSchema,
  paymentsAdminWithRelationsSchema,
} from "core/zod";

const tags: string[] = ["Admin Payments"];

/**
 * ================================================================
 * Admin Payments Routes
 * ================================================================
 */

// List paymentsAdmins
export const listPaymentsAdminRoute = createRoute({
  tags,
  summary: "List admin payments",
  path: "/",
  method: "get",
  request: {
    query: paymentsAdminQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(paymentsAdminWithRelationsSchema)),
      "The list of admin payments"
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

// Get single paymentsAdmin
export const getPaymentsAdminRoute = createRoute({
  tags,
  summary: "Get admin payment by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      paymentsAdminWithRelationsSchema,
      "The admin payment details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Admin payment not found"
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

// Create paymentsAdmin
export const createPaymentsAdminRoute = createRoute({
  tags,
  summary: "Create new admin payment",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(paymentsAdminInsertSchema, "Admin payment data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      paymentsAdminSchema,
      "Created admin payment"
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

// Update paymentsAdmin
export const updatePaymentsAdminRoute = createRoute({
  tags,
  summary: "Update admin payment",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      paymentsAdminUpdateSchema,
      "Admin payment update data"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      paymentsAdminSchema,
      "Updated admin payment"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Admin payment not found"
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

// Delete paymentsAdmin
export const deletePaymentsAdminRoute = createRoute({
  tags,
  summary: "Delete admin payment",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Admin payment deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Admin payment not found"
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

export type ListPaymentsAdminsRoute = typeof listPaymentsAdminRoute;
export type GetPaymentsAdminRoute = typeof getPaymentsAdminRoute;
export type CreatePaymentsAdminRoute = typeof createPaymentsAdminRoute;
export type UpdatePaymentsAdminRoute = typeof updatePaymentsAdminRoute;
export type DeletePaymentsAdminRoute = typeof deletePaymentsAdminRoute;

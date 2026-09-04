import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema } from "@/lib/helpers";
import { hotelPaymentMethodSchema } from "core/zod";

export const tags: string[] = ["Hotels"];

export const getHotelPaymentMethodsRoute = createRoute({
  tags,
  summary: "Get accepted payment methods for a specific hotel",
  method: "get",
  path: "/:id/payment-methods",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelPaymentMethodSchema),
      "The accepted payment methods for the hotel"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
  },
});

export const upsertPaymentMethodsToHotelRoute = createRoute({
  tags,
  summary: "Sync accepted payment methods for a hotel",
  method: "post",
  path: "/:id/payment-methods",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(
      z.array(z.object({ cardType: z.string() })),
      "List of card types to sync"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
        count: z.number(),
      }),
      "Payment methods synced successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
  },
});

export type GetHotelPaymentMethodsRoute = typeof getHotelPaymentMethodsRoute;
export type UpsertPaymentMethodsToHotelRoute = typeof upsertPaymentMethodsToHotelRoute;

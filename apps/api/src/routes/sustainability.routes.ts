import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema } from "@/lib/helpers";
import {
  hotelSustainabilityInsertSchema,
  hotelSustainabilitySchema,
} from "core/zod";

export const tags: string[] = ["Hotels"];

export const getHotelSustainabilityRoute = createRoute({
  tags,
  summary: "Get sustainability initiatives for a specific hotel",
  method: "get",
  path: "/:id/sustainability",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelSustainabilitySchema),
      "The sustainability initiatives for the hotel"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
  },
});

export const addHotelSustainabilityRoute = createRoute({
  tags,
  summary: "Sync sustainability initiatives for a hotel",
  method: "post",
  path: "/:id/sustainability",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(
      z.array(hotelSustainabilityInsertSchema),
      "List of sustainability initiatives to sync"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
        count: z.number(),
      }),
      "Sustainability initiatives synced successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
  },
});

export type GetHotelSustainabilityRoute = typeof getHotelSustainabilityRoute;
export type AddHotelSustainabilityRoute = typeof addHotelSustainabilityRoute;

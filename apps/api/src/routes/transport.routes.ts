import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema } from "@/lib/helpers";
import {
  hotelTransportParkingInsertSchema,
  hotelTransportParkingSchema,
} from "core/zod";

export const tags: string[] = ["Hotels"];

export const getHotelTransportRoute = createRoute({
  tags,
  summary: "Get transport & parking specifics for a specific hotel",
  method: "get",
  path: "/:id/transport",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelTransportParkingSchema),
      "The transport & parking specifics for the hotel"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
  },
});

export const addHotelTransportRoute = createRoute({
  tags,
  summary: "Sync transport & parking specifics for a hotel",
  method: "post",
  path: "/:id/transport",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(
      z.array(hotelTransportParkingInsertSchema),
      "List of transport & parking specifics to sync"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
        count: z.number(),
      }),
      "Transport & parking specifics synced successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
  },
});

export type GetHotelTransportRoute = typeof getHotelTransportRoute;
export type AddHotelTransportRoute = typeof addHotelTransportRoute;

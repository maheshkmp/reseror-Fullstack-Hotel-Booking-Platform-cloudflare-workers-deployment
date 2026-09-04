import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema } from "@/lib/helpers";
import { hotelCommonAreaSchema } from "core/zod";

export const tags: string[] = ["Hotels"];

export const getHotelCommonAreasRoute = createRoute({
  tags,
  summary: "Get common areas for a specific hotel",
  method: "get",
  path: "/:id/common-areas",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelCommonAreaSchema),
      "The common areas for the hotel"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
  },
});

export const upsertCommonAreasToHotelRoute = createRoute({
  tags,
  summary: "Sync common areas for a hotel",
  method: "post",
  path: "/:id/common-areas",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(
      z.array(z.object({ areaType: z.string() })),
      "List of common area types to sync"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
        count: z.number(),
      }),
      "Common areas synced successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
  },
});

export type GetHotelCommonAreasRoute = typeof getHotelCommonAreasRoute;
export type UpsertCommonAreasToHotelRoute = typeof upsertCommonAreasToHotelRoute;

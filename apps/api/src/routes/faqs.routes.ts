import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema } from "@/lib/helpers";
import { hotelFaqSchema } from "core/zod";

export const tags: string[] = ["Hotels"];

export const getHotelFaqsRoute = createRoute({
  tags,
  summary: "Get FAQs for a specific hotel",
  method: "get",
  path: "/:id/faqs",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelFaqSchema),
      "The FAQs for the hotel"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
  },
});

export const upsertFaqsToHotelRoute = createRoute({
  tags,
  summary: "Sync FAQs for a hotel",
  method: "post",
  path: "/:id/faqs",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(
      z.array(z.object({
        question: z.string(),
        answer: z.string(),
        displayOrder: z.number().optional().default(0),
      })),
      "List of FAQs to sync"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
        count: z.number(),
      }),
      "FAQs synced successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
  },
});

export type GetHotelFaqsRoute = typeof getHotelFaqsRoute;
export type UpsertFaqsToHotelRoute = typeof upsertFaqsToHotelRoute;

import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema, stringIdParamSchema } from "@/lib/helpers";
import { tags } from "./hotel.routes";
import {
  hotelLanguageInsertSchema,
  hotelLanguageSchema,
} from "core/zod";

// Hotel Language Routes
export const getHotelLanguagesRoute = createRoute({
  tags,
  summary: "Get all Hotel Languages Spoken",
  method: "get",
  path: "/:id/languages",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelLanguageSchema),
      "List of staff languages"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to get"
    )
  }
});

export const upsertLanguagesToHotelRoute = createRoute({
  tags,
  summary: "Upsert Languages to Hotel",
  method: "post",
  path: "/:id/languages",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      z.array(hotelLanguageInsertSchema),
      "Languages to upsert"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.array(hotelLanguageSchema),
      "Upserted Hotel Languages"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to update languages"
    )
  }
});

export const removeHotelLanguageRoute = createRoute({
  tags,
  summary: "Remove Hotel Language",
  method: "delete",
  path: "/languages/:id",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Hotel Language removed"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Language not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to delete"
    )
  }
});

export type GetHotelLanguagesRoute = typeof getHotelLanguagesRoute;
export type UpsertLanguagesToHotelRoute = typeof upsertLanguagesToHotelRoute;
export type RemoveHotelLanguageRoute = typeof removeHotelLanguageRoute;

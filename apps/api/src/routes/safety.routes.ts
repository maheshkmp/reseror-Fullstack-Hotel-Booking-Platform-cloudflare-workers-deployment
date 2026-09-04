import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema, stringIdParamSchema } from "@/lib/helpers";
import { tags } from "./hotel.routes";
import {
  hotelSafetyFeatureInsertSchema,
  hotelSafetyFeatureSchema,
} from "core/zod";

// Hotel Safety Feature Routes
export const getHotelSafetyFeaturesRoute = createRoute({
  tags,
  summary: "Get all Hotel Health & Safety Features",
  method: "get",
  path: "/:id/safety",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelSafetyFeatureSchema),
      "List of safety features"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to get"
    )
  }
});

export const upsertSafetyToHotelRoute = createRoute({
  tags,
  summary: "Upsert Safety Features to Hotel",
  method: "post",
  path: "/:id/safety",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      z.array(hotelSafetyFeatureInsertSchema),
      "Safety features to upsert"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.array(hotelSafetyFeatureSchema),
      "Upserted Hotel Safety Features"
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
      "Failed to update safety features"
    )
  }
});

export const removeHotelSafetyRoute = createRoute({
  tags,
  summary: "Remove Hotel Safety Feature",
  method: "delete",
  path: "/safety/:id",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Hotel Safety Feature removed"
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
      "Safety feature not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to delete"
    )
  }
});

export type GetHotelSafetyFeaturesRoute = typeof getHotelSafetyFeaturesRoute;
export type UpsertSafetyToHotelRoute = typeof upsertSafetyToHotelRoute;
export type RemoveHotelSafetyRoute = typeof removeHotelSafetyRoute;

import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema, stringIdParamSchema } from "@/lib/helpers";
import { tags } from "./hotel.routes";
import {
  hotelNearbyPoiInsertSchema,
  hotelNearbyPoiSchema,
  hotelNearbyPoiUpdateSchema
} from "core/zod";

// Hotel Nearby POI Routes
export const getHotelNearbyPoisRoute = createRoute({
  tags,
  summary: "Get all Nearby POIs for a Hotel",
  method: "get",
  path: "/:id/nearby-pois",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelNearbyPoiSchema),
      "List of nearby POIs"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to get"
    )
  }
});

export const upsertNearbyPoisToHotelRoute = createRoute({
  tags,
  summary: "Upsert Nearby POIs to Hotel",
  method: "post",
  path: "/:id/nearby-pois",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      z.array(hotelNearbyPoiInsertSchema),
      "Nearby POIs to upsert"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.array(hotelNearbyPoiSchema),
      "Upserted Nearby POIs"
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
      "Failed to create"
    )
  }
});

export const updateHotelNearbyPoiRoute = createRoute({
  tags,
  summary: "Update Nearby POI",
  method: "put",
  path: "/nearby-pois/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(hotelNearbyPoiUpdateSchema, "Update data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      hotelNearbyPoiSchema,
      "Updated Nearby POI"
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
      "POI not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to update"
    )
  }
});

export const removeHotelNearbyPoiRoute = createRoute({
  tags,
  summary: "Remove Nearby POI",
  method: "delete",
  path: "/nearby-pois/:id",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Nearby POI removed"
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
      "POI not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to delete"
    )
  }
});

// Export nearby POI routes type definitions
export type GetHotelNearbyPoisRoute = typeof getHotelNearbyPoisRoute;
export type UpsertNearbyPoisToHotelRoute = typeof upsertNearbyPoisToHotelRoute;
export type UpdateHotelNearbyPoiRoute = typeof updateHotelNearbyPoiRoute;
export type RemoveHotelNearbyPoiRoute = typeof removeHotelNearbyPoiRoute;

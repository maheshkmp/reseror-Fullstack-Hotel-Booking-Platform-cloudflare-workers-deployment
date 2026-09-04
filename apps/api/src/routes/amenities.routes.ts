import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema, stringIdParamSchema } from "@/lib/helpers";
import { tags } from "./hotel.routes";
import { hotelAmenityInsertSchema, hotelAmenitySchema } from "core/zod";

// Hotel Amenity Routes
export const getHotelAmenitiesRoute = createRoute({
  tags,
  summary: "Get all Hotel Amenities",
  method: "get",
  path: "/:id/amenities",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelAmenitySchema),
      "List of hotel amenities"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to get"
    )
  }
});

export const upsertAmenitiesToHotelRoute = createRoute({
  tags,
  summary: "Upsert Amenities to hotel",
  path: "/:id/amenities",
  method: "post",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      z.array(hotelAmenityInsertSchema),
      "Amenity to insert"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.array(hotelAmenityInsertSchema),
      "Inserted Hotel Amenities"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to create"
    )
  }
});

// Export hotel image routes type definitions
export type GetHotelAmenitiesRoute = typeof getHotelAmenitiesRoute;
export type UpsertAmenitiesToHotelRoute = typeof upsertAmenitiesToHotelRoute;

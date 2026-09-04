import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema, stringIdParamSchema } from "@/lib/helpers";
import { tags } from "./hotel.routes";
import {
  hotelImageInsertSchema,
  hotelImageSchema,
  hotelImageUpdateSchema,
} from "core/zod";

// Hotel Image Routes
export const getHotelImagesRoute = createRoute({
  tags,
  summary: "Get all Hotel Images",
  method: "get",
  path: "/:id/images",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelImageSchema),
      "List of hotel images"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to get"
    ),
  },
});

export const addNewHotelImagesRoute = createRoute({
  tags,
  summary: "Add new Hotel Images",
  method: "post",
  path: "/images",
  request: {
    body: jsonContentRequired(
      z.array(hotelImageInsertSchema),
      "Images to insert"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.array(hotelImageSchema),
      "Inserted Hotel Images"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to create"
    ),
  },
});

export const updateHotelImageRoute = createRoute({
  tags,
  summary: "Update Hotel Image",
  method: "put",
  path: "/images/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(hotelImageUpdateSchema, "Update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(hotelImageSchema, "Updated Hotel Image"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to update"
    ),
  },
});

export const removeHotelImageRoute = createRoute({
  tags,
  summary: "Remove Hotel Image",
  method: "delete",
  path: "/images/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Hotel Image removed"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to delete"
    ),
  },
});

export const getAllHotelImagesRoute = createRoute({
  tags,
  summary: "Get all images from all hotels",
  method: "get",
  path: "/images",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelImageSchema),
      "List of all hotel images"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to get all images"
    ),
  },
});

// Export hotel image routes type definitions
export type AddNewHotelImagesRoute = typeof addNewHotelImagesRoute;
export type GetHotelImagesRoute = typeof getHotelImagesRoute;
export type UpdateHotelImageRoute = typeof updateHotelImageRoute;
export type RemoveHotelImageRoute = typeof removeHotelImageRoute;
export type GetAllHotelImagesRoute = typeof getAllHotelImagesRoute;

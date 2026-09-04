import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  stringIdParamSchema,
} from "@/lib/helpers";
import {
  restaurantInsertSchema,
  restaurantQueryParamsSchema,
  restaurantSchema,
  restaurantUpdateSchema,
  restaurantWithRelationsSchema,
} from "core/zod";

const tags: string[] = ["Restaurant Types & Restaurants"];

/**
 * ================================================================
 * Restaurant Types Routes
 * ================================================================
 */

/**
 * ================================================================
 * Restaurant Type Amenities Routes
 * ================================================================
 */

/**
 * ================================================================
 * Restaurants Routes
 * ================================================================
 */

// List restaurants
export const listRestaurantsRoute = createRoute({
  tags,
  summary: "List restaurants",
  path: "/",
  method: "get",
  request: {
    query: restaurantQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(restaurantWithRelationsSchema)),
      "The list of restaurants"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    ),
  },
});

// Get single restaurant
export const getRestaurantRoute = createRoute({
  tags,
  summary: "Get restaurant by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      restaurantWithRelationsSchema,
      "The restaurant details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Restaurant not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    ),
  },
});

// Create restaurant
export const createRestaurantRoute = createRoute({
  tags,
  summary: "Create new restaurant",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(restaurantInsertSchema, "Restaurant data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      restaurantSchema,
      "Created restaurant"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorMessageSchema,
      "Restaurant number already exists"
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
      "Internal server error"
    ),
  },
});

// Update restaurant
export const updateRestaurantRoute = createRoute({
  tags,
  summary: "Update restaurant",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(restaurantUpdateSchema, "Restaurant update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(restaurantSchema, "Updated restaurant"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Restaurant not found"
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
      "Internal server error"
    ),
  },
});

// Delete restaurant
export const deleteRestaurantRoute = createRoute({
  tags,
  summary: "Delete restaurant",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Restaurant deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Restaurant not found"
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
      "Internal server error"
    ),
  },
});

// Get my restaurants route
export const getMyRestaurantsRoute = createRoute({
  tags,
  summary: "Get my restaurants",
  method: "get",
  path: "/myrestaurants",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(restaurantSchema),
      "The list of my restaurant items"
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
      "No restaurants found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    ),
  },
});

export type ListRestaurantsRoute = typeof listRestaurantsRoute;
export type GetRestaurantRoute = typeof getRestaurantRoute;
export type CreateRestaurantRoute = typeof createRestaurantRoute;
export type UpdateRestaurantRoute = typeof updateRestaurantRoute;
export type DeleteRestaurantRoute = typeof deleteRestaurantRoute;
export type GetMyRestaurantsRoute = typeof getMyRestaurantsRoute;

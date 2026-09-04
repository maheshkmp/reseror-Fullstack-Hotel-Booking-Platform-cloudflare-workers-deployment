import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@/lib/helpers";
import {
  roomTypeWithRelationsSchema,
  roomWithRelationsSchema,
} from "core/zod";
import {
  hotelInsertByAdminSchema,
  hotelInsertSchema,
  hotelPerformanceSchema,
  hotelQueryParamsSchema,
  hotelSelectSchema,
  hotelTypeInsertSchema,
  hotelTypeSchema,
  hotelTypeUpdateSchema,
  hotelUpdateSchema,
  plainHotelSchema,
} from "core/zod";

export const tags: string[] = ["Hotels"];

/**
 * ================================================================
 * Hotel Types Routes
 * ================================================================
 */
// List all hotel types route definition
export const listAllHotelTypesRoute = createRoute({
  tags,
  summary: "List all property types",
  path: "/types",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelTypeSchema),
      "The list of property types"
    ),
  },
});

// Create new hotel type route Definition
export const createNewHotelTypeRoute = createRoute({
  tags,
  summary: "Create new property type",
  method: "post",
  path: "/types",
  request: {
    body: jsonContentRequired(hotelTypeInsertSchema, "Property type insert data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      hotelTypeSchema,
      "Created new property type"
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
      "Could not create property type"
    ),
  },
});

// Update existing hotel type route Definition
export const updateHotelTypeRoute = createRoute({
  tags,
  summary: "Update existing property type",
  method: "patch",
  path: "/types/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(hotelTypeUpdateSchema, "Property type update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      hotelTypeSchema,
      "The updated property type"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

// Delete existing hotel type route schema
export const removeHotelTypeRoute = createRoute({
  tags,
  summary: "Remove property type",
  method: "delete",
  path: "/types/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The property type deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

// Export Hotel types route Types
export type ListHotelTypesRoute = typeof listAllHotelTypesRoute;
export type CreateHotelTypeRoute = typeof createNewHotelTypeRoute;
export type UpdateHotelTypeRoute = typeof updateHotelTypeRoute;
export type RemoveHotelTypeRoute = typeof removeHotelTypeRoute;

/**
 * ================================================================
 * Hotels Routes
 * ================================================================
 */

// Export all hotels route definition
export const exportHotelsRoute = createRoute({
  tags,
  summary: "Export all hotels as Excel",
  method: "get",
  path: "/export",
  request: {
    query: z.object({
      search: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: "The list of Hotels as Excel",
      content: {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

// Import hotels route definition
export const importHotelsRoute = createRoute({
  tags,
  summary: "Import hotels from Excel/CSV",
  method: "post",
  path: "/import",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary",
              },
            },
          },
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ 
        message: z.string(),
        count: z.number().optional(),
      }),
      "The hotels imported successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid file format"
    ),
  },
});

// Download hotel template route definition
export const downloadHotelTemplateRoute = createRoute({
  tags,
  summary: "Download property import template",
  method: "get",
  path: "/template",
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Excel template for property import",
      content: {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  },
});

// List all hotels route definition
export const listAllHotelsRoute = createRoute({
  tags,
  summary: "List all hotels",
  method: "get",
  path: "/",
  request: {
    query: hotelQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(hotelSelectSchema)),
      "The list of Hotels"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Create new hotel route definition
export const createNewHotelRoute = createRoute({
  tags,
  summary: "Create new Hotel",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(hotelInsertSchema, "Create new hotel"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      plainHotelSchema,
      "The hotel created"
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

export const createNewHotelRouteByAdmin = createRoute({
  tags,
  summary: "Create new Hotel (as Admin)",
  method: "post",
  path: "/admin",
  request: {
    body: jsonContentRequired(hotelInsertByAdminSchema, "Create new hotel"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      plainHotelSchema,
      "The hotel created"
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

// Get hotel type by ID route definition
export const getHotelByIdRoute = createRoute({
  tags,
  summary: "Get hotel by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(hotelSelectSchema, "The hotel item"),
    // Not found used to identify if hotel doesn't setup yet
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No hotel found"
    ),
  },
});

// Get hotel performance route definition
export const getHotelPerformanceRoute = createRoute({
  tags,
  summary: "Get hotel performance metrics",
  method: "get",
  path: "/:id/performance",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      hotelPerformanceSchema,
      "Hotel performance metrics"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
  },
});

// Get my-hotel route definition
export const getMyHotelRoute = createRoute({
  tags,
  summary: "Get my hotel",
  method: "get",
  path: "/my-hotel",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(hotelSelectSchema, "The hotel item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),

    // Not found used to identify if hotel doesn't setup yet
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No hotel found"
    ),
  },
});

// Get hotel room types route
export const getHotelRoomTypesRoute = createRoute({
  tags,
  summary: "Get room types for a specific hotel",
  method: "get",
  path: "/:id/room-types",
  request: {
    params: stringIdParamSchema,
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(roomTypeWithRelationsSchema)),
      "Hotel room types"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
  },
});

// Get hotel rooms route
export const getHotelRoomsRoute = createRoute({
  tags,
  summary: "Get rooms for a specific hotel",
  method: "get",
  path: "/:id/rooms",
  request: {
    params: stringIdParamSchema,
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      roomTypeId: z.string().optional(),
      status: z
        .enum(["available", "occupied", "maintenance", "out_of_order", "dirty"])
        .optional(),
      floorNumber: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(roomWithRelationsSchema)),
      "Hotel rooms"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
  },
});

// Update existing hotel route definition
export const updateHotelRoute = createRoute({
  tags,
  summary: "Update existing hotel",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(hotelUpdateSchema, "Hotel update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(plainHotelSchema, "The updated hotel"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
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

// Remove existing hotel route definition
export const removeHotelRoute = createRoute({
  tags,
  summary: "Remove hotel",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The hotel deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

// Export remove hotel route type
export type RemoveHotelRoute = typeof removeHotelRoute;

// Export hotel update route type
export type UpdateHotelRoute = typeof updateHotelRoute;

// Export hotel routes type definitions
export type ListAllHotelsRoute = typeof listAllHotelsRoute;
export type CreateNewHotelRoute = typeof createNewHotelRoute;
export type CreateNewHotelByAdminRoute = typeof createNewHotelRouteByAdmin;
export type GetMyHotelRoute = typeof getMyHotelRoute;
export type GetHotelByIdRoute = typeof getHotelByIdRoute;
export type GetHotelPerformanceRoute = typeof getHotelPerformanceRoute;
export type GetHotelRoomTypesRoute = typeof getHotelRoomTypesRoute;
export type GetHotelRoomsRoute = typeof getHotelRoomsRoute;
export type ExportHotelsRoute = typeof exportHotelsRoute;
export type ImportHotelsRoute = typeof importHotelsRoute;
export type DownloadHotelTemplateRoute = typeof downloadHotelTemplateRoute;

import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  stringIdParamSchema
} from "@/lib/helpers";
import {
  roomInsertSchema,
  roomQueryParamsSchema,
  roomSchema,
  roomTypeAmenityInsertSchema,
  roomTypeAmenitySchema,
  roomTypeInsertSchema,
  roomTypeQueryParamsSchema,
  roomTypeSchema,
  roomTypeUpdateSchema,
  roomTypeWithRelationsSchema,
  roomUpdateSchema,
  roomWithRelationsSchema
} from "core/zod";

const tags: string[] = ["Room Types & Rooms"];

/**
 * ================================================================
 * Room Types Routes
 * ================================================================
 */

// List room types for a hotel
export const listRoomTypesRoute = createRoute({
  tags,
  summary: "List room types for a hotel",
  path: "/types",
  method: "get",
  request: {
    query: roomTypeQueryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(roomTypeWithRelationsSchema)),
      "The list of room types"
    )
  }
});

// Get single room type
export const getRoomTypeRoute = createRoute({
  tags,
  summary: "Get room type by ID",
  path: "/types/:id",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      roomTypeWithRelationsSchema,
      "The room type details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Room type not found"
    )
  }
});

// Create room type
export const createRoomTypeRoute = createRoute({
  tags,
  summary: "Create new room type",
  method: "post",
  path: "/types",
  request: {
    body: jsonContentRequired(roomTypeInsertSchema, "Room type data")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(roomTypeSchema, "Created room type"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Update room type
export const updateRoomTypeRoute = createRoute({
  tags,
  summary: "Update room type",
  method: "patch",
  path: "/types/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(roomTypeUpdateSchema, "Room type update data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(roomTypeSchema, "Updated room type"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Room type not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Delete room type
export const deleteRoomTypeRoute = createRoute({
  tags,
  summary: "Delete room type",
  method: "delete",
  path: "/types/:id",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Room type deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Room type not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

/**
 * ================================================================
 * Room Type Amenities Routes
 * ================================================================
 */

// Add amenity to room type
export const addRoomTypeAmenityRoute = createRoute({
  tags,
  summary: "Add amenity to room type",
  method: "post",
  path: "/types/:id/amenities",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      roomTypeAmenityInsertSchema,
      "Room type amenity data"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      roomTypeAmenitySchema,
      "Added amenity to room type"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Room type not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Remove amenity from room type
export const removeRoomTypeAmenityRoute = createRoute({
  tags,
  summary: "Remove amenity from room type",
  method: "delete",
  path: "/types/:id/amenities/:amenityId",
  request: {
    params: z.object({
      id: z.string(),
      amenityId: z.string()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Amenity removed from room type"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Amenity not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

/**
 * ================================================================
 * Rooms Routes
 * ================================================================
 */

// List rooms
export const listRoomsRoute = createRoute({
  tags,
  summary: "List rooms",
  path: "/",
  method: "get",
  request: {
    query: roomQueryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(roomWithRelationsSchema)),
      "The list of rooms"
    )
  }
});

// Get single room
export const getRoomRoute = createRoute({
  tags,
  summary: "Get room by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      roomWithRelationsSchema,
      "The room details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Room not found"
    )
  }
});

// Create room
export const createRoomRoute = createRoute({
  tags,
  summary: "Create new room",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(roomInsertSchema, "Room data")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(roomSchema, "Created room"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorMessageSchema,
      "Room number already exists"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Update room
export const updateRoomRoute = createRoute({
  tags,
  summary: "Update room",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(roomUpdateSchema, "Room update data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(roomSchema, "Updated room"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Room not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Delete room
export const deleteRoomRoute = createRoute({
  tags,
  summary: "Delete room",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Room deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Room not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Bulk create rooms
export const bulkCreateRoomsRoute = createRoute({
  tags,
  summary: "Bulk create rooms",
  method: "post",
  path: "/bulk",
  request: {
    body: jsonContentRequired(
      z.object({
        roomTypeId: z.string(),
        hotelId: z.string(),
        roomNumbers: z.array(z.string()),
        floorNumber: z.number().optional(),
        isAccessible: z.boolean().optional()
      }),
      "Bulk room creation data"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        message: z.string(),
        created: z.number(),
        rooms: z.array(roomSchema)
      }),
      "Bulk created rooms"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Hotel not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorMessageSchema,
      "Room numbers already exist"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Export route types
export type ListRoomTypesRoute = typeof listRoomTypesRoute;
export type GetRoomTypeRoute = typeof getRoomTypeRoute;
export type CreateRoomTypeRoute = typeof createRoomTypeRoute;
export type UpdateRoomTypeRoute = typeof updateRoomTypeRoute;
export type DeleteRoomTypeRoute = typeof deleteRoomTypeRoute;
export type AddRoomTypeAmenityRoute = typeof addRoomTypeAmenityRoute;
export type RemoveRoomTypeAmenityRoute = typeof removeRoomTypeAmenityRoute;

export type ListRoomsRoute = typeof listRoomsRoute;
export type GetRoomRoute = typeof getRoomRoute;
export type CreateRoomRoute = typeof createRoomRoute;
export type UpdateRoomRoute = typeof updateRoomRoute;
export type DeleteRoomRoute = typeof deleteRoomRoute;
export type BulkCreateRoomsRoute = typeof bulkCreateRoomsRoute;

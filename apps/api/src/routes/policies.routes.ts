import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema, stringIdParamSchema } from "@/lib/helpers";
import { tags } from "./hotel.routes";
import {
  hotelPolicyInsertSchema,
  hotelPolicySchema,
  hotelPolicyUpdateSchema
} from "core/zod";

// Hotel Policy Routes
export const getHotelPoliciesRoute = createRoute({
  tags,
  summary: "Get all Hotel Policies",
  method: "get",
  path: "/:id/policies",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelPolicySchema),
      "List of hotel policies"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to get"
    )
  }
});

export const upsertPoliciesToHotelRoute = createRoute({
  tags,
  summary: "Upsert Policies to Hotel",
  method: "post",
  path: "/:id/policies",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      z.array(hotelPolicyInsertSchema),
      "Policies to upsert"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.array(hotelPolicySchema),
      "Upserted Hotel Policies"
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

export const addNewHotelPoliciesRoute = createRoute({
  tags,
  summary: "Add new Hotel Policies",
  method: "post",
  path: "/policies",
  request: {
    body: jsonContentRequired(
      z.array(hotelPolicyInsertSchema),
      "Policies to insert"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.array(hotelPolicyInsertSchema),
      "Inserted Hotel Policies"
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

export const updateHotelPolicyRoute = createRoute({
  tags,
  summary: "Update Hotel Policy",
  method: "put",
  path: "/policies/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(hotelPolicyUpdateSchema, "Update data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      hotelPolicySchema,
      "Updated Hotel Policy"
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
      "Policy not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to update"
    )
  }
});

export const removeHotelPolicyRoute = createRoute({
  tags,
  summary: "Remove Hotel Policy",
  method: "delete",
  path: "/policies/:id",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Hotel Policy removed"
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
      "Policy not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to delete"
    )
  }
});

// Export hotel policy routes type definitions
export type GetHotelPoliciesRoute = typeof getHotelPoliciesRoute;
export type UpsertPoliciesToHotelRoute = typeof upsertPoliciesToHotelRoute;
export type AddNewHotelPoliciesRoute = typeof addNewHotelPoliciesRoute;
export type UpdateHotelPolicyRoute = typeof updateHotelPolicyRoute;
export type RemoveHotelPolicyRoute = typeof removeHotelPolicyRoute;

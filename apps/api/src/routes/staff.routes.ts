import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
} from "@/lib/helpers";

const tags: string[] = ["Admin Staff Management"];

export const staffSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  banned: z.boolean().nullable().optional(),
});

export const createStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "moderator", "support", "staff"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["admin", "moderator", "support", "staff"]).optional(),
  banned: z.boolean().optional(),
});

export const listStaffRoute = createRoute({
  tags,
  summary: "List staff members",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(staffSchema)),
      "The list of staff members"
    ),
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

export const createStaffRoute = createRoute({
  tags,
  summary: "Create a new staff member",
  path: "/",
  method: "post",
  request: {
    body: jsonContent(createStaffSchema, "Staff member data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      staffSchema,
      "The created staff member"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
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

export const updateStaffRoute = createRoute({
  tags,
  summary: "Update a staff member",
  path: "/{id}",
  method: "patch",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContent(updateStaffSchema, "Staff member update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      staffSchema,
      "The updated staff member"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Staff member not found"
    ),
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

export const deleteStaffRoute = createRoute({
  tags,
  summary: "Delete a staff member",
  path: "/{id}",
  method: "delete",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Staff member deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Staff member not found"
    ),
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

export type ListStaffRoute = typeof listStaffRoute;
export type CreateStaffRoute = typeof createStaffRoute;
export type UpdateStaffRoute = typeof updateStaffRoute;
export type DeleteStaffRoute = typeof deleteStaffRoute;

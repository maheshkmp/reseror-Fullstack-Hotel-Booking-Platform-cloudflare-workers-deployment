import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
} from "@/lib/helpers";

const tags: string[] = ["Admin Users"];

export const adminUserQueryParamsSchema = queryParamsSchema.extend({
  tab: z.enum(["all", "admin", "hotelOwner", "customer"]).optional().default("all"),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  banned: z.boolean().nullable().optional(),
  banReason: z.string().nullable().optional(),
  banExpires: z.string().or(z.date()).nullable().optional(),
  setup: z.boolean().nullable().default(false),
});

// Export all users route definition
export const exportUsersRoute = createRoute({
  tags,
  summary: "Export all users as Excel",
  method: "get",
  path: "/export",
  request: {
    query: z.object({
      search: z.string().optional(),
      tab: z.enum(["all", "admin", "hotelOwner", "customer"]).optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: "The list of Users as Excel",
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

// Import users route definition
export const importUsersRoute = createRoute({
  tags,
  summary: "Import users from Excel/CSV",
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
      "The users imported successfully"
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

// Download user template route definition
export const downloadUserTemplateRoute = createRoute({
  tags,
  summary: "Download user import template",
  method: "get",
  path: "/template",
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Excel template for user import",
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

export const listUsersRoute = createRoute({
  tags,
  summary: "List users (Admin only)",
  path: "/",
  method: "get",
  request: {
    query: adminUserQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(userSchema)),
      "The list of users"
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

export const getUserRoute = createRoute({
  tags,
  summary: "Get a user by ID",
  path: "/{id}",
  method: "get",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userSchema,
      "The user details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User not found"
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

export const updateUserRoute = createRoute({
  tags,
  summary: "Update a user",
  path: "/{id}",
  method: "patch",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContent(
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        role: z.string().optional(),
      }),
      "User update data"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userSchema,
      "The updated user"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User not found"
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

export const deleteUserRoute = createRoute({
  tags,
  summary: "Delete a user",
  path: "/{id}",
  method: "delete",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "User deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User not found"
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

export const getUserProfileRoute = createRoute({
  tags,
  summary: "Get a user profile by ID (Owner-friendly)",
  path: "/{id}/profile",
  method: "get",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userSchema.extend({
        hotelId: z.string().nullable().optional(),
      }),
      "The user profile details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User not found"
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

export type ListUsersRoute = typeof listUsersRoute;
export type GetUserRoute = typeof getUserRoute;
export type GetUserProfileRoute = typeof getUserProfileRoute;
export type UpdateUserRoute = typeof updateUserRoute;
export type ExportUsersRoute = typeof exportUsersRoute;
export type ImportUsersRoute = typeof importUsersRoute;
export type DownloadUserTemplateRoute = typeof downloadUserTemplateRoute;
export type DeleteUserRoute = typeof deleteUserRoute;

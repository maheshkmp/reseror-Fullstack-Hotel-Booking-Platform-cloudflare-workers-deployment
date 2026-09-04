import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { errorMessageSchema } from "@/lib/helpers";
import { checkUserTypeSchema } from "core/zod";

const tags: string[] = ["System"];

// List route definition
export const checkUserType = createRoute({
  tags,
  summary: "Check user type",
  path: "/check-user-type",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(checkUserTypeSchema, "The user type"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    )
  }
});

export const testEmail = createRoute({
  tags,
  summary: "Test email sending",
  path: "/test-email",
  method: "get",
  request: {
    query: z.object({
      email: z.string().email(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.object({ message: z.string() }), "Email test status"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, "Email test failed"),
  }
});

export type CheckUserTypeRoute = typeof checkUserType;
export type TestEmailRoute = typeof testEmail;

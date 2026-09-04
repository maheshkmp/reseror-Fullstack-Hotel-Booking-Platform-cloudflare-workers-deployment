import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Auth"];

export const test = createRoute({
  tags,
  method: "get",
  path: "/test",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Auth routes are working!"),
      "Test endpoint for auth"
    ),
  },
});

export const verifyEmail = createRoute({
  tags,
  method: "post",
  path: "/verify-email",
  request: {
    body: jsonContentRequired(
      z.object({
        email: z.string().email(),
        otp: z.string().min(6).max(6),
      }),
      "Email and OTP for verification"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      "Email verified successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        error: z.string(),
      }),
      "Invalid or expired OTP"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string(),
      }),
      "User or verification request not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
      }),
      "Internal server error"
    ),
  },
});

export const debugOtp = createRoute({
  tags,
  method: "post",
  path: "/debug-otp",
  request: {
    body: jsonContentRequired(
      z.object({
        email: z.string().email(),
      }),
      "Email to get OTP for"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        email: z.string().email(),
        otp: z.string(),
        expiresAt: z.date(),
        token: z.string(),
      }),
      "Debug OTP information"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string(),
      }),
      "Verification request not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
      }),
      "Internal server error"
    ),
  },
});

export const switchRole = createRoute({
  tags,
  method: "post",
  path: "/switch-role",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        role: z.string(),
      }),
      "Role switched successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.object({ error: z.string() }),
      "Unauthorized access"
    ),
  },
});

export type TestRoute = typeof test;
export type VerifyEmailRoute = typeof verifyEmail;
export type DebugOtpRoute = typeof debugOtp;
export type SwitchRoleRoute = typeof switchRole;

import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema } from "@/lib/helpers";
import { inquiryInsertSchema, inquirySchema, inquiryUpdateSchema } from "core/zod";

const tags = ["Inquiries"];

export const createInquiryRoute = createRoute({
  tags,
  summary: "Create a new inquiry",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(inquiryInsertSchema, "Inquiry data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      inquirySchema,
      "Created inquiry"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid inquiry data"
    ),
  },
});

export const getInquiriesRoute = createRoute({
  tags,
  summary: "Get all inquiries (Admin only)",
  path: "/",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(inquirySchema),
      "List of inquiries"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
        errorMessageSchema,
        "Unauthorized access"
    ),
  },
});

export const updateInquiryStatusRoute = createRoute({
  tags,
  summary: "Update inquiry status (Admin only)",
  path: "/{id}/status",
  method: "patch",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: jsonContentRequired(inquiryUpdateSchema, "Inquiry status data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      inquirySchema,
      "Updated inquiry"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Inquiry not found"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
        errorMessageSchema,
        "Unauthorized access"
    ),
  },
});

export type CreateInquiryRoute = typeof createInquiryRoute;
export type GetInquiriesRoute = typeof getInquiriesRoute;
export type UpdateInquiryStatusRoute = typeof updateInquiryStatusRoute;

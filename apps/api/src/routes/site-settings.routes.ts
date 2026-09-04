import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema } from "@/lib/helpers";
import {
  siteSettingsSchema,
  updateSiteSettingsSchema,
} from "core/zod";

export const tags = ["Site Settings"];

export const getSiteSettingsRoute = createRoute({
  tags,
  summary: "Get Site Settings",
  method: "get",
  path: "/",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      siteSettingsSchema,
      "The site settings"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to fetch site settings"
    ),
  },
});

export const updateSiteSettingsRoute = createRoute({
  tags,
  summary: "Update Site Settings",
  method: "patch",
  path: "/",
  request: {
    body: jsonContentRequired(
      updateSiteSettingsSchema,
      "The site settings to update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      siteSettingsSchema,
      "The updated site settings"
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
      "Failed to update site settings"
    ),
  },
});

export type GetSiteSettingsRoute = typeof getSiteSettingsRoute;
export type UpdateSiteSettingsRoute = typeof updateSiteSettingsRoute;

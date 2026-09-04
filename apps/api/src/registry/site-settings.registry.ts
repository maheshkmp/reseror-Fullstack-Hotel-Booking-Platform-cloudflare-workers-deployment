import { OpenAPIHono } from "@hono/zod-openapi";
import type { APIBindings } from "@/types";
import {
  getSiteSettingsRoute,
  updateSiteSettingsRoute,
} from "../routes/site-settings.routes";
import {
  getSiteSettingsHandler,
  updateSiteSettingsHandler,
} from "../handlers/site-settings.handlers";

const siteSettings = new OpenAPIHono<APIBindings>();

siteSettings.openapi(getSiteSettingsRoute, getSiteSettingsHandler);
siteSettings.openapi(updateSiteSettingsRoute, updateSiteSettingsHandler);

export default siteSettings;

import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";
import { siteSettings } from "core/database/schema";
import type {
  GetSiteSettingsRoute,
  UpdateSiteSettingsRoute,
} from "../routes/site-settings.routes";

export const getSiteSettingsHandler: APIRouteHandler<GetSiteSettingsRoute> = async (c) => {
  const db = c.get("db");

  let settings = await db.query.siteSettings.findFirst({
    where: (fields, { eq }) => eq(fields.id, 1),
  });

  if (!settings) {
    // Initialize with defaults if not found
    const [newSettings] = await db
      .insert(siteSettings)
      .values({
        id: 1,
        siteName: "Reseror",
        defaultCommissionRate: "10.00",
      })
      .returning();
    settings = newSettings;
  }

  return c.json(settings as any, HttpStatusCodes.OK);
};

export const updateSiteSettingsHandler: APIRouteHandler<UpdateSiteSettingsRoute> = async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const user = c.get("user");

  if (!user || user.role !== "admin") {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(siteSettings)
    .set({
      ...body,
      updatedAt: new Date(),
    } as any)
    .where(eq(siteSettings.id, 1))
    .returning();

  if (!updated) {
    // If somehow it doesn't exist yet, create it
    const [inserted] = await db
      .insert(siteSettings)
      .values({
        ...body,
        id: 1,
      } as any)
      .returning();
    return c.json(inserted as any, HttpStatusCodes.OK);
  }

  return c.json(updated as any, HttpStatusCodes.OK);
};

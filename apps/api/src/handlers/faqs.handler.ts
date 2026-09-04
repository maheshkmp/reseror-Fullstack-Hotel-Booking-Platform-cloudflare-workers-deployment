import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { hotelFaqs, hotels } from "core/database/schema";
import type { APIRouteHandler } from "@/types";
import {
  GetHotelFaqsRoute,
  UpsertFaqsToHotelRoute,
} from "../routes/faqs.routes";

export const getHotelFaqsHandler: APIRouteHandler<
  GetHotelFaqsRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const faqs = await db.query.hotelFaqs.findMany({
    where: eq(hotelFaqs.hotelId, params.id),
    orderBy: (faqs, { asc }) => [asc(faqs.displayOrder)],
  });

  return c.json(faqs as any, HttpStatusCodes.OK);
};

export const upsertFaqsToHotelHandler: APIRouteHandler<
  UpsertFaqsToHotelRoute
> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const db = c.get("db");
  const user = c.get("user");

  if (!user) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, params.id),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Verify ownership
  if (user.role !== "admin" && hotel.createdBy !== user.id) {
    return c.json(
      { message: "You do not have permission to manage this hotel's FAQs" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Delete existing and insert new (sync)
  await db
    .delete(hotelFaqs)
    .where(eq(hotelFaqs.hotelId, params.id));

  if (body.length > 0) {
    const inserted = await db
      .insert(hotelFaqs)
      .values(
        body.map((item) => ({
          ...item,
          hotelId: params.id,
        }))
      )
      .returning();

    return c.json(
      {
        message: "FAQs synced successfully",
        count: inserted.length,
      },
      HttpStatusCodes.OK
    );
  }

  return c.json(
    {
      message: "FAQs cleared successfully",
      count: 0,
    },
    HttpStatusCodes.OK
  );
};

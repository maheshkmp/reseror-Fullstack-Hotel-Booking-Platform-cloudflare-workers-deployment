import * as HttpStatusCodes from "stoker/http-status-codes";
import type { APIRouteHandler } from "@/types";
import { inquiries } from "core/database/schema";
import { eq, desc } from "drizzle-orm";
import {
  CreateInquiryRoute,
  GetInquiriesRoute,
  UpdateInquiryStatusRoute,
} from "../routes/inquiries.routes";

export const createInquiryHandler: APIRouteHandler<CreateInquiryRoute> = async (c) => {
  try {
    const db = c.get("db");
    const body = c.req.valid("json");

    const [inquiry] = await db
      .insert(inquiries)
      .values(body)
      .returning();

    return c.json(inquiry, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("[INQUIRY CREATE ERROR]", error);
    return c.json(
      { message: "Failed to submit inquiry" },
      HttpStatusCodes.BAD_REQUEST as any
    );
  }
};

export const getInquiriesHandler: APIRouteHandler<GetInquiriesRoute> = async (c) => {
  try {
    const user = c.get("user");
    if (!user || user.role !== "admin") {
      return c.json(
        { message: "Unauthorized access" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    const db = c.get("db");

    const list = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));

    return c.json(list, HttpStatusCodes.OK);
  } catch (error) {
    console.error("[INQUIRY GET ERROR]", error);
    return c.json(
      { message: "Failed to fetch inquiries" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR as any
    );
  }
};

export const updateInquiryStatusHandler: APIRouteHandler<UpdateInquiryStatusRoute> = async (c) => {
  try {
    const user = c.get("user");
    if (!user || user.role !== "admin") {
      return c.json(
        { message: "Unauthorized access" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    const db = c.get("db");
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    const [inquiry] = await db
      .update(inquiries)
      .set({
        status: body.status,
      })
      .where(eq(inquiries.id, id))
      .returning();

    if (!inquiry) {
      return c.json(
        { message: "Inquiry not found" },
        HttpStatusCodes.NOT_FOUND as any
      );
    }

    return c.json(inquiry, HttpStatusCodes.OK);
  } catch (error) {
    console.error("[INQUIRY UPDATE ERROR]", error);
    return c.json(
      { message: "Failed to update inquiry status" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR as any
    );
  }
};

/* eslint-disable prefer-const */
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { hotelPolicies, hotels } from "core/database/schema";
import { HotelPolicy } from "core/zod";
import type {
  AddNewHotelPoliciesRoute,
  GetHotelPoliciesRoute,
  RemoveHotelPolicyRoute,
  UpdateHotelPolicyRoute,
  UpsertPoliciesToHotelRoute,
} from "../routes/policies.routes";

/**
 * ================================================================
 * Hotel policies Handlers
 * ================================================================
 */

// List hotel policies route handler
export const getHotelPoliciesHandler: APIRouteHandler<
  GetHotelPoliciesRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");

  const allHotelPolicies = await db.query.hotelPolicies.findMany({
    where(fields, { eq }) {
      return eq(fields.hotelId, params.id);
    },
  });

  return c.json(allHotelPolicies as unknown as any, HttpStatusCodes.OK);
};

// Upsert hotel policies route handler (following amenities pattern)
export const upsertPoliciesToHotelHandler: APIRouteHandler<
  UpsertPoliciesToHotelRoute
> = async (c) => {
  const body = c.req.valid("json");
  const params = c.req.valid("param");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
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
      { message: "You do not have permission to manage this hotel's policies" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const currentPolicies = await db.query.hotelPolicies.findMany({
    where: (fields, { eq }) => eq(fields.hotelId, params.id),
  });

  if (currentPolicies.length > 0) {
    // If policies already exist, delete them first
    await db.delete(hotelPolicies).where(eq(hotelPolicies.hotelId, params.id));
  }

  let insertedPolicies: HotelPolicy[] = [];

  await Promise.all(
    body.map(async (policy) => {
      const _insertedPolicy = await db
        .insert(hotelPolicies)
        .values({
          hotelId: params.id,
          policyType: policy.policyType,
          policyText: policy.policyText,
          effectiveDate: policy.effectiveDate,
          isActive: policy.isActive ?? true,
        })
        .returning();

      if (_insertedPolicy[0]) {
        insertedPolicies.push(_insertedPolicy[0] as unknown as any);
      }
    })
  );

  return c.json(insertedPolicies as unknown as any, HttpStatusCodes.CREATED);
};

// Add new hotel policies route handler
export const addNewHotelPoliciesHandler: APIRouteHandler<
  AddNewHotelPoliciesRoute
> = async (c) => {
  const body = c.req.valid("json");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // For addNewHotelPoliciesHandler, we need to check if the user has access to ALL hotels in the body
  const hotelIds = [...new Set(body.map(p => p.hotelId))];
  for (const hId of hotelIds) {
    const hotel = await db.query.hotels.findFirst({ where: eq(hotels.id, hId) });
    if (!hotel) return c.json({ message: `Hotel ${hId} not found` }, HttpStatusCodes.NOT_FOUND);
    if (user.role !== "admin" && hotel.createdBy !== user.id) {
      return c.json({ message: `Forbidden: You do not own hotel ${hId}` }, HttpStatusCodes.FORBIDDEN);
    }
  }

  let insertedPolicies: (typeof hotelPolicies.$inferSelect)[] = [];

  try {
    await Promise.all(
      body.map(async (policy) => {
        const _insertedPolicy = await db
          .insert(hotelPolicies)
          .values({
            hotelId: policy.hotelId,
            policyType: policy.policyType,
            policyText: policy.policyText,
            effectiveDate: policy.effectiveDate,
            isActive: policy.isActive ?? true,
          })
          .returning();

        if (_insertedPolicy[0]) {
          insertedPolicies.push(_insertedPolicy[0] as unknown as any);
        }
      })
    );

    return c.json(insertedPolicies as unknown as any, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("Failed to create hotel policies:", error);
    return c.json(
      {
        message: "Failed to create hotel policies",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Update hotel policy route handler
export const updateHotelPolicyHandler: APIRouteHandler<
  UpdateHotelPolicyRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // For updateHotelPolicyHandler, params.id is the policy ID.
  const policy = await db.query.hotelPolicies.findFirst({
    where: eq(hotelPolicies.id, params.id),
    with: {
        hotel: true
    }
  });

  if (!policy) {
    return c.json({ message: "Policy not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Verify ownership
  if (user.role !== "admin" && (policy as any).hotel?.createdBy !== user.id) {
    return c.json(
      { message: "You do not have permission to manage this hotel's policies" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const updatedPolicy = await db
      .update(hotelPolicies)
      .set({
        policyType: body.policyType,
        policyText: body.policyText,
        effectiveDate: body.effectiveDate,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(hotelPolicies.id, params.id))
      .returning();

    if (updatedPolicy.length === 0) {
      return c.json(
        {
          message: "Policy not found",
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(updatedPolicy[0] as unknown as any, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Failed to update hotel policy:", error);
    return c.json(
      {
        message: "Failed to update hotel policy",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Remove hotel policy route handler
export const removeHotelPolicyHandler: APIRouteHandler<
  RemoveHotelPolicyRoute
> = async (c) => {
  const params = c.req.valid("param");
  const db = c.get("db");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // For removeHotelPolicyHandler, params.id is the policy ID.
  const policy = await db.query.hotelPolicies.findFirst({
    where: eq(hotelPolicies.id, params.id),
    with: {
        hotel: true
    }
  });

  if (!policy) {
    return c.json({ message: "Policy not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Verify ownership
  if (user.role !== "admin" && (policy as any).hotel?.createdBy !== user.id) {
    return c.json(
      { message: "You do not have permission to manage this hotel's policies" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const deletedPolicy = await db
      .delete(hotelPolicies)
      .where(eq(hotelPolicies.id, params.id))
      .returning();

    if (deletedPolicy.length === 0) {
      return c.json(
        {
          message: "Policy not found",
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        message: "Hotel policy removed successfully",
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Failed to delete hotel policy:", error);
    return c.json(
      {
        message: "Failed to delete hotel policy",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";


import type { APIRouteHandler } from "@/types";
import { reviewNratings } from "core/database/schema";

import type {
  CreateRoute,
  GetByIdRoute,
  ListByHotelIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "../routes/reviewNrating.routes";

// 🔍 List all reviewNratings
export const list: APIRouteHandler<ListRoute> = async (c) => {
  const db = c.get("db");
  const results = await db.query.reviewNratings.findMany({});
  const page = 1; // or from query params
  const limit = results.length; // or from query params
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / limit);

  return c.json(
    {
      data: results,
      meta: {
        totalCount,
        limit,
        currentPage: page,
        totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create new reviewNrating
export const create: APIRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const db = c.get("db");
  const [inserted] = await db
    .insert(reviewNratings)
    .values({
      ...body,
      organizationId: session?.activeOrganizationId,
      userId: session?.userId,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted as unknown as any, HttpStatusCodes.CREATED);
};

// 🔍 Get a single reviewNrating
export const getOne: APIRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");
  const reviewNrating = await db.query.reviewNratings.findFirst({
    where: eq(reviewNratings.id, String(id)),
  });

  if (!reviewNrating) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(reviewNrating as unknown as any, HttpStatusCodes.OK);
};

// Update reviewNrating
export const patch: APIRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("user");
  const db = c.get("db");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [updated] = await db
    .update(reviewNratings)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(reviewNratings.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated as unknown as any, HttpStatusCodes.OK);
};

//  Delete reviewNrating
export const remove: APIRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("user") as { organizationId?: string } | undefined;
  const db = c.get("db");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  return c.json(null, 204 as any) as any;
};

export const listByHotelId: APIRouteHandler<ListByHotelIdRoute> = async (c) => {
  const { hotelId } = c.req.valid("param");
  const db = c.get("db");
    const results = await db.query.reviewNratings.findMany({
    where: eq(reviewNratings.hotelId, hotelId),
  });
  const page = 1;
  const limit = results.length;
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / (limit || 1));

  return c.json(
    {
      data: results,
      meta: {
        totalCount,
        limit,
        currentPage: page,
        totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

// import { eq } from "drizzle-orm";
// import * as HttpStatusCodes from "stoker/http-status-codes";
// import * as HttpStatusPhrases from "stoker/http-status-phrases";

// 
// import type { APIRouteHandler } from "@/types";
// import { reviewNratings } from "core/database/schema";

// import type {
//   ListRoute,
//   CreateRoute,
//   GetByIdRoute,
//   UpdateRoute,
//   RemoveRoute,
// } from "./reviewNrating.routes";

// // 📝 List all reviewNratings
// export const list: APIRouteHandler<ListRoute> = async (c) => {
//   const results = await db.query.reviewNratings.findMany({});
//   return c.json(
//     {
//       data: results,
//       total: results.length,
//     },
//     HttpStatusCodes.OK
//   );
// };

// // ➕ Create new reviewNrating
// export const create: APIRouteHandler<CreateRoute> = async (c) => {
//   const body = c.req.valid("json");
//   const session = c.get("user") as { organizationId?: string } | undefined;

//   if (!session?.organizationId) {
//     return c.json(
//       { message: HttpStatusPhrases.UNAUTHORIZED },
//       HttpStatusCodes.UNAUTHORIZED
//     );
//   }

//   const [inserted] = await db
//     .insert(reviewNratings)
//     .values({
//       ...body,
//       organizationId: session.organizationId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     })
//     .returning();

//   return c.json(inserted, HttpStatusCodes.CREATED);
// };

// // 🔍 Get a single reviewNrating
// export const getOne: APIRouteHandler<GetByIdRoute> = async (c) => {
//   const { id } = c.req.valid("params");

//   const found = await db.query.reviewNratings.findFirst({
//     where: eq(reviewNratings.id, String(id)),
//   });

//   if (!found) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(found, HttpStatusCodes.OK);
// };

// // ✏️ Update reviewNrating
// export const patch: APIRouteHandler<UpdateRoute> = async (c) => {
//   const { id } = c.req.valid("params");
//   const updates = c.req.valid("json");
//   const session = c.get("user") as { organizationId?: string } | undefined;

//   if (!session?.organizationId) {
//     return c.json(
//       { message: HttpStatusPhrases.UNAUTHORIZED },
//       HttpStatusCodes.UNAUTHORIZED
//     );
//   }

//   const [updated] = await db
//     .update(reviewNratings)
//     .set({
//       ...updates,
//       updatedAt: new Date(),
//     })
//     .where(eq(reviewNratings.id, String(id)))
//     .returning();

//   if (!updated) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(updated, HttpStatusCodes.OK);
// };

// // 🗑 Delete reviewNrating
// export const remove: APIRouteHandler<RemoveRoute> = async (c) => {
//   const { id } = c.req.valid("params");
//   const session = c.get("user") as { organizationId?: string } | undefined;

//   if (!session?.organizationId) {
//     return c.json(
//       { message: HttpStatusPhrases.UNAUTHORIZED },
//       HttpStatusCodes.UNAUTHORIZED
//     );
//   }

//   const [deleted] = await db
//     .delete(reviewNratings)
//     .where(eq(reviewNratings.id, String(id)))
//     .returning();

//   if (!deleted) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json({ message: "Deleted successfully" }, HttpStatusCodes.OK);
// };

import { APIRouteHandler } from "@/types";
import { 
  ListStaffRoute, 
  CreateStaffRoute, 
  UpdateStaffRoute, 
  DeleteStaffRoute 
} from "../routes/staff.routes";
import * as schemas from "core/database/schema";
import { desc, eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { getAuth } from "core/auth/setup";

export const listStaffHandler: APIRouteHandler<ListStaffRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user || user.role !== "admin") {
    return c.json({ message: "Unauthorized access" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { page: pageStr = "1", limit: limitStr = "10" } = c.req.valid("query");
  
  const page = parseInt(pageStr);
  const limit = parseInt(limitStr);
  const offset = (page - 1) * limit;

  const db = c.get("db");

  // We only want staff members
  const staffRoles = ["admin", "moderator", "support", "staff"];
  
  const staff = await db.select()
    .from(schemas.user)
    .where(inArray(schemas.user.role, staffRoles))
    .orderBy(desc(schemas.user.createdAt))
    .limit(limit)
    .offset(offset);

  const totalCount = staff.length; // Simplified for "no filtering needed"

  return c.json({
    data: staff.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    meta: {
      currentPage: page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  }, HttpStatusCodes.OK);
};

export const createStaffHandler: APIRouteHandler<CreateStaffRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user || user.role !== "admin") {
    return c.json({ message: "Unauthorized access" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { email, password, name, role } = c.req.valid("json");
  const auth = getAuth();
  const db = c.get("db");

  try {
    // Create user using better-auth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      }
    });

    if (!result || !result.user) {
        return c.json({ message: "Failed to create user" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    // Update the role to staff/admin/etc.
    const [updatedUser] = await db.update(schemas.user)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(schemas.user.id, result.user.id))
      .returning();

    return c.json({
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    }, HttpStatusCodes.CREATED);
  } catch (error: any) {
    console.error("Staff creation error:", error);
    return c.json({ message: error.message || "Failed to create staff member" }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }
};

export const updateStaffHandler: APIRouteHandler<UpdateStaffRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user || user.role !== "admin") {
    return c.json({ message: "Unauthorized access" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const db = c.get("db");

  const [updatedUser] = await db.update(schemas.user)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(schemas.user.id, id))
    .returning();

  if (!updatedUser) {
    return c.json({ message: "Staff member not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({
    ...updatedUser,
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
  }, HttpStatusCodes.OK);
};

export const deleteStaffHandler: APIRouteHandler<DeleteStaffRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user || user.role !== "admin") {
    return c.json({ message: "Unauthorized access" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { id } = c.req.valid("param");
  const db = c.get("db");

  const result = await db.delete(schemas.user)
    .where(eq(schemas.user.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ message: "Staff member not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

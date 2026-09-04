import { APIRouteHandler } from "@/types";
import { 
  listUsersRoute, 
  getUserRoute, 
  updateUserRoute, 
  deleteUserRoute,
  ListUsersRoute,
  GetUserRoute,
  UpdateUserRoute,
  DeleteUserRoute,
  ExportUsersRoute,
  ImportUsersRoute,
  DownloadUserTemplateRoute,
  GetUserProfileRoute,
} from "../routes/user.routes";
import { jsonToExcelBuffer, excelBufferToJson } from "@/lib/excel.utils";
import * as schemas from "core/database/schema";
import { count, desc, or, eq, and, ilike, inArray, notInArray, isNull } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const listUsersHandler: APIRouteHandler<ListUsersRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  console.log(`[listUsersHandler] Session: ${!!session}, User: ${user?.email}, Role: ${user?.role}`);

  if (!session || !user || user.role !== "admin") {
    console.warn(`[listUsersHandler] Unauthorized: session=${!!session}, user=${user?.email}, role=${user?.role}`);
    return c.json({ message: "Unauthorized access" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { page: pageStr, limit: limitStr, search = "", tab = "all" } = c.req.valid("query");
  
  const page = parseInt(pageStr || "1");
  const limit = parseInt(limitStr || "10");
  const offset = (page - 1) * limit;

  const db = c.get("db");

  let whereClause = undefined;
  
  const searchFilter = search 
    ? or(ilike(schemas.user.email, `%${search}%`), ilike(schemas.user.name, `%${search}%`)) 
    : undefined;

  let tabFilter = undefined;
  if (tab === "admin") {
    tabFilter = eq(schemas.user.role, "admin");
  } else if (tab === "hotelOwner") {
    const ownerSubquery = db.select({ id: schemas.member.userId }).from(schemas.member);
    tabFilter = inArray(schemas.user.id, ownerSubquery);
  } else if (tab === "customer") {
    const ownerSubquery = db.select({ id: schemas.member.userId }).from(schemas.member);
    tabFilter = and(
      or(eq(schemas.user.role, "user"), isNull(schemas.user.role)),
      notInArray(schemas.user.id, ownerSubquery)
    );
  }

  if (searchFilter && tabFilter) {
    whereClause = and(searchFilter, tabFilter);
  } else if (searchFilter) {
    whereClause = searchFilter;
  } else if (tabFilter) {
    whereClause = tabFilter;
  }
  
  const users = await db.select()
    .from(schemas.user)
    .where(whereClause)
    .orderBy(desc(schemas.user.createdAt))
    .limit(limit)
    .offset(offset);

  const resultCount = await db.select({ value: count() })
    .from(schemas.user)
    .where(whereClause);

  const totalCount = Number(resultCount[0]?.value || 0);


  return c.json({
    data: users.map(user => ({
      ...user,
      createdAt: user.createdAt ? (user.createdAt instanceof Date ? user.createdAt.toISOString() : new Date(user.createdAt).toISOString()) : new Date().toISOString(),
      updatedAt: user.updatedAt ? (user.updatedAt instanceof Date ? user.updatedAt.toISOString() : new Date(user.updatedAt).toISOString()) : new Date().toISOString(),
      banExpires: user.banExpires ? (user.banExpires instanceof Date ? user.banExpires.toISOString() : new Date(user.banExpires).toISOString()) : null
    })),
    meta: {
      currentPage: page,
      limit,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  }, HttpStatusCodes.OK);
};

export const getUserHandler: APIRouteHandler<GetUserRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user || user.role !== "admin") {
    return c.json({ message: "Unauthorized access" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { id } = c.req.valid("param");
  const db = c.get("db");

  const [fetchedUser] = await db.select()
    .from(schemas.user)
    .where(eq(schemas.user.id, id))
    .limit(1);

  if (!fetchedUser) {
    return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({
    ...fetchedUser,
    createdAt: fetchedUser.createdAt.toISOString(),
    updatedAt: fetchedUser.updatedAt.toISOString(),
    banExpires: fetchedUser.banExpires?.toISOString() || null
  }, HttpStatusCodes.OK);
};

export const getUserProfileHandler: APIRouteHandler<GetUserProfileRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const db = c.get("db");

  if (!session || !user) {
    return c.json({ message: "Unauthorized access" }, HttpStatusCodes.UNAUTHORIZED);
  }

  // Users can only view their own profile unless they are admins
  if (user.role !== "admin" && user.id !== id) {
    return c.json({ message: "Forbidden access" }, HttpStatusCodes.FORBIDDEN);
  }

  const [fetchedUser] = await db.select()
    .from(schemas.user)
    .where(eq(schemas.user.id, id))
    .limit(1);

  if (!fetchedUser) {
    return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Get associated hotelId if any (from member table)
  const [membership] = await db.select({ hotelId: schemas.hotels.id })
    .from(schemas.member)
    .leftJoin(schemas.hotels, eq(schemas.hotels.organizationId, schemas.member.organizationId))
    .where(eq(schemas.member.userId, id))
    .limit(1);

  return c.json({
    ...fetchedUser,
    hotelId: membership?.hotelId || null,
    createdAt: fetchedUser.createdAt.toISOString(),
    updatedAt: fetchedUser.updatedAt.toISOString(),
    banExpires: fetchedUser.banExpires?.toISOString() || null
  }, HttpStatusCodes.OK);
};

export const updateUserHandler: APIRouteHandler<UpdateUserRoute> = async (c) => {
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
    return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({
    ...updatedUser,
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
    banExpires: updatedUser.banExpires?.toISOString() || null
  }, HttpStatusCodes.OK);
};

export const deleteUserHandler: APIRouteHandler<DeleteUserRoute> = async (c) => {
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
    return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const exportUsersHandler: APIRouteHandler<ExportUsersRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");

  if (!session || !user || user.role !== "admin") {
    return c.json({ message: "Unauthorized access" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { search = "", tab = "all" } = c.req.valid("query");

  let whereClause = undefined;
  const searchFilter = search 
    ? or(ilike(schemas.user.email, `%${search}%`), ilike(schemas.user.name, `%${search}%`)) 
    : undefined;

  let tabFilter = undefined;
  if (tab === "admin") {
    tabFilter = eq(schemas.user.role, "admin");
  } else if (tab === "hotelOwner") {
    const ownerSubquery = db.select({ id: schemas.member.userId }).from(schemas.member);
    tabFilter = inArray(schemas.user.id, ownerSubquery);
  } else if (tab === "customer") {
    const ownerSubquery = db.select({ id: schemas.member.userId }).from(schemas.member);
    tabFilter = and(
      or(eq(schemas.user.role, "user"), isNull(schemas.user.role)),
      notInArray(schemas.user.id, ownerSubquery)
    );
  }

  if (searchFilter && tabFilter) {
    whereClause = and(searchFilter, tabFilter);
  } else if (searchFilter) {
    whereClause = searchFilter;
  } else if (tabFilter) {
    whereClause = tabFilter;
  }

  const allUsers = await db.select()
    .from(schemas.user)
    .where(whereClause)
    .orderBy(desc(schemas.user.createdAt));

  const exportData = allUsers.map(u => ({
    ID: u.id,
    Name: u.name,
    Email: u.email,
    Role: u.role,
    EmailVerified: u.emailVerified ? "Yes" : "No",
    Banned: u.banned ? "Yes" : "No",
    BanReason: u.banReason || "",
    CreatedAt: u.createdAt.toISOString(),
  }));

  const buffer = jsonToExcelBuffer(exportData, "Users");

  return c.body(buffer as any, HttpStatusCodes.OK, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": 'attachment; filename="users.xlsx"',
  });
};

export const importUsersHandler: APIRouteHandler<ImportUsersRoute> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const db = c.get("db");

  if (!session || !user || user.role !== "admin") {
    return c.json({ message: "Unauthorized access" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const formData = await c.req.parseBody();
  const file = formData.file as File;

  if (!file) {
    return c.json({ message: "No file uploaded" }, HttpStatusCodes.BAD_REQUEST);
  }

  const arrayBuffer = await file.arrayBuffer();
  const dataUint8 = new Uint8Array(arrayBuffer);

  try {
    const data = excelBufferToJson<any>(dataUint8);
    let count = 0;

    for (const row of data) {
      const userData = {
        name: row.Name,
        email: row.Email,
        role: row.Role || "user",
        emailVerified: row.EmailVerified === "Yes",
        updatedAt: new Date(),
      };

      if (row.ID) {
        // Update
        await db.update(schemas.user).set(userData).where(eq(schemas.user.id, row.ID));
      } else {
        // Insert (or upsert by email if needed, but here we use ID as primary check)
        const [existing] = await db.select().from(schemas.user).where(eq(schemas.user.email, row.Email)).limit(1);
        if (existing) {
          await db.update(schemas.user).set(userData).where(eq(schemas.user.id, existing.id));
        } else {
          await db.insert(schemas.user).values({
            ...userData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
          });
        }
      }
      count++;
    }

    return c.json({ message: "Import successful", count }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Import error:", error);
    return c.json({ message: "Failed to parse Excel file" }, HttpStatusCodes.BAD_REQUEST);
  }
};

export const downloadUserTemplateHandler: APIRouteHandler<DownloadUserTemplateRoute> = async (c) => {
  const templateData = [{
    ID: "",
    Name: "John Doe",
    Email: "john@example.com",
    Role: "user",
    EmailVerified: "Yes",
  }];

  const buffer = jsonToExcelBuffer(templateData, "Template");

  return c.body(buffer as any, HttpStatusCodes.OK, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": 'attachment; filename="user_import_template.xlsx"',
  });
};

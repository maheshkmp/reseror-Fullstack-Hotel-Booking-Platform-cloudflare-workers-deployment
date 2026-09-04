import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";


import { tasks } from "core/database/schema";

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute
} from "../routes/tasks.routes";

// List tasks route handler
export const list: APIRouteHandler<ListRoute> = async (c) => {
  const db = c.get("db");
  const tasks = await db.query.tasks.findMany({
    orderBy(fields) {
      return desc(fields.createdAt);
    }
  });

  return c.json(tasks as unknown as any);
};

// Create new task route handler
export const create: APIRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid("json");
  const session = c.get("user");
  const db = c.get("db");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db.insert(tasks).values(task).returning();

  return c.json(inserted as unknown as any, HttpStatusCodes.CREATED);
};

// Get single task route handler
export const getOne: APIRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id)
  });

  if (!task)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(task as unknown as any, HttpStatusCodes.OK);
};

// Update task route handler
export const patch: APIRouteHandler<PatchRoute> = async (c) => {
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

  const [task] = await db
    .update(tasks)
    .set({
      ...updates,
      updatedAt: new Date()
    })
    .where(eq(tasks.id, id))
    .returning();

  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(task as unknown as any, HttpStatusCodes.OK);
};

// Remove task route handler
export const remove: APIRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("user");
  const db = c.get("db");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [deleted] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

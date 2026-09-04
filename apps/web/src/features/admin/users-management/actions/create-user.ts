"use server";

import { authClient } from "@/lib/auth-client";
import { getForwardedHeaders } from "@/lib/server-utils";
import { type CreateUserSchema } from "core/zod/create-user";

export async function createUser(values: CreateUserSchema) {
  return await authClient.admin.createUser(
    {
      ...values,
      role: values.role === "admin" ? "admin" : "user"
    },
    {
      headers: await getForwardedHeaders()
    }
  );
}

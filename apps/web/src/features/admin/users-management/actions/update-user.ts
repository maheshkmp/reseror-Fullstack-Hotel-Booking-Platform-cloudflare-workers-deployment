"use server";

import { authClient } from "@/lib/auth-client";
import { getForwardedHeaders } from "@/lib/server-utils";

import { UpdateUserSchema } from "core/zod";

export async function updateUser(values: UpdateUserSchema) {
  return await authClient.admin.setRole(
    {
      userId: values.userId,
      role: values.role
    },
    {
      headers: await getForwardedHeaders()
    }
  );
}

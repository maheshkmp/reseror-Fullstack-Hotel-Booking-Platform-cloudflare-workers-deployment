"use server";

import { authClient } from "@/lib/auth-client";
import { getForwardedHeaders } from "@/lib/server-utils";
import { BanUserSchema } from "core/zod";

export async function banUser(values: BanUserSchema) {
  return await authClient.admin.banUser(
    {
      userId: values.userId,
      ...(values.banReason && { banReason: values.banReason }),
      ...(values.banExpiresIn && { banExpiresIn: values.banExpiresIn })
    },
    {
      headers: await getForwardedHeaders()
    }
  );
}

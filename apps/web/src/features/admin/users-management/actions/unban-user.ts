"use server";

import { authClient } from "@/lib/auth-client";
import { getForwardedHeaders } from "@/lib/server-utils";

export async function unbanUser(values: { userId: string }) {
  return await authClient.admin.unbanUser(
    {
      userId: values.userId
    },
    {
      headers: await getForwardedHeaders()
    }
  );
}

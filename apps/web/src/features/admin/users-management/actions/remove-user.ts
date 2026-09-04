"use server";

import { authClient } from "@/lib/auth-client";
import { getForwardedHeaders } from "@/lib/server-utils";

export async function removeUser(values: { userId: string }) {
  return await authClient.admin.removeUser(
    {
      userId: values.userId
    },
    {
      headers: await getForwardedHeaders()
    }
  );
}

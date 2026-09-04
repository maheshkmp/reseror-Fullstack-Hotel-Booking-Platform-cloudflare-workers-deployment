"use server";

import { authClient } from "@/lib/auth-client";
import { getForwardedHeaders } from "@/lib/server-utils";

export async function getUser(filterParams: { userId: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${filterParams.userId}`, {
    method: "GET",
    headers: await getForwardedHeaders()
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch user");
  }

  return await response.json();
}

"use server";

import { FilterParams } from "../api";
import { getForwardedHeaders } from "@/lib/server-utils";

export async function listUsers(filterParams: FilterParams & { tab?: string; status?: string }) {
  const { page = 1, limit = 10, search = "", tab = "all", status = "" } = filterParams;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search || "",
    tab: tab || "all",
  });

  if (status) {
    queryParams.append("status", status);
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?${queryParams}`;
    console.log(`[listUsers] Fetching from: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: await getForwardedHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[listUsers] Fetch failed: ${response.status} ${response.statusText}`, errorText);
      return { users: [], total: 0 };
    }

    const result = await response.json();

    return {
      users: result.data || [],
      total: result.meta?.totalCount || 0
    };
  } catch (error) {
    console.error("Fetch users exception:", error);
    return { users: [], total: 0 };
  }
}

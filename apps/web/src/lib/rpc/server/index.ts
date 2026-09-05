import rpc from "core/rpc";
import { cookies } from "next/headers";

export const getClient = async (cookieHeader?: string | null, userAgent?: string | null) => {
  let cookiesList = cookieHeader;

  if (cookiesList === undefined) {
    const cookiesStore = await cookies();

    cookiesList = cookiesStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
  }

  const backendUrl =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:4000";

  return rpc(backendUrl, {
    headers: {
      cookie: cookiesList || "",
      ...(userAgent ? { "user-agent": userAgent } : {}),
    }
  });
};

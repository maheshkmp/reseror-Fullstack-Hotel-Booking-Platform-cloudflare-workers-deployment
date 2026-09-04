import { MiddlewareHandler } from "hono";

import { getAuth } from "core/auth/setup";

import { APIBindings } from "@/types";

export const authMiddleware: MiddlewareHandler<APIBindings> = async (
  c,
  next
) => {
  const auth = getAuth();
  const headers = c.req.raw.headers;
  const cookie = headers.get("cookie");
  
  console.log(`[AUTH-MIDDLEWARE] Request Path: ${c.req.path}`);
  console.log(`[AUTH-MIDDLEWARE] Cookie present: ${!!cookie}`);
  if (cookie) {
    console.log(`[AUTH-MIDDLEWARE] Cookie start: ${cookie.substring(0, 40)}...`);
  }

  const session = await auth.api.getSession({ headers });

  if (!session) {
    console.log("[AUTH-MIDDLEWARE] ❌ No session found");
    c.set("session", null);
    c.set("user", null);
    return next();
  }

  console.log(`[AUTH-MIDDLEWARE] ✅ Session found for: ${session.user.email}`);
  c.set("session", session.session);
  c.set("user", session.user);
  return next();
};

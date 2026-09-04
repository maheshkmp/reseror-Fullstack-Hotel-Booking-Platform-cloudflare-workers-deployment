import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "core/auth/config";
import { NextResponse, type NextRequest } from "next/server";
import { getUserType } from "./lib/helpers/get-user-type";

const authRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/forgot-password",
  "/email-verified",
];

const onboardingRoutes = [
  "/user-selection",
  "/setup-organization",
  "/join-organization",
];

const protectedRoutes = ["/admin", "/account", ...onboardingRoutes];

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  console.log("[MIDDLEWARE] 🔍 Request:", request.method, pathname);
  console.log("[MIDDLEWARE] isProtectedPath:", isProtectedPath);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  if (authRoutes.includes(pathname) || isProtectedPath) {
    console.log("[MIDDLEWARE] 📡 Fetching session from:", request.nextUrl.origin);
    console.log("[MIDDLEWARE] Cookie header present:", !!request.headers.get("cookie"));

    // Fetch session and user type in parallel to reduce latency
    let session: Session | null = null;
    let userType: string | null = null;
    let setup = false;

    try {
      console.log("[MIDDLEWARE] 📡 Fetching session & user type in parallel...");
      const cookie = request.headers.get("cookie") || "";
      const userAgent = request.headers.get("user-agent") || "";
      const authBaseURL =
        process.env.BETTER_AUTH_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        "http://localhost:4000";
      
      console.log(`[MIDDLEWARE] Using authBaseURL: ${authBaseURL}`);
      console.log(`[MIDDLEWARE] Cookies found: ${cookie.substring(0, 50)}...`);
      console.log(`[MIDDLEWARE] User-Agent present: ${!!userAgent}`);

      const [sessionResult, userTypeData] = await Promise.all([
        betterFetch<Session>("/api/auth/get-session", {
          baseURL: authBaseURL,
          headers: { 
            cookie,
            "user-agent": userAgent
          },
        }),
        getUserType(cookie, userAgent)
      ]);

      session = sessionResult.data;
      userType = (userTypeData as any).userType;
      setup = (userTypeData as any).setup;

      console.log("[MIDDLEWARE] ✅ Session:", session ? `user=${session.user?.email}` : "NO SESSION");
      if (sessionResult.error) {
        console.error("[MIDDLEWARE] ❌ Session fetch error:", sessionResult.error);
      }
      console.log("[MIDDLEWARE] ✅ UserType:", userType, "Setup:", setup);
    } catch (err) {
      console.error("[MIDDLEWARE] ❌ Parallel fetch threw error:", err);
    }

    // 1. If on Auth route...
    if (authRoutes.includes(pathname)) {
      if (session) {
        return NextResponse.redirect(new URL("/account", request.url));
      }
      return NextResponse.next();
    }

    // 2. If on protected/onboarding route and NOT authenticated, redirect to signin
    if (!session) {
      console.log("[MIDDLEWARE] 🔒 Protected route but no session → redirecting to /signin");
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // 3. User is AUTHENTICATED. Handle routing based on type and setup.
    const name = String(session.user?.name || "").trim();

    // 4. Force name setup if missing
    if (!name && !onboardingRoutes.includes(pathname)) {
      console.log("[MIDDLEWARE] ⚠️ Name is EMPTY → redirecting to /setup-organization");
      return NextResponse.redirect(new URL("/setup-organization", request.url));
    }

    // 5. Handle Admin specific routing
    if (session?.user?.role === "admin" || userType === "systemAdmin") {
      if (!pathname.startsWith("/admin")) {
        console.log("[MIDDLEWARE] ➡️ Admin → redirecting to /admin");
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    } else if (pathname.startsWith("/admin")) {
      // 6. Non-admin attempting to access admin route → redirect to account
      console.log(`[MIDDLEWARE] 🔒 Non-admin attempted to access ${pathname} → redirecting to /account`);
      return NextResponse.redirect(new URL("/account", request.url));
    }

    if (userType === "hotelOwner" || userType === "nurseryOwner" || userType === "parent" || userType === "teacher") {
      // If hotelOwner but NOT setup, force onboarding
      if (userType === "hotelOwner" && !setup && !onboardingRoutes.includes(pathname)) {
        console.log("[MIDDLEWARE] ➡️ Hotel Owner NOT setup → redirecting to /setup-organization");
        return NextResponse.redirect(new URL("/setup-organization", request.url));
      }

      // Completed users should NOT be on onboarding routes
      if (setup && onboardingRoutes.includes(pathname)) {
        console.log(`[MIDDLEWARE] ➡️ Completed ${userType} on onboarding route → redirecting to /account`);
        return NextResponse.redirect(new URL("/account", request.url));
      }
    } else if (userType === "pending") {
      // Pending join requests should be on organization selection
      if (pathname !== "/organization-selection") {
        console.log("[MIDDLEWARE] ➡️ Pending user → redirecting to /organization-selection");
        return NextResponse.redirect(new URL("/organization-selection", request.url));
      }
    }

  }

  console.log("[MIDDLEWARE] ⏭️ Falling through to NextResponse.next() for:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

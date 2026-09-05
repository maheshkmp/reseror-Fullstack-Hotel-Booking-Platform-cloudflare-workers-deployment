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

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const isProtectedPath = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    console.log("[MIDDLEWARE] 🔍 Request:", request.method, pathname);

    if (authRoutes.includes(pathname) || isProtectedPath) {
      let session: Session | null = null;
      let userType: string | null = null;
      let setup = false;

      try {
        const cookie = request.headers.get("cookie") || "";
        const userAgent = request.headers.get("user-agent") || "";
        const authBaseURL =
          process.env.BETTER_AUTH_INTERNAL_URL ||
          process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
          "http://localhost:4000";

        const [sessionResult, userTypeData] = await Promise.all([
          betterFetch<Session>("/api/auth/get-session", {
            baseURL: authBaseURL,
            headers: { 
              cookie,
              "user-agent": userAgent
            },
          }).catch(() => ({ data: null })),
          getUserType(cookie, userAgent).catch(() => null)
        ]);

        session = sessionResult?.data || null;
        if (userTypeData) {
          userType = userTypeData.userType;
          setup = userTypeData.setup;
        }
      } catch (err) {
        console.error("[MIDDLEWARE] Auth fetch failed:", err);
      }

      if (authRoutes.includes(pathname)) {
        if (session) {
          return NextResponse.redirect(new URL("/account", request.url));
        }
        return NextResponse.next();
      }

      if (!session) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }

      const name = String(session.user?.name || "").trim();

      if (!name && !onboardingRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/setup-organization", request.url));
      }

      if (session?.user?.role === "admin" || userType === "systemAdmin") {
        if (!pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.next();
      } else if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/account", request.url));
      }

      if (userType === "hotelOwner" || userType === "nurseryOwner" || userType === "parent" || userType === "teacher") {
        if (userType === "hotelOwner" && !setup && !onboardingRoutes.includes(pathname)) {
          return NextResponse.redirect(new URL("/setup-organization", request.url));
        }
        if (setup && onboardingRoutes.includes(pathname)) {
          return NextResponse.redirect(new URL("/account", request.url));
        }
      } else if (userType === "pending") {
        if (pathname !== "/organization-selection") {
          return NextResponse.redirect(new URL("/organization-selection", request.url));
        }
      }
    }

    return NextResponse.next();
  } catch (globalErr) {
    console.error("[MIDDLEWARE] Global error:", globalErr);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

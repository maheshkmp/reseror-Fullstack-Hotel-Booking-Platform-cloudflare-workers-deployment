import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { defaultHook } from "stoker/openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { authMiddleware } from "@/middlewares/auth.middleware";

import { getAuth } from "core/auth/setup";

import { APIBindings, OpenAPI } from "@/types";
import { BASE_PATH } from "./constants";
import { getDatabase } from "core/database";
import { logger } from "hono/logger";

// Create a new OpenAPIHono instance with API Bindings
export function createRouter(): OpenAPIHono<APIBindings> {
  return new OpenAPIHono<APIBindings>({
    strict: false,
    defaultHook,
  });
}

// Setup API
export function setupAPI(): OpenAPIHono<APIBindings> {
  const api = createRouter().basePath(BASE_PATH) as OpenAPI;

  // Logging Middleware
  api.use("*", logger());

  // CORS Middleware
  api.use(
    "*",
    cors({
      origin: (origin) => {
        const allowedOrigins = [
          "https://www.reseror.com",
          "https://reseror.com",
          "https://api.reseror.com",
          "http://localhost:3000",
          "http://localhost:4000",
        ];
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return process.env.CLIENT_URL!;
        return allowedOrigins.includes(origin)
          ? origin
          : process.env.CLIENT_URL!;
      },
      allowHeaders: ["Content-Type", "Authorization", "Cookie"],
      allowMethods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
      exposeHeaders: ["Content-Length", "Set-Cookie"],
      maxAge: 600,
      credentials: true,
    }),
  );

  // Serve Favicon for fun
  api.use("*", serveEmojiFavicon("🍔"));

  // Inject Database into context
  api.use("*", async (c, next) => {
    const database = getDatabase();
    c.set("db", database);
    await next();
  });

  // Authentication Middleware
  api.use("*", authMiddleware);

  // BetterAuth Routing - handle all /auth/* paths before route registry
  api.on(["POST", "GET", "PATCH", "OPTIONS", "DELETE", "PUT"], "/auth/*", (c) => {
    const auth = getAuth();
    return auth.handler(c.req.raw);
  });

  // Error Handling Middleware
  api.onError(onError);

  // Not Found Middleware
  api.notFound(notFound);

  return api;
}

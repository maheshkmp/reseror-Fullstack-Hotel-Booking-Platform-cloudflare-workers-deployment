let app: OpenAPIHono<APIBindings>;

// Import at module-level for faster cold starts
import { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { initDatabase } from "core/database";
import type { Database } from "core/database";
import { setupAuth } from "core/auth/setup";

import type { APIBindings } from "./types";
import { setupAPI } from "./lib/setup-api";
import { registerRoutes } from "./registry";
import configureOpenAPI from "./lib/open-api-config";

const ALLOWED_ORIGINS = [
  "https://www.reseror.com",
  "https://reseror.com",
  "https://api.reseror.com",
  "http://localhost:3000",
  "http://localhost:4000",
];

// Module-level initialization - runs during cold start
let db: Database;

try {
  console.log("Starting API initialization...");
  // Initialize database connection at module load
  console.log("Initializing database...");
  db = initDatabase(process.env.DATABASE_URL!);
  console.log("Database initialized.");

  // Initialize authentication at module load
  console.log("Setting up Auth...");
  setupAuth({
    database: db,
    secret: process.env.BETTER_AUTH_SECRET!
  });
  console.log("Auth setup complete.");


  console.log("Registering routes...");
  app = registerRoutes(setupAPI());
  console.log("Routes registered.");

  console.log("Configuring OpenAPI...");
  configureOpenAPI(app);
  console.log("OpenAPI configured.");
} catch (error) {
  console.error("Failed to initialize database/auth:", error);

  // Fallback app that returns 500 for all requests
  const fallback = new Hono<APIBindings>();

  fallback.all("*", (c) => {
    return c.json(
      { error: "Internal Server Error: Initialization Failed" },
      500
    );
  });

  throw error;
}

// Root-level app that applies CORS to ALL routes (including /site-settings, /auth, etc.)
const rootApp = new Hono<APIBindings>();

rootApp.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return ALLOWED_ORIGINS[0];
      return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    },
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 600,
    credentials: true,
  })
);

rootApp.route("/", app);

// We export fetch explicitly so we can pass bun serve config like idleTimeout.
export default {
  fetch: rootApp.fetch,
  idleTimeout: 60, // 60 seconds to prevent ECONNRESET on cold query compilation
};


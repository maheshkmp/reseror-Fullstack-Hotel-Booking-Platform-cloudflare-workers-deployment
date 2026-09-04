import { OpenAPI } from "./types";
export declare function registerRoutes(app: OpenAPI): import("@hono/zod-openapi").OpenAPIHono<import("@/types").APIBindings, any, "/api">;
export declare const router: import("@hono/zod-openapi").OpenAPIHono<import("@/types").APIBindings, any, "/api">;
export type Router = typeof router;

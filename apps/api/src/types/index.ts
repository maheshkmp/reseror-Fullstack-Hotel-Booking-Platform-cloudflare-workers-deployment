import { BASE_PATH } from "@/lib/constants";
import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

import { getAuth, type AuthInstance } from "core/auth/setup";
import { Database } from "core/database";
import { Context } from "hono";

export interface APIBindings {
  Variables: {
    user: AuthInstance["$Infer"]["Session"]["user"] | null;
    session: AuthInstance["$Infer"]["Session"]["session"] | null;
    db: Database;
  };
}

export type OpenAPI = OpenAPIHono<APIBindings, {}, typeof BASE_PATH>;

export type APIRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  APIBindings
>;

import { BASE_PATH } from "./lib/constants";
import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { type AuthInstance } from "core/auth/setup";
import { Database } from "core/database";
declare const auth: AuthInstance;
export interface APIBindings {
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
        db: Database;
    };
}
export type OpenAPI = OpenAPIHono<APIBindings, {}, typeof BASE_PATH>;
export type APIRouteHandler<R extends RouteConfig> = RouteHandler<R, APIBindings>;
export {};

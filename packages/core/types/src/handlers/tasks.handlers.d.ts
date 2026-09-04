import { APIRouteHandler } from "./types";
import type { ListRoute, CreateRoute, GetOneRoute, PatchRoute, RemoveRoute } from "./routes/tasks.routes";
export declare const list: APIRouteHandler<ListRoute>;
export declare const create: APIRouteHandler<CreateRoute>;
export declare const getOne: APIRouteHandler<GetOneRoute>;
export declare const patch: APIRouteHandler<PatchRoute>;
export declare const remove: APIRouteHandler<RemoveRoute>;

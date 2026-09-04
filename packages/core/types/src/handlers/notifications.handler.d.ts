import type { APIRouteHandler } from "./types";
import type { CreateRoute, GetByIdRoute, ListRoute, RemoveRoute, UpdateRoute } from "./routes/notifications.routes";
export declare const list: APIRouteHandler<ListRoute>;
export declare const create: APIRouteHandler<CreateRoute>;
export declare const getOne: APIRouteHandler<GetByIdRoute>;
export declare const patch: APIRouteHandler<UpdateRoute>;
export declare const remove: APIRouteHandler<RemoveRoute>;

import type { APIRouteHandler } from "./types";
import type { CreateRoute, GetByIdRoute, ListRoute, RemoveRoute, UpdateRoute } from "./routes/media.routes";
export declare const list: APIRouteHandler<ListRoute>;
export declare const getById: APIRouteHandler<GetByIdRoute>;
export declare const create: APIRouteHandler<CreateRoute>;
export declare const update: APIRouteHandler<UpdateRoute>;
export declare const remove: APIRouteHandler<RemoveRoute>;

import type { APIRouteHandler } from "./types";
import type { ListRoute, GetByIdRoute, CountRoute, UpdateUserRoute } from "../routes/user.routes";
export declare const list: APIRouteHandler<ListRoute>;
export declare const getOne: APIRouteHandler<GetByIdRoute>;
export declare const count: APIRouteHandler<CountRoute>;
export declare const updateUser: APIRouteHandler<UpdateUserRoute>;

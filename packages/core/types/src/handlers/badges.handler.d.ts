import type { APIRouteHandler } from "./types";
import type { ListRoute } from "./routes/badges.routes";
export declare const list: APIRouteHandler<ListRoute>;
export declare const create: (c: any) => Promise<any>;
export declare const getOne: (c: any) => Promise<any>;
export declare const patch: (c: any) => Promise<any>;
export declare const remove: (c: any) => Promise<any>;

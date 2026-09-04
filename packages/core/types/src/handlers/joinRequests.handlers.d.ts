import type { APIRouteHandler } from "./types";
import type { RequestJoinRoute, ListPendingRoute, ListMyRequestsRoute, ApproveRoute, RejectRoute } from "./routes/joinRequests.routes";
export declare const requestJoin: APIRouteHandler<RequestJoinRoute>;
export declare const listPending: APIRouteHandler<ListPendingRoute>;
export declare const listMyRequests: APIRouteHandler<ListMyRequestsRoute>;
export declare const approve: APIRouteHandler<ApproveRoute>;
export declare const reject: APIRouteHandler<RejectRoute>;

import { z } from "zod";
/**
 * List classes (scoped to current user's org/ownership in your handler)
 * Mounted under /classes — path is "/" here to match your router style.
 */
export declare const list: {
    tags: string[];
    summary: string;
    path: "/";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        query: z.ZodObject<{
            page: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodString>;
            sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>>;
            search: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        data: z.ZodType<{
                            teacherIds: string;
                            childIds: string;
                            nurseryId: string;
                            mainTeacherId: string;
                        }[], unknown, z.core.$ZodTypeInternals<{
                            teacherIds: string;
                            childIds: string;
                            nurseryId: string;
                            mainTeacherId: string;
                        }[], unknown>>;
                        meta: z.ZodObject<{
                            currentPage: z.ZodNumber;
                            limit: z.ZodNumber;
                            totalCount: z.ZodNumber;
                            totalPages: z.ZodNumber;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/";
};
/** Get a class by ID (owned by current user/org) */
export declare const getById: {
    tags: string[];
    summary: string;
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    path: "/:id";
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        teacherIds: z.ZodString;
                        childIds: z.ZodString;
                        nurseryId: z.ZodString;
                        mainTeacherId: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id";
};
/** Create a new class (owned by current user/org)
 *  If nurseryId is omitted, the handler will auto-pick the user's sole nursery.
 */
export declare const create: {
    tags: string[];
    summary: string;
    method: "post";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    path: "/";
    request: {
        body: {
            required: boolean;
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        name: z.ZodString;
                        teacherIds: z.ZodArray<z.ZodString>;
                        childIds: z.ZodArray<z.ZodString>;
                        nurseryId: z.ZodString;
                        mainTeacherId: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        teacherIds: z.ZodString;
                        childIds: z.ZodString;
                        nurseryId: z.ZodString;
                        mainTeacherId: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        400: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/";
};
/** Update an existing class */
export declare const update: {
    tags: string[];
    summary: string;
    method: "patch";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    path: "/:id";
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: {
            required: boolean;
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        name: z.ZodOptional<z.ZodString>;
                        teacherIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        childIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        nurseryId: z.ZodOptional<z.ZodString>;
                        mainTeacherId: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        teacherIds: z.ZodString;
                        childIds: z.ZodString;
                        nurseryId: z.ZodString;
                        mainTeacherId: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id";
};
/** Delete a class */
export declare const remove: {
    tags: string[];
    summary: string;
    method: "delete";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    path: "/:id";
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    };
    responses: {
        204: {
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id";
};
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;

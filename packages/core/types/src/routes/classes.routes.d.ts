import { z } from "zod";
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
                            id: string;
                            name: string;
                            nurseryId?: string | null | undefined;
                            organizationId?: string | null | undefined;
                            mainTeacherId?: string | null | undefined;
                            teacherIds?: string[] | null | undefined;
                            childIds?: string[] | null | undefined;
                            createdAt?: string | null | undefined;
                            updatedAt?: string | null | undefined;
                        }[], unknown, z.core.$ZodTypeInternals<{
                            id: string;
                            name: string;
                            nurseryId?: string | null | undefined;
                            organizationId?: string | null | undefined;
                            mainTeacherId?: string | null | undefined;
                            teacherIds?: string[] | null | undefined;
                            childIds?: string[] | null | undefined;
                            createdAt?: string | null | undefined;
                            updatedAt?: string | null | undefined;
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
                        id: z.ZodString;
                        nurseryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        name: z.ZodString;
                        mainTeacherId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        teacherIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        childIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        createdAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
                        nurseryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        mainTeacherId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        teacherIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        childIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
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
                        id: z.ZodString;
                        nurseryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        name: z.ZodString;
                        mainTeacherId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        teacherIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        childIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        createdAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
    getRoutingPath(): "/";
};
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
                        nurseryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        mainTeacherId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        teacherIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        childIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
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
                        id: z.ZodString;
                        nurseryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        name: z.ZodString;
                        mainTeacherId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        teacherIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        childIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        createdAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
export declare const remove: {
    method: "delete";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    path: "/:id";
    tags: string[];
    summary: string;
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

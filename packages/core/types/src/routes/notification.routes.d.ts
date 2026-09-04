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
                            organizationId: string;
                            senderId: string;
                            receiverId: string[];
                            topic: string;
                            description: string;
                            status: string;
                            updatedAt: string;
                            createdAt: string;
                        }[], unknown, z.core.$ZodTypeInternals<{
                            id: string;
                            organizationId: string;
                            senderId: string;
                            receiverId: string[];
                            topic: string;
                            description: string;
                            status: string;
                            updatedAt: string;
                            createdAt: string;
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
                        organizationId: z.ZodString;
                        senderId: z.ZodString;
                        receiverId: z.ZodArray<z.ZodString>;
                        topic: z.ZodString;
                        description: z.ZodString;
                        status: z.ZodString;
                        updatedAt: z.ZodString;
                        createdAt: z.ZodString;
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
                    schema: z.ZodPipe<z.ZodObject<{
                        description: z.ZodString;
                        status: z.ZodString;
                        senderId: z.ZodString;
                        receiverId: z.ZodArray<z.ZodString>;
                        topic: z.ZodString;
                    }, z.core.$strip>, z.ZodTransform<{
                        description: string;
                        status: string;
                        senderId: string;
                        receiverId: string[];
                        topic: string;
                    }, {
                        description: string;
                        status: string;
                        senderId: string;
                        receiverId: string[];
                        topic: string;
                    }>>;
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
                        organizationId: z.ZodString;
                        senderId: z.ZodString;
                        receiverId: z.ZodArray<z.ZodString>;
                        topic: z.ZodString;
                        description: z.ZodString;
                        status: z.ZodString;
                        updatedAt: z.ZodString;
                        createdAt: z.ZodString;
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
                        description: z.ZodOptional<z.ZodString>;
                        status: z.ZodOptional<z.ZodString>;
                        senderId: z.ZodOptional<z.ZodString>;
                        receiverId: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        topic: z.ZodOptional<z.ZodString>;
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
                        description: z.ZodOptional<z.ZodString>;
                        status: z.ZodOptional<z.ZodString>;
                        senderId: z.ZodOptional<z.ZodString>;
                        receiverId: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        topic: z.ZodOptional<z.ZodString>;
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
        200: {
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
export declare const getByUserId: {
    tags: string[];
    summary: string;
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    path: "/by-user";
    request: {
        query: z.ZodObject<{
            receiverId: z.ZodString;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        organizationId: z.ZodString;
                        senderId: z.ZodString;
                        receiverId: z.ZodArray<z.ZodString>;
                        topic: z.ZodString;
                        description: z.ZodString;
                        status: z.ZodString;
                        updatedAt: z.ZodString;
                        createdAt: z.ZodString;
                    }, z.core.$strip>>;
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
    getRoutingPath(): "/by-user";
};
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type GetByUserIdRoute = typeof getByUserId;

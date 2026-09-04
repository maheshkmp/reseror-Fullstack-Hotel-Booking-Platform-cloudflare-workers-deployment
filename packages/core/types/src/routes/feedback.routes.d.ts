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
                            childId: string;
                            teacherId: string;
                            content: string;
                            rating: string;
                            images: string;
                            teacherFeedback: string;
                            reply: string;
                            createdAt: string;
                            updatedAt: string;
                        }[], unknown, z.core.$ZodTypeInternals<{
                            id: string;
                            organizationId: string;
                            childId: string;
                            teacherId: string;
                            content: string;
                            rating: string;
                            images: string;
                            teacherFeedback: string;
                            reply: string;
                            createdAt: string;
                            updatedAt: string;
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
                        childId: z.ZodString;
                        teacherId: z.ZodString;
                        content: z.ZodString;
                        rating: z.ZodString;
                        images: z.ZodString;
                        teacherFeedback: z.ZodString;
                        reply: z.ZodString;
                        createdAt: z.ZodString;
                        updatedAt: z.ZodString;
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
export declare const getByChildId: {
    tags: string[];
    summary: string;
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    path: "/child/:childId";
    request: {
        params: z.ZodObject<{
            childId: z.ZodString;
        }, z.core.$strip>;
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
                            childId: string;
                            teacherId: string;
                            content: string;
                            rating: string;
                            images: string;
                            teacherFeedback: string;
                            reply: string;
                            createdAt: string;
                            updatedAt: string;
                        }[], unknown, z.core.$ZodTypeInternals<{
                            id: string;
                            organizationId: string;
                            childId: string;
                            teacherId: string;
                            content: string;
                            rating: string;
                            images: string;
                            teacherFeedback: string;
                            reply: string;
                            createdAt: string;
                            updatedAt: string;
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
    getRoutingPath(): "/child/:childId";
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
                        childId: z.ZodString;
                        content: z.ZodString;
                        rating: z.ZodString;
                        images: z.ZodString;
                        teacherFeedback: z.ZodString;
                        reply: z.ZodString;
                        teacherId: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>, z.ZodTransform<{
                        childId: string;
                        content: string;
                        rating: string;
                        images: string;
                        teacherFeedback: string;
                        reply: string;
                        teacherId?: string | undefined;
                    }, {
                        childId: string;
                        content: string;
                        rating: string;
                        images: string;
                        teacherFeedback: string;
                        reply: string;
                        teacherId?: string | undefined;
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
                        childId: z.ZodString;
                        teacherId: z.ZodString;
                        content: z.ZodString;
                        rating: z.ZodString;
                        images: z.ZodString;
                        teacherFeedback: z.ZodString;
                        reply: z.ZodString;
                        createdAt: z.ZodString;
                        updatedAt: z.ZodString;
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
                        childId: z.ZodOptional<z.ZodString>;
                        teacherId: z.ZodOptional<z.ZodString>;
                        content: z.ZodOptional<z.ZodString>;
                        rating: z.ZodOptional<z.ZodString>;
                        images: z.ZodOptional<z.ZodString>;
                        teacherFeedback: z.ZodOptional<z.ZodString>;
                        reply: z.ZodOptional<z.ZodString>;
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
                        childId: z.ZodOptional<z.ZodString>;
                        teacherId: z.ZodOptional<z.ZodString>;
                        content: z.ZodOptional<z.ZodString>;
                        rating: z.ZodOptional<z.ZodString>;
                        images: z.ZodOptional<z.ZodString>;
                        teacherFeedback: z.ZodOptional<z.ZodString>;
                        reply: z.ZodOptional<z.ZodString>;
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
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type GetByChildIdRoute = typeof getByChildId;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;

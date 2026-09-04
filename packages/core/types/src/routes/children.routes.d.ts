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
            childId: z.ZodOptional<z.ZodString>;
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
                            organizationId?: string | null | undefined;
                            nurseryId?: string | null | undefined;
                            parentId?: string | null | undefined;
                            classId?: string | null | undefined;
                            badgeId?: string[] | null | undefined;
                            dateOfBirth?: string | null | undefined;
                            gender?: string | null | undefined;
                            emergencyContact?: string | null | undefined;
                            medicalNotes?: string | null | undefined;
                            profileImageUrl?: string | null | undefined;
                            imagesUrl?: string | null | undefined;
                            activities?: string | null | undefined;
                            createdAt?: Date | undefined;
                            updatedAt?: Date | null | undefined;
                        }[], unknown, z.core.$ZodTypeInternals<{
                            id: string;
                            name: string;
                            organizationId?: string | null | undefined;
                            nurseryId?: string | null | undefined;
                            parentId?: string | null | undefined;
                            classId?: string | null | undefined;
                            badgeId?: string[] | null | undefined;
                            dateOfBirth?: string | null | undefined;
                            gender?: string | null | undefined;
                            emergencyContact?: string | null | undefined;
                            medicalNotes?: string | null | undefined;
                            profileImageUrl?: string | null | undefined;
                            imagesUrl?: string | null | undefined;
                            activities?: string | null | undefined;
                            createdAt?: Date | undefined;
                            updatedAt?: Date | null | undefined;
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
                        name: z.ZodString;
                        organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        nurseryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        parentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        classId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        badgeId: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        gender: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        emergencyContact: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        medicalNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        profileImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        imagesUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        activities: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        createdAt: z.ZodOptional<z.ZodDate>;
                        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
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
                        parentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        classId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        badgeId: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        gender: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        emergencyContact: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        medicalNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        profileImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        imagesUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        activities: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
                        name: z.ZodString;
                        organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        nurseryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        parentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        classId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        badgeId: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                        dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        gender: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        emergencyContact: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        medicalNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        profileImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        imagesUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        activities: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        createdAt: z.ZodOptional<z.ZodDate>;
                        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
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
                        nurseryId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        parentId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        classId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        badgeId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>>;
                        dateOfBirth: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        gender: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        emergencyContact: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        medicalNotes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        profileImageUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        imagesUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        activities: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
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
                        name: z.ZodOptional<z.ZodString>;
                        nurseryId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        parentId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        classId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        badgeId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>>;
                        dateOfBirth: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        gender: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        emergencyContact: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        medicalNotes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        profileImageUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        imagesUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
                        activities: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
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
            content: {
                "application/json": {
                    schema: z.ZodNull;
                };
            };
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
export declare const getByParentId: {
    tags: string[];
    summary: string;
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    path: "/parent/:parentId";
    request: {
        params: z.ZodObject<{
            parentId: z.ZodString;
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
                            organizationId?: string | null | undefined;
                            nurseryId?: string | null | undefined;
                            parentId?: string | null | undefined;
                            classId?: string | null | undefined;
                            badgeId?: string[] | null | undefined;
                            dateOfBirth?: string | null | undefined;
                            gender?: string | null | undefined;
                            emergencyContact?: string | null | undefined;
                            medicalNotes?: string | null | undefined;
                            profileImageUrl?: string | null | undefined;
                            imagesUrl?: string | null | undefined;
                            activities?: string | null | undefined;
                            createdAt?: Date | undefined;
                            updatedAt?: Date | null | undefined;
                        }[], unknown, z.core.$ZodTypeInternals<{
                            id: string;
                            name: string;
                            organizationId?: string | null | undefined;
                            nurseryId?: string | null | undefined;
                            parentId?: string | null | undefined;
                            classId?: string | null | undefined;
                            badgeId?: string[] | null | undefined;
                            dateOfBirth?: string | null | undefined;
                            gender?: string | null | undefined;
                            emergencyContact?: string | null | undefined;
                            medicalNotes?: string | null | undefined;
                            profileImageUrl?: string | null | undefined;
                            imagesUrl?: string | null | undefined;
                            activities?: string | null | undefined;
                            createdAt?: Date | undefined;
                            updatedAt?: Date | null | undefined;
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
    getRoutingPath(): "/parent/:parentId";
};
export declare const listWithObjects: {
    tags: string[];
    summary: string;
    path: "/with-objects";
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
            childId: z.ZodOptional<z.ZodString>;
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
                            organizationId: string | null;
                            nursery: {
                                id: string;
                                name: string;
                                address: string | null;
                                phoneNumber: string | null;
                                email: string | null;
                                organizationId: string | null;
                                capacity: number | null;
                                description: string | null;
                                imageUrl: string | null;
                                operatingHours: string | null;
                                facilities: string | null;
                                ageRange: string | null;
                                createdAt: string | null;
                                updatedAt: string | null;
                            } | null;
                            parent: {
                                id: string;
                                name: string;
                                email: string;
                                phoneNumber: string;
                                address: string | null;
                                occupation: string | null;
                                emergencyContact: string | null;
                                createdAt: string | null;
                                updatedAt: string | null;
                            } | null;
                            class: {
                                id: string;
                                name: string;
                                teacherId: string | null;
                                teacherName: string | null;
                                capacity: number | null;
                                ageRange: string | null;
                                description: string | null;
                                schedule: string | null;
                                createdAt: string | null;
                                updatedAt: string | null;
                            } | null;
                            badges: {
                                id: string;
                                name: string;
                                description: string | null;
                                imageUrl: string | null;
                                category: string | null;
                                points: number | null;
                                requirements: string | null;
                                earnedAt: string | null;
                            }[];
                            dateOfBirth: string | null;
                            gender: string | null;
                            emergencyContact: string | null;
                            medicalNotes: string | null;
                            profileImageUrl: string | null;
                            imagesUrl: string | null;
                            activities: string | null;
                            createdAt: string | null;
                            updatedAt: string | null;
                        }[], unknown, z.core.$ZodTypeInternals<{
                            id: string;
                            name: string;
                            organizationId: string | null;
                            nursery: {
                                id: string;
                                name: string;
                                address: string | null;
                                phoneNumber: string | null;
                                email: string | null;
                                organizationId: string | null;
                                capacity: number | null;
                                description: string | null;
                                imageUrl: string | null;
                                operatingHours: string | null;
                                facilities: string | null;
                                ageRange: string | null;
                                createdAt: string | null;
                                updatedAt: string | null;
                            } | null;
                            parent: {
                                id: string;
                                name: string;
                                email: string;
                                phoneNumber: string;
                                address: string | null;
                                occupation: string | null;
                                emergencyContact: string | null;
                                createdAt: string | null;
                                updatedAt: string | null;
                            } | null;
                            class: {
                                id: string;
                                name: string;
                                teacherId: string | null;
                                teacherName: string | null;
                                capacity: number | null;
                                ageRange: string | null;
                                description: string | null;
                                schedule: string | null;
                                createdAt: string | null;
                                updatedAt: string | null;
                            } | null;
                            badges: {
                                id: string;
                                name: string;
                                description: string | null;
                                imageUrl: string | null;
                                category: string | null;
                                points: number | null;
                                requirements: string | null;
                                earnedAt: string | null;
                            }[];
                            dateOfBirth: string | null;
                            gender: string | null;
                            emergencyContact: string | null;
                            medicalNotes: string | null;
                            profileImageUrl: string | null;
                            imagesUrl: string | null;
                            activities: string | null;
                            createdAt: string | null;
                            updatedAt: string | null;
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
    getRoutingPath(): "/with-objects";
};
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type GetByParentIdRoute = typeof getByParentId;
export type ListWithObjectsRoute = typeof listWithObjects;

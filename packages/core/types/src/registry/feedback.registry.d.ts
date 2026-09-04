declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
    "/": {
        $get: {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    sort?: "asc" | "desc" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    sort?: "asc" | "desc" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                data: {
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
                }[];
                meta: {
                    currentPage: number;
                    limit: number;
                    totalCount: number;
                    totalPages: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    childId: string;
                    content: string;
                    rating: string;
                    images: string;
                    teacherFeedback: string;
                    reply: string;
                    teacherId?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                json: {
                    childId: string;
                    content: string;
                    rating: string;
                    images: string;
                    teacherFeedback: string;
                    reply: string;
                    teacherId?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                json: {
                    childId: string;
                    content: string;
                    rating: string;
                    images: string;
                    teacherFeedback: string;
                    reply: string;
                    teacherId?: string | undefined;
                };
            };
            output: {
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
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
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
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/child/:childId": {
        $get: {
            input: {
                param: {
                    childId: string;
                };
            } & {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    sort?: "asc" | "desc" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    childId: string;
                };
            } & {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    sort?: "asc" | "desc" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    childId: string;
                };
            } & {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    sort?: "asc" | "desc" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                data: {
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
                }[];
                meta: {
                    currentPage: number;
                    limit: number;
                    totalCount: number;
                    totalPages: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    childId?: string | undefined;
                    teacherId?: string | undefined;
                    content?: string | undefined;
                    rating?: string | undefined;
                    images?: string | undefined;
                    teacherFeedback?: string | undefined;
                    reply?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    childId?: string | undefined;
                    teacherId?: string | undefined;
                    content?: string | undefined;
                    rating?: string | undefined;
                    images?: string | undefined;
                    teacherFeedback?: string | undefined;
                    reply?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    childId?: string | undefined;
                    teacherId?: string | undefined;
                    content?: string | undefined;
                    rating?: string | undefined;
                    images?: string | undefined;
                    teacherFeedback?: string | undefined;
                    reply?: string | undefined;
                };
            };
            output: {
                childId?: string | undefined;
                teacherId?: string | undefined;
                content?: string | undefined;
                rating?: string | undefined;
                images?: string | undefined;
                teacherFeedback?: string | undefined;
                reply?: string | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
export default router;

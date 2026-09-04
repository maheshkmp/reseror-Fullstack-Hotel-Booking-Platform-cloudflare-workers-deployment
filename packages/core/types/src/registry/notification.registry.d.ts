declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
    "/by-user": {
        $get: {
            input: {
                query: {
                    receiverId: string;
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
                    receiverId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                query: {
                    receiverId: string;
                };
            };
            output: {
                id: string;
                organizationId: string;
                senderId: string;
                receiverId: string[];
                topic: string;
                description: string;
                status: string;
                updatedAt: string;
                createdAt: string;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
} & {
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
                    senderId: string;
                    receiverId: string[];
                    topic: string;
                    description: string;
                    status: string;
                    updatedAt: string;
                    createdAt: string;
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
                    description: string;
                    status: string;
                    senderId: string;
                    receiverId: string[];
                    topic: string;
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
                    description: string;
                    status: string;
                    senderId: string;
                    receiverId: string[];
                    topic: string;
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
                    description: string;
                    status: string;
                    senderId: string;
                    receiverId: string[];
                    topic: string;
                };
            };
            output: {
                id: string;
                organizationId: string;
                senderId: string;
                receiverId: string[];
                topic: string;
                description: string;
                status: string;
                updatedAt: string;
                createdAt: string;
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
                senderId: string;
                receiverId: string[];
                topic: string;
                description: string;
                status: string;
                updatedAt: string;
                createdAt: string;
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
                    description?: string | undefined;
                    status?: string | undefined;
                    senderId?: string | undefined;
                    receiverId?: string[] | undefined;
                    topic?: string | undefined;
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
                    description?: string | undefined;
                    status?: string | undefined;
                    senderId?: string | undefined;
                    receiverId?: string[] | undefined;
                    topic?: string | undefined;
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
                    description?: string | undefined;
                    status?: string | undefined;
                    senderId?: string | undefined;
                    receiverId?: string[] | undefined;
                    topic?: string | undefined;
                };
            };
            output: {
                description?: string | undefined;
                status?: string | undefined;
                senderId?: string | undefined;
                receiverId?: string[] | undefined;
                topic?: string | undefined;
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

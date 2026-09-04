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
                    name: string;
                    nurseryId?: string | null | undefined;
                    organizationId?: string | null | undefined;
                    mainTeacherId?: string | null | undefined;
                    teacherIds?: string[] | null | undefined;
                    childIds?: string[] | null | undefined;
                    createdAt?: string | null | undefined;
                    updatedAt?: string | null | undefined;
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
                    name: string;
                    nurseryId?: string | null | undefined;
                    mainTeacherId?: string | null | undefined;
                    teacherIds?: string[] | null | undefined;
                    childIds?: string[] | null | undefined;
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
                    name: string;
                    nurseryId?: string | null | undefined;
                    mainTeacherId?: string | null | undefined;
                    teacherIds?: string[] | null | undefined;
                    childIds?: string[] | null | undefined;
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
                    name: string;
                    nurseryId?: string | null | undefined;
                    mainTeacherId?: string | null | undefined;
                    teacherIds?: string[] | null | undefined;
                    childIds?: string[] | null | undefined;
                };
            };
            output: {
                id: string;
                name: string;
                nurseryId?: string | null | undefined;
                organizationId?: string | null | undefined;
                mainTeacherId?: string | null | undefined;
                teacherIds?: string[] | null | undefined;
                childIds?: string[] | null | undefined;
                createdAt?: string | null | undefined;
                updatedAt?: string | null | undefined;
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
                name: string;
                nurseryId?: string | null | undefined;
                organizationId?: string | null | undefined;
                mainTeacherId?: string | null | undefined;
                teacherIds?: string[] | null | undefined;
                childIds?: string[] | null | undefined;
                createdAt?: string | null | undefined;
                updatedAt?: string | null | undefined;
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
                    name?: string | undefined;
                    nurseryId?: string | null | undefined;
                    mainTeacherId?: string | null | undefined;
                    teacherIds?: string[] | undefined;
                    childIds?: string[] | undefined;
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
                    name?: string | undefined;
                    nurseryId?: string | null | undefined;
                    mainTeacherId?: string | null | undefined;
                    teacherIds?: string[] | undefined;
                    childIds?: string[] | undefined;
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
                    name?: string | undefined;
                    nurseryId?: string | null | undefined;
                    mainTeacherId?: string | null | undefined;
                    teacherIds?: string[] | undefined;
                    childIds?: string[] | undefined;
                };
            };
            output: {
                id: string;
                name: string;
                nurseryId?: string | null | undefined;
                organizationId?: string | null | undefined;
                mainTeacherId?: string | null | undefined;
                teacherIds?: string[] | null | undefined;
                childIds?: string[] | null | undefined;
                createdAt?: string | null | undefined;
                updatedAt?: string | null | undefined;
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
            output: {};
            outputFormat: string;
            status: 204;
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
        };
    };
}, "/">;
export default router;

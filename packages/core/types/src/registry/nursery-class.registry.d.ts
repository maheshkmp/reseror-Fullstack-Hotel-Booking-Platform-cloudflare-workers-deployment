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
                    teacherIds: string;
                    childIds: string;
                    nurseryId: string;
                    mainTeacherId: string;
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
                    teacherIds: string[];
                    childIds: string[];
                    nurseryId: string;
                    mainTeacherId: string;
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
                    teacherIds: string[];
                    childIds: string[];
                    nurseryId: string;
                    mainTeacherId: string;
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
                    teacherIds: string[];
                    childIds: string[];
                    nurseryId: string;
                    mainTeacherId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                json: {
                    name: string;
                    teacherIds: string[];
                    childIds: string[];
                    nurseryId: string;
                    mainTeacherId: string;
                };
            };
            output: {
                teacherIds: string;
                childIds: string;
                nurseryId: string;
                mainTeacherId: string;
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
                teacherIds: string;
                childIds: string;
                nurseryId: string;
                mainTeacherId: string;
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
                    teacherIds?: string[] | undefined;
                    childIds?: string[] | undefined;
                    nurseryId?: string | undefined;
                    mainTeacherId?: string | undefined;
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
                    teacherIds?: string[] | undefined;
                    childIds?: string[] | undefined;
                    nurseryId?: string | undefined;
                    mainTeacherId?: string | undefined;
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
                    teacherIds?: string[] | undefined;
                    childIds?: string[] | undefined;
                    nurseryId?: string | undefined;
                    mainTeacherId?: string | undefined;
                };
            };
            output: {
                teacherIds: string;
                childIds: string;
                nurseryId: string;
                mainTeacherId: string;
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

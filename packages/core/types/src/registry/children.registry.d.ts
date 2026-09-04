declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
    [x: string]: {
        [x: `$${Lowercase<ListWithObjectsRoute>}`]: {
            input: any;
            output: {};
            outputFormat: string;
            status: 500;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 100;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 200;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 101;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 102;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 103;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 201;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 202;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 203;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 204;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 205;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 206;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 207;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 208;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 226;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 300;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 301;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 302;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 303;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 304;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 305;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 306;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 307;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 308;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 400;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 401;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 402;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 403;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 404;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 405;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 406;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 407;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 408;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 409;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 410;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 411;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 412;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 413;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 414;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 415;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 416;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 417;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 418;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 421;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 422;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 423;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 424;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 425;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 426;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 428;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 429;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 431;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 451;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 501;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 502;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 503;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 504;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 505;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 506;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 507;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 508;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 510;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 511;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: -1;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").InfoStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").SuccessStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").RedirectStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").ClientErrorStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").ServerErrorStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: never;
        };
    };
} & {
    [x: string]: {
        [x: `$${Lowercase<GetByParentIdRoute>}`]: {
            input: any;
            output: {};
            outputFormat: string;
            status: 500;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 100;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 200;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 101;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 102;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 103;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 201;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 202;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 203;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 204;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 205;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 206;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 207;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 208;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 226;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 300;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 301;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 302;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 303;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 304;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 305;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 306;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 307;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 308;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 400;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 401;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 402;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 403;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 404;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 405;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 406;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 407;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 408;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 409;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 410;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 411;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 412;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 413;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 414;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 415;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 416;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 417;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 418;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 421;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 422;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 423;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 424;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 425;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 426;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 428;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 429;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 431;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 451;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 501;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 502;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 503;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 504;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 505;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 506;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 507;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 508;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 510;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: 511;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: -1;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").InfoStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").SuccessStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").RedirectStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").ClientErrorStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").ServerErrorStatusCode;
        } | {
            input: any;
            output: {};
            outputFormat: string;
            status: never;
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
                    childId?: string | undefined;
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
                    childId?: string | undefined;
                };
            };
            output: {
                data: {
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
                    createdAt?: string | undefined;
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
                };
            };
            output: {
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
                createdAt?: string | undefined;
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
                createdAt?: string | undefined;
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
                };
            };
            output: {
                name?: string | undefined;
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
            output: null;
            outputFormat: "json";
            status: 204;
        };
    };
}, "/">;
export default router;

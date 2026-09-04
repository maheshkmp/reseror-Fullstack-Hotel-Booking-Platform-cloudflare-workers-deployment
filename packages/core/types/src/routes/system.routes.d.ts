export declare const checkUserType: {
    tags: string[];
    summary: string;
    path: "/check-user-type";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: import("zod").ZodObject<{
                        userType: import("zod").ZodEnum<{
                            pending: "pending";
                            user: "user";
                            parent: "parent";
                            nurseryOwner: "nurseryOwner";
                            systemAdmin: "systemAdmin";
                        }>;
                    }, import("better-auth").$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: import("zod").ZodObject<{
                        message: import("zod").ZodString;
                    }, import("better-auth").$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/check-user-type";
};
export type CheckUserTypeRoute = typeof checkUserType;

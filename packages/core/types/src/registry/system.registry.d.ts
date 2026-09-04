declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
    "/check-user-type": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                userType: "pending" | "user" | "parent" | "nurseryOwner" | "systemAdmin";
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
export default router;

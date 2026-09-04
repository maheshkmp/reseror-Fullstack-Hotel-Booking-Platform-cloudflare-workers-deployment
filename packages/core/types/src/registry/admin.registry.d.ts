declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
    "/stats": {
        $get: {
            input: {};
            output: {
                totalNurseries: number;
                totalUsers: number;
                totalChildren: number;
                totalTeachers: number;
                totalParents: number;
                growthRate: number;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        };
    };
} & {
    "/charts": {
        $get: {
            input: {};
            output: {
                nurseryGrowth: {
                    month: string;
                    count: number;
                }[];
                userRegistration: {
                    month: string;
                    teachers: number;
                    parents: number;
                }[];
                nurseryActivity: {
                    name: string;
                    children: number;
                    classes: number;
                }[];
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        };
    };
}, "/">;
export default router;

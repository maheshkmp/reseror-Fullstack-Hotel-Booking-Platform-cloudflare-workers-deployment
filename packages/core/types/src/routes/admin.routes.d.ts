import { z } from "zod";
export declare const getDashboardStats: {
    tags: string[];
    summary: string;
    path: "/stats";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        totalNurseries: z.ZodNumber;
                        totalUsers: z.ZodNumber;
                        totalChildren: z.ZodNumber;
                        totalTeachers: z.ZodNumber;
                        totalParents: z.ZodNumber;
                        growthRate: z.ZodNumber;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
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
    getRoutingPath(): "/stats";
};
export declare const getChartData: {
    tags: string[];
    summary: string;
    path: "/charts";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        nurseryGrowth: z.ZodArray<z.ZodObject<{
                            month: z.ZodString;
                            count: z.ZodNumber;
                        }, z.core.$strip>>;
                        userRegistration: z.ZodArray<z.ZodObject<{
                            month: z.ZodString;
                            teachers: z.ZodNumber;
                            parents: z.ZodNumber;
                        }, z.core.$strip>>;
                        nurseryActivity: z.ZodArray<z.ZodObject<{
                            name: z.ZodString;
                            children: z.ZodNumber;
                            classes: z.ZodNumber;
                        }, z.core.$strip>>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
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
    getRoutingPath(): "/charts";
};
export type GetDashboardStatsRoute = typeof getDashboardStats;
export type GetChartDataRoute = typeof getChartData;

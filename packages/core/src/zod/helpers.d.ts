import { z } from "zod";
export declare const errorMessageSchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
export declare const stringIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const queryParamsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;
export declare function getPaginatedSchema<T>(data: z.ZodType<T>): z.ZodObject<{
    data: z.ZodType<T, unknown, z.core.$ZodTypeInternals<T, unknown>>;
    meta: z.ZodObject<{
        currentPage: z.ZodNumber;
        limit: z.ZodNumber;
        totalCount: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare function prepareQueryParams(params: QueryParamsSchema): {
    page: number;
    limit: number;
    offset: number;
    search: string | undefined;
    sort: "asc" | "desc";
};
export declare function toKebabCase(str: string): string;

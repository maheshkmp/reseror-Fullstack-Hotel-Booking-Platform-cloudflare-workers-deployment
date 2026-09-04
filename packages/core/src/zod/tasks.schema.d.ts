import { z } from "zod";
export declare const selectTaskSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    done: z.ZodBoolean;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodDate>;
}, z.core.$strip>;
export declare const insertTaskSchema: z.ZodObject<{
    name: z.ZodString;
    done: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateTaskSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    done: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
declare const getAllTasksResponseSchema: z.ZodObject<{
    data: z.ZodType<{
        id: number;
        name: string;
        done: boolean;
        createdAt: string;
        updatedAt: Date | null;
    }[], unknown, z.core.$ZodTypeInternals<{
        id: number;
        name: string;
        done: boolean;
        createdAt: string;
        updatedAt: Date | null;
    }[], unknown>>;
    meta: z.ZodObject<{
        currentPage: z.ZodNumber;
        limit: z.ZodNumber;
        totalCount: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SelectTaskT = z.infer<typeof selectTaskSchema>;
export type InsertTaskT = z.infer<typeof insertTaskSchema>;
export type UpdateTaskT = z.infer<typeof updateTaskSchema>;
export type GetAllTasksResponseT = z.infer<typeof getAllTasksResponseSchema>;
export {};

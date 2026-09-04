import { z } from "zod";
export declare const updateUserSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodEnum<{
        user: "user";
        admin: "admin";
    }>;
}, z.core.$strip>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

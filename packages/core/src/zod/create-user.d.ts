import { z } from "zod";
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodString;
}, z.core.$strip>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;

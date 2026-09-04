import { z } from "zod";
export declare const signupSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export type SignupSchema = z.infer<typeof signupSchema>;

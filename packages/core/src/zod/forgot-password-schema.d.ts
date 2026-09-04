import { z } from "zod";
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type ForgotPasswordSchemaT = z.infer<typeof forgotPasswordSchema>;

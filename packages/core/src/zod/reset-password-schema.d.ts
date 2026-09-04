import { z } from "zod";
export declare const resetPasswordSchema: z.ZodObject<{
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export type ResetPasswordSchemaT = z.infer<typeof resetPasswordSchema>;

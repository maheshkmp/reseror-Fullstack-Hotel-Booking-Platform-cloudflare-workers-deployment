import { z } from "zod";
export declare const banUserSchema: z.ZodObject<{
    userId: z.ZodString;
    banReason: z.ZodString;
    banExpiresIn: z.ZodNumber;
}, z.core.$strip>;
export type BanUserSchema = z.infer<typeof banUserSchema>;

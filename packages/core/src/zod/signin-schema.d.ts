import { z } from "zod";
export declare const signinSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type SigninSchemaT = z.infer<typeof signinSchema>;

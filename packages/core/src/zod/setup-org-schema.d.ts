import { z } from "zod";
export declare const setupOrgSchema: z.ZodObject<{
    name: z.ZodString;
    logo: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    company: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    phoneNumber: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    website: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type SetupOrgSchemaT = z.infer<typeof setupOrgSchema>;

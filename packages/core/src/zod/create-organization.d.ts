import { z } from "zod";
export declare const createOrganizationSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    logo: z.ZodString;
    userId: z.ZodString;
    keepCurrentActiveOrganization: z.ZodBoolean;
}, z.core.$strip>;
export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;

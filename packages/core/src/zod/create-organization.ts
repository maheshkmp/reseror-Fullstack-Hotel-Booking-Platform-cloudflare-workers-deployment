import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string(), // required
  slug: z.string(), // required
  logo: z.string(),
  userId: z.string(), // server-only
  keepCurrentActiveOrganization: z.boolean()
});

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;

import { z } from "zod";

export const setupOrgSchema = z.object({
  name: z.string().min(1, "Agent name is required"),
  logo: z.string().optional().default(""),

  // Metadata
  company: z.string().optional().default(""),
  phoneNumber: z.string().optional().default(""),
  website: z.string().optional().default("")
});

export type SetupOrgSchemaT = z.infer<typeof setupOrgSchema>;

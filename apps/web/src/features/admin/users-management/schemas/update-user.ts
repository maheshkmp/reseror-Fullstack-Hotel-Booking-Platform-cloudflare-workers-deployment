import { z } from "zod";

export const updateUserSchema = z.object({
  userId: z.string(),
  role: z.enum(["user", "admin"])
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

import { z } from "zod";

export const banUserSchema = z.object({
  userId: z.string(),
  banReason: z.string(),
  banExpiresIn: z.number()
});

export type BanUserSchema = z.infer<typeof banUserSchema>;

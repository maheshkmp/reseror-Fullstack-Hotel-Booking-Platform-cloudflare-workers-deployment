import { z } from "zod";

export const staffSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "moderator", "support", "staff"]),
  image: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  banned: z.boolean().optional(),
});

export const createStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "moderator", "support", "staff"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["admin", "moderator", "support", "staff"]).optional(),
  banned: z.boolean().optional(),
});

export type Staff = z.infer<typeof staffSchema>;
export type CreateStaff = z.infer<typeof createStaffSchema>;
export type UpdateStaff = z.infer<typeof updateStaffSchema>;

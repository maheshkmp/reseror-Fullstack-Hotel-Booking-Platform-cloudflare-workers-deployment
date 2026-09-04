import { z } from "zod";
import { getPaginatedSchema } from "./helpers";

// Select schema (for tasks fetched from DB)
export const selectTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  done: z.boolean(),
  createdAt: z.coerce.string(),
  updatedAt: z.date().nullable()
});

// Insert schema (for creating new tasks)
export const insertTaskSchema = z.object({
  name: z
    .string()
    .min(1, "Task name is required")
    .max(255, "Task name too long"),
  done: z.boolean().default(false)
});

// Update schema (for updating existing tasks)
export const updateTaskSchema = z
  .object({
    name: z.string().optional(),
    done: z.boolean().optional()
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
  });

// Get all tasks route -> Schema
const getAllTasksResponseSchema = getPaginatedSchema(z.array(selectTaskSchema));

// Type exports
export type SelectTaskT = z.infer<typeof selectTaskSchema>;
export type InsertTaskT = z.infer<typeof insertTaskSchema>;
export type UpdateTaskT = z.infer<typeof updateTaskSchema>;
export type GetAllTasksResponseT = z.infer<typeof getAllTasksResponseSchema>;

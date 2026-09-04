import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { inquiries } from "../database/schema";
import { z } from "zod";

export const inquirySchema = createSelectSchema(inquiries);

export const inquiryInsertSchema = createInsertSchema(inquiries, {
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  type: z.string().min(1, "Type is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const inquiryUpdateSchema = createInsertSchema(inquiries).pick({
  status: true,
});

export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryInsert = z.infer<typeof inquiryInsertSchema>;

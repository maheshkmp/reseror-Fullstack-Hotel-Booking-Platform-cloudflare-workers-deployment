
import { z } from "zod";

import { paymentsAdmin } from "core/database/schema";

// PaymentsAdmin Schemas
export const paymentsAdminSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  bookingId: z.string().nullable(),
  restaurantBookingId: z.string().nullable(),
  organizationId: z.string(),
  type: z.enum(["incoming", "outgoing"]),
  method: z.string(),
  amount: z.string(),
  settled: z.boolean(),
  settledAt: z.date().nullable(),
  createdAt: z.coerce.string(),
});

export type PaymentsAdmin = z.infer<typeof paymentsAdminSchema>;

export const paymentsAdminInsertSchema = paymentsAdminSchema.omit(
  {
    id: true,
    organizationId: true,
    createdAt: true,
  }
);

export type PaymentsAdminInsert = z.infer<typeof paymentsAdminInsertSchema>;

export const paymentsAdminUpdateSchema = paymentsAdminSchema
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
  })
  .partial();

export type PaymentsAdminUpdate = z.infer<typeof paymentsAdminUpdateSchema>;

export const paymentsAdminWithRelationsSchema = paymentsAdminSchema.extend({});

export type PaymentsAdminWithRelations = z.infer<
  typeof paymentsAdminWithRelationsSchema
>;

// Query Params Schemas
export const paymentsAdminQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
  type: z.enum(["incoming", "outgoing"]).optional(),
  method: z.string().optional(), // stripe, bank_transfer, etc.
  settled: z.enum(["true", "false"]).optional(),
  dateFrom: z.string().optional(), // ISO date string
  dateTo: z.string().optional(), // ISO date string
});

export type PaymentsAdminQueryParams = z.infer<
  typeof paymentsAdminQueryParamsSchema
>;

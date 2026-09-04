import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { paymentsHotel } from "core/database/schema";

// PaymentsHotel Schemas
export const paymentsHotelSchema = createSelectSchema(paymentsHotel);

export type PaymentsHotel = z.infer<typeof paymentsHotelSchema>;

export const paymentsHotelInsertSchema = createInsertSchema(paymentsHotel).omit(
  {
    id: true,
    organizationId: true,
    createdAt: true,
  }
);

export interface PaymentsHotelInsert {
  hotelId: string;
  bookingId?: string | null;
  type?: string | null;
  amount: string;
  dueDate?: string | null;
  paid?: boolean | null;
  paidAt?: string | null;
}

export const paymentsHotelUpdateSchema = createInsertSchema(paymentsHotel)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
  })
  .partial();

export type PaymentsHotelUpdate = z.infer<typeof paymentsHotelUpdateSchema>;

export const paymentsHotelWithRelationsSchema = paymentsHotelSchema.extend({});

export type PaymentsHotelWithRelations = z.infer<
  typeof paymentsHotelWithRelationsSchema
>;

// Query Params Schemas
export const paymentsHotelQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
  type: z
    .enum(["receive_commission_from_cash", "repay_net_from_online"])
    .optional(),
  paid: z.enum(["true", "false"]).optional(),
  dueDateFrom: z.string().optional(), // ISO date string
  dueDateTo: z.string().optional(), // ISO date string
  dateFrom: z.string().optional(), // ISO date string for createdAt
  dateTo: z.string().optional(), // ISO date string for createdAt
});

export type PaymentsHotelQueryParams = z.infer<
  typeof paymentsHotelQueryParamsSchema
>;

import { z } from "zod";

// PaymentsHotel Schemas
export const paymentsHotelSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  bookingId: z.string().nullable(),
  restaurantBookingId: z.string().nullable(),
  organizationId: z.string(),
  type: z.enum(["receive_commission_from_cash", "repay_net_from_online", "restaurant_booking_commission"]),
  amount: z.string(),
  dueDate: z.string().optional().nullable(), // ISO date string
  paid: z.boolean(),
  paidAt: z.string().optional().nullable(), // ISO date string
  proof: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  referenceId: z.string().optional().nullable(),
  status: z.enum(["pending", "submitted", "confirmed", "rejected"]).optional().default("pending"),
  rejectionReason: z.string().optional().nullable(),
  createdAt: z.string(), // ISO date string
});

export type PaymentsHotel = z.infer<typeof paymentsHotelSchema>;

export const paymentsHotelInsertSchema = paymentsHotelSchema
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
  })
  .partial();

export const paymentsHotelUpdateSchema = paymentsHotelInsertSchema.partial();

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
    .enum(["receive_commission_from_cash", "repay_net_from_online", "restaurant_booking_commission"])
    .optional(),
  paid: z.enum(["true", "false"]).optional(),
  dueDateFrom: z.string().optional(), // ISO date string
  dueDateTo: z.string().optional(), // ISO date string
  dateFrom: z.string().optional(), // ISO date string for createdAt
  dateTo: z.string().optional(), // ISO date string for createdAt
  status: z.enum(["pending", "submitted", "confirmed", "rejected"]).optional(),
});

export type PaymentsHotelQueryParams = z.infer<
  typeof paymentsHotelQueryParamsSchema
>;

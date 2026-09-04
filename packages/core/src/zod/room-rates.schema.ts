import { z } from "zod";

// Room Rate Plans Schemas
export const roomRatePlanSchema = z.object({
  id: z.string(),
  roomTypeId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  ratePlanType: z.enum(["standard", "advance_purchase", "non_refundable", "last_minute", "package"]),
  baseRate: z.string(),
  currency: z.string(),
  minAdvanceBooking: z.string().nullable(),
  maxAdvanceBooking: z.string().nullable(),
  minStayLength: z.string().nullable(),
  maxStayLength: z.string().nullable(),
  isRefundable: z.boolean().nullable(),
  cancellationDeadline: z.string().nullable(),
  validFrom: z.string(),
  validTo: z.string(),
  isActive: z.boolean(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type RoomRatePlan = z.infer<typeof roomRatePlanSchema>;

export const roomRatePlanInsertSchema = roomRatePlanSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type RoomRatePlanInsert = z.infer<typeof roomRatePlanInsertSchema>;

export const roomRatePlanUpdateSchema = roomRatePlanSchema
  .omit({
    id: true,
    roomTypeId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type RoomRatePlanUpdate = z.infer<typeof roomRatePlanUpdateSchema>;

// Room Rates Schemas
export const roomRateSchema = z.object({
  id: z.string(),
  ratePlanId: z.string(),
  rateDate: z.string(),
  rate: z.string(),
  availableRooms: z.string().nullable(),
  isClosed: z.boolean().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type RoomRate = z.infer<typeof roomRateSchema>;

export const roomRateInsertSchema = roomRateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type RoomRateInsert = z.infer<typeof roomRateInsertSchema>;

export const roomRateUpdateSchema = roomRateSchema
  .omit({
    id: true,
    ratePlanId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type RoomRateUpdate = z.infer<typeof roomRateUpdateSchema>;

// Room Seasonal Rates Schemas
export const roomSeasonalRateSchema = z.object({
  id: z.string(),
  ratePlanId: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  mondayRate: z.string().nullable(),
  tuesdayRate: z.string().nullable(),
  wednesdayRate: z.string().nullable(),
  thursdayRate: z.string().nullable(),
  fridayRate: z.string().nullable(),
  saturdayRate: z.string().nullable(),
  sundayRate: z.string().nullable(),
  flatRate: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type RoomSeasonalRate = z.infer<typeof roomSeasonalRateSchema>;

export const roomSeasonalRateInsertSchema = roomSeasonalRateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type RoomSeasonalRateInsert = z.infer<
  typeof roomSeasonalRateInsertSchema
>;

export const roomSeasonalRateUpdateSchema = roomSeasonalRateSchema
  .omit({
    id: true,
    ratePlanId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type RoomSeasonalRateUpdate = z.infer<
  typeof roomSeasonalRateUpdateSchema
>;

// Combined schemas with relations
export const roomRatePlanWithRelationsSchema = roomRatePlanSchema.extend({
  rates: z.array(roomRateSchema).optional(),
  seasonalRates: z.array(roomSeasonalRateSchema).optional()
});

export type RoomRatePlanWithRelations = z.infer<
  typeof roomRatePlanWithRelationsSchema
>;

// Query Params Schemas
export const roomRatePlanQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  roomTypeId: z.string().optional(),
  ratePlanType: z
    .enum([
      "standard",
      "advance_purchase",
      "non_refundable",
      "last_minute",
      "package"
    ])
    .optional(),
  isActive: z.enum(["true", "false"]).optional()
});

export const roomRateQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  ratePlanId: z.string().optional(),
  dateFrom: z.string().optional(), // YYYY-MM-DD format
  dateTo: z.string().optional(), // YYYY-MM-DD format
  isClosed: z.enum(["true", "false"]).optional()
});

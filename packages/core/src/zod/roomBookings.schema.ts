import { z } from "zod";

// Select schema for reading room bookings
export const roomBookingSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  roomTypeId: z.string(),
  organizationId: z.string().nullable().optional(),
  createdBy: z.string(),
  rooms: z.array(z.string()).nullable().optional(),
  guestName: z.string(),
  paymentType: z.string().nullable().optional(),
  guestEmail: z.string().nullable().optional(),
  guestPhone: z.string().nullable().optional(),
  checkInDate: z.string().nullable().optional(),
  checkInTime: z.string().nullable().optional(),
  checkOutDate: z.string().nullable().optional(),
  checkOutTime: z.string().nullable().optional(),
  numRooms: z.number().nullable().optional(),
  numAdults: z.number().nullable().optional(),
  numChildren: z.number().nullable().optional(),
  totalAmount: z.string().nullable().optional(),
  commissionAmount: z.string().nullable().optional(),
  netPayableToHotel: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  status: z.enum([
      "pending",
      "confirmed",
      "cancelled",
      "checked_in",
      "checked_out",
      "no_show",
    ]).nullable().optional(),
  specialRequests: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  isPaid: z.boolean().nullable().optional(),
  paymentDetails: z.any().nullable().optional(),
  promoCode: z.string().nullable().optional(),
  discountAmount: z.string().nullable().optional(),
  influencerId: z.string().nullable().optional(),
  browserFingerprint: z.string().nullable().optional(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable().optional(),
});

// Insert schema for creating a room booking
export const roomBookingInsertSchema = roomBookingSchema.omit({
  organizationId: true,
  createdBy: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema for updating a room booking
export const roomBookingUpdateSchema = roomBookingSchema
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
  })
  .partial();

export const roomBookingQueryParamsSchema = z.object({
  hotelId: z.string().optional(),
  organizationId: z.string().optional(),
  roomTypeId: z.string().optional(),
  status: z
    .enum([
      "pending",
      "confirmed",
      "cancelled",
      "checked_in",
      "checked_out",
      "no_show",
    ])
    .optional(),
  guestName: z.string().optional(),
  checkInDateFrom: z.string().optional(),
  checkInDateTo: z.string().optional(),
  checkOutDateFrom: z.string().optional(),
  checkOutDateTo: z.string().optional(),
  paymentType: z.enum(["cash", "online"]).optional(),
  isPaid: z.string().optional(), // "true" or "false" as string for query params
  minAmount: z.string().optional(),
  maxAmount: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});

export const roomBookingWithRelationsSchema = roomBookingSchema.extend({
  hotel: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable().optional(),
      street: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      country: z.string().nullable().optional(),
      formattedAddress: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      starRating: z.number().nullable().optional(),
      latitude: z.string().nullable().optional(),
      longitude: z.string().nullable().optional(),
    })
    .optional(),
  roomType: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable().optional(),
      price: z.string().nullable().optional(),
      baseOccupancy: z.number().nullable().optional(),
      maxOccupancy: z.number().nullable().optional(),
      roomSizeSqm: z.string().nullable().optional(),
      viewType: z.string().nullable().optional(),
    })
    .optional(),
  createdByUser: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().nullable().optional(),
      image: z.string().nullable().optional(),
    })
    .optional(),
});

// Type Definitions
export type RoomBookingSchema = z.infer<typeof roomBookingSchema>;
export type InsertRoomBookingSchema = z.infer<typeof roomBookingInsertSchema>;
export type UpdateRoomBookingSchema = z.infer<typeof roomBookingUpdateSchema>;
export type RoomBookingQueryParamsSchema = z.infer<
  typeof roomBookingQueryParamsSchema
>;
export type RoomBookingWithRelationsSchema = z.infer<
  typeof roomBookingWithRelationsSchema
>;

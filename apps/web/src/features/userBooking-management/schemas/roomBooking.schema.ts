import { roomBookings } from "core/database/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for reading room bookings
export const roomBookingSchema = createSelectSchema(roomBookings);

// Insert schema for creating a room booking
export const roomBookingInsertSchema = createInsertSchema(
  roomBookings,
  {}
).omit({
  organizationId: true,
  createdBy: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema for updating a room booking
export const roomBookingUpdateSchema = createInsertSchema(roomBookings, {})
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
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});

export const roomBookingWithRelationsSchema = roomBookingSchema.extend({
  hotel: z
    .object({
      id: z.string(),
      name: z.string(),
      // add more hotel fields as needed
    })
    .optional(),
  roomType: z
    .object({
      id: z.string(),
      name: z.string(),
      // add more roomType fields as needed
    })
    .optional(),
  createdByUser: z
    .object({
      id: z.string(),
      name: z.string(),
      // add more user fields as needed
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

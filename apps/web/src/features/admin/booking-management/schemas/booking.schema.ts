import { z } from "zod";

export const adminBookingCreateSchema = z.object({
  hotelId: z.string().min(1, "Hotel is required"),
  roomTypeId: z.string().min(1, "Room type is required"),
  userId: z.string().optional(),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  guestPhone: z.string().optional(),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkInTime: z.string().optional(),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  checkOutTime: z.string().optional(),
  numRooms: z.number().int().min(1).default(1),
  numAdults: z.number().int().min(1).default(1),
  numChildren: z.number().int().min(0).default(0),
  totalAmount: z.string().min(1, "Total amount is required"),
  commissionAmount: z.string().optional(),
  netPayableToHotel: z.string().optional(),
  currency: z.string().default("LKR"),
  paymentType: z.enum(["cash", "online", "card", "bank_transfer"]).default("cash"),
  isPaid: z.boolean().default(false),
  specialRequests: z.string().optional(),
  notes: z.string().optional(),
});

export type AdminBookingCreateValues = z.infer<typeof adminBookingCreateSchema>;

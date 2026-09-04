import { z } from "zod";

// Room Type Schemas
export const roomTypeSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.string().nullable(),
  baseOccupancy: z.number(),
  maxOccupancy: z.number(),
  extraBedCapacity: z.number().nullable(),
  bedConfiguration: z.any().nullable(),
  roomSizeSqm: z.string().nullable(),
  viewType: z.enum(["ocean", "city", "garden", "mountain", "pool", "courtyard", "street", "interior"]).nullable(),
  status: z.boolean(),
  note: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type RoomType = z.infer<typeof roomTypeSchema>;

// Rooms Schemas
export const roomSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  roomTypeId: z.string(),
  roomNumber: z.string(),
  floorNumber: z.number().nullable(),
  isAccessible: z.boolean().nullable(),
  status: z.enum(["available", "occupied", "maintenance", "out_of_order", "dirty"]),
  lastCleanedAt: z.date().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type Room = z.infer<typeof roomSchema>;

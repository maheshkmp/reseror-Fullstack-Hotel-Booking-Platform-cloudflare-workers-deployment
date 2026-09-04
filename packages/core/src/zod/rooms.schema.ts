import { z } from "zod";

import { hotelImageSchema } from "./media.schema";

// Room Type Schemas
export const roomTypeSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.string().nullable().transform((v) => (v === "" ? null : v)),
  baseOccupancy: z.number(),
  maxOccupancy: z.number(),
  extraBedCapacity: z.number().nullable(),
  bedConfiguration: z.any().nullable(),
  roomSizeSqm: z.string().nullable().transform((v) => (v === "" ? null : v)),
  viewType: z.enum(["ocean", "city", "garden", "mountain", "pool", "courtyard", "street", "interior"]).nullable(),
  status: z.boolean(),
  isSmoking: z.boolean().default(false),
  note: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type RoomType = z.infer<typeof roomTypeSchema>;

export const roomTypeInsertSchema = roomTypeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type RoomTypeInsert = z.infer<typeof roomTypeInsertSchema>;

export const roomTypeUpdateSchema = roomTypeSchema
  .omit({
    id: true,
    hotelId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type RoomTypeUpdate = z.infer<typeof roomTypeUpdateSchema>;

// Room Type Amenities Schemas
export const roomTypeAmenitySchema = z.object({
  id: z.string(),
  roomTypeId: z.string(),
  amenityType: z.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type RoomTypeAmenity = z.infer<typeof roomTypeAmenitySchema>;

export const roomTypeAmenityInsertSchema = roomTypeAmenitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type RoomTypeAmenityInsert = z.infer<typeof roomTypeAmenityInsertSchema>;

export const roomTypeAmenityUpdateSchema = roomTypeAmenitySchema
  .omit({
    id: true,
    roomTypeId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type RoomTypeAmenityUpdate = z.infer<typeof roomTypeAmenityUpdateSchema>;

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

export const roomInsertSchema = roomSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type RoomInsert = z.infer<typeof roomInsertSchema>;

export const roomUpdateSchema = roomSchema
  .omit({
    id: true,
    hotelId: true,
    roomTypeId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type RoomUpdate = z.infer<typeof roomUpdateSchema>;

// Room with Relations
export const roomWithRelationsSchema = roomSchema.extend({
  roomType: roomTypeSchema.nullable()
});

export type RoomWithRelations = z.infer<typeof roomWithRelationsSchema>;

// Complete Room Type with Relations
export const roomTypeWithRelationsSchema = roomTypeSchema.extend({
  amenities: z.array(roomTypeAmenitySchema),
  rooms: z.array(roomSchema).optional(),
  images: z.array(hotelImageSchema).optional()
});

export type RoomTypeWithRelations = z.infer<typeof roomTypeWithRelationsSchema>;

// Query Params Schemas
export const roomTypeQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional()
});

export const roomQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  hotelId: z.string().optional(),
  roomTypeId: z.string().optional(),
  status: z
    .enum(["available", "occupied", "maintenance", "out_of_order", "dirty"])
    .optional(),
  floorNumber: z.string().optional()
});

// Bulk room creation schema
export const bulkRoomCreationSchema = z.object({
  roomTypeId: z.string(),
  hotelId: z.string(),
  roomNumbers: z.array(z.string()),
  floorNumber: z.number().optional(),
  isAccessible: z.boolean().optional()
});

export type BulkRoomCreation = z.infer<typeof bulkRoomCreationSchema>;

// Additional type aliases for compatibility with queries
export type CreateRoomInput = RoomInsert;
export type UpdateRoomInput = RoomUpdate;
export type CreateRoomTypeInput = RoomTypeInsert;
export type UpdateRoomTypeInput = RoomTypeUpdate;
export type GetRoomsParams = z.infer<typeof roomQueryParamsSchema>;
export type RoomAmenity = RoomTypeAmenity;

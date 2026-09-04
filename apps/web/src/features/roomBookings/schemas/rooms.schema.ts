import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  hotelImages,
  rooms,
  roomTypeAmenities,
  roomTypes,
} from "core/database/schema";

// Hotel Image Schema (to avoid circular dependency)
export const hotelImageSchema = createSelectSchema(hotelImages);

export type HotelImage = z.infer<typeof hotelImageSchema>;

// Room Type Schemas
export const roomTypeSchema = createSelectSchema(roomTypes);

export type RoomType = z.infer<typeof roomTypeSchema>;

export const roomTypeInsertSchema = createInsertSchema(roomTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type RoomTypeInsert = z.infer<typeof roomTypeInsertSchema>;

export const roomTypeUpdateSchema = createInsertSchema(roomTypes)
  .omit({
    id: true,
    hotelId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type RoomTypeUpdate = z.infer<typeof roomTypeUpdateSchema>;

// Room Type Amenities Schemas
export const roomTypeAmenitySchema = createSelectSchema(roomTypeAmenities);

export type RoomTypeAmenity = z.infer<typeof roomTypeAmenitySchema>;

export const roomTypeAmenityInsertSchema = createInsertSchema(
  roomTypeAmenities
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const roomTypeAmenityUpdateSchema = createInsertSchema(roomTypeAmenities)
  .omit({
    id: true,
    roomTypeId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Rooms Schemas
export const roomSchema = createSelectSchema(rooms);

export type Room = z.infer<typeof roomSchema>;

export const roomInsertSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type RoomInsert = z.infer<typeof roomInsertSchema>;

export const roomUpdateSchema = createInsertSchema(rooms)
  .omit({
    id: true,
    hotelId: true,
    roomTypeId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type RoomUpdate = z.infer<typeof roomUpdateSchema>;

// Room with Relations
export const roomWithRelationsSchema = roomSchema.extend({
  roomType: roomTypeSchema.nullable(),
});

export type RoomWithRelations = z.infer<typeof roomWithRelationsSchema>;

// Complete Room Type with Relations
export const roomTypeWithRelationsSchema = roomTypeSchema.extend({
  amenities: z.array(roomTypeAmenitySchema),
  rooms: z.array(roomSchema).optional(),
  images: z.array(hotelImageSchema).optional(),
});

export type RoomTypeWithRelations = z.infer<typeof roomTypeWithRelationsSchema>;

// Query Params Schemas
export const roomTypeQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
});

export const roomQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
  roomTypeId: z.string().optional(),
  status: z
    .enum(["available", "occupied", "maintenance", "out_of_order", "dirty"])
    .optional(),
  floorNumber: z.string().optional(),
});

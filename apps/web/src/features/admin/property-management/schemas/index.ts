import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  hotelAmenities,
  hotelImages,
  hotelPolicies,
  hotels,
  hotelTypes,
  propertyClasses,
} from "core/database/schema";
import { roomTypeSchema } from "@/features/roomBookings/schemas/rooms.schema";


// Property Type Schemas
export const hotelTypeSchema = createSelectSchema(hotelTypes);

export type HotelType = z.infer<typeof hotelTypeSchema>;

export const hotelTypeInsertSchema = createInsertSchema(hotelTypes).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const hotelTypeUpdateSchema = createInsertSchema(hotelTypes)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    slug: true,
  })
  .partial();

// Hotel Amenities Schemas
export const hotelAmenitySchema = createSelectSchema(hotelAmenities);

export type HotelAmenity = z.infer<typeof hotelAmenitySchema>;

export const hotelAmenityInsertSchema = createInsertSchema(hotelAmenities).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  }
);

export const hotelAmenityUpdateSchema = createInsertSchema(hotelAmenities)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Hotel Images Schemas
export const hotelImageSchema = createSelectSchema(hotelImages);

export type HotelImage = z.infer<typeof hotelImageSchema>;

export const hotelImageInsertSchema = createInsertSchema(hotelImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const hotelImageUpdateSchema = createInsertSchema(hotelImages)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Hotel Policies Schemas
export const hotelPolicySchema = createSelectSchema(hotelPolicies);

export type HotelPolicy = z.infer<typeof hotelPolicySchema>;

export const hotelPolicyInsertSchema = createInsertSchema(hotelPolicies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const hotelPolicyUpdateSchema = createInsertSchema(hotelPolicies)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

/**
 * Complete Hotel Schema with Populated Relations
 *
 * Hotel Relations
 * - organizationId (need to populate)
 * - createdBy (dont need to populate)
 * - propertyType (need to populate, 1:1)
 * - propertyClass (need to populate, 1:1)
 * - images (need to populate, 1:M)
 * - amenities (need to populate, 1:M)
 * - policies (need to populate, 1:M)
 * - roomTypes (need to populate, 1:M)
 * - rooms (route based population, 1:M)
 */
export const plainHotelSchema = createSelectSchema(hotels);

export type PlainHotelType = z.infer<typeof plainHotelSchema>;

export const propertyClassSchema = createSelectSchema(propertyClasses);

export const basicHotelSchema = createSelectSchema(hotels, {
  hotelType: hotelTypeSchema.nullable(),
  propertyClass: propertyClassSchema.nullable(),
});

export type BasicHotelType = z.infer<typeof basicHotelSchema>;

export const hotelSelectSchema = basicHotelSchema.extend({
  images: z.array(hotelImageSchema),
  amenities: z.array(hotelAmenitySchema),
  policies: z.array(hotelPolicySchema),
  roomTypes: z.array(z.any()), 
  performance: z.object({
    totalBookings: z.number(),
    totalRevenue: z.number(),
    totalRooms: z.number(),
    isOverdue: z.boolean().optional(),
  }).optional(),
});

export type HotelSelectType = z.infer<typeof hotelSelectSchema>;


export const hotelInsertSchema = createInsertSchema(hotels).omit({
  id: true,
  organizationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type HotelInsertType = z.infer<typeof hotelInsertSchema>;

export const hotelInsertByAdminSchema = createInsertSchema(hotels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type HotelInsertByAdminType = z.infer<typeof hotelInsertByAdminSchema>;

export const hotelUpdateSchema = createInsertSchema(hotels)
  .omit({
    id: true,
    organizationId: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type HotelUpdateType = z.infer<typeof hotelUpdateSchema>;

// Helper Schemas
export const hotelQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelType: z.string().optional(),
  propertyClass: z.string().optional(),
});

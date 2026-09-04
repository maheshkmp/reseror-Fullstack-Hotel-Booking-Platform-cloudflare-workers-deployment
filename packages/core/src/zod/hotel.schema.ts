import { z } from "zod";

import {
  hotelAmenities,
  hotelCommonAreas,
  hotelFaqs,
  hotelImages,
  hotelLanguages,
  hotelPaymentMethods,
  hotelPolicies,
  hotelSafetyFeatures,
  hotels,
  hotelSustainability,
  hotelTransportParking,
  hotelTypes,
} from "core/database/schema";
import { propertyClassSchema } from "./property-classes.schema";
import { roomTypeSchema, roomTypeWithRelationsSchema } from "./rooms.schema";
import { restaurantWithRelationsSchema } from "./restaurant.schema";
import { hotelImageSchema } from "./media.schema";

// Hotel Type Schemas
export const hotelTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().nullable(),
  thumbnail: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type HotelType = z.infer<typeof hotelTypeSchema>;

export const hotelTypeInsertSchema = hotelTypeSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const hotelTypeUpdateSchema = hotelTypeSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    slug: true,
  })
  .partial();

// Hotel Amenities Schemas
export const hotelAmenitySchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  amenityType: z.string(),
  isPopular: z.coerce.boolean().nullable().default(false),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type HotelAmenity = z.infer<typeof hotelAmenitySchema>;

export const hotelAmenityInsertSchema = hotelAmenitySchema.omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  }
);

export type InsertHotelAmenityType = z.infer<typeof hotelAmenityInsertSchema>;

export const hotelAmenityUpdateSchema = hotelAmenitySchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Hotel Images Schemas
export { type HotelImage } from "./media.schema";

export const hotelImageInsertSchema = hotelImageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  isThumbnail: z.boolean().nullable().optional(),
});

export type InsertHotelImageType = z.infer<typeof hotelImageInsertSchema>;

export const hotelImageUpdateSchema = hotelImageSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Hotel Policies Schemas
export const hotelPolicySchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  policyType: z.string(),
  policyText: z.string(),
  effectiveDate: z.string(),
  isActive: z.boolean(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type HotelPolicy = z.infer<typeof hotelPolicySchema>;

export const hotelPolicyInsertSchema = hotelPolicySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHotelPolicyType = z.infer<typeof hotelPolicyInsertSchema>;

export const hotelPolicyUpdateSchema = hotelPolicySchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Hotel Nearby POIs Schemas
export const hotelNearbyPoiSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  name: z.string(),
  type: z.string(),
  distanceText: z.string().nullable(),
  durationText: z.string().nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type HotelNearbyPoi = z.infer<typeof hotelNearbyPoiSchema>;

export const hotelNearbyPoiInsertSchema = hotelNearbyPoiSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHotelNearbyPoiType = z.infer<
  typeof hotelNearbyPoiInsertSchema
>;

export const hotelNearbyPoiUpdateSchema = hotelNearbyPoiSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Hotel Languages Schemas
export const hotelLanguageSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  languageCode: z.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type HotelLanguage = z.infer<typeof hotelLanguageSchema>;

export const hotelLanguageInsertSchema = hotelLanguageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHotelLanguageType = z.infer<typeof hotelLanguageInsertSchema>;

export const hotelPaymentMethodSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  cardType: z.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export const hotelPaymentMethodInsertSchema = hotelPaymentMethodSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHotelPaymentMethodType = z.infer<typeof hotelPaymentMethodInsertSchema>;

export const hotelFaqSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  question: z.string(),
  answer: z.string(),
  displayOrder: z.number().default(0),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export const hotelFaqInsertSchema = hotelFaqSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHotelFaqType = z.infer<typeof hotelFaqInsertSchema>;

export const hotelCommonAreaSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  areaType: z.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export const hotelCommonAreaInsertSchema = hotelCommonAreaSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHotelCommonAreaType = z.infer<typeof hotelCommonAreaInsertSchema>;

// Hotel Safety Features Schemas
export const hotelSafetyFeatureSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  featureType: z.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type HotelSafetyFeature = z.infer<typeof hotelSafetyFeatureSchema>;

export const hotelSafetyFeatureInsertSchema = hotelSafetyFeatureSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHotelSafetyType = z.infer<
  typeof hotelSafetyFeatureInsertSchema
>;

// Hotel Sustainability Schemas
export const hotelSustainabilitySchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  initiativeType: z.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type HotelSustainability = z.infer<typeof hotelSustainabilitySchema>;

export const hotelSustainabilityInsertSchema = hotelSustainabilitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHotelSustainabilityType = z.infer<
  typeof hotelSustainabilityInsertSchema
>;

// Hotel Transport & Parking Schemas
export const hotelTransportParkingSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  featureType: z.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type HotelTransportParking = z.infer<typeof hotelTransportParkingSchema>;

export const hotelTransportParkingInsertSchema = hotelTransportParkingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHotelTransportType = z.infer<
  typeof hotelTransportParkingInsertSchema
>;

/**
 * Complete Hotel Schema with Populated Relations
 *
 * Hotel Relations
 * - organizationId (need to populate)
 * - createdBy (dont need to populate)
 * - hotelType (need to populate, 1:1)
 * - propertyClass (need to populate, 1:1)
 * - images (need to populate, 1:M)
 * - amenities (need to populate, 1:M)
 * - policies (need to populate, 1:M)
 * - roomTypes (need to populate, 1:M)
 * - rooms (route based population, 1:M)
 */
export const plainHotelSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  createdBy: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  brandName: z.string().nullable(),
  street: z.string(),
  city: z.string(),
  state: z.string().nullable(),
  country: z.string(),
  postalCode: z.string().nullable(),
  latitude: z.string().nullable(), // handles both number and string from frontend
  longitude: z.string().nullable(), // handles both number and string from frontend
  formattedAddress: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  hotelType: z.string().nullable(),
  starRating: z.number().nullable(),
  propertyClass: z.string().nullable(),
  checkInTime: z.string().nullable(),
  checkInEnd: z.string().nullable().optional(),
  checkOutStart: z.string().nullable().optional(),
  checkOutTime: z.string().nullable(),
  status: z.enum(["active", "inactive", "under_maintenance", "pending_approval", "paused", "hidden"]),
  slug: z.string().nullable().optional(),
  commissionRate: z.string().or(z.number()).nullable().optional(),
  minAge: z.number().nullable().optional(),
  childrenAllowed: z.boolean().nullable().optional(),
  extraBedsAvailable: z.boolean().nullable().optional(),
  extraBedsPolicy: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type PlainHotelType = z.infer<typeof plainHotelSchema>;

export const basicHotelSchema = plainHotelSchema.extend({
  hotelType: hotelTypeSchema.nullable(),
  propertyClass: propertyClassSchema.nullable(),
});

export type BasicHotelType = z.infer<typeof basicHotelSchema>;

export const hotelSelectSchema = basicHotelSchema.extend({
  images: z.array(hotelImageSchema),
  amenities: z.array(hotelAmenitySchema),
  roomTypes: z.array(roomTypeWithRelationsSchema),
  policies: z.array(hotelPolicySchema),
  nearbyPois: z.array(hotelNearbyPoiSchema),
  languages: z.array(hotelLanguageSchema),
  safetyFeatures: z.array(hotelSafetyFeatureSchema),
  sustainability: z.array(hotelSustainabilitySchema),
  transportParking: z.array(hotelTransportParkingSchema),
  paymentMethods: z.array(hotelPaymentMethodSchema),
  faqs: z.array(hotelFaqSchema),
  commonAreas: z.array(hotelCommonAreaSchema),
  restaurants: z.array(restaurantWithRelationsSchema).optional(),
  performance: z.object({
    totalBookings: z.number(),
    totalRevenue: z.number(),
    totalRooms: z.number(),
  }).optional(),
});

export type HotelSelectType = z.infer<typeof hotelSelectSchema>;
export const hotelPerformanceSchema = z.object({
  hotelId: z.string(),
  name: z.string(),
  stats: z.object({
    totalRevenue: z.number(),
    totalBookings: z.number(),
    avgOrderValue: z.number(),
    occupancyRate: z.number(),
  }),
  revenueByDay: z.array(
    z.object({
      date: z.string(),
      revenue: z.number(),
      bookings: z.number(),
    })
  ),
  roomTypePerformance: z.array(
    z.object({
      roomTypeName: z.string(),
      revenue: z.number(),
      bookings: z.number(),
    })
  ),
  bookingStatusBreakdown: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
    })
  ),
});
export type HotelPerformanceType = z.infer<typeof hotelPerformanceSchema>;

export const hotelSelectWithRoomsSchema = hotelSelectSchema.extend({
  rooms: z.array(roomTypeSchema),
});

export type HotelSelectWithRoomsType = z.infer<
  typeof hotelSelectWithRoomsSchema
>;

export const hotelInsertSchema = plainHotelSchema.omit({
  id: true,
  organizationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type HotelInsertType = z.infer<typeof hotelInsertSchema>;

export const hotelInsertByAdminSchema = plainHotelSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type HotelInsertByAdminType = z.infer<typeof hotelInsertByAdminSchema>;

export const hotelUpdateSchema = plainHotelSchema
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
  status: z.string().optional(),
  starRating: z.string().optional(),
  tags: z.string().optional(),
  isOverdue: z.string().optional(),
});

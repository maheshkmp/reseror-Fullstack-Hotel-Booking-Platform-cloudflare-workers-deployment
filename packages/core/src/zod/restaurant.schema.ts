import { z } from "zod";

// Restaurant Image Schema (to avoid circular dependency)
export const restaurantImageSchema = z.object({
  id: z.string(),
  restaurantId: z.string(),
  imageUrl: z.string(),
  altText: z.string().nullable(),
  displayOrder: z.number().nullable(),
  isThumbnail: z.boolean().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type RestaurantImage = z.infer<typeof restaurantImageSchema>;

// Restaurants Schemas
export const restaurantSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  createdBy: z.string(),
  organizationId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  brandName: z.string().nullable(),
  buffetMetadata: z.string().nullable(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  latitude: z.coerce.string().nullable(),
  longitude: z.coerce.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  starRating: z.coerce.string().nullable(),
  checkInTime: z.string().nullable(),
  checkOutTime: z.string().nullable(),
  cuisineType: z.string().nullable(),
  dressCode: z.string().nullable(),
  totalSeats: z.number().nullable(),
  allocatedSeats: z.number().nullable(),
  breakfastPrice: z.coerce.string().nullable(),
  lunchPrice: z.coerce.string().nullable(),
  dinnerPrice: z.coerce.string().nullable(),
  buffetPrice: z.coerce.string().nullable(),
  pricePerSeat: z.coerce.string().nullable(),
  customPrices: z.array(
    z.object({
      label: z.string(),
      price: z.coerce.number()
    })
  ).optional().default([]),
  menuUrl: z.string().nullable(),
  status: z.enum(["active", "inactive", "under_maintenance", "pending_approval"]),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type Restaurant = z.infer<typeof restaurantSchema>;

export const restaurantInsertSchema = restaurantSchema.omit({
  id: true,
  organizationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type RestaurantInsert = z.infer<typeof restaurantInsertSchema>;

export const restaurantUpdateSchema = restaurantSchema
  .omit({
    id: true,
    createdBy: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type RestaurantUpdate = z.infer<typeof restaurantUpdateSchema>;

export const restaurantWithRelationsSchema = restaurantSchema.extend({
  images: z.array(restaurantImageSchema).optional(),
});

export type RestaurantWithRelations = z.infer<
  typeof restaurantWithRelationsSchema
>;

// Query Params Schemas
export const restaurantTypeQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
});

export const restaurantQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
  status: z
    .enum(["active", "inactive", "under_maintenance", "pending_approval"])
    .optional(),
  floorNumber: z.string().optional(),
});

// Restaurant Bookings Schemas
export const restaurantBookingSchema = z.object({
  id: z.string(),
  restaurantId: z.string(),
  userId: z.string(),
  numberOfChairs: z.number(),
  bookingDate: z.coerce.date(),
  totalDeposit: z.coerce.string(),
  status: z.enum(["pending", "arrived", "no_show", "refunded"]),
  checkInAt: z.coerce.date().nullable(),
  refundId: z.string().nullable(),
  paymentId: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type RestaurantBooking = z.infer<typeof restaurantBookingSchema>;

export const restaurantBookingInsertSchema = restaurantBookingSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type RestaurantBookingInsert = z.infer<typeof restaurantBookingInsertSchema>;


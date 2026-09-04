import { z } from "zod";
import { hotelImageSchema } from "./media.schema";

// Hotel Image Schema
export { type HotelImage } from "./media.schema";

// Villas Schemas
export const villaSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  createdBy: z.string(),
  hotelId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  brandName: z.string().nullable(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  starRating: z.number().nullable(),
  checkInTime: z.string().nullable(),
  checkOutTime: z.string().nullable(),
  status: z.enum(["active", "inactive", "under_maintenance", "pending_approval"]),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type Villa = z.infer<typeof villaSchema>;

export const villaInsertSchema = villaSchema.omit({
  id: true,
  organizationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type VillaInsert = z.infer<typeof villaInsertSchema>;

export const villaUpdateSchema = villaSchema
  .omit({
    id: true,
    createdBy: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type VillaUpdate = z.infer<typeof villaUpdateSchema>;

export const villaWithRelationsSchema = villaSchema.extend({});

export type VillaWithRelations = z.infer<typeof villaWithRelationsSchema>;

// Query Params Schemas
export const villaTypeQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
});

export const villaQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
  status: z
    .enum(["available", "occupied", "maintenance", "out_of_order", "dirty"])
    .optional(),
  floorNumber: z.string().optional(),
});

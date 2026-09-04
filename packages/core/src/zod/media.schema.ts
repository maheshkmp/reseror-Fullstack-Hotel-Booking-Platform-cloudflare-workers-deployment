import { z } from "zod";

// Hotel Image Schema
export const hotelImageSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  imageUrl: z.string(),
  altText: z.string().nullable(),
  displayOrder: z.number().nullable(),
  isThumbnail: z.boolean().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string().nullable(),
});

export type HotelImage = z.infer<typeof hotelImageSchema>;

export const mediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  type: z.enum(["image", "video", "audio", "document"]),
  filename: z.string(),
  size: z.number(),
  uploadedBy: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.date()
});

export type Media = z.infer<typeof mediaSchema>;

export const mediaUploadSchema = mediaSchema.omit({
  id: true,
  uploadedBy: true,
  createdAt: true,
  updatedAt: true
});

export type MediaUploadType = z.infer<typeof mediaUploadSchema>;

export const mediaUpdateSchema = mediaSchema
  .omit({
    id: true,
    createdAt: true,
    type: true
  })
  .partial();

export type MediaUpdateType = z.infer<typeof mediaUpdateSchema>;

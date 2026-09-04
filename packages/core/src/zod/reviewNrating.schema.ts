import { z } from "zod";

export const reviewNrating = z.object({
  id: z.string(),
  hotelId: z.string().nullable(),
  roomId: z.string().nullable(),
  restaurantId: z.string().nullable(),
  userId: z.string().nullable(),
  organizationId: z.string().nullable(),
  rating: z.string(),
  reviewTitle: z.string().nullable(),
  reviewPositiveText: z.string().nullable(),
  reviewNegativeText: z.string().nullable(),
  reviewDate: z.string().nullable(), // date comes as string
  propertyResponse: z.string().nullable(),
  stayDate: z.coerce.date().nullable(),
  response: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.coerce.string().nullable(),
});

export const reviewNratingInsertSchema = reviewNrating.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  userId: true,
});

export const reviewNratingUpdateSchema = reviewNrating
  .omit({
    id: true,
    organizationId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type reviewNratingUpdateType = z.infer<typeof reviewNratingUpdateSchema>;
export type reviewNrating = z.infer<typeof reviewNrating>;
export type reviewNratingInsertType = z.infer<typeof reviewNratingInsertSchema>;

import { z } from "zod";
export declare const hotelImageSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    imageUrl: z.ZodString;
    altText: z.ZodNullable<z.ZodString>;
    displayOrder: z.ZodNullable<z.ZodNumber>;
    isThumbnail: z.ZodNullable<z.ZodBoolean>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type HotelImage = z.infer<typeof hotelImageSchema>;
export declare const mediaSchema: z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    type: z.ZodEnum<{
        image: "image";
        video: "video";
        audio: "audio";
        document: "document";
    }>;
    filename: z.ZodString;
    size: z.ZodNumber;
    uploadedBy: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export type Media = z.infer<typeof mediaSchema>;
export declare const mediaUploadSchema: z.ZodObject<{
    url: z.ZodString;
    type: z.ZodEnum<{
        image: "image";
        video: "video";
        audio: "audio";
        document: "document";
    }>;
    filename: z.ZodString;
    size: z.ZodNumber;
}, z.core.$strip>;
export type MediaUploadType = z.infer<typeof mediaUploadSchema>;
export declare const mediaUpdateSchema: z.ZodObject<{
    updatedAt: z.ZodOptional<z.ZodDate>;
    url: z.ZodOptional<z.ZodString>;
    filename: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
    uploadedBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type MediaUpdateType = z.infer<typeof mediaUpdateSchema>;

import { z } from "zod";
export declare const hotelTypeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodNullable<z.ZodString>;
    thumbnail: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type HotelType = z.infer<typeof hotelTypeSchema>;
export declare const hotelTypeInsertSchema: z.ZodObject<{
    name: z.ZodString;
    thumbnail: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const hotelTypeUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    thumbnail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const hotelAmenitySchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    amenityType: z.ZodString;
    isPopular: z.ZodDefault<z.ZodNullable<z.ZodCoercedBoolean<unknown>>>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type HotelAmenity = z.infer<typeof hotelAmenitySchema>;
export declare const hotelAmenityInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    amenityType: z.ZodString;
    isPopular: z.ZodDefault<z.ZodNullable<z.ZodCoercedBoolean<unknown>>>;
}, z.core.$strip>;
export type InsertHotelAmenityType = z.infer<typeof hotelAmenityInsertSchema>;
export declare const hotelAmenityUpdateSchema: z.ZodObject<{
    hotelId: z.ZodOptional<z.ZodString>;
    amenityType: z.ZodOptional<z.ZodString>;
    isPopular: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodCoercedBoolean<unknown>>>>;
}, z.core.$strip>;
export { type HotelImage } from "./media.schema";
export declare const hotelImageInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    imageUrl: z.ZodString;
    altText: z.ZodNullable<z.ZodString>;
    displayOrder: z.ZodNullable<z.ZodNumber>;
    isThumbnail: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strip>;
export type InsertHotelImageType = z.infer<typeof hotelImageInsertSchema>;
export declare const hotelImageUpdateSchema: z.ZodObject<{
    hotelId: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    altText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    displayOrder: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isThumbnail: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const hotelPolicySchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    policyType: z.ZodString;
    policyText: z.ZodString;
    effectiveDate: z.ZodString;
    isActive: z.ZodBoolean;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type HotelPolicy = z.infer<typeof hotelPolicySchema>;
export declare const hotelPolicyInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    policyType: z.ZodString;
    policyText: z.ZodString;
    effectiveDate: z.ZodString;
    isActive: z.ZodBoolean;
}, z.core.$strip>;
export type InsertHotelPolicyType = z.infer<typeof hotelPolicyInsertSchema>;
export declare const hotelPolicyUpdateSchema: z.ZodObject<{
    hotelId: z.ZodOptional<z.ZodString>;
    policyType: z.ZodOptional<z.ZodString>;
    policyText: z.ZodOptional<z.ZodString>;
    effectiveDate: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const hotelNearbyPoiSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    distanceText: z.ZodNullable<z.ZodString>;
    durationText: z.ZodNullable<z.ZodString>;
    latitude: z.ZodNullable<z.ZodString>;
    longitude: z.ZodNullable<z.ZodString>;
    isActive: z.ZodBoolean;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type HotelNearbyPoi = z.infer<typeof hotelNearbyPoiSchema>;
export declare const hotelNearbyPoiInsertSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    latitude: z.ZodNullable<z.ZodString>;
    longitude: z.ZodNullable<z.ZodString>;
    hotelId: z.ZodString;
    isActive: z.ZodBoolean;
    distanceText: z.ZodNullable<z.ZodString>;
    durationText: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type InsertHotelNearbyPoiType = z.infer<typeof hotelNearbyPoiInsertSchema>;
export declare const hotelNearbyPoiUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    longitude: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hotelId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    distanceText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    durationText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const hotelLanguageSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    languageCode: z.ZodString;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type HotelLanguage = z.infer<typeof hotelLanguageSchema>;
export declare const hotelLanguageInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    languageCode: z.ZodString;
}, z.core.$strip>;
export type InsertHotelLanguageType = z.infer<typeof hotelLanguageInsertSchema>;
export declare const hotelPaymentMethodSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    cardType: z.ZodString;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export declare const hotelPaymentMethodInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    cardType: z.ZodString;
}, z.core.$strip>;
export type InsertHotelPaymentMethodType = z.infer<typeof hotelPaymentMethodInsertSchema>;
export declare const hotelFaqSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    question: z.ZodString;
    answer: z.ZodString;
    displayOrder: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export declare const hotelFaqInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    displayOrder: z.ZodDefault<z.ZodNumber>;
    question: z.ZodString;
    answer: z.ZodString;
}, z.core.$strip>;
export type InsertHotelFaqType = z.infer<typeof hotelFaqInsertSchema>;
export declare const hotelCommonAreaSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    areaType: z.ZodString;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export declare const hotelCommonAreaInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    areaType: z.ZodString;
}, z.core.$strip>;
export type InsertHotelCommonAreaType = z.infer<typeof hotelCommonAreaInsertSchema>;
export declare const hotelSafetyFeatureSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    featureType: z.ZodString;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type HotelSafetyFeature = z.infer<typeof hotelSafetyFeatureSchema>;
export declare const hotelSafetyFeatureInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    featureType: z.ZodString;
}, z.core.$strip>;
export type InsertHotelSafetyType = z.infer<typeof hotelSafetyFeatureInsertSchema>;
export declare const hotelSustainabilitySchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    initiativeType: z.ZodString;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type HotelSustainability = z.infer<typeof hotelSustainabilitySchema>;
export declare const hotelSustainabilityInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    initiativeType: z.ZodString;
}, z.core.$strip>;
export type InsertHotelSustainabilityType = z.infer<typeof hotelSustainabilityInsertSchema>;
export declare const hotelTransportParkingSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    featureType: z.ZodString;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type HotelTransportParking = z.infer<typeof hotelTransportParkingSchema>;
export declare const hotelTransportParkingInsertSchema: z.ZodObject<{
    hotelId: z.ZodString;
    featureType: z.ZodString;
}, z.core.$strip>;
export type InsertHotelTransportType = z.infer<typeof hotelTransportParkingInsertSchema>;
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
export declare const plainHotelSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    createdBy: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    brandName: z.ZodNullable<z.ZodString>;
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodNullable<z.ZodString>;
    country: z.ZodString;
    postalCode: z.ZodNullable<z.ZodString>;
    latitude: z.ZodNullable<z.ZodString>;
    longitude: z.ZodNullable<z.ZodString>;
    formattedAddress: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    website: z.ZodNullable<z.ZodString>;
    hotelType: z.ZodNullable<z.ZodString>;
    starRating: z.ZodNullable<z.ZodNumber>;
    propertyClass: z.ZodNullable<z.ZodString>;
    checkInTime: z.ZodNullable<z.ZodString>;
    checkInEnd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutStart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutTime: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        pending_approval: "pending_approval";
        active: "active";
        inactive: "inactive";
        under_maintenance: "under_maintenance";
        paused: "paused";
        hidden: "hidden";
    }>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    commissionRate: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
    minAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    childrenAllowed: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsAvailable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsPolicy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type PlainHotelType = z.infer<typeof plainHotelSchema>;
export declare const basicHotelSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    createdBy: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    brandName: z.ZodNullable<z.ZodString>;
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodNullable<z.ZodString>;
    country: z.ZodString;
    postalCode: z.ZodNullable<z.ZodString>;
    latitude: z.ZodNullable<z.ZodString>;
    longitude: z.ZodNullable<z.ZodString>;
    formattedAddress: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    website: z.ZodNullable<z.ZodString>;
    starRating: z.ZodNullable<z.ZodNumber>;
    checkInTime: z.ZodNullable<z.ZodString>;
    checkInEnd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutStart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutTime: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        pending_approval: "pending_approval";
        active: "active";
        inactive: "inactive";
        under_maintenance: "under_maintenance";
        paused: "paused";
        hidden: "hidden";
    }>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    commissionRate: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
    minAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    childrenAllowed: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsAvailable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsPolicy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    hotelType: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodNullable<z.ZodString>;
        thumbnail: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    propertyClass: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodNullable<z.ZodString>;
        thumbnail: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BasicHotelType = z.infer<typeof basicHotelSchema>;
export declare const hotelSelectSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    createdBy: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    brandName: z.ZodNullable<z.ZodString>;
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodNullable<z.ZodString>;
    country: z.ZodString;
    postalCode: z.ZodNullable<z.ZodString>;
    latitude: z.ZodNullable<z.ZodString>;
    longitude: z.ZodNullable<z.ZodString>;
    formattedAddress: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    website: z.ZodNullable<z.ZodString>;
    starRating: z.ZodNullable<z.ZodNumber>;
    checkInTime: z.ZodNullable<z.ZodString>;
    checkInEnd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutStart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutTime: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        pending_approval: "pending_approval";
        active: "active";
        inactive: "inactive";
        under_maintenance: "under_maintenance";
        paused: "paused";
        hidden: "hidden";
    }>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    commissionRate: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
    minAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    childrenAllowed: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsAvailable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsPolicy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    hotelType: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodNullable<z.ZodString>;
        thumbnail: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    propertyClass: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodNullable<z.ZodString>;
        thumbnail: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    images: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        imageUrl: z.ZodString;
        altText: z.ZodNullable<z.ZodString>;
        displayOrder: z.ZodNullable<z.ZodNumber>;
        isThumbnail: z.ZodNullable<z.ZodBoolean>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    amenities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        amenityType: z.ZodString;
        isPopular: z.ZodDefault<z.ZodNullable<z.ZodCoercedBoolean<unknown>>>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    roomTypes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        name: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        price: z.ZodPipe<z.ZodNullable<z.ZodString>, z.ZodTransform<string | null, string | null>>;
        baseOccupancy: z.ZodNumber;
        maxOccupancy: z.ZodNumber;
        extraBedCapacity: z.ZodNullable<z.ZodNumber>;
        bedConfiguration: z.ZodNullable<z.ZodAny>;
        roomSizeSqm: z.ZodPipe<z.ZodNullable<z.ZodString>, z.ZodTransform<string | null, string | null>>;
        viewType: z.ZodNullable<z.ZodEnum<{
            street: "street";
            city: "city";
            pool: "pool";
            ocean: "ocean";
            garden: "garden";
            mountain: "mountain";
            courtyard: "courtyard";
            interior: "interior";
        }>>;
        status: z.ZodBoolean;
        isSmoking: z.ZodDefault<z.ZodBoolean>;
        note: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        amenities: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            roomTypeId: z.ZodString;
            amenityType: z.ZodString;
            createdAt: z.ZodCoercedString<unknown>;
            updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        }, z.core.$strip>>;
        rooms: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            hotelId: z.ZodString;
            roomTypeId: z.ZodString;
            roomNumber: z.ZodString;
            floorNumber: z.ZodNullable<z.ZodNumber>;
            isAccessible: z.ZodNullable<z.ZodBoolean>;
            status: z.ZodEnum<{
                available: "available";
                occupied: "occupied";
                maintenance: "maintenance";
                out_of_order: "out_of_order";
                dirty: "dirty";
            }>;
            lastCleanedAt: z.ZodNullable<z.ZodDate>;
            createdAt: z.ZodCoercedString<unknown>;
            updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        }, z.core.$strip>>>;
        images: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            hotelId: z.ZodString;
            imageUrl: z.ZodString;
            altText: z.ZodNullable<z.ZodString>;
            displayOrder: z.ZodNullable<z.ZodNumber>;
            isThumbnail: z.ZodNullable<z.ZodBoolean>;
            createdAt: z.ZodCoercedString<unknown>;
            updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    policies: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        policyType: z.ZodString;
        policyText: z.ZodString;
        effectiveDate: z.ZodString;
        isActive: z.ZodBoolean;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    nearbyPois: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        name: z.ZodString;
        type: z.ZodString;
        distanceText: z.ZodNullable<z.ZodString>;
        durationText: z.ZodNullable<z.ZodString>;
        latitude: z.ZodNullable<z.ZodString>;
        longitude: z.ZodNullable<z.ZodString>;
        isActive: z.ZodBoolean;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    languages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        languageCode: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    safetyFeatures: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        featureType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    sustainability: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        initiativeType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    transportParking: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        featureType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    paymentMethods: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        cardType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    faqs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        question: z.ZodString;
        answer: z.ZodString;
        displayOrder: z.ZodDefault<z.ZodNumber>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    commonAreas: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        areaType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    restaurants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        createdBy: z.ZodString;
        organizationId: z.ZodString;
        name: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        brandName: z.ZodNullable<z.ZodString>;
        buffetMetadata: z.ZodNullable<z.ZodString>;
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        country: z.ZodString;
        postalCode: z.ZodString;
        latitude: z.ZodNullable<z.ZodCoercedString<unknown>>;
        longitude: z.ZodNullable<z.ZodCoercedString<unknown>>;
        phone: z.ZodNullable<z.ZodString>;
        email: z.ZodNullable<z.ZodString>;
        website: z.ZodNullable<z.ZodString>;
        starRating: z.ZodNullable<z.ZodCoercedString<unknown>>;
        checkInTime: z.ZodNullable<z.ZodString>;
        checkOutTime: z.ZodNullable<z.ZodString>;
        cuisineType: z.ZodNullable<z.ZodString>;
        dressCode: z.ZodNullable<z.ZodString>;
        totalSeats: z.ZodNullable<z.ZodNumber>;
        allocatedSeats: z.ZodNullable<z.ZodNumber>;
        breakfastPrice: z.ZodNullable<z.ZodCoercedString<unknown>>;
        lunchPrice: z.ZodNullable<z.ZodCoercedString<unknown>>;
        dinnerPrice: z.ZodNullable<z.ZodCoercedString<unknown>>;
        buffetPrice: z.ZodNullable<z.ZodCoercedString<unknown>>;
        pricePerSeat: z.ZodNullable<z.ZodCoercedString<unknown>>;
        customPrices: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            price: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>>>>;
        menuUrl: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            pending_approval: "pending_approval";
            active: "active";
            inactive: "inactive";
            under_maintenance: "under_maintenance";
        }>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        images: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            restaurantId: z.ZodString;
            imageUrl: z.ZodString;
            altText: z.ZodNullable<z.ZodString>;
            displayOrder: z.ZodNullable<z.ZodNumber>;
            isThumbnail: z.ZodNullable<z.ZodBoolean>;
            createdAt: z.ZodCoercedString<unknown>;
            updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    performance: z.ZodOptional<z.ZodObject<{
        totalBookings: z.ZodNumber;
        totalRevenue: z.ZodNumber;
        totalRooms: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type HotelSelectType = z.infer<typeof hotelSelectSchema>;
export declare const hotelPerformanceSchema: z.ZodObject<{
    hotelId: z.ZodString;
    name: z.ZodString;
    stats: z.ZodObject<{
        totalRevenue: z.ZodNumber;
        totalBookings: z.ZodNumber;
        avgOrderValue: z.ZodNumber;
        occupancyRate: z.ZodNumber;
    }, z.core.$strip>;
    revenueByDay: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        revenue: z.ZodNumber;
        bookings: z.ZodNumber;
    }, z.core.$strip>>;
    roomTypePerformance: z.ZodArray<z.ZodObject<{
        roomTypeName: z.ZodString;
        revenue: z.ZodNumber;
        bookings: z.ZodNumber;
    }, z.core.$strip>>;
    bookingStatusBreakdown: z.ZodArray<z.ZodObject<{
        status: z.ZodString;
        count: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type HotelPerformanceType = z.infer<typeof hotelPerformanceSchema>;
export declare const hotelSelectWithRoomsSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    createdBy: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    brandName: z.ZodNullable<z.ZodString>;
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodNullable<z.ZodString>;
    country: z.ZodString;
    postalCode: z.ZodNullable<z.ZodString>;
    latitude: z.ZodNullable<z.ZodString>;
    longitude: z.ZodNullable<z.ZodString>;
    formattedAddress: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    website: z.ZodNullable<z.ZodString>;
    starRating: z.ZodNullable<z.ZodNumber>;
    checkInTime: z.ZodNullable<z.ZodString>;
    checkInEnd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutStart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutTime: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        pending_approval: "pending_approval";
        active: "active";
        inactive: "inactive";
        under_maintenance: "under_maintenance";
        paused: "paused";
        hidden: "hidden";
    }>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    commissionRate: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
    minAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    childrenAllowed: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsAvailable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsPolicy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    hotelType: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodNullable<z.ZodString>;
        thumbnail: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    propertyClass: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodNullable<z.ZodString>;
        thumbnail: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    images: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        imageUrl: z.ZodString;
        altText: z.ZodNullable<z.ZodString>;
        displayOrder: z.ZodNullable<z.ZodNumber>;
        isThumbnail: z.ZodNullable<z.ZodBoolean>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    amenities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        amenityType: z.ZodString;
        isPopular: z.ZodDefault<z.ZodNullable<z.ZodCoercedBoolean<unknown>>>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    roomTypes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        name: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        price: z.ZodPipe<z.ZodNullable<z.ZodString>, z.ZodTransform<string | null, string | null>>;
        baseOccupancy: z.ZodNumber;
        maxOccupancy: z.ZodNumber;
        extraBedCapacity: z.ZodNullable<z.ZodNumber>;
        bedConfiguration: z.ZodNullable<z.ZodAny>;
        roomSizeSqm: z.ZodPipe<z.ZodNullable<z.ZodString>, z.ZodTransform<string | null, string | null>>;
        viewType: z.ZodNullable<z.ZodEnum<{
            street: "street";
            city: "city";
            pool: "pool";
            ocean: "ocean";
            garden: "garden";
            mountain: "mountain";
            courtyard: "courtyard";
            interior: "interior";
        }>>;
        status: z.ZodBoolean;
        isSmoking: z.ZodDefault<z.ZodBoolean>;
        note: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        amenities: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            roomTypeId: z.ZodString;
            amenityType: z.ZodString;
            createdAt: z.ZodCoercedString<unknown>;
            updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        }, z.core.$strip>>;
        rooms: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            hotelId: z.ZodString;
            roomTypeId: z.ZodString;
            roomNumber: z.ZodString;
            floorNumber: z.ZodNullable<z.ZodNumber>;
            isAccessible: z.ZodNullable<z.ZodBoolean>;
            status: z.ZodEnum<{
                available: "available";
                occupied: "occupied";
                maintenance: "maintenance";
                out_of_order: "out_of_order";
                dirty: "dirty";
            }>;
            lastCleanedAt: z.ZodNullable<z.ZodDate>;
            createdAt: z.ZodCoercedString<unknown>;
            updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        }, z.core.$strip>>>;
        images: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            hotelId: z.ZodString;
            imageUrl: z.ZodString;
            altText: z.ZodNullable<z.ZodString>;
            displayOrder: z.ZodNullable<z.ZodNumber>;
            isThumbnail: z.ZodNullable<z.ZodBoolean>;
            createdAt: z.ZodCoercedString<unknown>;
            updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    policies: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        policyType: z.ZodString;
        policyText: z.ZodString;
        effectiveDate: z.ZodString;
        isActive: z.ZodBoolean;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    nearbyPois: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        name: z.ZodString;
        type: z.ZodString;
        distanceText: z.ZodNullable<z.ZodString>;
        durationText: z.ZodNullable<z.ZodString>;
        latitude: z.ZodNullable<z.ZodString>;
        longitude: z.ZodNullable<z.ZodString>;
        isActive: z.ZodBoolean;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    languages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        languageCode: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    safetyFeatures: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        featureType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    sustainability: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        initiativeType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    transportParking: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        featureType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    paymentMethods: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        cardType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    faqs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        question: z.ZodString;
        answer: z.ZodString;
        displayOrder: z.ZodDefault<z.ZodNumber>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    commonAreas: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        areaType: z.ZodString;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
    restaurants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        createdBy: z.ZodString;
        organizationId: z.ZodString;
        name: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        brandName: z.ZodNullable<z.ZodString>;
        buffetMetadata: z.ZodNullable<z.ZodString>;
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        country: z.ZodString;
        postalCode: z.ZodString;
        latitude: z.ZodNullable<z.ZodCoercedString<unknown>>;
        longitude: z.ZodNullable<z.ZodCoercedString<unknown>>;
        phone: z.ZodNullable<z.ZodString>;
        email: z.ZodNullable<z.ZodString>;
        website: z.ZodNullable<z.ZodString>;
        starRating: z.ZodNullable<z.ZodCoercedString<unknown>>;
        checkInTime: z.ZodNullable<z.ZodString>;
        checkOutTime: z.ZodNullable<z.ZodString>;
        cuisineType: z.ZodNullable<z.ZodString>;
        dressCode: z.ZodNullable<z.ZodString>;
        totalSeats: z.ZodNullable<z.ZodNumber>;
        allocatedSeats: z.ZodNullable<z.ZodNumber>;
        breakfastPrice: z.ZodNullable<z.ZodCoercedString<unknown>>;
        lunchPrice: z.ZodNullable<z.ZodCoercedString<unknown>>;
        dinnerPrice: z.ZodNullable<z.ZodCoercedString<unknown>>;
        buffetPrice: z.ZodNullable<z.ZodCoercedString<unknown>>;
        pricePerSeat: z.ZodNullable<z.ZodCoercedString<unknown>>;
        customPrices: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            price: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>>>>;
        menuUrl: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            pending_approval: "pending_approval";
            active: "active";
            inactive: "inactive";
            under_maintenance: "under_maintenance";
        }>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        images: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            restaurantId: z.ZodString;
            imageUrl: z.ZodString;
            altText: z.ZodNullable<z.ZodString>;
            displayOrder: z.ZodNullable<z.ZodNumber>;
            isThumbnail: z.ZodNullable<z.ZodBoolean>;
            createdAt: z.ZodCoercedString<unknown>;
            updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    performance: z.ZodOptional<z.ZodObject<{
        totalBookings: z.ZodNumber;
        totalRevenue: z.ZodNumber;
        totalRooms: z.ZodNumber;
    }, z.core.$strip>>;
    rooms: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        hotelId: z.ZodString;
        name: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        price: z.ZodPipe<z.ZodNullable<z.ZodString>, z.ZodTransform<string | null, string | null>>;
        baseOccupancy: z.ZodNumber;
        maxOccupancy: z.ZodNumber;
        extraBedCapacity: z.ZodNullable<z.ZodNumber>;
        bedConfiguration: z.ZodNullable<z.ZodAny>;
        roomSizeSqm: z.ZodPipe<z.ZodNullable<z.ZodString>, z.ZodTransform<string | null, string | null>>;
        viewType: z.ZodNullable<z.ZodEnum<{
            street: "street";
            city: "city";
            pool: "pool";
            ocean: "ocean";
            garden: "garden";
            mountain: "mountain";
            courtyard: "courtyard";
            interior: "interior";
        }>>;
        status: z.ZodBoolean;
        isSmoking: z.ZodDefault<z.ZodBoolean>;
        note: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedString<unknown>;
        updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type HotelSelectWithRoomsType = z.infer<typeof hotelSelectWithRoomsSchema>;
export declare const hotelInsertSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodEnum<{
        pending_approval: "pending_approval";
        active: "active";
        inactive: "inactive";
        under_maintenance: "under_maintenance";
        paused: "paused";
        hidden: "hidden";
    }>;
    description: z.ZodNullable<z.ZodString>;
    brandName: z.ZodNullable<z.ZodString>;
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodNullable<z.ZodString>;
    country: z.ZodString;
    postalCode: z.ZodNullable<z.ZodString>;
    latitude: z.ZodNullable<z.ZodString>;
    longitude: z.ZodNullable<z.ZodString>;
    formattedAddress: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    website: z.ZodNullable<z.ZodString>;
    hotelType: z.ZodNullable<z.ZodString>;
    starRating: z.ZodNullable<z.ZodNumber>;
    propertyClass: z.ZodNullable<z.ZodString>;
    checkInTime: z.ZodNullable<z.ZodString>;
    checkInEnd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutStart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutTime: z.ZodNullable<z.ZodString>;
    minAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    childrenAllowed: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsAvailable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsPolicy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    commissionRate: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
    tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export type HotelInsertType = z.infer<typeof hotelInsertSchema>;
export declare const hotelInsertByAdminSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    organizationId: z.ZodString;
    status: z.ZodEnum<{
        pending_approval: "pending_approval";
        active: "active";
        inactive: "inactive";
        under_maintenance: "under_maintenance";
        paused: "paused";
        hidden: "hidden";
    }>;
    createdBy: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    brandName: z.ZodNullable<z.ZodString>;
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodNullable<z.ZodString>;
    country: z.ZodString;
    postalCode: z.ZodNullable<z.ZodString>;
    latitude: z.ZodNullable<z.ZodString>;
    longitude: z.ZodNullable<z.ZodString>;
    formattedAddress: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    website: z.ZodNullable<z.ZodString>;
    hotelType: z.ZodNullable<z.ZodString>;
    starRating: z.ZodNullable<z.ZodNumber>;
    propertyClass: z.ZodNullable<z.ZodString>;
    checkInTime: z.ZodNullable<z.ZodString>;
    checkInEnd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutStart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutTime: z.ZodNullable<z.ZodString>;
    minAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    childrenAllowed: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsAvailable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    extraBedsPolicy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    commissionRate: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
    tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export type HotelInsertByAdminType = z.infer<typeof hotelInsertByAdminSchema>;
export declare const hotelUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    status: z.ZodOptional<z.ZodEnum<{
        pending_approval: "pending_approval";
        active: "active";
        inactive: "inactive";
        under_maintenance: "under_maintenance";
        paused: "paused";
        hidden: "hidden";
    }>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    brandName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    street: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    country: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    latitude: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    longitude: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    formattedAddress: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hotelType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    starRating: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    propertyClass: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkInTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkInEnd: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    checkOutStart: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    checkOutTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    minAge: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    childrenAllowed: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    extraBedsAvailable: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    extraBedsPolicy: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    commissionRate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>>;
}, z.core.$strip>;
export type HotelUpdateType = z.infer<typeof hotelUpdateSchema>;
export declare const hotelQueryParamsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    search: z.ZodOptional<z.ZodString>;
    hotelType: z.ZodOptional<z.ZodString>;
    propertyClass: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    starRating: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodString>;
    isOverdue: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;

import { z } from "zod";
export declare const roomTypeSchema: z.ZodObject<{
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
}, z.core.$strip>;
export type RoomType = z.infer<typeof roomTypeSchema>;
export declare const roomTypeInsertSchema: z.ZodObject<{
    name: z.ZodString;
    status: z.ZodBoolean;
    description: z.ZodNullable<z.ZodString>;
    hotelId: z.ZodString;
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
    isSmoking: z.ZodDefault<z.ZodBoolean>;
    note: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type RoomTypeInsert = z.infer<typeof roomTypeInsertSchema>;
export declare const roomTypeUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodBoolean>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    price: z.ZodOptional<z.ZodPipe<z.ZodNullable<z.ZodString>, z.ZodTransform<string | null, string | null>>>;
    baseOccupancy: z.ZodOptional<z.ZodNumber>;
    maxOccupancy: z.ZodOptional<z.ZodNumber>;
    extraBedCapacity: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    bedConfiguration: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    roomSizeSqm: z.ZodOptional<z.ZodPipe<z.ZodNullable<z.ZodString>, z.ZodTransform<string | null, string | null>>>;
    viewType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        street: "street";
        city: "city";
        pool: "pool";
        ocean: "ocean";
        garden: "garden";
        mountain: "mountain";
        courtyard: "courtyard";
        interior: "interior";
    }>>>;
    isSmoking: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RoomTypeUpdate = z.infer<typeof roomTypeUpdateSchema>;
export declare const roomTypeAmenitySchema: z.ZodObject<{
    id: z.ZodString;
    roomTypeId: z.ZodString;
    amenityType: z.ZodString;
    createdAt: z.ZodCoercedString<unknown>;
    updatedAt: z.ZodNullable<z.ZodCoercedString<unknown>>;
}, z.core.$strip>;
export type RoomTypeAmenity = z.infer<typeof roomTypeAmenitySchema>;
export declare const roomTypeAmenityInsertSchema: z.ZodObject<{
    roomTypeId: z.ZodString;
    amenityType: z.ZodString;
}, z.core.$strip>;
export type RoomTypeAmenityInsert = z.infer<typeof roomTypeAmenityInsertSchema>;
export declare const roomTypeAmenityUpdateSchema: z.ZodObject<{
    amenityType: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RoomTypeAmenityUpdate = z.infer<typeof roomTypeAmenityUpdateSchema>;
export declare const roomSchema: z.ZodObject<{
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
}, z.core.$strip>;
export type Room = z.infer<typeof roomSchema>;
export declare const roomInsertSchema: z.ZodObject<{
    status: z.ZodEnum<{
        available: "available";
        occupied: "occupied";
        maintenance: "maintenance";
        out_of_order: "out_of_order";
        dirty: "dirty";
    }>;
    hotelId: z.ZodString;
    roomTypeId: z.ZodString;
    roomNumber: z.ZodString;
    floorNumber: z.ZodNullable<z.ZodNumber>;
    isAccessible: z.ZodNullable<z.ZodBoolean>;
    lastCleanedAt: z.ZodNullable<z.ZodDate>;
}, z.core.$strip>;
export type RoomInsert = z.infer<typeof roomInsertSchema>;
export declare const roomUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        available: "available";
        occupied: "occupied";
        maintenance: "maintenance";
        out_of_order: "out_of_order";
        dirty: "dirty";
    }>>;
    roomNumber: z.ZodOptional<z.ZodString>;
    floorNumber: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isAccessible: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    lastCleanedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
}, z.core.$strip>;
export type RoomUpdate = z.infer<typeof roomUpdateSchema>;
export declare const roomWithRelationsSchema: z.ZodObject<{
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
    roomType: z.ZodNullable<z.ZodObject<{
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
export type RoomWithRelations = z.infer<typeof roomWithRelationsSchema>;
export declare const roomTypeWithRelationsSchema: z.ZodObject<{
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
}, z.core.$strip>;
export type RoomTypeWithRelations = z.infer<typeof roomTypeWithRelationsSchema>;
export declare const roomTypeQueryParamsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    search: z.ZodOptional<z.ZodString>;
    hotelId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const roomQueryParamsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
    sort: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    hotelId: z.ZodOptional<z.ZodString>;
    roomTypeId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        available: "available";
        occupied: "occupied";
        maintenance: "maintenance";
        out_of_order: "out_of_order";
        dirty: "dirty";
    }>>;
    floorNumber: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const bulkRoomCreationSchema: z.ZodObject<{
    roomTypeId: z.ZodString;
    hotelId: z.ZodString;
    roomNumbers: z.ZodArray<z.ZodString>;
    floorNumber: z.ZodOptional<z.ZodNumber>;
    isAccessible: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type BulkRoomCreation = z.infer<typeof bulkRoomCreationSchema>;
export type CreateRoomInput = RoomInsert;
export type UpdateRoomInput = RoomUpdate;
export type CreateRoomTypeInput = RoomTypeInsert;
export type UpdateRoomTypeInput = RoomTypeUpdate;
export type GetRoomsParams = z.infer<typeof roomQueryParamsSchema>;
export type RoomAmenity = RoomTypeAmenity;

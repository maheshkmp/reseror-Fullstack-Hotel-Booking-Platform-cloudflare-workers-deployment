import { z } from "zod";
export declare const paymentsAdminSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    bookingId: z.ZodNullable<z.ZodString>;
    restaurantBookingId: z.ZodNullable<z.ZodString>;
    organizationId: z.ZodString;
    type: z.ZodEnum<{
        incoming: "incoming";
        outgoing: "outgoing";
    }>;
    method: z.ZodString;
    amount: z.ZodString;
    settled: z.ZodBoolean;
    settledAt: z.ZodNullable<z.ZodDate>;
    createdAt: z.ZodCoercedString<unknown>;
}, z.core.$strip>;
export type PaymentsAdmin = z.infer<typeof paymentsAdminSchema>;
export declare const paymentsAdminInsertSchema: z.ZodObject<{
    type: z.ZodEnum<{
        incoming: "incoming";
        outgoing: "outgoing";
    }>;
    hotelId: z.ZodString;
    bookingId: z.ZodNullable<z.ZodString>;
    restaurantBookingId: z.ZodNullable<z.ZodString>;
    method: z.ZodString;
    amount: z.ZodString;
    settled: z.ZodBoolean;
    settledAt: z.ZodNullable<z.ZodDate>;
}, z.core.$strip>;
export type PaymentsAdminInsert = z.infer<typeof paymentsAdminInsertSchema>;
export declare const paymentsAdminUpdateSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        incoming: "incoming";
        outgoing: "outgoing";
    }>>;
    hotelId: z.ZodOptional<z.ZodString>;
    bookingId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    restaurantBookingId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    method: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodString>;
    settled: z.ZodOptional<z.ZodBoolean>;
    settledAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
}, z.core.$strip>;
export type PaymentsAdminUpdate = z.infer<typeof paymentsAdminUpdateSchema>;
export declare const paymentsAdminWithRelationsSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    bookingId: z.ZodNullable<z.ZodString>;
    restaurantBookingId: z.ZodNullable<z.ZodString>;
    organizationId: z.ZodString;
    type: z.ZodEnum<{
        incoming: "incoming";
        outgoing: "outgoing";
    }>;
    method: z.ZodString;
    amount: z.ZodString;
    settled: z.ZodBoolean;
    settledAt: z.ZodNullable<z.ZodDate>;
    createdAt: z.ZodCoercedString<unknown>;
}, z.core.$strip>;
export type PaymentsAdminWithRelations = z.infer<typeof paymentsAdminWithRelationsSchema>;
export declare const paymentsAdminQueryParamsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    search: z.ZodOptional<z.ZodString>;
    hotelId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        incoming: "incoming";
        outgoing: "outgoing";
    }>>;
    method: z.ZodOptional<z.ZodString>;
    settled: z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
    dateFrom: z.ZodOptional<z.ZodString>;
    dateTo: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PaymentsAdminQueryParams = z.infer<typeof paymentsAdminQueryParamsSchema>;

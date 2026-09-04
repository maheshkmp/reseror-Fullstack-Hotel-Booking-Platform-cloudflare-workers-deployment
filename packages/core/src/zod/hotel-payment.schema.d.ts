import { z } from "zod";
export declare const paymentsHotelSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    bookingId: z.ZodNullable<z.ZodString>;
    restaurantBookingId: z.ZodNullable<z.ZodString>;
    organizationId: z.ZodString;
    type: z.ZodEnum<{
        receive_commission_from_cash: "receive_commission_from_cash";
        repay_net_from_online: "repay_net_from_online";
        restaurant_booking_commission: "restaurant_booking_commission";
    }>;
    amount: z.ZodString;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    paid: z.ZodBoolean;
    paidAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    proof: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bankName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    referenceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        rejected: "rejected";
        submitted: "submitted";
        confirmed: "confirmed";
    }>>>;
    rejectionReason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type PaymentsHotel = z.infer<typeof paymentsHotelSchema>;
export declare const paymentsHotelInsertSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        rejected: "rejected";
        submitted: "submitted";
        confirmed: "confirmed";
    }>>>>;
    type: z.ZodOptional<z.ZodEnum<{
        receive_commission_from_cash: "receive_commission_from_cash";
        repay_net_from_online: "repay_net_from_online";
        restaurant_booking_commission: "restaurant_booking_commission";
    }>>;
    hotelId: z.ZodOptional<z.ZodString>;
    bookingId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    restaurantBookingId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    amount: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    paid: z.ZodOptional<z.ZodBoolean>;
    paidAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    proof: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    bankName: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    referenceId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    rejectionReason: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.core.$strip>;
export declare const paymentsHotelUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        rejected: "rejected";
        submitted: "submitted";
        confirmed: "confirmed";
    }>>>>>;
    type: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        receive_commission_from_cash: "receive_commission_from_cash";
        repay_net_from_online: "repay_net_from_online";
        restaurant_booking_commission: "restaurant_booking_commission";
    }>>>;
    hotelId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bookingId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    restaurantBookingId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    amount: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dueDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>>;
    paid: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    paidAt: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>>;
    proof: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>>;
    bankName: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>>;
    referenceId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>>;
    rejectionReason: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>>;
}, z.core.$strip>;
export type PaymentsHotelUpdate = z.infer<typeof paymentsHotelUpdateSchema>;
export declare const paymentsHotelWithRelationsSchema: z.ZodObject<{
    id: z.ZodString;
    hotelId: z.ZodString;
    bookingId: z.ZodNullable<z.ZodString>;
    restaurantBookingId: z.ZodNullable<z.ZodString>;
    organizationId: z.ZodString;
    type: z.ZodEnum<{
        receive_commission_from_cash: "receive_commission_from_cash";
        repay_net_from_online: "repay_net_from_online";
        restaurant_booking_commission: "restaurant_booking_commission";
    }>;
    amount: z.ZodString;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    paid: z.ZodBoolean;
    paidAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    proof: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bankName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    referenceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        rejected: "rejected";
        submitted: "submitted";
        confirmed: "confirmed";
    }>>>;
    rejectionReason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type PaymentsHotelWithRelations = z.infer<typeof paymentsHotelWithRelationsSchema>;
export declare const paymentsHotelQueryParamsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    search: z.ZodOptional<z.ZodString>;
    hotelId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        receive_commission_from_cash: "receive_commission_from_cash";
        repay_net_from_online: "repay_net_from_online";
        restaurant_booking_commission: "restaurant_booking_commission";
    }>>;
    paid: z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
    dueDateFrom: z.ZodOptional<z.ZodString>;
    dueDateTo: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodString>;
    dateTo: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        rejected: "rejected";
        submitted: "submitted";
        confirmed: "confirmed";
    }>>;
}, z.core.$strip>;
export type PaymentsHotelQueryParams = z.infer<typeof paymentsHotelQueryParamsSchema>;

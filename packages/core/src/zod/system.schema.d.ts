import { z } from "zod";
export declare const checkUserTypeSchema: z.ZodObject<{
    userType: z.ZodEnum<{
        user: "user";
        hotelOwner: "hotelOwner";
        systemAdmin: "systemAdmin";
    }>;
    setup: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;

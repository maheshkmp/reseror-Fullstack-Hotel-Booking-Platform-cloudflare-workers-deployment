import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  stringIdParamSchema,
} from "@/lib/helpers";
import {
  influencerInsertSchema,
  influencerSchema,
  influencerUpdateSchema,
  affiliateUsageSchema,
} from "core/zod";

const tags: string[] = ["Affiliate"];

export const validatePromoCodeRoute = createRoute({
  tags,
  summary: "Validate promo code",
  path: "/validate/:code",
  method: "get",
  request: {
    params: z.object({
      code: z.string().min(1, "Code is required"),
    }),
    query: z.object({
      fingerprint: z.string().optional(),
      hotelId: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        valid: z.boolean(),
        influencerId: z.string(),
        promoCode: z.string(),
        discountRate: z.string(),
        discountCap: z.string().nullable(),
        minBookingValue: z.string().nullable(),
        isHotelPromo: z.boolean().optional(),
      }),
      "Validation results"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Promo code not found or inactive"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Promo code usage error (e.g. expired, limit reached)"
    ),
  },
});

export const exportPayoutsReportRoute = createRoute({
  tags,
  summary: "Export payouts report as CSV",
  method: "get",
  path: "/report/payouts",
  responses: {
    [HttpStatusCodes.OK]: {
      description: "CSV file of payouts",
      content: {
        "text/csv": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  },
});

export const listInfluencersRoute = createRoute({
  tags,
  summary: "List influencers",
  path: "/influencers",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(influencerSchema),
      "List of influencers"
    ),
  },
});

export const createInfluencerRoute = createRoute({
  tags,
  summary: "Create influencer",
  path: "/influencers",
  method: "post",
  request: {
    body: jsonContentRequired(influencerInsertSchema, "Influencer data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      influencerSchema,
      "Created influencer"
    ),
  },
});

export const listAffiliateUsageRoute = createRoute({
  tags,
  summary: "List affiliate usage",
  path: "/usage",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(affiliateUsageSchema),
      "List of affiliate usage"
    ),
  },
});

export const payoutAffiliateUsageRoute = createRoute({
  tags,
  summary: "Mark affiliate usage as paid",
  path: "/usage/:id/payout",
  method: "post",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      affiliateUsageSchema,
      "Updated affiliate usage"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Usage record not found"
    ),
  },
});

export type ValidatePromoCodeRoute = typeof validatePromoCodeRoute;
export type ExportPayoutsReportRoute = typeof exportPayoutsReportRoute;
export type ListInfluencersRoute = typeof listInfluencersRoute;
export type CreateInfluencerRoute = typeof createInfluencerRoute;
export type ListAffiliateUsageRoute = typeof listAffiliateUsageRoute;
export type PayoutAffiliateUsageRoute = typeof payoutAffiliateUsageRoute;

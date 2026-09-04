import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { APIRouteHandler } from "@/types";
import { influencers, affiliateUsage } from "core/database/schema";
import type {
  ValidatePromoCodeRoute,
  ListInfluencersRoute,
  CreateInfluencerRoute,
  ListAffiliateUsageRoute,
  PayoutAffiliateUsageRoute,
  ExportPayoutsReportRoute,
} from "../routes/affiliate.routes";
import { roomBookings } from "core/database/schema";

export const validatePromoCodeHandler: APIRouteHandler<
  ValidatePromoCodeRoute
> = async (c) => {
  const { code } = c.req.valid("param");
  const { fingerprint } = c.req.valid("query");
  const db = c.get("db");
  const user = c.get("user");
  const { ads: adsTable } = await import("core/database/schema");

  // 1. Try Influencer / Affiliate codes first
  const influencer = await db.query.influencers.findFirst({
    where: and(
      eq(influencers.promoCode, code),
      eq(influencers.isActive, true)
    ),
  });

  if (influencer) {
    // Check expiration
    if (influencer.expiresAt && new Date(influencer.expiresAt) < new Date()) {
      return c.json(
        { message: "Promo code has expired" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Check usage limit
    if (influencer.usageLimit && (influencer.usageCount || 0) >= influencer.usageLimit) {
      return c.json(
        { message: "Promo code usage limit reached" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Check self-use fraud rule
    if (user && influencer.userId === user.id) {
      return c.json(
        { message: "Cannot use your own influencer code" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Check fingerprint fraud rule (limit usage from same device)
    if (fingerprint) {
      const existingUsageOnDevice = await db
        .select({ count: sql<number>`count(*)` })
        .from(roomBookings)
        .where(
          and(
            eq(roomBookings.promoCode, code),
            eq(roomBookings.browserFingerprint, fingerprint)
          )
        );

      if (Number(existingUsageOnDevice[0]?.count || 0) >= 2) {
        return c.json(
          { message: "Promo code use limit exceeded for this device" },
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    return c.json(
      {
        valid: true,
        influencerId: influencer.id,
        promoCode: influencer.promoCode,
        discountRate: influencer.discountRate || "5.00",
        discountCap: influencer.discountCap || null,
        minBookingValue: influencer.minBookingValue || "0.00",
        isHotelPromo: false,
      },
      HttpStatusCodes.OK
    );
  }

  // 2. Try Ads / Hotel Owner codes if no influencer found
  const adRecord = await db.query.ads.findFirst({
    where: and(
      eq(adsTable.promoCode, code),
      eq(adsTable.isActive, true)
    ),
  });

  if (adRecord) {
    // Check expiration if dates are set
    const now = new Date();
    if (adRecord.startDate && new Date(adRecord.startDate) > now) {
      return c.json({ message: "Promo code not yet active" }, HttpStatusCodes.BAD_REQUEST);
    }
    if (adRecord.endDate && new Date(adRecord.endDate) < now) {
      return c.json({ message: "Promo code has expired" }, HttpStatusCodes.BAD_REQUEST);
    }

    // Check usage limit
    if (adRecord.usageLimit && (adRecord.usageCount || 0) >= adRecord.usageLimit) {
      return c.json({ message: "Promo code total usage limit reached" }, HttpStatusCodes.BAD_REQUEST);
    }

    // Check unique usage per user if enabled
    const { hotelId: queryHotelId, fingerprint } = c.req.valid("query");
    
    if (adRecord.isUniquePerUser) {
      let alreadyUsed = false;
      
      // Check by user ID if logged in
      if (user) {
        const usage = await db.query.roomBookings.findFirst({
          where: and(
            eq(roomBookings.promoCode, code),
            eq(roomBookings.createdBy, user.id)
          ),
        });
        if (usage) alreadyUsed = true;
      } 
      
      // Also check by fingerprint to prevent anonymous reuse
      if (!alreadyUsed && fingerprint) {
        const usageOnDevice = await db
          .select({ count: sql<number>`count(*)` })
          .from(roomBookings)
          .where(
            and(
              eq(roomBookings.promoCode, code),
              eq(roomBookings.browserFingerprint, fingerprint)
            )
          );
        if (Number(usageOnDevice[0]?.count || 0) >= 1) alreadyUsed = true;
      }

      if (alreadyUsed) {
        return c.json(
          { message: "You have already used this promo code" },
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    // Check Hotel Specificity
    if (adRecord.hotelId && queryHotelId && adRecord.hotelId !== queryHotelId) {
       return c.json({ message: "This promo code is not valid for this hotel" }, HttpStatusCodes.BAD_REQUEST);
    }

    return c.json(
      {
        valid: true,
        influencerId: "", 
        promoCode: adRecord.promoCode!,
        discountRate: adRecord.discountPercent || "0.00",
        discountCap: null,
        minBookingValue: adRecord.minBookingValue || "0.00",
        isHotelPromo: !!adRecord.hotelId,
      },
      HttpStatusCodes.OK
    );
  }

  return c.json(
    { message: "Invalid or inactive promo code" },
    HttpStatusCodes.NOT_FOUND
  );
};

export const exportPayoutsReportHandler: APIRouteHandler<ExportPayoutsReportRoute> = async (c) => {
  const db = c.get("db");
  
  const records = await db.query.affiliateUsage.findMany({
    with: {
      influencer: true,
    } as any,
  });

  const header = "ID,Influencer,Promo Code,Commission,Discount,Status,Payout Date,Created At\n";
  const rows = records.map((r: any) => {
    return [
      r.id,
      r.influencer?.name || "N/A",
      r.influencer?.promoCode || "N/A",
      r.commissionAmount,
      r.discountAmount,
      r.status,
      r.payoutDate ? new Date(r.payoutDate).toLocaleDateString() : "N/A",
      new Date(r.createdAt).toLocaleDateString(),
    ].join(",");
  }).join("\n");

  const csv = header + rows;

  c.header("Content-Type", "text/csv");
  c.header("Content-Disposition", "attachment; filename=payout_report.csv");
  
  return c.body(csv) as any;
};

export const listInfluencersHandler: APIRouteHandler<ListInfluencersRoute> = async (c) => {
  const db = c.get("db");
  const result = await db.query.influencers.findMany();
  return c.json(result as any, HttpStatusCodes.OK);
};

export const createInfluencerHandler: APIRouteHandler<CreateInfluencerRoute> = async (c) => {
  const body = c.req.valid("json");
  const db = c.get("db");

  const [inserted] = await db
    .insert(influencers)
    .values(body as any)
    .returning();

  return c.json(inserted as any, HttpStatusCodes.CREATED);
};

export const listAffiliateUsageHandler: APIRouteHandler<ListAffiliateUsageRoute> = async (c) => {
  const db = c.get("db");
  const result = await db.query.affiliateUsage.findMany();
  return c.json(result as any, HttpStatusCodes.OK);
};

export const payoutAffiliateUsageHandler: APIRouteHandler<PayoutAffiliateUsageRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");

  const [updated] = await db
    .update(affiliateUsage)
    .set({
      status: "paid",
      payoutDate: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(affiliateUsage.id, id))
    .returning();

  if (!updated) {
    return c.json(
      { message: "Usage record not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated as any, HttpStatusCodes.OK);
};

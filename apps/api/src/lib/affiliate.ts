import { and, eq, sql } from "drizzle-orm";
import { affiliateUsage, influencers, roomBookings } from "core/database/schema";
import type { Database } from "core/database";

export async function recordAffiliateUsage(db: any, bookingId: string) {
  // 1. Get the booking details
  const booking = await db.query.roomBookings.findFirst({
    where: eq(roomBookings.id, bookingId),
  });

  if (!booking || !booking.influencerId || !booking.promoCode) {
    return;
  }

  // 2. Check if usage already exists to avoid duplicates
  const existing = await db.query.affiliateUsage.findFirst({
    where: eq(affiliateUsage.bookingId, bookingId),
  });

  if (existing) {
    return;
  }

  // 3. Get the influencer details
  const influencer = await db.query.influencers.findFirst({
    where: eq(influencers.id, booking.influencerId),
  });

  if (!influencer) {
    return;
  }

  // 4. Calculate influencer commission
  // User clarified: "calculated commission (separate from discount)"
  // I'll calculate it based on the final total amount paid by the user
  const totalAmount = parseFloat(booking.totalAmount || "0");
  const commissionRate = parseFloat(influencer.commissionRate || "0");
  const commissionAmount = (totalAmount * commissionRate) / 100;

  // 5. Create the usage record
  await db.insert(affiliateUsage).values({
    bookingId,
    influencerId: influencer.id,
    userId: booking.createdBy,
    commissionAmount: commissionAmount.toString(),
    discountAmount: booking.discountAmount || "0",
    status: "pending",
  });

  // 6. Increment influencer usage count
  await db.update(influencers)
    .set({
      usageCount: sql`${influencers.usageCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(influencers.id, influencer.id));
}

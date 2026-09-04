import { and, eq } from "drizzle-orm";
import { hotels, paymentsHotel, roomBookings } from "core/database/schema";

/**
 * Automatically creates or updates a payment record in payments_hotel based on a room booking.
 * This ensures the Hotel Owner dashboard reflects confirmed bookings in their Ledger.
 */
export async function syncBookingPaymentRecord(db: any, bookingId: string) {
  // 1. Get the booking details
  const booking = await db.query.roomBookings.findFirst({
    where: eq(roomBookings.id, bookingId),
  });

  if (!booking) {
    console.error(`[PAYMENT_SYNC] Booking not found: ${bookingId}`);
    return;
  }

  // 2. Clear record if cancelled or pending (unless already paid)
  // We only delete UNPAID records to prevent data loss on actual transactions.
  if (booking.status === "cancelled" || booking.status === "pending") {
    await db.delete(paymentsHotel).where(
      and(
        eq(paymentsHotel.bookingId, bookingId),
        eq(paymentsHotel.paid, false)
      )
    );
    console.log(`[PAYMENT_SYNC] Removed payment record for booking: ${bookingId} (Status: ${booking.status})`);
    return;
  }

  // 3. Generate record for confirmed bookings
  if (booking.status === "confirmed") {
    const amount = booking.paymentType === "cash" 
      ? booking.commissionAmount 
      : booking.netPayableToHotel;
    
    const type = booking.paymentType === "cash" 
      ? "receive_commission_from_cash" 
      : "repay_net_from_online";

    if (!amount || parseFloat(amount) <= 0) {
      console.warn(`[PAYMENT_SYNC] Skipping sync for booking ${bookingId}: Amount is 0 or null`);
      return;
    }

    // Get organizationId (required for payments table)
    let organizationId = booking.organizationId;
    if (!organizationId) {
      const hotel = await db.query.hotels.findFirst({
        where: eq(hotels.id, booking.hotelId),
        columns: { organizationId: true }
      });
      organizationId = hotel?.organizationId;
    }

    if (!organizationId) {
      console.error(`[PAYMENT_SYNC] Could not resolve organizationId for booking: ${bookingId}`);
      return;
    }

    // Check if record already exists for this booking
    const existing = await db.query.paymentsHotel.findFirst({
      where: eq(paymentsHotel.bookingId, bookingId),
    });

    if (existing) {
      // If payment was already processed/paid, we do NOT change it automatically to avoid accounting errors
      if (existing.paid) {
        console.log(`[PAYMENT_SYNC] Skipping update for booking ${bookingId}: Payment record already marked as paid.`);
        return;
      }

      await db.update(paymentsHotel)
        .set({
          amount: amount.toString(),
          type,
          organizationId,
          // We keep the original createdAt or dueDate unless explicitly changing
        } as any)
        .where(eq(paymentsHotel.id, existing.id));
      
      console.log(`[PAYMENT_SYNC] Updated payment record for booking: ${bookingId}`);
    } else {
      await db.insert(paymentsHotel).values({
        hotelId: booking.hotelId,
        bookingId: booking.id,
        organizationId,
        type,
        amount: amount.toString(),
        paid: false,
        dueDate: booking.checkInDate, // Using check-in date as a default due date
      } as any);
      
      console.log(`[PAYMENT_SYNC] Created new payment record for booking: ${bookingId}`);
    }
  }
}

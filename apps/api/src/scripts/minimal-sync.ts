import { eq } from "drizzle-orm";
import { initDatabase } from "core/database";
import { roomBookings, paymentsHotel, hotels } from "core/database/schema";

async function minimalSync() {
  console.log("Starting minimal sync...");
  const db = initDatabase(process.env.DATABASE_URL!);
  const ids = ["3cb92144-d00b-445b-a475-22a4df71f1dc", "a67bbb5e-c729-434f-8c9b-f499daa7c36c"];
  
  for (const id of ids) {
    const booking = await db.query.roomBookings.findFirst({ where: eq(roomBookings.id, id) });
    if (!booking) {
      console.log(`Booking ${id} not found`);
      continue;
    }
    
    if (booking.status !== 'confirmed') {
      console.log(`Booking ${id} is not confirmed (status: ${booking.status})`);
      continue;
    }
    
    const amount = booking.paymentType === "cash" ? booking.commissionAmount : booking.netPayableToHotel;
    const type = booking.paymentType === "cash" ? "receive_commission_from_cash" : "repay_net_from_online";
    
    let orgId = booking.organizationId;
    if (!orgId) {
      const h = await db.query.hotels.findFirst({ 
        where: eq(hotels.id, booking.hotelId),
        columns: { organizationId: true } 
      });
      orgId = h?.organizationId ?? null;
    }
    
    if (orgId && amount && parseFloat(amount.toString()) > 0) {
       // Manual insert check
       const existing = await db.query.paymentsHotel.findFirst({
         where: eq(paymentsHotel.bookingId, id)
       });

       if (!existing) {
         await db.insert(paymentsHotel).values({
           hotelId: booking.hotelId,
           bookingId: booking.id,
           organizationId: orgId,
           type,
           amount: amount.toString(),
           paid: false,
           dueDate: booking.checkInDate,
         } as any);
         console.log(`Successfully synced booking: ${id}`);
       } else {
         console.log(`Booking ${id} already has a payment record.`);
       }
    } else {
      console.log(`Skipping sync for ${id}: missing orgId (${orgId}) or amount (${amount})`);
    }
  }
  console.log("Minimal sync complete.");
  process.exit(0);
}

minimalSync().catch(console.error);

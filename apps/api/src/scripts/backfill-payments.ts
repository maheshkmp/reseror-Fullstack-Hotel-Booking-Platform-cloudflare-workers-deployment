import { eq } from "drizzle-orm";
import { initDatabase } from "core/database";
import { roomBookings, paymentsHotel } from "core/database/schema";
import { syncBookingPaymentRecord } from "../lib/payments";
import "dotenv/config";

async function backfill() {
  console.log("--- Payment Sync Backfill ---");
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  
  const db = initDatabase(dbUrl);
  
  // 1. Find all confirmed bookings
  const confirmedBookings = await db.query.roomBookings.findMany({
    where: eq(roomBookings.status, "confirmed"),
  });
  
  console.log(`Found ${confirmedBookings.length} confirmed bookings.`);
  
  // 2. Iterate and sync
  let syncCount = 0;
  for (const booking of confirmedBookings) {
    try {
      // Check if payment already exists to avoid redundant logs/processing
      const existing = await db.query.paymentsHotel.findFirst({
        where: eq(paymentsHotel.bookingId, booking.id),
      });
      
      if (!existing) {
        await syncBookingPaymentRecord(db, booking.id);
        syncCount++;
      }
    } catch (err) {
      console.error(`Failed to sync booking ${booking.id}:`, err);
    }
  }
  
  console.log(`Backfill complete. Synced ${syncCount} missing records.`);
  process.exit(0);
}

backfill().catch(err => {
  console.error(err);
  process.exit(1);
});

import { eq } from "drizzle-orm";
import { initDatabase } from "core/database";
import { roomBookings, paymentsHotel } from "core/database/schema";

async function diagnose() {
  console.log("--- Payment Sync Diagnostic ---");
  
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
  
  // 2. Find matching payment records
  const paymentRecords = await db.query.paymentsHotel.findMany();
  console.log(`Found ${paymentRecords.length} total payment records.`);
  
  const bookingsWithPayments = paymentRecords.map(p => p.bookingId).filter(Boolean);
  
  const missingPayments = confirmedBookings.filter(b => !bookingsWithPayments.includes(b.id));
  
  console.log(`Confirmed bookings missing payment records: ${missingPayments.length}`);
  
  if (missingPayments.length > 0) {
    console.log("Sample missing booking IDs:", missingPayments.slice(0, 5).map(b => b.id));
  }
  
  process.exit(0);
}

diagnose().catch(err => {
  console.error(err);
  process.exit(1);
});

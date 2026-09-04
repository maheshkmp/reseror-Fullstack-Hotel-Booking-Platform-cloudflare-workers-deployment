import { initDatabase } from 'core/database';
import { eq } from 'drizzle-orm';
import { roomBookings } from 'core/database/schema';
import { syncBookingPaymentRecord } from '../lib/payments';

async function forceSync() {
  const db = initDatabase(process.env.DATABASE_URL!);
  const ids = ['658c92a8-2024-43cb-9870-26c758309973', '66b75281-619f-4954-baa8-24b6c87b5ec4'];
  
  for (const id of ids) {
    const booking = await db.query.roomBookings.findFirst({ where: eq(roomBookings.id, id) });
    if (!booking) {
      console.log(`Booking ${id} not found`);
      continue;
    }

    console.log(`Updating booking ${id} status to 'confirmed'...`);
    await db.update(roomBookings).set({ status: 'confirmed' }).where(eq(roomBookings.id, id));
    
    console.log(`Syncing payment record for ${id}...`);
    await syncBookingPaymentRecord(db, id);
    console.log(`Successfully confirmed and synced: ${id}`);
  }
  process.exit(0);
}

forceSync().catch(console.error);

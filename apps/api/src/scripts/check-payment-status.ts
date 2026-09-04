import { initDatabase } from 'core/database';
import { paymentsHotel } from 'core/database/schema';

async function checkStatus() {
  const db = initDatabase(process.env.DATABASE_URL!);
  const p = await db.query.paymentsHotel.findMany();
  console.log('Current Payments Status:', JSON.stringify(p.map(h => ({id: h.id, status: h.status, paid: h.paid})), null, 2));
  process.exit(0);
}

checkStatus().catch(console.error);

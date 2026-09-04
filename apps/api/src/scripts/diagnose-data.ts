import { initDatabase } from 'core/database';
import { eq } from 'drizzle-orm';
import { member, hotels, roomBookings, paymentsHotel } from 'core/database/schema';

async function diagnose() {
  const db = initDatabase(process.env.DATABASE_URL!);
  const userId = 'DejTEM8riwTomlXRkcWkCudIhcnWU7aE';
  
  const memberships = await db.query.member.findMany({
    where: eq(member.userId, userId)
  });
  console.log('Memberships:', JSON.stringify(memberships, null, 2));

  if (memberships.length > 0) {
    const orgId = memberships[0].organizationId;
    const hotelList = await db.query.hotels.findMany({
      where: eq(hotels.organizationId, orgId)
    });
    console.log('Hotels in Org:', JSON.stringify(hotelList.map(h => ({id: h.id, name: h.name})), null, 2));

    if (hotelList.length > 0) {
      for (const hotel of hotelList) {
        const bookings = await db.query.roomBookings.findMany({
          where: eq(roomBookings.hotelId, hotel.id)
        });
        console.log(`Bookings for Hotel ${hotel.name}:`, JSON.stringify(bookings.map(b => ({id: b.id, status: b.status, amount: b.totalAmount})), null, 2));

        const payments = await db.query.paymentsHotel.findMany({
          where: eq(paymentsHotel.hotelId, hotel.id)
        });
        console.log(`Payments for Hotel ${hotel.name}:`, payments.length);
        
        if (payments.length > 0) {
            console.log('Sample Payment:', JSON.stringify(payments[0], null, 2));
        }
      }
    }
  } else {
    console.log('No memberships found for user');
  }

  const allPayments = await db.query.paymentsHotel.findMany();
  console.log('Total Payments in DB:', allPayments.length);
  if (allPayments.length > 0) {
      console.log('Sample Payments IDs:', JSON.stringify(allPayments.map(p => ({id: p.id, hotelId: p.hotelId, orgId: p.organizationId})).slice(0, 5), null, 2));
  }

  process.exit(0);
}

diagnose().catch(console.error);

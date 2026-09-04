import { initDatabase } from "core/database";
import { hotels } from "core/database/schema";
import { eq, isNull } from "drizzle-orm";
import { toKebabCase } from "@/lib/helpers";

const db = initDatabase(process.env.DATABASE_URL!);

async function populateSlugs() {
  console.log("Fetching hotels with null slugs...");
  const hotelsList = await db.query.hotels.findMany({
    where: isNull(hotels.slug),
  });

  console.log(`Found ${hotelsList.length} hotels to update.`);

  for (const hotel of hotelsList) {
    const slug = toKebabCase(hotel.name);
    console.log(`Updating hotel: ${hotel.name} -> ${slug}`);
    
    // Check if slug already exists (simple avoidance for now)
    await db.update(hotels)
      .set({ slug })
      .where(eq(hotels.id, hotel.id));
  }

  console.log("Finished populating slugs.");
  process.exit(0);
}

populateSlugs().catch(err => {
  console.error("Failed to populate slugs:", err);
  process.exit(1);
});

import { initDatabase, getDatabase } from "core/database";
import { user, organization, hotels, rooms } from "core/database/schema";
import { eq } from "drizzle-orm";

async function checkIds() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("No DATABASE_URL");
    
    initDatabase(dbUrl);
    const db = getDatabase();

    const userId = "QfVhxRYBIxJRLduhEDy7RDkiHW8mQmJE";
    const hotelId = "383a4665-0205-4798-9fa1-0501b9450843";
    const roomId = "7f9c249a-1be0-435d-9968-98bbf23d04f1";

    console.log("Checking IDs...");
    
    const [foundUser] = await db.select().from(user).where(eq(user.id, userId));
    console.log("User:", foundUser ? "Found" : "NOT FOUND");

    const [foundHotel] = await db.select().from(hotels).where(eq(hotels.id, hotelId));
    console.log("Hotel:", foundHotel ? "Found" : "NOT FOUND");

    const [foundRoom] = await db.select().from(rooms).where(eq(rooms.id, roomId));
    console.log("Room:", foundRoom ? "Found" : "NOT FOUND");

    const [emptyOrg] = await db.select().from(organization).where(eq(organization.id, ""));
    console.log("Empty string Org:", emptyOrg ? "Found" : "NOT FOUND");

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkIds();

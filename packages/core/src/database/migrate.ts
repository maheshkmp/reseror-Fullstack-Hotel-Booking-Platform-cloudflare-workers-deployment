import { migrate as migrateNeon } from "drizzle-orm/neon-http/migrator";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";

import { initDatabase } from "./index";

// Database type support: matches DB_TYPE from index.ts
const DB_TYPE = (process.env.DB_TYPE || "neon") as "neon" | "postgres";

const main = async () => {
  try {
    const db = initDatabase(process.env.DATABASE_URL!);

    // Use appropriate migrator based on database type
    if (DB_TYPE === "neon") {
      console.log("Running migrations for Neon...");
      await migrateNeon(db as any, { migrationsFolder: "src/database/migrations" });
    } else {
      console.log("Running migrations for PostgreSQL...");
      await migratePostgres(db as any, { migrationsFolder: "src/database/migrations" });
    }

    console.log("✓ Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error during migration:", error);
    process.exit(1);
  }
};

main();

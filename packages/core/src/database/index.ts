import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import dns from "node:dns";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

// Fix for Node/Bun inside Docker incorrectly attempting IPv6 for Neon HTTP URLs
dns.setDefaultResultOrder("ipv4first");
import { drizzle as drizzlePostgres, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// Database type support: 'neon' for serverless or 'postgres' for localhost/pgAdmin
const DB_TYPE = (process.env.DB_TYPE || "neon") as "neon" | "postgres";

// Database instance - supports both Neon and Postgres drivers
let db: (NeonHttpDatabase<typeof schema> & {
  $client: NeonQueryFunction<false, false>;
}) | PostgresJsDatabase<typeof schema>;

export type Database = typeof db;

/**
 * Initialize the database connection
 * Supports both Neon (serverless) and local PostgreSQL via postgres-js driver
 * @param databaseUrl - PostgreSQL connection string
 * @returns Initialized database instance
 */
export function initDatabase(databaseUrl: string) {
  if (db) {
    return db;
  }

  // Switch between Neon HTTP and PostgreSQL drivers based on DB_TYPE
  if (DB_TYPE === "neon") {
    // Neon: serverless PostgreSQL - uses HTTP driver
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema });
    console.log("Database initialized with Neon (serverless)");
  } else {
    // Postgres: local PostgreSQL or managed instance - uses postgres-js driver
    // Better for development/localhost and pgAdmin connections
    const client = postgres(databaseUrl);
    db = drizzlePostgres(client, { schema });
    console.log("Database initialized with PostgreSQL driver");
  }

  return db;
}

/**
 * Get the database instance
 * @returns Initialized database instance
 * @throws Error if database not initialized
 */
export function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized.");
  }

  return db;
}

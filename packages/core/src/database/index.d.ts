import { type NeonQueryFunction } from "@neondatabase/serverless";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
declare let db: (NeonHttpDatabase<typeof schema> & {
    $client: NeonQueryFunction<false, false>;
}) | PostgresJsDatabase<typeof schema>;
export type Database = typeof db;
/**
 * Initialize the database connection
 * Supports both Neon (serverless) and local PostgreSQL via postgres-js driver
 * @param databaseUrl - PostgreSQL connection string
 * @returns Initialized database instance
 */
export declare function initDatabase(databaseUrl: string): (NeonHttpDatabase<typeof schema> & {
    $client: NeonQueryFunction<false, false>;
}) | PostgresJsDatabase<typeof schema>;
/**
 * Get the database instance
 * @returns Initialized database instance
 * @throws Error if database not initialized
 */
export declare function getDatabase(): (NeonHttpDatabase<typeof schema> & {
    $client: NeonQueryFunction<false, false>;
}) | PostgresJsDatabase<typeof schema>;
export {};

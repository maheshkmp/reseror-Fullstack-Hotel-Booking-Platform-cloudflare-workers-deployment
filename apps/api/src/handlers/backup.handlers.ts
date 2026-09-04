import * as HttpStatusCodes from "stoker/http-status-codes";
import type { APIRouteHandler } from "@/types";
import { ExportBackupRoute, RestoreBackupRoute } from "../routes/backup.routes";
import * as schemas from "core/database/schema";
import { gzipSync } from "node:zlib";
import { getTableName, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

function getBackupTables() {
  const tables: Record<string, PgTable> = {};
  for (const [key, value] of Object.entries(schemas)) {
    try {
      // Exclude auth-related ephemeral tables explicitly
      if (["session", "account", "verification"].includes(key)) continue;

      if (value && typeof value === 'object' && getTableName(value as PgTable)) {
        tables[key] = value as PgTable;
      }
    } catch (e) {
      // Not a table
    }
  }
  return tables;
}

export const exportBackupHandler: APIRouteHandler<ExportBackupRoute> = async (c) => {
  try {
    const user = c.get("user");
    if (!user || user.role !== "admin") {
      return c.json({ message: "Unauthorized access" }, HttpStatusCodes.FORBIDDEN);
    }

    const db = c.get("db");
    const tables = getBackupTables();
    
    const dbData: Record<string, any[]> = {};
    
    for (const [key, tableObj] of Object.entries(tables)) {
      dbData[key] = await db.select().from(tableObj);
    }

    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      tables: dbData,
    };

    const jsonString = JSON.stringify(backupData);
    const compressedPayload = gzipSync(Buffer.from(jsonString, "utf-8"));

    const dateStr = new Date().toISOString().split("T")[0];
    
    // Set response headers for file download
    c.header("Content-Type", "application/gzip");
    c.header("Content-Disposition", `attachment; filename=reseror-backup-${dateStr}.json.gz`);
    c.header("Content-Length", compressedPayload.length.toString());

    return c.body(compressedPayload as any);
  } catch (error) {
    console.error("[BACKUP EXPORT ERROR]", error);
    return c.json({ message: "Failed to export backup" }, HttpStatusCodes.INTERNAL_SERVER_ERROR as any);
  }
};

export const restoreBackupHandler: APIRouteHandler<RestoreBackupRoute> = async (c) => {
  try {
    const user = c.get("user");
    if (!user || user.role !== "admin") {
      return c.json({ message: "Unauthorized access" }, HttpStatusCodes.FORBIDDEN);
    }

    const body = c.req.valid("json");
    const { mode, data } = body;

    if (!data || !data.version || !data.tables) {
      return c.json({ message: "Invalid backup format" }, HttpStatusCodes.BAD_REQUEST);
    }

    const db = c.get("db") as any; // Using any for transaction flexibility
    const tables = getBackupTables();
    
    const restoreStats: Record<string, number> = {};

    await db.transaction(async (tx: any) => {
        // Set session role to bypass row level security if any, or disable foreign key checks
        // However, Neon serverless might restrict session config. So we truncate cascades.
        
        if (mode === "full") {
            // Because of foreign keys, standard TRUNCATE requires CASCADE
            // We truncate all involved tables safely.
            const tableNames = Object.values(tables).map(t => getTableName(t)).join(", ");
            if (tableNames.length > 0) {
                 await tx.execute(sql.raw(`TRUNCATE TABLE ${tableNames} CASCADE`));
            }
        }

        // Insert logic
        for (const [key, rows] of Object.entries(data.tables)) {
            restoreStats[key] = 0;
            const tableObj = tables[key];
            
            if (!tableObj || !Array.isArray(rows) || rows.length === 0) continue;
            
            if (mode === "full") {
               // Batch inserts if too many rows
               const batchSize = 1000;
               for (let i = 0; i < rows.length; i += batchSize) {
                   const batch = rows.slice(i, i + batchSize);
                   await tx.insert(tableObj).values(batch);
               }
               restoreStats[key] = rows.length;
            } else if (mode === "merge") {
               // Merge logic: use ON CONFLICT DO NOTHING assuming mostly UUID primary keys
               // Drizzle onConflictDoNothing is table specific, so we can build raw query or try to insert
               const batchSize = 1000;
               for (let i = 0; i < rows.length; i += batchSize) {
                   const batch = rows.slice(i, i + batchSize);
                   await tx.insert(tableObj).values(batch).onConflictDoNothing();
               }
               restoreStats[key] = rows.length; 
            }
        }
    });

    return c.json({
      success: true,
      message: `Restore completed successfully in ${mode} mode`,
      restored: restoreStats,
    }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("[BACKUP RESTORE ERROR]", error);
    return c.json({ message: "Failed to restore backup" }, HttpStatusCodes.INTERNAL_SERVER_ERROR as any);
  }
};

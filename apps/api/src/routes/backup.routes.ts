import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema } from "@/lib/helpers";

const tags: string[] = ["Backup"];

export const exportBackupRoute = createRoute({
  tags,
  summary: "Export full database backup",
  method: "get",
  path: "/export",
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Gzipped JSON backup file",
      content: {
        "application/gzip": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

export const restoreBackupRoute = createRoute({
  tags,
  summary: "Restore database from backup",
  method: "post",
  path: "/restore",
  request: {
    body: jsonContentRequired(
      z.object({
        mode: z.enum(["full", "merge"]),
        data: z.object({
          version: z.string(),
          exportedAt: z.string(),
          tables: z.record(z.string(), z.array(z.any())),
        }),
      }),
      "Backup data and restore mode"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        message: z.string(),
        restored: z.record(z.string(), z.number()),
      }),
      "Restore results"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid backup format"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

export type ExportBackupRoute = typeof exportBackupRoute;
export type RestoreBackupRoute = typeof restoreBackupRoute;

'use server'

import { db } from "@/src/db";
import { backupLogs } from "@/src/db/schema";
import { desc } from "drizzle-orm";

export async function getBackupLogs(limit: number = 10) {
  try {
    const logs = await db.select().from(backupLogs).orderBy(desc(backupLogs.startedAt)).limit(limit);
    return { success: true, data: logs };
  } catch (error) {
    console.error("Failed to fetch backup logs", error);
    return { success: false, error: "Failed to fetch logs" };
  }
}

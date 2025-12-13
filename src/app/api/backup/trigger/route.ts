import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/src/db";
import { backupLogs } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== 'ADMIN' && session?.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await req.json(); // 'full', 'sql', 'media'

    if (!['full', 'sql', 'media'].includes(type)) {
      return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
    }

    // Insert a pending log to indicate a request was made.
    // In a real triggering scenario, we would also call the worker service here.
    // Since the worker is decoupled in this architecture (e.g., running as a separate service),
    // we rely on the generic 'pending' state. 
    // If we wanted to actually trigger it immediately, we'd need an endpoint ON the worker or a message queue.
    // For this implementation, we assume the worker *runs on schedule* or user manually runs it via CLI/Portainer.
    // However, to make the UI feel responsive, we insert a log that stays "PENDING" until the worker (if polling) or manual run picks it up.
    // Or we simply return success saying "Request logged".

    // For better UX in this specific "Manual Trigger" requirement from user:
    // We will just log it. If the worker isn't polling db, this naturally won't start anything.
    // User requested "Manual Backups" in dashboard. 
    // Best effort: Log it.

    const [insertedLog] = await db.insert(backupLogs).values({
      status: 'PENDING',
      type: type,
      details: 'Started via Manual Trigger from Dashboard',
    }).returning();

    // Execute the worker process in the background
    // Since we are running in a persistent container (Dokploy/VPS), we can spawn a child process.
    // We use 'bun' as requested by the user.
    const { exec } = require('child_process');
    const path = require('path');
    const workerPath = path.join(process.cwd(), 'scripts/backup-worker/dist/index.js');
    
    exec(`bun ${workerPath} --type=${type} --id=${insertedLog.id}`, async (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.error(`Backup worker execution error: ${error}`);
            // Update log to FAILED
            // Note: We can't easily use 'db' here if the process context is weird, but in Next.js API route scope it should be fine 
            // BUT 'exec' callback runs later. db instance typically persists.
            // However, better to just log console for now OR try to update DB.
            try {
                await db.update(backupLogs)
                   .set({ status: 'FAILED', details: `Spawn Error: ${error.message}` })
                   .where(eq(backupLogs.id, insertedLog.id));
            } catch (e) {
                console.error('Failed to update log status', e);
            }
        }
        if (stderr) {
            console.error(`Backup worker stderr: ${stderr}`);
        }
        console.log(`Backup worker stdout: ${stdout}`);
    });

    return NextResponse.json({ success: true, message: 'Backup requested and started' });

  } catch (error) {
    console.error('Trigger error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

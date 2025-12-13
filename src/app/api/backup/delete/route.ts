import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/src/db";
import { backupLogs } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { S3Client, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== 'ADMIN' && session?.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id, path: manifestPath, type } = await req.json();

    if (!id) {
        return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
    }

    // Initialize S3 Client
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CF_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
      },
    });

    // Delete from R2
    if (manifestPath) {
        // Extract timestamp from manifest path: backup/manifests/2025-12-13T04-52-40-946Z_manifest.json
        const timestamp = manifestPath.split('/')[2]?.replace('_manifest.json', '');
        
        if (timestamp) {
            // Delete SQL dump if this is a SQL or FULL backup
            if (type === 'sql' || type === 'full') {
                const sqlPath = `backup/sql/db_${timestamp}.dump`;
                try {
                    await s3Client.send(new DeleteObjectCommand({
                        Bucket: process.env.CF_BUCKET_NAME,
                        Key: sqlPath
                    }));
                    console.log(`Deleted SQL dump: ${sqlPath}`);
                } catch (err) {
                    console.error(`Failed to delete SQL dump: ${sqlPath}`, err);
                }
            }

            // Delete media files if this is a MEDIA or FULL backup
            if (type === 'media' || type === 'full') {
                const mediaPrefix = `backup/media/${timestamp}/`;
                let continuationToken: string | undefined = undefined;
                
                try {
                    do {
                        const listCmd: ListObjectsV2Command = new ListObjectsV2Command({
                            Bucket: process.env.CF_BUCKET_NAME,
                            Prefix: mediaPrefix,
                            ContinuationToken: continuationToken
                        });
                        const listRes = await s3Client.send(listCmd);
                        
                        if (listRes.Contents && listRes.Contents.length > 0) {
                            const deleteCmd = new DeleteObjectsCommand({
                                Bucket: process.env.CF_BUCKET_NAME,
                                Delete: {
                                    Objects: listRes.Contents.map(c => ({ Key: c.Key }))
                                }
                            });
                            await s3Client.send(deleteCmd);
                            console.log(`Deleted ${listRes.Contents.length} media files from ${mediaPrefix}`);
                        }
                        continuationToken = listRes.NextContinuationToken;
                    } while (continuationToken);
                } catch (err) {
                    console.error(`Failed to delete media files: ${mediaPrefix}`, err);
                }
            }

            // Delete the manifest file itself
            try {
                await s3Client.send(new DeleteObjectCommand({
                    Bucket: process.env.CF_BUCKET_NAME,
                    Key: manifestPath
                }));
                console.log(`Deleted manifest: ${manifestPath}`);
            } catch (err) {
                console.error(`Failed to delete manifest: ${manifestPath}`, err);
            }
        }
    }

    // Delete from DB
    await db.delete(backupLogs).where(eq(backupLogs.id, id));

    return NextResponse.json({ success: true, message: 'Backup deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

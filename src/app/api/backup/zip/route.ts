import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Readable } from 'stream';
import archiver from 'archiver';
import { s3Client, getBucketName } from "@/src/lib/utils/s3Client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== 'ADMIN' && session?.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sqlPath = searchParams.get('sql');
    const mediaPrefix = searchParams.get('media');
    const timestamp = searchParams.get('timestamp') || new Date().toISOString().replace(/[:.]/g, '-');

    if (!sqlPath && !mediaPrefix) {
      return NextResponse.json({ success: false, message: 'Missing backup paths' }, { status: 400 });
    }

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Set up response headers for streaming zip
    const responseHeaders = new Headers({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="backup-${timestamp}.zip"`,
      'Cache-Control': 'no-cache',
    });

    // Create a transform stream to pipe archive to response
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // Pipe archive to the writable stream
    archive.on('data', (chunk) => {
      writer.write(chunk);
    });

    archive.on('end', () => {
      writer.close();
    });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      writer.abort(err);
    });

    // Start archiving in the background
    (async () => {
      try {
        // Add SQL dump if provided
        if (sqlPath) {
          const sqlCommand = new GetObjectCommand({
            Bucket: process.env.CF_BUCKET_NAME,
            Key: sqlPath,
          });
          const sqlResponse = await s3Client.send(sqlCommand);
          
          if (sqlResponse.Body) {
            const sqlStream = sqlResponse.Body as Readable;
            archive.append(sqlStream, { name: `database/${sqlPath.split('/').pop()}` });
          }
        }

        // Add media files if provided
        if (mediaPrefix) {
          let continuationToken: string | undefined = undefined;
          
          do {
            const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
              Bucket: process.env.CF_BUCKET_NAME,
              Prefix: mediaPrefix,
              ContinuationToken: continuationToken,
            });
            
            const listResponse = await s3Client.send(listCommand);
            
            if (listResponse.Contents) {
              for (const item of listResponse.Contents) {
                if (item.Key) {
                  const getCommand = new GetObjectCommand({
                    Bucket: process.env.CF_BUCKET_NAME,
                    Key: item.Key,
                  });
                  
                  const fileResponse = await s3Client.send(getCommand);
                  
                  if (fileResponse.Body) {
                    const fileStream = fileResponse.Body as Readable;
                    // Remove the backup prefix from the path for cleaner zip structure
                    const cleanPath = item.Key.replace(mediaPrefix, 'media/');
                    archive.append(fileStream, { name: cleanPath });
                  }
                }
              }
            }
            
            continuationToken = listResponse.NextContinuationToken;
          } while (continuationToken);
        }

        // Finalize the archive
        await archive.finalize();
      } catch (error) {
        console.error('Error creating zip:', error);
        archive.destroy();
      }
    })();

    return new Response(readable, {
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Zip download error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

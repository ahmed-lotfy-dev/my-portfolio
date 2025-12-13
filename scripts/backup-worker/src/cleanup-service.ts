import { Client } from 'pg';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

export class CleanupService {
  private pgClient: Client;
  private s3Client: S3Client;
  private bucket: string;

  constructor(private config: {
    databaseUrl: string;
    cfAccountId: string;
    cfAccessKeyId: string;
    cfSecretAccessKey: string;
    cfBucketName: string;
  }) {
    this.pgClient = new Client({ connectionString: config.databaseUrl });
    this.bucket = config.cfBucketName;
    this.s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${config.cfAccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.cfAccessKeyId,
        secretAccessKey: config.cfSecretAccessKey,
      },
    });
  }

  async cleanupOldBackups(keepCount: number = 3) {
    console.log(`[Cleanup] Starting cleanup, keeping ${keepCount} most recent backups...`);
    
    await this.pgClient.connect();

    try {
      // Get all successful backups ordered by completion time (newest first)
      const result = await this.pgClient.query(
        `SELECT id, path, "completed_at" 
         FROM "backup_logs" 
         WHERE status = 'SUCCESS' 
         ORDER BY "completed_at" DESC`
      );

      const allBackups = result.rows;
      console.log(`[Cleanup] Found ${allBackups.length} successful backups`);

      if (allBackups.length <= keepCount) {
        console.log(`[Cleanup] No cleanup needed. Have ${allBackups.length}, keeping ${keepCount}`);
        return { deleted: 0, kept: allBackups.length };
      }

      // Backups to delete (everything after the first keepCount)
      const backupsToDelete = allBackups.slice(keepCount);
      console.log(`[Cleanup] Will delete ${backupsToDelete.length} old backups`);

      let deletedCount = 0;

      for (const backup of backupsToDelete) {
        try {
          // Extract timestamp from manifest path (e.g., "backup/manifests/2025-12-13T06-16-01-889Z_manifest.json")
          const manifestPath = backup.path;
          const timestamp = manifestPath?.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/)?.[1];

          if (!timestamp) {
            console.warn(`[Cleanup] Could not extract timestamp from path: ${manifestPath}`);
            continue;
          }

          // List all objects with this timestamp prefix
          const prefixes = [
            `backup/sql/db_${timestamp}`,
            `backup/media/${timestamp}/`,
            `backup/manifests/${timestamp}_manifest.json`
          ];

          const objectsToDelete: string[] = [];

          for (const prefix of prefixes) {
            const listCommand = new ListObjectsV2Command({
              Bucket: this.bucket,
              Prefix: prefix,
            });

            const listResponse = await this.s3Client.send(listCommand);
            
            if (listResponse.Contents && listResponse.Contents.length > 0) {
              objectsToDelete.push(...listResponse.Contents.map(obj => obj.Key!));
            }
          }

          // Delete objects from R2
          if (objectsToDelete.length > 0) {
            console.log(`[Cleanup] Deleting ${objectsToDelete.length} objects for backup ${backup.id}`);
            
            const deleteCommand = new DeleteObjectsCommand({
              Bucket: this.bucket,
              Delete: {
                Objects: objectsToDelete.map(key => ({ Key: key })),
                Quiet: true,
              },
            });

            await this.s3Client.send(deleteCommand);
          }

          // Delete backup log from database
          await this.pgClient.query(
            `DELETE FROM "backup_logs" WHERE id = $1`,
            [backup.id]
          );

          deletedCount++;
          console.log(`[Cleanup] Deleted backup ${backup.id} (${backup.completed_at})`);

        } catch (error) {
          console.error(`[Cleanup] Error deleting backup ${backup.id}:`, error);
          // Continue with other backups even if one fails
        }
      }

      console.log(`[Cleanup] Completed. Deleted ${deletedCount} backups, kept ${keepCount}`);
      return { deleted: deletedCount, kept: keepCount };

    } finally {
      await this.pgClient.end();
    }
  }
}

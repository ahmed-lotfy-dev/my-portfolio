import { Client } from 'pg';
import { SqlService } from './sql-service';
import { MediaService } from './media-service';
import * as fs from 'fs/promises';
import { createReadStream } from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Simple Manifest Interface (Duplicated from shared to avoid import issues in standalone worker, or usage of path aliases)
interface BackupManifest {
  version: string;
  timestamp: string;
  type: string;
  environment: string;
  checksums: { sql_dump?: string; };
  stats: {
    media_objects_count: number;
    media_total_size_bytes: number;
    sql_dump_size_bytes: number;
    duration_ms: number;
  };
  details?: any;
}

export class Orchestrator {
  private sqlService: SqlService;
  private mediaService: MediaService;
  private databaseUrl: string;
  private s3Client: S3Client;
  private bucket: string;

  constructor(private config: {
    databaseUrl: string;
    cfAccountId: string;
    cfAccessKeyId: string;
    cfSecretAccessKey: string;
    cfBucketName: string;
  }) {
    this.databaseUrl = config.databaseUrl;
    this.sqlService = new SqlService(config.databaseUrl);
    this.mediaService = new MediaService({
      accountId: config.cfAccountId,
      accessKeyId: config.cfAccessKeyId,
      secretAccessKey: config.cfSecretAccessKey,
      bucketName: config.cfBucketName,
    });
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

  async run(type: 'full' | 'sql' | 'media', existingLogId?: string) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const tempDir = path.join(__dirname, '../temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Log Start in DB
    const pgClient = new Client({ connectionString: this.databaseUrl });
    await pgClient.connect();
    
    let logId = existingLogId;

    if (logId) {
        // Update existing log to running
        await pgClient.query(
            `UPDATE "backup_logs" SET status = 'RUNNING', "started_at" = NOW() WHERE id = $1`,
            [logId]
        );
    } else {
        // Create new log
        // Using raw query as we don't have drizzle in worker
        const logResult = await pgClient.query(
          `INSERT INTO "backup_logs" (id, status, type, "started_at") VALUES (gen_random_uuid(), 'RUNNING', $1, NOW()) RETURNING id`,
          [type]
        );
        logId = logResult.rows[0].id;
    }

    const stats = {
      media_objects_count: 0,
      media_total_size_bytes: 0,
      sql_dump_size_bytes: 0,
    };

    try {
      // 1. SQL Backup
      let sqlPath = '';
      if (type === 'full' || type === 'sql') {
        const dumpPath = path.join(tempDir, `db_${timestamp}.dump`);
        const result = await this.sqlService.dumpDatabase(dumpPath);
        stats.sql_dump_size_bytes = result.sizeBytes;
        
        // Upload Dump
        const fileStream = createReadStream(result.path);
        const destinationKey = `backup/sql/db_${timestamp}.dump`;
        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: destinationKey,
            Body: fileStream,
        }));
        sqlPath = destinationKey;
        
        // Clean up local dump
        await fs.unlink(result.path);
      }

      // 2. Media Backup
      if (type === 'full' || type === 'media') {
        const result = await this.mediaService.copyMediaToBackup(timestamp);
        stats.media_objects_count = result.count;
        stats.media_total_size_bytes = result.totalSize;
      }

      // 3. Manifest
      const duration = Date.now() - startTime;
      const manifest: BackupManifest = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        type,
        environment: process.env.NODE_ENV || 'production',
        checksums: {}, // TODO: Implement checksums
        stats: { ...stats, duration_ms: duration },
      };

      const manifestKey = `backup/manifests/${timestamp}_manifest.json`;
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: manifestKey,
        Body: JSON.stringify(manifest, null, 2),
        ContentType: "application/json",
      }));

      // Log Success
      await pgClient.query(
        `UPDATE "backup_logs" SET status = 'SUCCESS', "completed_at" = NOW(), path = $1, "size_bytes" = $2, details = $3 WHERE id = $4`,
        [manifestKey, stats.sql_dump_size_bytes + stats.media_total_size_bytes, JSON.stringify(stats), logId]
      );
      
      console.log(`[Backup] Completed successfully. Log ID: ${logId}`);

    } catch (error) {
      console.error("[Backup] Failed:", error);
      await pgClient.query(
        `UPDATE "backup_logs" SET status = 'FAILED', "completed_at" = NOW(), details = $1 WHERE id = $2`,
        [String(error), logId]
      );
      throw error;
    } finally {
      await pgClient.end();
      // Cleanup temp
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }
}

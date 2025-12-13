"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestrator = void 0;
const pg_1 = require("pg");
const sql_service_1 = require("./sql-service");
const media_service_1 = require("./media-service");
const fs = __importStar(require("fs/promises"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
class Orchestrator {
    config;
    sqlService;
    mediaService;
    databaseUrl;
    s3Client;
    bucket;
    constructor(config) {
        this.config = config;
        this.databaseUrl = config.databaseUrl;
        this.sqlService = new sql_service_1.SqlService(config.databaseUrl);
        this.mediaService = new media_service_1.MediaService({
            accountId: config.cfAccountId,
            accessKeyId: config.cfAccessKeyId,
            secretAccessKey: config.cfSecretAccessKey,
            bucketName: config.cfBucketName,
        });
        this.bucket = config.cfBucketName;
        this.s3Client = new client_s3_1.S3Client({
            region: "auto",
            endpoint: `https://${config.cfAccountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: config.cfAccessKeyId,
                secretAccessKey: config.cfSecretAccessKey,
            },
        });
    }
    async run(type, existingLogId) {
        const startTime = Date.now();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const tempDir = path.join(__dirname, '../temp');
        await fs.mkdir(tempDir, { recursive: true });
        // Log Start in DB
        const pgClient = new pg_1.Client({ connectionString: this.databaseUrl });
        await pgClient.connect();
        let logId = existingLogId;
        if (logId) {
            // Update existing log to running
            await pgClient.query(`UPDATE "backup_logs" SET status = 'RUNNING', "started_at" = NOW() WHERE id = $1`, [logId]);
        }
        else {
            // Create new log
            // Using raw query as we don't have drizzle in worker
            const logResult = await pgClient.query(`INSERT INTO "backup_logs" (id, status, type, "started_at") VALUES (gen_random_uuid(), 'RUNNING', $1, NOW()) RETURNING id`, [type]);
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
                const fileStream = (0, fs_1.createReadStream)(result.path);
                const destinationKey = `backup/sql/db_${timestamp}.dump`;
                await this.s3Client.send(new client_s3_1.PutObjectCommand({
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
            const manifest = {
                version: "1.0",
                timestamp: new Date().toISOString(),
                type,
                environment: process.env.NODE_ENV || 'production',
                checksums: {}, // TODO: Implement checksums
                stats: { ...stats, duration_ms: duration },
            };
            const manifestKey = `backup/manifests/${timestamp}_manifest.json`;
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: manifestKey,
                Body: JSON.stringify(manifest, null, 2),
                ContentType: "application/json",
            }));
            // Log Success
            await pgClient.query(`UPDATE "backup_logs" SET status = 'SUCCESS', "completed_at" = NOW(), path = $1, "size_bytes" = $2, details = $3 WHERE id = $4`, [manifestKey, stats.sql_dump_size_bytes + stats.media_total_size_bytes, JSON.stringify(stats), logId]);
            console.log(`[Backup] Completed successfully. Log ID: ${logId}`);
        }
        catch (error) {
            console.error("[Backup] Failed:", error);
            await pgClient.query(`UPDATE "backup_logs" SET status = 'FAILED', "completed_at" = NOW(), details = $1 WHERE id = $2`, [String(error), logId]);
            throw error;
        }
        finally {
            await pgClient.end();
            // Cleanup temp
            await fs.rm(tempDir, { recursive: true, force: true });
        }
    }
}
exports.Orchestrator = Orchestrator;

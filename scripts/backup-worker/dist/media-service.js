"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class MediaService {
    client;
    bucket;
    constructor(config) {
        this.client = new client_s3_1.S3Client({
            region: "auto",
            endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        });
        this.bucket = config.bucketName;
    }
    async copyMediaToBackup(backupTimestamp) {
        // 1. List all objects in root (exclude /backup/ and potentially other folders if needed)
        // For this portfolio, we assume valuable media is at root or specific folders. 
        // We will exclude existing backups to avoid infinite loops.
        let continuationToken;
        let count = 0;
        let totalSize = 0;
        const backupPrefix = `backup/media/${backupTimestamp}/`;
        console.log(`[Media] Starting copy to ${backupPrefix}`);
        do {
            const command = new client_s3_1.ListObjectsV2Command({
                Bucket: this.bucket,
                ContinuationToken: continuationToken,
            });
            const response = await this.client.send(command);
            if (response.Contents) {
                // Parallelize copies in chunks
                const copyPromises = response.Contents
                    .filter(item => item.Key && !item.Key.startsWith('backup/')) // Exclude backup folder
                    .map(async (item) => {
                    if (!item.Key)
                        return;
                    const sourceKey = item.Key;
                    const destKey = `${backupPrefix}${sourceKey}`;
                    try {
                        await this.client.send(new client_s3_1.CopyObjectCommand({
                            Bucket: this.bucket,
                            CopySource: `${this.bucket}/${sourceKey}`, // R2 CopySource format might need explicit handling depending on provider implementation, but standard S3 is Bucket/Key
                            Key: destKey,
                        }));
                        // console.log(`[Media] Copied ${sourceKey}`); 
                        // Reduce logging spam
                        return item.Size || 0;
                    }
                    catch (error) {
                        console.error(`[Media] Failed to copy ${sourceKey}:`, error);
                        throw error;
                    }
                });
                const results = await Promise.all(copyPromises);
                count += results.filter(r => r !== undefined).length;
                totalSize += results.filter((size) => size !== undefined).reduce((acc, size) => acc + size, 0);
            }
            continuationToken = response.NextContinuationToken;
        } while (continuationToken);
        console.log(`[Media] Finished. Copied ${count} files.`);
        return { count, totalSize, prefix: backupPrefix };
    }
}
exports.MediaService = MediaService;

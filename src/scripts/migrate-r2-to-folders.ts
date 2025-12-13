import { S3Client, ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import "dotenv/config";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.CF_BUCKET_NAME!;

async function migrateR2ToFolders() {
  console.log("🚀 Starting R2 migration to folder structure...\n");

  try {
    // List all objects in the bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const response = await s3Client.send(listCommand);
    const objects = response.Contents || [];

    console.log(`📦 Found ${objects.length} objects in R2\n`);

    let movedCount = 0;
    let skippedCount = 0;

    for (const object of objects) {
      const oldKey = object.Key!;

      // Skip if already in a folder structure
      if (oldKey.includes("/")) {
        console.log(`⏭️  Skipping (already in folder): ${oldKey}`);
        skippedCount++;
        continue;
      }

      let newKey: string | null = null;

      // Determine new key based on prefix
      if (oldKey.startsWith("Certificates-")) {
        // Remove "Certificates-" prefix and add to certificates/ folder
        const fileName = oldKey.replace("Certificates-", "");
        newKey = `certificates/${fileName}`;
      } else if (oldKey.startsWith("Projects-")) {
        // Remove "Projects-" prefix and add to projects/ folder
        const fileName = oldKey.replace("Projects-", "");
        newKey = `projects/${fileName}`;
      } else if (oldKey.startsWith("Screenshot")) {
        // Handle standalone screenshots - put in certificates folder
        newKey = `certificates/${oldKey}`;
      } else {
        console.log(`⚠️  Unknown prefix, skipping: ${oldKey}`);
        skippedCount++;
        continue;
      }

      console.log(`📁 Moving: ${oldKey} → ${newKey}`);

      // Copy object to new location
      await s3Client.send(
        new CopyObjectCommand({
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${oldKey}`,
          Key: newKey,
        })
      );

      // Delete old object
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: oldKey,
        })
      );

      movedCount++;
      console.log(`✅ Moved successfully\n`);
    }

    console.log("\n🎉 Migration completed!");
    console.log(`📊 Summary:`);
    console.log(`   - Moved: ${movedCount} files`);
    console.log(`   - Skipped: ${skippedCount} files`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateR2ToFolders();

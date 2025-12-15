"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/src/lib/utils/s3Client";

export async function DeleteFromS3(imageLink: string | undefined) {
  if (!imageLink) {
    console.log("Image link is not defined please provide one");
    return;
  }

  const objectKey = imageLink.split("/").pop();

  if (!objectKey) {
    console.log("Object key not found in the image link");
    return;
  }

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "portfolio",
        Key: objectKey,
      })
    );
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image from S3:", error);
  }
}

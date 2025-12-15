import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import sharp from "sharp";
import { s3Client, getBucketName, getImageUrl, extractKeyFromUrl } from "@/src/lib/utils/s3Client";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const imageType = formData.get("image-type") as string;
    const itemTitle = formData.get("item-title") as string | null;
    const itemSlug = formData.get("item-slug") as string | null;
    const oldImageUrl = formData.get("old-image-url") as string | null;

    if (!file) {
      return Response.json({ success: false, message: "No file uploaded" });
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({
        success: false,
        message: "File must be an image",
      });
    }

    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;
    if (user?.role !== "ADMIN") {
      return Response.json({
        success: false,
        message: "You don't have permission to upload files",
      });
    }

    // Delete old image if it exists
    if (oldImageUrl) {
      try {
        const oldKey = extractKeyFromUrl(oldImageUrl);
        if (oldKey) {
          console.log("🗑️  Deleting old image:", oldKey);
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: getBucketName(),
              Key: oldKey,
            })
          );
          console.log("✅ Old image deleted successfully");
        }
      } catch (deleteError) {
        // Log but don't fail the upload if deletion fails
        console.warn("⚠️  Failed to delete old image:", deleteError);
      }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(
      "📸 Original image size:",
      (buffer.length / 1024 / 1024).toFixed(2),
      "MB"
    );

    // Optimize image with Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, null, {
        // Max width 1920px, maintain aspect ratio
        withoutEnlargement: true, // Don't upscale smaller images
        fit: "inside",
      })
      .webp({
        lossless: true,
        effort: 6, // Higher effort = better compression (0-6)
      })
      .toBuffer();

    console.log(
      "✨ Optimized image size:",
      (optimizedBuffer.length / 1024 / 1024).toFixed(2),
      "MB"
    );
    console.log(
      "💾 Size reduction:",
      (
        ((buffer.length - optimizedBuffer.length) / buffer.length) *
        100
      ).toFixed(1),
      "%"
    );

    // Helper function to sanitize filename
    const sanitizeFilename = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim();
    };

    // Generate filename with .webp extension and folder structure
    const timestamp = Date.now();
    let folder = imageType.toLowerCase(); // "Certificates" -> "certificates", "Projects" -> "projects"
    
    // For projects, organize in subfolders if slug is available
    if (folder === "projects" && itemSlug) {
      folder = `projects/${sanitizeFilename(itemSlug)}`;
    }
    
    // Use item title if provided, otherwise use original filename
    let baseName: string;
    if (itemTitle && itemTitle.trim()) {
      baseName = sanitizeFilename(itemTitle);
    } else {
      baseName = file.name.replace(/\.[^/.]+$/, ""); // Remove original extension
    }
    
    const fileName = `${folder}/${baseName}-${timestamp}.webp`;

    // Upload to R2
    await s3Client.send(
      new PutObjectCommand({
        Bucket: getBucketName(),
        Key: fileName,
        Body: optimizedBuffer,
        ContentType: "image/webp",
      })
    );

    // Construct final URL
    const imageUrl = getImageUrl(fileName);

    console.log("🎉 Image uploaded successfully:", imageUrl);

    return Response.json({
      success: true,
      message: "Image optimized and uploaded successfully",
      coverImage: imageUrl,
      stats: {
        originalSize: `${(buffer.length / 1024 / 1024).toFixed(2)} MB`,
        optimizedSize: `${(optimizedBuffer.length / 1024 / 1024).toFixed(
          2
        )} MB`,
        reduction: `${(
          ((buffer.length - optimizedBuffer.length) / buffer.length) *
          100
        ).toFixed(1)}%`,
      },
    });
  } catch (error) {
    console.error("❌ Image optimization error:", error);
    return Response.json(
      {
        success: false,
        message: "Image optimization failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

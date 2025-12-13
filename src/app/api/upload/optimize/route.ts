import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import sharp from "sharp";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const imageType = formData.get("image-type") as string;
    const itemTitle = formData.get("item-title") as string | null;

    if (!file) {
      return Response.json({ success: false, message: "No file uploaded" });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return Response.json({
        success: false,
        message: "File must be an image",
      });
    }

    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;
    if (user?.email !== process.env.ADMIN_EMAIL) {
      return Response.json({
        success: false,
        message: "You don't have permission to upload files",
      });
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
    const folder = imageType.toLowerCase(); // "Certificates" -> "certificates", "Projects" -> "projects"
    
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
        Bucket: process.env.CF_BUCKET_NAME!,
        Key: fileName,
        Body: optimizedBuffer,
        ContentType: "image/webp",
      })
    );

    // Construct final URL
    const subdomain = process.env
      .CF_IMAGES_SUBDOMAIN!.trim()
      .replace(/^https?:\/\//, "");
    const imageUrl = `https://${subdomain}/${fileName}`;

    console.log("🎉 Image uploaded successfully:", imageUrl);

    return Response.json({
      success: true,
      message: "Image optimized and uploaded successfully",
      imageLink: imageUrl,
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

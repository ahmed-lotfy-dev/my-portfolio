import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

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

    if (!file) {
      return Response.json({ success: false, message: "No file uploaded" });
    }

    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;
    if (user?.email !== process.env.ADMIN_EMAIL) {
      return Response.json({
        success: false,
        message: "You don't have permission to upload files",
      });
    }

    const fileData = Buffer.from(await file.arrayBuffer());
    const fileName = `${imageType}-${file.name}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.CF_BUCKET_NAME!,
        Key: fileName,
        Body: fileData,
        ContentType: file.type,
      })
    );

    // Remove any existing protocol and trim whitespace from CF_IMAGES_SUBDOMAIN
    const subdomain = process.env
      .CF_IMAGES_SUBDOMAIN!.trim() // Remove leading/trailing whitespace
      .replace(/^https?:\/\//, ""); // Remove protocol if present

    const imageUrl = `https://${subdomain}/${fileName}`;

    console.log("🔍 Upload Debug Info:");
    console.log("  Raw CF_IMAGES_SUBDOMAIN:", process.env.CF_IMAGES_SUBDOMAIN);
    console.log("  Sanitized subdomain:", subdomain);
    console.log("  Final imageUrl:", imageUrl);

    return Response.json({
      success: true,
      message: "File uploaded successfully",
      imageLink: imageUrl,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return Response.json(
      { success: false, message: "Upload failed", error: String(error) },
      { status: 500 }
    );
  }
}

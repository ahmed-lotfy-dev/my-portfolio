import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { s3Client, getBucketName, getImageUrl } from "@/src/lib/utils/s3Client";

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
    if (user?.role !== "ADMIN") {
      return Response.json({
        success: false,
        message: "You don't have permission to upload files",
      });
    }

    const fileData = Buffer.from(await file.arrayBuffer());
    const fileName = `${imageType}-${file.name}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: getBucketName(),
        Key: fileName,
        Body: fileData,
        ContentType: file.type,
      })
    );

    const imageUrl = getImageUrl(fileName);

    console.log("🔍 Upload Debug Info:");
    console.log("  File name:", fileName);
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

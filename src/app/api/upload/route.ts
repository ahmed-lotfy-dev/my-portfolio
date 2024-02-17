import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { auth } from "@/auth";

const config = {
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  },
};

const s3Client = new S3Client(config);

async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  type: string,
  imageType: string
) {
  const fileBuffer = file;
  const params = {
    Bucket: process.env.CF_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: type,
  };
  const command = new PutObjectCommand(params);
  const imageurl = getSignedUrl(s3Client, command, { expiresIn: 60 });

  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully", response);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const imageType = formData.get("image-type") as string;
  const fileData = await file.arrayBuffer();
  const buffer = Buffer.from(fileData);

  const session = await auth();
  const user = session?.user;
  if (user?.role === "ADMIN") {
    const uploaded = await uploadFileToS3(
      buffer,
      `${imageType}-${file.name}`,
      file.type,
      imageType
    );
    return new Response(
      JSON.stringify({
        success: true,
        message: "File uploaded successfully",
        imageLink: `${process.env.CF_IMAGES_SUBDOMAIN}/${imageType}-${file.name}`,
      })
    );
  } else {
    return new Response(
      JSON.stringify({
        success: false,
        message: "File upload failed you don't have enough priviliges",
      })
    );
  }
}

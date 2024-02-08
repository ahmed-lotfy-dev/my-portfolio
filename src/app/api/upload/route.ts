import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
    Key: `${imageType}-${fileName}`,
    Body: fileBuffer,
    ContentType: type,
  };
  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully", response);
    return fileName;
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

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (user?.email === process.env.ADMIN_EMAIL) {
    const uploaded = await uploadFileToS3(
      buffer,
      file.name,
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

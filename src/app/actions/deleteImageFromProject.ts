"use server";

import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { DeleteFromS3 } from "./deleteImageAction";

export async function deleteImageFromProject(imageUrl: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (user?.role !== "ADMIN") {
    return {
      success: false,
      message: "You don't have privilege to delete images.",
    };
  }

  try {
    await DeleteFromS3(imageUrl);
    return { success: true, message: "Image deleted from storage" };
  } catch (error) {
    console.error("Failed to delete image:", error);
    return { success: false, message: "Failed to delete image from storage" };
  }
}

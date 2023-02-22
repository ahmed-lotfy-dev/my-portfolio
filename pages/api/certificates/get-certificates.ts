import prisma from "@/src/lib/prismadb";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function SignUp(
  req: NextApiRequest & { body: User },
  res: NextApiResponse
) {
  try {
    const certificates = await prisma.certificate.findMany();
    console.log(certificates);
    return res
      .status(200)
      .json({ message: "Certificates GET", certificates: certificates });
  } catch (error) {
    console.log(error);
  }
}

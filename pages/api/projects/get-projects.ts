import {prisma} from "@/src/lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function SignUp(
  req: NextApiRequest & { body: User },
  res: NextApiResponse
) {
  try {
    const projects = await prisma.project.findMany();
    console.log(projects);
    return res
      .status(200)
      .json({ message: "Projects GET", projects: projects });
  } catch (error) {
    console.log(error);
  }
}

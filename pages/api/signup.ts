import {prisma} from "@/src/lib/prismadb";
import bcrypt from "bcrypt";

import type { NextApiRequest, NextApiResponse } from "next";

interface User {
  email: string;
  password: string;
  confirmPassword: string;
}
type Data = {
  message: string;
};

export default async function SignUp(
  req: NextApiRequest & { body: User },
  res: NextApiResponse<Data>
) {
  try {
    let { email, password, confirmPassword }: User = req.body;
    if (!email && !password && !confirmPassword) {
      return res.status(401).json({
        message: `Email and password cannot be empty`,
      });
    }
    if (password !== confirmPassword) {
      return res.status(401).json({
        message: "Username or password doesn't match",
      });
    }
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return res.status(401).json({ message: "Email is allready exist" });
    }
    const hashedPw = await bcrypt.hash(password, 10);
    console.log(email, password, confirmPassword);
    const user = await prisma.user.create({
      data: { email: email, password: hashedPw },
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
  }
  res.status(201).json({ message: "User created successfully" });
}

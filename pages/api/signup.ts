import { prisma } from "@/utils/connectDB";
import bcrypt from "bcryptjs";

import type { NextApiRequest, NextApiResponse } from "next";

interface User {
  email: string;
  password: string;
}
type Data = {
  message: string;
};

export default async function SignUp(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log(req.body);
    let { email, password, confirmPassword } = req.body;
    email = email.toLowerCase();
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
    const exist = await prisma.user.findUnique({ where: { email: email } });
    if (exist) {
      return res.status(401).json({ message: "Email is allready exist" });
    }
    const hashedPw = bcrypt.hashSync(password, 10);
    password = hashedPw;
    const user = await prisma.user.create({ data: { email, password } });
    console.log(user);
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
  }
  res.status(201).json({ message: "User created successfully" });
}

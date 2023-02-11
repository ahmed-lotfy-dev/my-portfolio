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
    let { email, password } = req.body;
    if (!email && !password) {
      return res.status(401).json({
        message: `Email and password cannot be empty`,
      });
    }

    const user = await prisma.user.findUnique({ where: { email: email } });
    console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "You're not signedup, Please Sign Up " });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      
    }

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
  }
  res.status(201).json({ message: "User created successfully" });
}

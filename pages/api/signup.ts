import { prisma } from "../../prisma/prisma";
import bcrypt from "bcryptjs";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body);
  let { email, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    return;
  }
  console.log(password);
  console.log(confirmPassword);
  const hash = bcrypt.hashSync(password, 10);
  password = hash;
  await prisma.user.create({
    data: {
      email,
      password,
    },
  });
  res.status(201).json({ message: "user created" });
}

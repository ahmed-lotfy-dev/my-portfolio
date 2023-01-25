import { prisma } from "../../prisma/prisma";
import bcrypt from "bcryptjs";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};
type User = {
  user: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body);
  let { email, password } = req.body;
  console.log(password);
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.password) {
    const isMatched = await bcrypt.compare(password, user.password);
    console.log(isMatched);
    res.status(201).redirect("/");
  }
  console.log(user);
}

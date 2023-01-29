import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDb from "@/utils/db.";

type Data = {
  message: string;
};
type User = {
  user: string;
  password: string;
};

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // try {
  //   console.log("CONNECTING TO MONGO");
  //   await connectToDb();
  //   console.log("CONNECTED TO MONGO");

  //   console.log(req.body);
  //   console.log(connectToDb());
  //   let { email, password } = req.body;
  //   console.log(password);
  //   // const user = await prisma.user.findUnique({ where: { email: email } });
  //   if (user && user.password) {
  //     const isMatched = await bcrypt.compare(password, user.password);
  //     console.log(isMatched);
  //     res.status(201).redirect("/");
  //   }
  //   console.log(user);
  // } catch (error) {
  //   console.log(error);
  // }
}

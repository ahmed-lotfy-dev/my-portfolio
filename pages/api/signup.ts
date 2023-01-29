import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log(req.body);
    let { email, password, confirmPassword } = req.body;
    console.log(password);
    console.log(confirmPassword);
    if (password !== confirmPassword) {
      return;
    }
    const cryptedPassword = bcrypt.hashSync(password, process.env.BCRYPT_SALT);

    res.status(201).json({ message: "user created" });
  } catch (error) {
    console.log(error)
  }
}

import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";

type User = {
  email: string;
  password: string;
};

type Data = {
  message?: string;
  user?: object;
};

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // try {
    // get user from database then:
    // let { email, password }: User = req.body;
    // const dbUser = await prisma.user.findUnique({ where: { email } });
    // if (!email && !password) {
    //   return res.status(401).json({
    //     message: `Email and password cannot be empty`,
    //   });
    // }
    // if (!dbUser) {
    //   return {
    //     redirect: {
    //       permanent: false,
    //       destination: "/login",
    //     },
    //   };
    // }
    // const isMatch = await bcrypt.compare(password, dbUser.password!);
    // if (!isMatch) {
    //   return;
    // }
    res.send({});
  // } catch (error) {
  //   res.status(500).json({ message: (error as Error).message });
  // }
}

export default loginRoute;

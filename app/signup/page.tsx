import React from "react";
import { PrismaClient } from "@prisma/client";

function SignUp() {
  const signupHandler = async (e: any) => {
    e.preventDefault();
    const prisma = new PrismaClient();
    await prisma.$connect();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const User = await prisma.user.create({ data: { email: email } });
  };

  return (
    <div className="flex flex-col items-center mt-20 w-screen h-screen">
      <form className="flex flex-col gap-5" onSubmit={signupHandler}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Username"
          className="px-5 py-4"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="px-5 py-4"
        />
        <button type="submit">SignUp</button>
      </form>
    </div>
  );
}

export default SignUp;

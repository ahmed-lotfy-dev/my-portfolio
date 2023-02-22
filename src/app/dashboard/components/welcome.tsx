"use client";
import { useSession } from "next-auth/react";

const welcome = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const userImage = user?.image ?? "";
  console.log(user);
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <p>Hello And Welcome </p>
      <h2>{user!.name?.split(" ")[0]}</h2>
      <img src={userImage} className="w-28 rounded-full"></img>
    </div>
  );
};

export default welcome;

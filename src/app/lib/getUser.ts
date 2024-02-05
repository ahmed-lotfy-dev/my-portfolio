import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/lib/auth";
import { User } from "@/global";

export async function getUser(): Promise<User | null> {
  const user = await getServerSession(authOptions);
  console.log(user);
  const userDetails = user?.user;
  return userDetails;
}

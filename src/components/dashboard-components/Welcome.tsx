import { auth } from "@/src/auth";
import { NotAuthenticated } from "./NotAuthenticated";

export default async function Welcome() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="w-full">
      {!user && <NotAuthenticated />}
      {user && (
        <div className="w-full flex justify-between items-start flex-col pl-10">
          <h2 className="mb-6">
            Welcome {user?.name?.split(" ")[0]} {user?.name?.split(" ")[1]} to
            the dashboard.
          </h2>
          {user.role === "admin" ? (
            <p>You are admin, welcome!</p>
          ) : (
            <p>
              You are not admin, eventhough you can view the site but not
              interact with action that demand priviliges
            </p>
          )}
        </div>
      )}
    </div>
  );
}

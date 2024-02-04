import { NotAuthenticated } from "./NotAuthenticated";
import { LogoutButton } from "./auth-buttons";
import { getUser } from "@/src/app/lib/getUser";

export default async function Welcome() {
  const user = await getUser();

  return (
    <div className="w-full">
      {!user && <NotAuthenticated />}
      {user && (
        <div className="w-full flex justify-between items-start flex-col pl-10">
          <h2 className="mb-6">
            Welcome {user?.name?.split(" ")[0]} {user?.name?.split(" ")[1]} to
            the dashboard.
          </h2>
          {user.role === "ADMIN" ? (
            <p>You are an admin, welcome!</p>
          ) : (
            <p>
              You are not admin . eventhough you can view the site but not
              interact with action that demand priviliges
            </p>
          )}
        </div>
      )}
    </div>
  );
}

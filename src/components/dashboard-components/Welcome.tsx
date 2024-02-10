import { NotAuthenticated } from "./NotAuthenticated";
import { auth } from "@/src/auth";

export default async function Welcome() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="w-full">
      {!user && <NotAuthenticated />}
      {user && (
        <div className="w-full flex justify-between items-start flex-col pl-10">
          <h2 className="mb-6">
            Welcome {user?.given_name} {user?.family_name} to the dashboard.
          </h2>

          {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
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

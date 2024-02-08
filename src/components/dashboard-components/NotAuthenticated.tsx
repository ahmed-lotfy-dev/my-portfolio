import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function NotAuthenticated() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <div className="flex flex-col justify-center pt-14">
      {user ? (
        <h2 className="mt-6">Sorry You{"'"}re Not Authenticated</h2>
      ) : (
        "signin button"
      )}
    </div>
  );
}
export { NotAuthenticated };

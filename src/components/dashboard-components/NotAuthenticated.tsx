import { auth } from "@/src/auth";
import SignInButtons from "../ui/SignInButton";

async function NotAuthenticated() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="flex flex-col justify-center pt-14 m-auto w-1/2">
      {!user ? (
        <>
          <h2 className="mt-6 m-auto">Sorry You{"'"}re Not Authenticated</h2>
          <SignInButtons />
        </>
      ) : (
        <p>
          You are not admin, eventhough you can view the site but not interact
          with action that demand priviliges
        </p>
      )}
    </div>
  );
}
export { NotAuthenticated };

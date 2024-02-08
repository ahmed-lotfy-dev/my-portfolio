import { SignIn } from "@/src/components/dashboard-components/auth-componets";

async function NotAuthenticated() {
  return (
    <div className="flex flex-col justify-center pt-14">
      <h2 className="mt-6">Sorry You{"'"}re Not Authenticated</h2>
      <SignIn />
    </div>
  );
}
export { NotAuthenticated };

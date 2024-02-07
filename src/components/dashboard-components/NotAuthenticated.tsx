import { SignIn } from "./auth-buttons";

function NotAuthenticated() {
  return (
    <div className="flex flex-col justify-center pt-14">
      <h2 className="mt-6">Sorry You{"'"}re Not Authenticated</h2>
      <SignIn provider="google" />
    </div>
  );
}
export { NotAuthenticated };

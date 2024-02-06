"use client";
import { LoginButton } from "./auth-buttons";

function NotAuthenticated() {
  return (
    <div className="flex flex-col justify-center pt-14">
      <h2 className="mt-6">Sorry You{"'"}re Not Authenticated</h2>
      <LoginButton />
    </div>
  );
}
export { NotAuthenticated };

import Aside from "./aside";
import { signIn } from "next-auth/react";

const notauth = () => {
  return (
    <div className="flex  w-full">
      <Aside />
      <div className="flex flex-col gap-3 h-screen w-full justify-start items-center mt-10">
        <p>Access Denied</p>
        <button
          onClick={() =>
            signIn("undefined", {
              callbackUrl: `/dashboard`,
            })
          }
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default notauth;

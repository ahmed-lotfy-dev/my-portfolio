"use client";
import React from "react";

function SignUp() {

  const signInHandler = async (e: any) => {
    const email = e.target.email.value;
    const password = e.target.password.value;
    fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  };
  
  return (
    <div className="flex flex-col items-center mt-20 w-screen h-screen">
      <form
        action="/api/signin"
        method="POST"
        className="flex flex-col gap-5"
        onSubmit={() => {
          signInHandler;
        }}
      >
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Username"
          className="px-5 py-4"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="px-5 py-4"
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignUp;

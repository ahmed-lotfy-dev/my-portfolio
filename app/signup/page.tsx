"use client";
import React from "react";
import z from "zod";

function SignUp() {
  const User = z.object({
    email: z.string().trim().email(),
    password: z.string().min(6).max(16),
    confirmPassword: z.string().min(6).max(16),
  });

  const signupHandler = async (e: any) => {
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    console.log(email, password);
    // User.parse({ email, password, confirmPassword });
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
        className="flex flex-col gap-5"
        onSubmit={() => {
          signupHandler;
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
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="px-5 py-4"
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;

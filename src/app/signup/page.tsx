"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import React from "react";
import { useFormState } from "react-dom";
import { SignUpAction } from "@/src/app/actions";
import Submit from "@/src/components/ui/formSubmitBtn";

type Props = {};

export default function Login({}: Props) {
  const [state, formAction] = useFormState(SignUpAction, null);
  return (
    <div className="w-full flex flex-col justify-center items-center mt-20">
      <form action={formAction}>
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  required
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" required type="password" />
              </div>
              <Submit btnText="Login" className="w-full" type="submit"></Submit>
            </div>
          </CardContent>
        </Card>
      </form>
      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* {state && (
          <>
            <div className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{state}</p>
          </>
        )} */}
      </div>
    </div>
  );
}

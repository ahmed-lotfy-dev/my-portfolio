"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./button";

type SubmitProps = ButtonProps & {
  btnText: string;
  onClick?: () => void;
};

export default function Submit({ btnText, ...rest }: SubmitProps) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} {...rest} className="mx-auto w-2/3 py-2 ">
      {btnText}
    </Button>
  );
}

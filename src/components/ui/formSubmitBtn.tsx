"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./button";

type SubmitProps = ButtonProps & {
  btnText: string;
  className?: string;
  onClick?: () => void;
};

export default function Submit({ btnText, className, ...rest }: SubmitProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      {...rest}
      className={`mx-auto w-full py-2 ${className}`}
    >
      {btnText}
    </Button>
  );
}

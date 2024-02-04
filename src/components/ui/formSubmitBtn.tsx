"use client";
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
      className={`mx-auto w-[200px] py-2 ${className}`}
    >
      {btnText}
    </Button>
  );
}

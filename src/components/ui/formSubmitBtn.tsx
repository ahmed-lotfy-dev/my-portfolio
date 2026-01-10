"use client";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./button";
import { cn } from "@/src/lib/utils";

type SubmitProps = ButtonProps & {
  btnText: string;
  className?: string;
  children?: React.ReactNode;
};

export default function Submit({
  btnText,
  className,
  disabled,
  children,
  ...rest
}: SubmitProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || disabled}
      {...rest}
      className={cn("w-full md:w-auto min-w-[200px] rounded-xl font-bold py-6 text-base shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:opacity-70", className)}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Sending...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {btnText}
          {children}
        </div>
      )}
    </Button>
  );
}

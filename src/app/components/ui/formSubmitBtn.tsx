import { useFormStatus } from "react-dom";
import { Button } from "./button";

export default function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      className="mx-auto w-2/3 py-2 sm:self-start bg-blue-700 rounded-md hover:bg-blue-900 text-blue-100 hover:text-blue-100 font-bold transition-all hover:rounded-lg border-[3px] border-solid border-gray-800 sm:text-md"
    >
      {pending ? "Sending Email..." : "Send Email"}
    </Button>
  );
}

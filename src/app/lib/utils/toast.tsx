import { toast } from "sonner"

export const notify = (message: string, status: boolean) =>
  status ? toast.success(message,) : toast.error(message);

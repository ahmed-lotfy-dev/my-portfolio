import toast from "react-hot-toast";

export const notify = (message: string, status: boolean) =>
  status ? toast.success(message) : toast.error(message);

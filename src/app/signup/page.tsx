"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

const UserSchema = z
  .object({
    email: z.string().email("Email is invalid"),
    password: z
      .string()
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type userSchemaType = z.infer<typeof UserSchema>;

function SignUp() {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<userSchemaType>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = handleSubmit(async (data, event) => {
    event?.preventDefault();
    const validatedForm = UserSchema.parse(data);
    try {
      console.log(data);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
        const data = await res.json();
        toast.warning(data.message);
      }
      if (res.status === 201) {
        const data = await res.json();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="flex flex-col items-center mt-20 w-screen h-screen">
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="flex flex-col m-auto ">
          <label className="mb-5" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="px-5 py-4"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col m-auto">
          <label className="mb-5" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="px-5 py-4"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col m-auto">
          <label className="mb-5" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            className="px-5 py-4"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <ToastContainer position="bottom-right" autoClose={4000} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;

"use client";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { IoLogoLinkedin, IoLogoGithub, IoLogoFacebook } from "react-icons/io5";
import { contactAction } from "@/src/app/actions";

import { Button } from "./ui/button";

import { useFormState } from "react-dom";

import { notify } from "../lib/utils/toast";
import Submit from "./ui/formSubmitBtn";

export default function Contact() {
  const [state, formAction] = useFormState(contactAction, null);

  if (state?.success)
    notify("Email sent successfully, i'll contact you soon ", true);
  
  return (
    // outer container for bg
    <section className="p-6">
      {/* // inner container */}
      <div className="container mx-auto max-w-screen-xl sm:place-items-center grid grid-cols-6 grid-row-3 p-6">
        {/* // section heading */}
        <div className="col-start-3 col-end-5 row-start-1 row-end-2 sm:col-start-1 sm:col-end-7 py-10">
          <h1 className="font-bold text-3xl ">Contact Me</h1>
        </div>
        {/* //contact me links and number */}
        <div className="h-full pt-16 col-start-1 col-end-7 sm:row-start-2 sm:row-end-3 sm:col-start-5 sm:col-end-4 flex md:col-start-6 w-full  justify-center sm:justify-start md:justify-center">
          <div className="flex flex-col text-center gap-4 text-xl font-lightbold text-blue-800 items-start">
            <span className="mx-auto sm:mx-0">+201016037479</span>
            <span className="mb-4">contact@ahmedlotfy.dev</span>
            <div className="flex flex-row space-x-10 justify-between">
              <Link
                href={"https://www.linkedin.com/in/ahmed-lotfy-dev/"}
                target={"_blank"}
              >
                <IoLogoLinkedin className="w-10 h-10 fill-[#557aca] hover:fill-[#3b5998] hover:scale-110 transition-all duration-300" />
              </Link>
              <Link
                href={"https://github.com/ahmed-lotfy-dev"}
                target={"_blank"}
              >
                <IoLogoGithub className="w-10 h-10 fill-gray-500 hover:fill-black hover:scale-110 transition-all duration-300" />
              </Link>
              <Link
                href={"https://www.facebook.com/ahmed.lotfy00"}
                target={"_blank"}
              >
                <IoLogoFacebook className="w-10 h-10 fill-[#557aca] hover:fill-[#3b5998] hover:scale-110 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
        {/* //contact form container */}
        <div className="col-start-1 col-end-7 sm:col-start-1 sm:col-end-4 sm:row-start-2 sm:row-end-3 py-10 w-full  place-self-start">
          <form
            action={formAction}
            className="flex flex-col space-y-5 mt-6 w-[75%] sm:w-[85%] mx-auto sm:mx-0"
          >
            <input
              className="py-2 px-3 rounded-md placeholder:opacity-60 text-blue-900 border-[2px] border-blue-500 focus:border-blue-900 focus:border-[2px] outline-none placeholder:text-blue-700"
              type="text"
              name="name"
              placeholder="Name"
            />
            <p className="text-sm text-red-400">
              {state?.error?.name && state?.error?.name?._errors}
            </p>
            <input
              className="py-2 px-3 rounded-md placeholder:opacity-60 text-blue-900 border-[2px] border-blue-500 focus:border-blue-900 focus:border-[2px] outline-none placeholder:text-blue-700"
              type="email"
              name="email"
              placeholder="Email"
            />
            <p className="text-sm text-red-400">
              {state?.error?.email && state?.error?.email?._errors}
            </p>
            <input
              className="py-2 px-3 rounded-md placeholder:opacity-60 text-blue-900 border-[2px] border-blue-500 focus:border-blue-900 focus:border-[2px] outline-none placeholder:text-blue-700"
              type="text"
              name="subject"
              placeholder="Subject"
            />
            <p className="text-sm text-red-400">
              {state?.error?.subject && state?.error?.subject?._errors}
            </p>
            <textarea
              className="py-2 px-3 rounded-md h-[10em] placeholder:opacity-60 text-blue-900 border-[2px] border-blue-500 focus:border-blue-900 focus:border-[2px] outline-none placeholder:text-blue-700"
              placeholder="Your Message"
              name="message"
            />
            <p className="text-sm text-red-400">
              {state?.error?.message && state?.error?.message?._errors}
            </p>
            <Submit btnText="Send"/>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </section>
  );
}
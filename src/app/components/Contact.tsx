import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { IoLogoLinkedin, IoLogoGithub, IoLogoFacebook } from "react-icons/io5";
import { contactAction } from "@/src/app/_actions";

export default async function Contact() {
  return (
    // outer container for bg
    <section className="p-6">
      {/* // inner container */}
      <div className="container mx-auto max-w-screen-xl sm:place-items-center grid grid-cols-6 grid-row-3 p-6">
        {/* // section heading */}
        <div className="col-start-3 col-end-5 row-start-1 row-end-2 sm:col-start-1 sm:col-end-7 py-10">
          <h1 className="font-bold text-3xl ">Contact Me</h1>
        </div>
        {/* // toaster for notifications */}
        <Toaster />
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
            className="flex flex-col space-y-5 mt-6 w-[75%] sm:w-[85%] mx-auto sm:mx-0 "
            action={contactAction}
          >
            <input
              className="py-2 px-3 rounded-md placeholder:opacity-60 text-blue-900 border-[2px] border-blue-500 focus:border-blue-900 focus:border-[2px] outline-none placeholder:text-blue-700"
              type="text"
              placeholder="Name"
              name="name"
              min={5}
              max={80}
              required
            />
            <div className="text-md lightbold text-red-500"></div>
            <input
              className="py-2 px-3 rounded-md placeholder:opacity-60 text-blue-900 border-[2px] border-blue-500 focus:border-blue-900 focus:border-[2px] outline-none placeholder:text-blue-700"
              type="text"
              placeholder="Email"
              name="email"
              required
            />
            <div className="text-md lightbold text-red-500"></div>
            <input
              className="py-2 px-3 rounded-md placeholder:opacity-60 text-blue-900 border-[2px] border-blue-500 focus:border-blue-900 focus:border-[2px] outline-none placeholder:text-blue-700"
              type="text"
              placeholder="Subject"
              name="subject"
              min={6}
              required
            />
            <div className="text-md lightbold text-red-500"></div>
            <textarea
              className="py-2 px-3 rounded-md h-[10em] placeholder:opacity-60 text-blue-900 border-[2px] border-blue-500 focus:border-blue-900 focus:border-[2px] outline-none placeholder:text-blue-700"
              placeholder="Your Message"
              name="message"
              minLength={10}
              required
            />
            <div className="text-md lightbold text-red-500"></div>
            <input
              className="mx-auto w-[10rem] py-2 sm:self-start bg-blue-700 rounded-md hover:bg-blue-900 text-blue-100 hover:text-blue-100 font-bold transition-all hover:rounded-lg border-[3px] border-solid border-gray-800 sm:text-md"
              type="submit"
            />
          </form>
        </div>
      </div>
    </section>
  );
}

"use client"
import { useActionState } from "react"
import Link from "next/link"
import { contactAction } from "@/src/app/actions/contactAction"
import { notify } from "@/src/lib/utils/toast"
import { IoLogoFacebook, IoLogoLinkedin, IoLogoGithub } from "react-icons/io5"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import Submit from "./ui/formSubmitBtn"

export default function Contact() {
  const [state, formAction] = useActionState(contactAction, null)

  if (state?.success) {
    notify("Email sent successfully, I'll contact you soon", true)
  }

  return (
    <section className="flex flex-col items-center my-16" id="contact">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight sm:text-5xl">
          Contact <span className="text-blue-600">Me</span>
        </h2>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Have a question or want to work together? Send me a message.
        </p>
      </div>
      <div className="container flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2 space-y-4">
          <h3 className="text-2xl font-bold">Get in Touch</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Email: contact@ahmedlotfy.site
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Phone: +201016037479
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://www.linkedin.com/in/ahmed-lotfy-dev/"
              target="_blank"
            >
              <IoLogoLinkedin className="w-8 h-8 text-blue-600 hover:text-blue-800" />
            </Link>
            <Link href="https://github.com/ahmed-lotfy-dev" target="_blank">
              <IoLogoGithub className="w-8 h-8 text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white" />
            </Link>
            <Link href="https://www.facebook.com/ahmed.lotfy00" target="_blank">
              <IoLogoFacebook className="w-8 h-8 text-blue-800 hover:text-blue-900" />
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 ">
          <form
            action={formAction}
            className="[&_input]:mt-6 [&_textarea]:mt-6 [&_button]:mt-6 [&_p]:mt-6"
          >
            <Input type="text" name="name" placeholder="Name" />
            {state?.error?.name && (
              <p className="text-sm text-red-500">
                {state.error.name._errors.join(", ")}
              </p>
            )}
            <Input type="email" name="email" placeholder="Email" />
            {state?.error?.email && (
              <p className="text-sm text-red-500">
                {state.error.email._errors.join(", ")}
              </p>
            )}
            <Input type="text" name="subject" placeholder="Subject" />
            {state?.error?.subject && (
              <p className="text-sm text-red-500">
                {state.error.subject._errors.join(", ")}
              </p>
            )}
            <Textarea name="message" placeholder="Your Message" />
            {state?.error?.message && (
              <p className="text-sm text-red-500">
                {state.error.message._errors.join(", ")}
              </p>
            )}
            <Submit btnText="Send Message" />
          </form>
        </div>
      </div>
    </section>
  )
}

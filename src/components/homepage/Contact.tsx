"use client";
import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { contactAction } from "@/src/app/actions/contactAction";
import { notify } from "@/src/lib/utils/toast";
import { IoLogoFacebook, IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import Submit from "@/src/components/ui/formSubmitBtn";
import { useLocale, useTranslations } from "next-intl";

export default function Contact() {
  const t = useTranslations("contact");

  const [state, formAction] = useActionState(contactAction, null);

  // Form field states to preserve values on validation errors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (state?.success) {
      notify("Email sent successfully, I'll contact you soon", true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else if (state?.error && Object.keys(state.error).length > 0) {
      notify("Please fix the errors and try again.", false);
    }
  }, [state]);

  return (
    <section className="flex flex-col items-center my-16 p-4" id="contact">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-foreground dark:text-blue-700 tracking-tight sm:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>
      <div className="container flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2 space-y-4">
          <h3 className="text-2xl font-bold"> {t("getInTouch")}</h3>
          <p className="text-gray-700 dark:text-gray-600">{t("email")}</p>
          <p className="text-gray-700 dark:text-gray-600">{t("phone")}</p>
          <div className="flex space-x-4">
            <Link
              href="https://www.linkedin.com/in/ahmed-lotfy-dev/"
              target="_blank"
            >
              <IoLogoLinkedin className="w-8 h-8 text-blue-600 hover:text-blue-800" />
            </Link>
            <Link href="https://github.com/ahmed-lotfy-dev" target="_blank">
              <IoLogoGithub className="w-8 h-8 text-gray-600 dark:text-gray-500 hover:text-gray-900 " />
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
            <input type="hidden" name="locale" value={useLocale()} />
            <Input
              type="text"
              name="name"
              placeholder={t("placeholders.name")}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {state?.error?.name && (
              <p className="text-sm text-red-500">
                {state.error.name._errors.join(", ")}
              </p>
            )}
            <Input
              type="email"
              name="email"
              placeholder={t("placeholders.email")}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {state?.error?.email && (
              <p className="text-sm text-red-500">
                {state.error.email._errors.join(", ")}
              </p>
            )}
            <Input
              type="text"
              name="subject"
              placeholder={t("placeholders.subject")}
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
            {state?.error?.subject && (
              <p className="text-sm text-red-500">
                {state.error.subject._errors.join(", ")}
              </p>
            )}
            <Textarea
              name="message"
              placeholder={t("placeholders.message")}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
            {state?.error?.message && (
              <p className="text-sm text-red-500">
                {state.error.message._errors.join(", ")}
              </p>
            )}
            <Submit btnText={t("send")} />
          </form>
        </div>
      </div>
    </section>
  );
}

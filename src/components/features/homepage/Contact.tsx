"use client";

import { useActionState, useState, useEffect } from "react";
import { contactAction } from "@/src/app/actions/contact/mutations";
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  PaperPlaneTilt,
  Phone,
} from "@phosphor-icons/react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import Submit from "@/src/components/ui/formSubmitBtn";
import { useLocale, useTranslations } from "next-intl";

export default function Contact() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const isRTL = locale === "ar";

  const [state, formAction] = useActionState(contactAction, null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (state?.success) {
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  }, [state]);

  const contactMethods = [
    {
      icon: EnvelopeSimple,
      label: t("email"),
      value: "contact@alotfy.site",
      href: "mailto:contact@alotfy.site",
    },
    {
      icon: Phone,
      label: t("phone"),
      value: "+20 1016037479",
      href: "tel:+201016037479",
    },
    {
      icon: LinkedinLogo,
      label: "LinkedIn",
      value: "ahmed-lotfy-dev",
      href: "https://www.linkedin.com/in/ahmed-lotfy-dev/",
    },
    {
      icon: GithubLogo,
      label: "GitHub",
      value: "ahmed-lotfy-dev",
      href: "https://github.com/ahmed-lotfy-dev",
    },
  ];

  const inputClass =
    "h-11 rounded-lg border-white/[0.1] bg-transparent px-3 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0";

  return (
    <section
      id="contact"
      className="relative border-b border-white/[0.07] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="eyebrow">{t("getInTouch")}</p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
            {t("heading_part1")}
            <span className="block text-primary">{t("heading_part2")}</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {t("availability")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("info_desc")}
            </p>

            <address className="mt-8 border-t border-white/[0.08] not-italic">
              {contactMethods.map((method) => (
                <a
                  key={method.href}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 border-b border-white/[0.08] py-4"
                >
                  <span className="flex items-center gap-3">
                    <method.icon
                      size={16}
                      className="text-muted-foreground transition-colors duration-300 group-hover:text-primary"
                    />
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {method.label}
                    </span>
                  </span>
                  <span className="truncate text-sm font-medium text-foreground/80 transition-colors duration-300 group-hover:text-primary">
                    {method.value}
                  </span>
                </a>
              ))}
            </address>
          </div>

          <div className="lg:col-span-8">
            <div className="surface p-6 md:p-10">
              {state?.success && (
                <div className="mb-8 rounded-lg border border-primary/25 bg-primary/[0.06] px-4 py-3 text-sm text-foreground">
                  {t("success")}
                </div>
              )}

              <form action={formAction} className="space-y-6" noValidate>
                <input type="hidden" name="locale" value={locale} />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {t("labels.name")}
                    </label>
                    <Input
                      id="contact-name"
                      type="text"
                      name="name"
                      className={inputClass}
                      placeholder={t("placeholders.name")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {state?.error?.name && (
                      <p className="text-xs text-destructive">
                        {state.error.name._errors.join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-email"
                      className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {t("labels.email")}
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      name="email"
                      className={inputClass}
                      placeholder={t("placeholders.email")}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {state?.error?.email && (
                      <p className="text-xs text-destructive">
                        {state.error.email._errors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-subject"
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {t("labels.subject")}
                  </label>
                  <Input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    className={inputClass}
                    placeholder={t("placeholders.subject")}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                  {state?.error?.subject && (
                    <p className="text-xs text-destructive">
                      {state.error.subject._errors.join(", ")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-message"
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {t("labels.message")}
                  </label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    className="rounded-lg border-white/[0.1] bg-transparent px-3 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                    placeholder={t("placeholders.message")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  {state?.error?.message && (
                    <p className="text-xs text-destructive">
                      {state.error.message._errors.join(", ")}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Submit btnText={t("send")} className="w-full sm:w-auto">
                    <PaperPlaneTilt
                      size={16}
                      weight="bold"
                      className={isRTL ? "rotate-180" : undefined}
                    />
                  </Submit>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

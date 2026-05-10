"use client";

import { useActionState, useState, useEffect } from "react";
import { contactAction } from "@/src/app/actions/contact/mutations";
import { notify } from "@/src/lib/utils/toast";
import { IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";
import { Mail, Send, MessageSquare, Sparkles } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import Submit from "@/src/components/ui/formSubmitBtn";
import { useLocale, useTranslations } from "next-intl";
import posthog from "posthog-js";
import { m } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
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
      posthog.capture("contact_form_submitted", {
        subject: formData.subject,
      });
      notify(isRTL ? "تم إرسال رسالتك بنجاح، سأتواصل معك قريباً" : "Email sent successfully, I'll contact you soon", true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else if (state?.error && Object.keys(state.error).length > 0) {
      notify(isRTL ? "يرجى تصحيح الأخطاء والمحاولة مرة أخرى" : "Please fix the errors and try again.", false);
    }
  }, [state, isRTL, formData.subject]);

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "contact@ahmedlotfy.site",
      href: "mailto:contact@ahmedlotfy.site",
      color: "text-primary",
    },
    {
      icon: IoLogoLinkedin,
      label: "LinkedIn",
      value: "ahmed-lotfy-dev",
      href: "https://www.linkedin.com/in/ahmed-lotfy-dev/",
      color: "text-primary-light",
    },
    {
      icon: IoLogoGithub,
      label: "GitHub",
      value: "ahmed-lotfy-dev",
      href: "https://github.com/ahmed-lotfy-dev",
      color: "text-foreground",
    },
  ];

  return (
    <section className="relative overflow-hidden py-32 lg:py-40" id="contact">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-[400px] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/2 translate-x-[300px] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container relative mx-auto px-6 lg:px-8 z-10">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-20 lg:mb-28 space-y-6">
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-[0.22em] uppercase border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("title")}</span>
          </m.div>

          <m.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.05]"
          >
            {t("heading_part1")}
            <span className="text-primary italic block mt-2">{t("heading_part2")}</span>
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            {t("description")}
          </m.p>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-16 lg:gap-24 items-start max-w-6xl mx-auto">
          {/* Contact Info Side — 4 cols */}
          <m.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4 space-y-10 lg:sticky lg:top-32"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold flex items-center gap-4">
                <span className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary">
                  <MessageSquare className="w-6 h-6" />
                </span>
                {t("getInTouch")}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                {t("info_desc")}
              </p>
            </div>

            <address className="space-y-5 not-italic">
              {contactMethods.map((method, idx) => (
                <a
                  key={idx}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-card/40 hover:shadow-xl hover:shadow-primary/5"
                  onClick={() => posthog.capture("contact_method_clicked", { method: method.label })}
                >
                  <div className={cn(
                    "flex-shrink-0 p-3.5 rounded-xl bg-background border border-border group-hover:border-primary/20 group-hover:scale-110 transition-all duration-500 shadow-sm",
                    method.color
                  )}>
                    <method.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">{method.label}</p>
                    <p className="text-foreground font-semibold text-base truncate">{method.value}</p>
                  </div>
                </a>
              ))}
            </address>
          </m.div>

          {/* Form Side — 7 cols */}
          <m.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-linear-to-r from-primary/15 to-secondary/15 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />
              <div className="relative bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-10 md:p-14 shadow-2xl">
                <form action={formAction} className="space-y-10" noValidate>
                  <input type="hidden" name="locale" value={locale} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-3.5">
                      <label className="text-sm font-bold text-foreground/70 tracking-wide block">
                        {t("labels.name")}
                      </label>
                      <Input
                        type="text"
                        name="name"
                        className="rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all py-5 px-6 h-auto text-base shadow-inner focus:ring-2 focus:ring-primary/20"
                        placeholder={t("placeholders.name")}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      {state?.error?.name && (
                        <p className="text-xs text-red-500 font-medium ml-1 mt-1.5">{state.error.name._errors.join(", ")}</p>
                      )}
                    </div>

                    <div className="space-y-3.5">
                      <label className="text-sm font-bold text-foreground/70 tracking-wide block">
                        {t("labels.email")}
                      </label>
                      <Input
                        type="email"
                        name="email"
                        className="rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all py-5 px-6 h-auto text-base shadow-inner focus:ring-2 focus:ring-primary/20"
                        placeholder={t("placeholders.email")}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      {state?.error?.email && (
                        <p className="text-xs text-red-500 font-medium ml-1 mt-1.5">{state.error.email._errors.join(", ")}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <label className="text-sm font-bold text-foreground/70 tracking-wide block">
                      {t("labels.subject")}
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      className="rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all py-5 px-6 h-auto text-base shadow-inner focus:ring-2 focus:ring-primary/20"
                      placeholder={t("placeholders.subject")}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                    {state?.error?.subject && (
                      <p className="text-xs text-red-500 font-medium ml-1 mt-1.5">{state.error.subject._errors.join(", ")}</p>
                    )}
                  </div>

                  <div className="space-y-3.5">
                    <label className="text-sm font-bold text-foreground/70 tracking-wide block">
                      {t("labels.message")}
                    </label>
                    <Textarea
                      name="message"
                      rows={6}
                      className="rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all p-6 text-base resize-none shadow-inner focus:ring-2 focus:ring-primary/20"
                      placeholder={t("placeholders.message")}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    {state?.error?.message && (
                      <p className="text-xs text-red-500 font-medium ml-1 mt-1.5">{state.error.message._errors.join(", ")}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Submit
                      btnText={t("send")}
                      className="w-full md:w-auto min-w-[200px] rounded-xl py-5 px-10 text-sm font-bold tracking-[0.12em] uppercase shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                    >
                      <Send className="w-4 h-4 ml-2.5 rtl:rotate-180" />
                    </Submit>
                  </div>
                </form>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}

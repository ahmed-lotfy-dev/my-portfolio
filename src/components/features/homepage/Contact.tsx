"use client";

import { useActionState, useState, useEffect } from "react";
import { contactAction } from "@/src/app/actions/contactAction";
import { notify } from "@/src/lib/utils/toast";
import { IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";
import { Mail, Send, MessageSquare, Sparkles } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import Submit from "@/src/components/ui/formSubmitBtn";
import { useLocale, useTranslations } from "next-intl";
import posthog from "posthog-js";
import { motion } from "framer-motion";
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
      color: "text-blue-500",
    },
    {
      icon: IoLogoLinkedin,
      label: "LinkedIn",
      value: "ahmed-lotfy-dev",
      href: "https://www.linkedin.com/in/ahmed-lotfy-dev/",
      color: "text-blue-600",
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
    <section
      className="relative py-24 overflow-hidden bg-background border-t border-border/40"
      id="contact"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none opacity-50">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-secondary/20 rounded-full blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-[0.2em] uppercase border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("title")}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-foreground tracking-tight"
          >
            {t("heading_part1")}
            <span className="text-primary italic">{t("heading_part2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto"
          >
            {t("description")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <MessageSquare className="text-primary w-6 h-6" />
                {t("getInTouch")}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("info_desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactMethods.map((method, idx) => (
                <a
                  key={idx}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-card/50 hover:shadow-2xl hover:shadow-primary/5"
                  onClick={() => posthog.capture("contact_method_clicked", { method: method.label })}
                >
                  <div className={cn("p-3 rounded-xl bg-background border border-border group-hover:border-primary/20 group-hover:scale-110 transition-all duration-500 shadow-sm", method.color)}>
                    <method.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{method.label}</p>
                    <p className="text-foreground font-semibold antialiased">{method.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.2rem] p-8 md:p-12 shadow-2xl">
                <form action={formAction} className="space-y-8" noValidate>
                  <input type="hidden" name="locale" value={locale} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-foreground/70 ml-1 tracking-wide">{t("labels.name")}</label>
                      <Input
                        type="text"
                        name="name"
                        className="rounded-2xl border-border/50 bg-background/50 focus:bg-background transition-all py-7 px-6 h-auto text-base shadow-inner"
                        placeholder={t("placeholders.name")}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      {state?.error?.name && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{state.error.name._errors.join(", ")}</p>}
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-bold text-foreground/70 ml-1 tracking-wide">{t("labels.email")}</label>
                      <Input
                        type="email"
                        name="email"
                        className="rounded-2xl border-border/50 bg-background/50 focus:bg-background transition-all py-7 px-6 h-auto text-base shadow-inner"
                        placeholder={t("placeholders.email")}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      {state?.error?.email && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{state.error.email._errors.join(", ")}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground/70 ml-1 tracking-wide">{t("labels.subject")}</label>
                    <Input
                      type="text"
                      name="subject"
                      className="rounded-2xl border-border/50 bg-background/50 focus:bg-background transition-all py-7 px-6 h-auto text-base shadow-inner"
                      placeholder={t("placeholders.subject")}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                    {state?.error?.subject && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{state.error.subject._errors.join(", ")}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground/70 ml-1 tracking-wide">{t("labels.message")}</label>
                    <Textarea
                      name="message"
                      rows={5}
                      className="rounded-2xl border-border/50 bg-background/50 focus:bg-background transition-all p-6 text-base resize-none shadow-inner"
                      placeholder={t("placeholders.message")}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    {state?.error?.message && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{state.error.message._errors.join(", ")}</p>}
                  </div>

                  <div className="pt-4">
                    <Submit btnText={t("send")} className="w-full md:w-auto min-w-[180px] rounded-xl py-6 text-sm font-bold tracking-widest uppercase shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                      <Send className="w-4 h-4 ml-2 rtl:rotate-180" />
                    </Submit>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

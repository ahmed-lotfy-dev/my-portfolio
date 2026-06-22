"use client";

import { useActionState, useState, useEffect } from "react";
import { contactAction } from "@/src/app/actions/contact/mutations";
import { IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";
import { Mail, Send, MessageSquare } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import Submit from "@/src/components/ui/formSubmitBtn";
import { useLocale } from "next-intl";
import { cn } from "@/src/lib/utils";

export default function Contact() {
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
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  }, [state]);

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "contact@ahmedlotfy.site",
      href: "mailto:contact@ahmedlotfy.site",
    },
    {
      icon: IoLogoLinkedin,
      label: "LinkedIn",
      value: "ahmed-lotfy-dev",
      href: "https://www.linkedin.com/in/ahmed-lotfy-dev/",
    },
    {
      icon: IoLogoGithub,
      label: "GitHub",
      value: "ahmed-lotfy-dev",
      href: "https://github.com/ahmed-lotfy-dev",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28" id="contact">
      <div className="container relative mx-auto px-4 lg:px-8 z-10">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary/70 mb-4">
            {locale === "ar" ? "تواصل معي" : "Get In Touch"}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {locale === "ar" ? "عايز تعمل مشروع؟" : "Want to build something?"}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {locale === "ar"
              ? "أنا متاح للمشاريع الجديدة والاستشارات. تواصل معي عبر النموذج أو أي من القنوات التالية."
              : "I'm available for new projects and consulting. Reach out through the form or any of the channels below."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-5">
              <h3 className="text-lg font-semibold flex items-center gap-3">
                <span className="inline-flex p-2.5 rounded-lg bg-primary/8 text-primary border border-primary/10">
                  <MessageSquare className="w-4 h-4" />
                </span>
                {locale === "ar" ? "معلومات التواصل" : "Contact Info"}
              </h3>
            </div>

            <address className="space-y-3 not-italic">
              {contactMethods.map((method, idx) => (
                <a
                  key={idx}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-card/20 hover:border-primary/20 hover:bg-card/30 transition-all duration-300"
                >
                  <div className="flex-shrink-0 p-2.5 rounded-lg bg-background border border-border group-hover:border-primary/15 transition-all duration-300">
                    <method.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-0.5">{method.label}</p>
                    <p className="text-sm text-foreground font-medium truncate">{method.value}</p>
                  </div>
                </a>
              ))}
            </address>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-card/20 border border-border/40 rounded-xl p-6 sm:p-8">
              {state?.success && (
                <div className="mb-6 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm font-medium">
                  {locale === "ar" ? "تم إرسال رسالتك بنجاح! سأتواصل معك قريباً." : "Message sent successfully! I'll get back to you soon."}
                </div>
              )}
              <form action={formAction} className="space-y-6" noValidate>
                <input type="hidden" name="locale" value={locale} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wide block">
                      {locale === "ar" ? "الاسم" : "Name"}
                    </label>
                    <Input
                      type="text"
                      name="name"
                      className="rounded-lg border-border/40 bg-background/50 h-11 text-sm"
                      placeholder={locale === "ar" ? "اسمك الكامل" : "Your full name"}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {state?.error?.name && (
                      <p className="text-xs text-destructive font-medium">{state.error.name._errors.join(", ")}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wide block">
                      {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <Input
                      type="email"
                      name="email"
                      className="rounded-lg border-border/40 bg-background/50 h-11 text-sm"
                      placeholder={locale === "ar" ? "بريدك الإلكتروني" : "your@email.com"}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {state?.error?.email && (
                      <p className="text-xs text-destructive font-medium">{state.error.email._errors.join(", ")}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wide block">
                    {locale === "ar" ? "الموضوع" : "Subject"}
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    className="rounded-lg border-border/40 bg-background/50 h-11 text-sm"
                    placeholder={locale === "ar" ? "موضوع الرسالة" : "Message subject"}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                  {state?.error?.subject && (
                    <p className="text-xs text-destructive font-medium">{state.error.subject._errors.join(", ")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wide block">
                    {locale === "ar" ? "الرسالة" : "Message"}
                  </label>
                  <Textarea
                    name="message"
                    rows={5}
                    className="rounded-lg border-border/40 bg-background/50 text-sm resize-none"
                    placeholder={locale === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  {state?.error?.message && (
                    <p className="text-xs text-destructive font-medium">{state.error.message._errors.join(", ")}</p>
                  )}
                </div>

                <div>
                  <Submit
                    btnText={locale === "ar" ? "إرسال" : "Send Message"}
                    className="w-full sm:w-auto rounded-lg py-3 px-8 text-sm font-semibold"
                  >
                    <Send className="w-3.5 h-3.5 ml-2 rtl:rotate-180" />
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

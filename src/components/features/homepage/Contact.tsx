"use client";

import { useActionState, useState, useEffect } from "react";
import { contactAction } from "@/src/app/actions/contact/mutations";
import { IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";
import { Mail, Send, MessageSquare, Sparkles } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import Submit from "@/src/components/ui/formSubmitBtn";
import { useLocale } from "next-intl";

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
    { icon: Mail, label: "Email", value: "contact@ahmedlotfy.site", href: "mailto:contact@ahmedlotfy.site" },
    { icon: IoLogoLinkedin, label: "LinkedIn", value: "ahmed-lotfy-dev", href: "https://www.linkedin.com/in/ahmed-lotfy-dev/" },
    { icon: IoLogoGithub, label: "GitHub", value: "ahmed-lotfy-dev", href: "https://github.com/ahmed-lotfy-dev" },
  ];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" id="contact">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-[400px] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative mx-auto px-4 lg:px-8 z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase border border-primary/20 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {locale === "ar" ? "تواصل معي" : "Get In Touch"}
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            {locale === "ar" ? "عايز تعمل" : "Want to build"}{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {locale === "ar" ? "مشروع؟" : "something?"}
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            {locale === "ar"
              ? "أنا متاح للمشاريع الجديدة والاستشارات. تواصل معي عبر النموذج أو أي من القنوات التالية."
              : "I'm available for new projects and consulting. Reach out through the form or any of the channels below."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <span className="inline-flex p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/15">
                <MessageSquare className="w-5 h-5" />
              </span>
              {locale === "ar" ? "معلومات التواصل" : "Contact Info"}
            </h3>

            <address className="space-y-3 not-italic">
              {contactMethods.map((method, idx) => (
                <a
                  key={idx}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-card/20 hover:border-primary/25 hover:bg-card/30 transition-all duration-300"
                >
                  <div className="flex-shrink-0 p-2.5 rounded-lg bg-background border border-border group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
                    <method.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-0.5">{method.label}</p>
                    <p className="text-sm text-foreground font-medium truncate">{method.value}</p>
                  </div>
                </a>
              ))}
            </address>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-70 transition duration-700" />
              <div className="relative bg-card/30 backdrop-blur-xl border border-border/40 rounded-2xl p-6 sm:p-10">
                {state?.success && (
                  <div className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-medium">
                    {locale === "ar" ? "تم إرسال رسالتك بنجاح! سأتواصل معك قريباً." : "Message sent successfully! I'll get back to you soon."}
                  </div>
                )}
                <form action={formAction} className="space-y-6" noValidate>
                  <input type="hidden" name="locale" value={locale} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground/60 tracking-wide block">
                        {locale === "ar" ? "الاسم" : "Name"}
                      </label>
                      <Input type="text" name="name" className="rounded-xl border-border/40 bg-background/50 h-12 text-sm" placeholder={locale === "ar" ? "اسمك الكامل" : "Your full name"} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      {state?.error?.name && <p className="text-xs text-destructive font-medium">{state.error.name._errors.join(", ")}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground/60 tracking-wide block">
                        {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                      </label>
                      <Input type="email" name="email" className="rounded-xl border-border/40 bg-background/50 h-12 text-sm" placeholder={locale === "ar" ? "بريدك الإلكتروني" : "your@email.com"} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      {state?.error?.email && <p className="text-xs text-destructive font-medium">{state.error.email._errors.join(", ")}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground/60 tracking-wide block">
                      {locale === "ar" ? "الموضوع" : "Subject"}
                    </label>
                    <Input type="text" name="subject" className="rounded-xl border-border/40 bg-background/50 h-12 text-sm" placeholder={locale === "ar" ? "موضوع الرسالة" : "Message subject"} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                    {state?.error?.subject && <p className="text-xs text-destructive font-medium">{state.error.subject._errors.join(", ")}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground/60 tracking-wide block">
                      {locale === "ar" ? "الرسالة" : "Message"}
                    </label>
                    <Textarea name="message" rows={5} className="rounded-xl border-border/40 bg-background/50 text-sm resize-none" placeholder={locale === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                    {state?.error?.message && <p className="text-xs text-destructive font-medium">{state.error.message._errors.join(", ")}</p>}
                  </div>

                  <div>
                    <Submit btnText={locale === "ar" ? "إرسال" : "Send Message"} className="w-full sm:w-auto rounded-xl py-3.5 px-8 text-sm font-bold tracking-wide">
                      <Send className="w-4 h-4 ml-2 rtl:rotate-180" />
                    </Submit>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

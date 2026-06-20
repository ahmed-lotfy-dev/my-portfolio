"use client";

import { IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";
import { Mail, MessageSquare, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/src/lib/utils";

export default function Contact() {
  const locale = useLocale();
  const isRTL = locale === "ar";

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
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-[400px] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/2 translate-x-[300px] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container relative mx-auto px-6 lg:px-8 z-10">
        <div className="max-w-3xl mx-auto text-center mb-20 lg:mb-28 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-[0.22em] uppercase border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{locale === "ar" ? "تواصل معي" : "Get In Touch"}</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.05]">
            {locale === "ar" ? "عايز تعمل مشروع؟" : "Want to build something?"}
            <span className="text-primary italic block mt-2">
              {locale === "ar" ? "يكلمني" : "Let's talk"}
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {locale === "ar"
              ? "أنا متاح للمشاريع الجديدة والاستشارات. تواصل معي عبر أي من القنوات التالية."
              : "I'm available for new projects and consulting. Reach out through any of the channels below."}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {contactMethods.map((method, idx) => (
            <a
              key={idx}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-card/40 hover:shadow-xl hover:shadow-primary/5"
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
        </div>
      </div>
    </section>
  );
}

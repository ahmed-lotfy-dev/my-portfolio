"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { cn } from "@/src/lib/utils";

type TestimonialsClientProps = {
  isRTL: boolean;
  testimonials: Testimonial[];
};

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote_en: string;
  quote_ar: string;
};
export default function TestimonialsClient({ isRTL, testimonials }: TestimonialsClientProps) {
  return (
    <Section id="testimonials" variant="surface" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-14 space-y-5">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em]"
          >
            <Star className="w-3.5 h-3.5" />
            Testimonials
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Client <span className="text-primary italic">Feedback</span>
          </motion.h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Real testimonials from your dashboard. English and Arabic are both shown for each record.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, cardIndex) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: cardIndex * 0.1 }}
              className="relative h-full rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <Quote
                className={cn(
                  "w-8 h-8 text-primary/70 mb-4",
                  isRTL && "scale-x-[-1]"
                )}
              />
              <div className="space-y-4 mb-8">
                <p className="text-muted-foreground leading-relaxed">"{testimonial.quote_en}"</p>
                <p className="text-muted-foreground leading-relaxed" dir="rtl">
                  "{testimonial.quote_ar}"
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-foreground font-bold text-lg">{testimonial.name}</p>
                <p className="text-sm text-primary font-semibold">{testimonial.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}

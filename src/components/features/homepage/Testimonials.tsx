import { getLocale } from "next-intl/server";
import { getTestimonials } from "@/src/app/actions/testimonialsActions";
import TestimonialsClient from "./TestimonialsClient";

export default async function Testimonials() {
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const testimonials = await getTestimonials(true);

  if (testimonials.length === 0) return null;

  return <TestimonialsClient isRTL={isRTL} testimonials={testimonials} />;
}

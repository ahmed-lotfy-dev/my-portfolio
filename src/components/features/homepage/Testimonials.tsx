import { getLocale } from "next-intl/server";
import testimonialsData from "@/src/data/testimonials.json";
import TestimonialsClient from "./TestimonialsClient";

export default async function Testimonials() {
  const locale = await getLocale();
  const isRTL = locale === "ar";

  if (testimonialsData.length === 0) return null;

  return <TestimonialsClient isRTL={isRTL} testimonials={testimonialsData} />;
}

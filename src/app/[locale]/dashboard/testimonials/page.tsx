import { getTestimonials } from "@/src/app/actions/testimonialsActions";
import TestimonialList from "@/src/components/features/dashboard/testimonials/TestimonialList";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export default async function DashboardTestimonialsPage() {
  const testimonials = await getTestimonials();
  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin =
    session?.user?.role === "ADMIN" ||
    session?.user?.email === process.env.ADMIN_EMAIL;

  return (
    <div className="container mx-auto py-10 px-4">
      <TestimonialList testimonials={testimonials} isAdmin={isAdmin} />
    </div>
  );
}

import { getTestimonialById } from "@/src/app/actions/testimonials/queries";
import TestimonialForm from "@/src/components/features/dashboard/testimonials/TestimonialForm";
import { notFound } from "next/navigation";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}

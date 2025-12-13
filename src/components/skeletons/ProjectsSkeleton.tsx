import { Skeleton } from "@/src/components/ui/skeleton";
import Section from "@/src/components/ui/Section";

export default function ProjectsSkeleton() {
  return (
    <Section
      className="flex flex-col items-center p-4 py-20 border-t border-border/40 bg-background"
      id="projects"
    >
      <div className="container">
        {/* Header Skeleton */}
        <div className="text-center mb-16 space-y-4 flex flex-col items-center">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-10 w-64 sm:w-96 rounded-lg" />
        </div>

        {/* Grid Skeleton */}
        <div className="w-full grid gap-8 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] justify-items-stretch">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-full flex-col justify-between overflow-hidden border border-border bg-card/50 rounded-xl"
            >
              {/* Image Skeleton matching h-64 */}
              <Skeleton className="w-full h-64" />

              <div className="p-6 flex flex-col grow gap-4">
                <div>
                  {/* Title */}
                  <Skeleton className="h-8 w-3/4 mb-2 rounded-md" />
                  {/* Description (3 lines) */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  {/* View Case Study Link */}
                  <Skeleton className="h-5 w-32 mt-3 rounded-md" />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <Skeleton className="flex-1 h-10 rounded-md" />
                  <Skeleton className="flex-1 h-10 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

import { Skeleton } from "@/src/components/ui/skeleton";

export default function ProjectsSkeleton() {
  return (
    <section
      id="projects"
      className="border-b border-white/[0.07] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-5">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-12 w-64 rounded-lg sm:w-80" />
          </div>
          <Skeleton className="h-4 w-full max-w-sm rounded-md" />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-3xl border border-white/[0.07] bg-card ${
                i === 1 ? "md:col-span-2" : ""
              }`}
            >
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="space-y-4 p-6 md:p-8">
                <Skeleton className="h-3 w-10 rounded-md" />
                <Skeleton className="h-7 w-3/4 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

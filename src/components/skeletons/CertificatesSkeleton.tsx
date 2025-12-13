import { Skeleton } from "@/src/components/ui/skeleton";
import { Card } from "@/src/components/ui/card";

export default function CertificatesSkeleton() {
  return (
    <section
      className="flex flex-col items-center py-20 px-4 border-t border-border/40 bg-linear-to-b from-muted/20 to-transparent"
      id="certificates"
    >
      <div className="container">
        {/* Header Skeleton */}
        <div className="text-center mb-16 space-y-4 flex flex-col items-center">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-10 w-64 sm:w-96 rounded-lg" />
        </div>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col justify-between overflow-hidden shadow-lg p-6 h-[200px]">
            <div className="flex flex-col grow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  {/* Title Skeleton (2 lines) */}
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
                {/* Eye Icon Skeleton */}
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              </div>
              {/* Description Skeleton (3 lines) */}
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

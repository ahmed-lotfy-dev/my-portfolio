import { Skeleton } from "@/src/components/ui/skeleton";

export default function DashboardTableSkeleton() {
  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="relative rounded-xl border border-border/50 shadow-sm overflow-hidden h-20 mb-6 bg-card/80">
        <div className="flex items-center justify-between px-6 py-4 h-full">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Table Header Skeleton */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-border/30">
        <div className="col-span-1"></div>
        <div className="col-span-2"><Skeleton className="h-4 w-12" /></div>
        <div className="col-span-4"><Skeleton className="h-4 w-24" /></div>
        <div className="col-span-3 hidden md:block"><Skeleton className="h-4 w-16" /></div>
        <div className="col-span-2 text-right"><Skeleton className="h-4 w-12 ml-auto" /></div>
      </div>

      {/* Rows Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-12 gap-4 items-center p-4 rounded-xl border border-border/40 bg-card/50 h-24">
            {/* Drag Handle */}
            <div className="col-span-1 flex justify-center">
              <Skeleton className="h-5 w-5 rounded-sm" />
            </div>
            {/* Image */}
            <div className="col-span-2">
              <Skeleton className="h-16 w-24 rounded-lg" />
            </div>
            {/* Details */}
            <div className="col-span-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            {/* Tags */}
            <div className="col-span-3 hidden md:block space-y-1">
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

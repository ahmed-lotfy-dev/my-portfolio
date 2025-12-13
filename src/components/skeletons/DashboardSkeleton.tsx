import { Skeleton } from "@/src/components/ui/skeleton";
import { Card } from "@/src/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full p-5 pt-10">
      {/* Welcome Skeleton */}
      <Skeleton className="h-10 w-64 mb-4" />

      {/* Quick Stats Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-start">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col justify-center items-center gap-4 p-6 bg-muted h-[140px]">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>

      {/* Analytics Chart Skeleton */}
      <div className="w-full h-[400px] border border-border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex items-end gap-2 h-[300px]">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${Math.random() * 80 + 20}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

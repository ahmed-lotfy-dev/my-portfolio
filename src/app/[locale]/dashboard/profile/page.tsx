import ProfileForm from "@/src/components/features/dashboard/profile/ProfileForm";
import { Suspense } from "react";
import DashboardSkeleton from "@/src/components/skeletons/DashboardSkeleton";

export default async function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 w-full p-5 pt-10 min-h-screen">
      <Suspense fallback={<DashboardSkeleton />}>
        <ProfileForm />
      </Suspense>
    </div>
  );
}

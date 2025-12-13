import { Suspense } from "react";
import CertificateListContainer from "@/src/components/dashboard-components/certificate/CertificateListContainer";
import DashboardTableSkeleton from "@/src/components/skeletons/DashboardTableSkeleton";

export default function CertificatesPage() {
  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex flex-col justify-center items-center w-full">
        <Suspense fallback={<DashboardTableSkeleton />}>
          <CertificateListContainer />
        </Suspense>
      </div>
    </div>
  );
}

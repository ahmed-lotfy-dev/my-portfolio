import { Suspense } from "react";
import ProjectListContainer from "@/src/components/dashboard-components/project/ProjectListContainer";
import DashboardTableSkeleton from "@/src/components/skeletons/DashboardTableSkeleton";

export default function ProjectsPage({ }) {
  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex flex-col justify-center items-center w-full">
        <Suspense fallback={<DashboardTableSkeleton />}>
          <ProjectListContainer />
        </Suspense>
      </div>
    </div>
  );
}

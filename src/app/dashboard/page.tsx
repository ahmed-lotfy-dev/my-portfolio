import { Card } from "@/src/components/ui/card";
import getAllCertificates from "../lib/getCertificates";
import getAllProjects from "../lib/getProjects";

import Welcome from "@/src/components/dashboardcomponents/Welcome";

export default async function Page({}) {
  const { allCertificates } = await getAllCertificates();
  const { allProjects } = await getAllProjects();
  const projectsCount = allProjects?.length;
  const certificatesCount = allCertificates?.length;
  return (
    <div className="group flex flex-col gap-3 w-full justify-start items-start mt-10">
      <Welcome />
      <div className="flex gap-10 justify-start text-center w-full">
        <Card className="group-hover:bg-gray-500 ml-10 mt-10 p-10 bg-gray-200 w-[200px]">
          <h2>Projects</h2>
          <p>{projectsCount}</p>
        </Card>

        <Card className="group-hover:bg-gray-500 ml-10 mt-10 p-10 bg-gray-200 w-[200px] ">
          <h2>Certificates</h2>
          <p>{certificatesCount}</p>
        </Card>
      </div>
    </div>
  );
}

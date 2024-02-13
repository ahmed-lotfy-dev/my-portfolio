import { Card } from "@/src/components/ui/card";
import { getAllCertificates } from "@/src/app/actions/certificatesActions";
import { getAllProjects } from "@/src/app/actions/projectsActions";

import Welcome from "@/src/components/dashboard-components/Welcome";
import Link from "next/link";

export default async function Page({}) {
  const { allCertificates } = await getAllCertificates();
  const { allProjects } = await getAllProjects();
  const projectsCount = allProjects?.length;
  const certificatesCount = allCertificates?.length;
  return (
    <div className="group flex flex-col flex-wrap gap-3 w-full justify-start items-start mt-10">
      <Welcome />
      <div className="flex gap-10 flex-wrap justify-center items-center text-center md:justify-start pl-0 md:pl-10 w-full mt-6">
        <Link href={"/dashboard/projects"}>
          <Card className="hover:bg-gray-500 hover:text-gray-200 cursor-pointer p-10 bg-gray-200 w-[200px]">
            <h2>Projects</h2>

            <p>{projectsCount}</p>
          </Card>
        </Link>
        <Link href={"/dashboard/certificates"}>
          <Card className="hover:bg-gray-500 hover:text-gray-200 cursor-pointer p-10 bg-gray-200 w-[200px] ">
            <h2>Certificates</h2>

            <p>{certificatesCount}</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

import { Card } from "@/src/components/ui/card";
import { getAllCertificates } from "../lib/getCertificates";
import { getAllProjects } from "../lib/getProjects";

import Welcome from "@/src/components/dashboard-components/Welcome";
import Link from "next/link";

export default async function Page({}) {
  const { allCertificates } = await getAllCertificates();
  const { allProjects } = await getAllProjects();
  const projectsCount = allProjects?.length;
  const certificatesCount = allCertificates?.length;
  return (
    <div className="group flex flex-col gap-3 w-full justify-start items-start mt-10">
      <Welcome />
      <div className="flex gap-10 justify-start text-center w-full">
        <Link href={"/dashboard/projects"}>
          <Card className="hover:bg-gray-500 hover:text-gray-200 cursor-pointer ml-10 mt-10 p-10 bg-gray-200 w-[200px]">
            <h2>Projects</h2>
            <p>{projectsCount}</p>
          </Card>
        </Link>
        <Link href={"/dashboard/certificates"}>
          <Card className="hover:bg-gray-500 hover:text-gray-200 cursor-pointer ml-10 mt-10 p-10 bg-gray-200 w-[200px] ">
            <h2>Certificates</h2>
            <p>{certificatesCount}</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

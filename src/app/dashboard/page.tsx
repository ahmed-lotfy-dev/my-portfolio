import getAllCertificates from "../lib/getCertificates";
import getAllProjects from "../lib/getProjects";

import Welcome from "@/src/components/dashboardcomponents/Welcome";

export default async function Page({}) {
  // const { allCertificates } = await getAllCertificates()
  // const { allProjects } = await getAllProjects()

  return (
    <div className="min-h-screen flex flex-col gap-3 w-full justify-start items-center mt-10">
      <Welcome />
    </div>
  );
}

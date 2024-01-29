import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/lib/auth";

import { NotAuthenticated } from "@/src/components/dashboardcomponents/NotAuthenticated";
import { AddCertificateComponent } from "@/src/components/dashboardcomponents/AddCertificat";
import { CertificateList } from "@/src/components/dashboardcomponents/CertificatesList";
import getAllCertificates from "@/src/app/lib/getCertificates";

export default async function AddProject({}) {
  const user = await getServerSession(authOptions);
  const { allCertificates } = await getAllCertificates();

  return (
    <div className="w-full flex justify-center items-start">
      {!user && <NotAuthenticated />}
      {user && (
        <div className="flex flex-col justify-center items-center w-full">
          <AddCertificateComponent />
          <CertificateList allCertificates={allCertificates} />
        </div>
      )}
    </div>
  );
}

import { NotAuthenticated } from "@/src/components/dashboard-components/NotAuthenticated";
import { CertificateList } from "@/src/components/dashboard-components/CertificatesList";
import { getAllCertificates } from "@/src/app/lib/getCertificates";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { auth } from "@/src/auth";
import { AddCertificateComponent } from "@/src/components/dashboard-components/AddCertificate";

export default async function AddCertifiate({}) {
  const session = await auth();
  const user = session?.user;
  const { allCertificates } = await getAllCertificates();

  return (
    <div className="w-full flex justify-center items-start pt-14">
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

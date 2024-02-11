import { CertificateList } from "@/src/components/dashboard-components/certificate/CertificatesList";
import { getAllCertificates } from "@/src/app/lib/getCertificates";
import { auth } from "@/auth";
import { AddCertificateComponent } from "@/src/components/dashboard-components/certificate/AddCertificate";

export default async function AddCertifiate({}) {
  const session = await auth();
  const user = session?.user;
  const { allCertificates } = await getAllCertificates();

  return (
    <div className="w-full flex justify-center items-start pt-14">
        <div className="flex flex-col justify-center items-center w-full">
          <AddCertificateComponent />
          <CertificateList allCertificates={allCertificates} />
        </div>
    </div>
  );
}

import { CertificateList } from "@/src/components/dashboard-components/certificate/CertificatesList";
import { getAllCertificates } from "@/src/app/actions/certificatesActions";
import { AddCertificateComponent } from "@/src/components/dashboard-components/certificate/AddCertificate";

export default async function AddCertifiate({}) {
  const { allCertificates } = await getAllCertificates();

  return (
    <div className="w-full flex justify-center items-start pt-14">
      <div className="flex flex-col justify-center items-center w-full">
        <CertificateList allCertificates={allCertificates} />
      </div>
    </div>
  );
}

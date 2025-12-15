import { getAllCertificatesForDashboard } from "@/src/app/actions/certificatesActions";
import { CertificateList } from "./CertificatesList";

export default async function CertificateListContainer() {
  const { allCertificates } = await getAllCertificatesForDashboard();
  return <CertificateList allCertificates={allCertificates} />;
}

import { getAllCertificatesForDashboard } from "@/src/app/actions/certificates/queries";
import { CertificateList } from "./CertificatesList";

export default async function CertificateListContainer() {
  const { allCertificates } = await getAllCertificatesForDashboard();
  return <CertificateList allCertificates={allCertificates} />;
}

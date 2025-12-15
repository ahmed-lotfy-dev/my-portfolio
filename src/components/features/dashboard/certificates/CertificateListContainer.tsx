import { getAllCertificates } from "@/src/app/actions/certificatesActions";
import { CertificateList } from "./CertificatesList";

export default async function CertificateListContainer() {
  const { allCertificates } = await getAllCertificates();
  return <CertificateList allCertificates={allCertificates} />;
}

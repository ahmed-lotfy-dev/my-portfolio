import { getAllCertificates } from "@/src/app/actions/certificatesActions";
import { getTranslations } from "next-intl/server";
import CertificatesList from "./CertificatesList";

export default async function Certificates() {
  const { allCertificates } = await getAllCertificates();
  const t = await getTranslations("certificates");

  return (
    <section
      className="flex flex-col items-center py-20 px-4 border-t border-border/40 bg-linear-to-b from-muted/20 to-transparent"
      id="certificates"
    >
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase border border-primary/20 backdrop-blur-sm">
            {t("title")}
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {t("description")}
          </p>
        </div>
      </div>

      <CertificatesList certificates={allCertificates} />
    </section>
  );
}

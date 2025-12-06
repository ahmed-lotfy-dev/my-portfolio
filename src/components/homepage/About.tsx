import Image from "next/image";
import myImage from "@/public/images/AShouman_3d_vector_human_with_glasses_developer_coding_09763759-3521-438f-a963-0c61670df468.png";
import { getTranslations } from "next-intl/server";

export default async function About() {
  const t = await getTranslations("about");

  return (
    <section
      className="flex flex-col items-center py-20 px-4 border-t border-border/40 bg-linear-to-b from-muted/20 to-transparent"
      id="about"
    >
      <div className="text-center mb-16 space-y-4">
        <h2 className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase border border-primary/20 backdrop-blur-sm">
          {t("title")}
        </h2>
      </div>
      <div className="container flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <Image
            src={myImage}
            width={400}
            height={400}
            alt="Ahmed Lotfy"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 text-lg text-muted-foreground space-y-4">
          <p className="mb-8">{t("description1")}</p>
          <p className="mb-8">{t("description2")}</p>
          <p className="mb-8">{t("description3")}</p>
        </div>
      </div>
    </section>
  );
}

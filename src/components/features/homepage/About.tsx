import Image from "next/image";
import myImage from "@/public/images/optimized/About-Image.webp";
import { getTranslations, getLocale } from "next-intl/server";

export default async function About() {
  const t = await getTranslations("about");
  const locale = await getLocale();
  const isRTL = locale === "ar";

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
      <div className="container flex flex-col md:flex-row items-center gap-12 transform">
        <div className="md:w-1/2">
          <Image
            src={myImage}
            width={400}
            height={400}
            quality={75}
            alt="Ahmed Lotfy"
            className={`rounded-lg shadow-lg ${isRTL ? "scale-x-[-1]" : ""}`}
          />
        </div>
        <div className="md:w-1/2 text-lg text-muted-foreground space-y-4">
          <p className="mb-8">
            I am a Full-Stack Engineer focused on building stable, production-ready applications.
            I specialize in the modern React ecosystem (Next.js, TypeScript) but I place equal
            emphasis on backend performance, database optimization, and DevOps practices using Docker and Linux.
          </p>
          <p className="mb-8">
            My path to software engineering started with a deep background in hardware and IT systems.
            Unlike many developers who only know code, I understand the machine underneath.
            This experience allows me to write more efficient software, debug complex production
            issues faster, and respect system resources.
          </p>
          <p className="mb-8">
            I value reliability over hype. I build software that works, scales, and is easy to maintain.
            I am currently available for full-time roles or complex freelance projects where I can
            help teams ship high-quality products.
          </p>
        </div>
      </div>
    </section>
  );
}
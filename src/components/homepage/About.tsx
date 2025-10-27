import Image from "next/image"
import myImage from "@/public/images/AShouman_3d_vector_human_with_glasses_developer_coding_09763759-3521-438f-a963-0c61670df468.png"
import { getTranslations } from "next-intl/server"

export default async function About() {
  const t = await getTranslations("about")

  return (
    <section className="flex flex-col items-center my-16 p-4" id="about">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-foreground dark:text-blue-700 tracking-tight sm:text-5xl">
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
        <div className="md:w-1/2 text-lg text-gray-700 dark:text-gray-300 space-y-4">
          <p className="mb-8">{t("description1")}</p>
          <p className="mb-8">{t("description2")}</p>
          <p className="mb-8">{t("description3")}</p>
        </div>
      </div>
    </section>
  )
}

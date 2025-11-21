import { getAllCertificates } from "@/src/app/actions/certificatesActions"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/ui/hover-card"
import { Eye } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function Certificates() {
  const { allCertificates } = await getAllCertificates()
const t = await getTranslations("certificates")

  return (
    <section className="flex flex-col items-center my-16 p-4" id="certificates">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-foreground dark:text-blue-700 tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
            {t("description")}
          </p>
        </div>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allCertificates?.map((cert: any) => (
          <HoverCard key={cert.id}>
            <HoverCardTrigger asChild>
              <Card className="flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold" title={cert.title}>
                        {cert.title}
                      </h3>
                    </div>
                    <Eye className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                    <Link href={cert.courseLink} target="_blank">
                      <Button variant="outline">{t("course")}</Button>
                    </Link>
                    <Link href={cert.profLink} target="_blank">
                      <Button>{t("certificate")}</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-[320px] sm:w-[420px] max-w-[90vw] p-2">
              <Image
                src={cert.imageLink}
                alt={cert.title}
                width={420}
                height={315}
                className="rounded-md w-full h-auto"
              />
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </section>
  )
}

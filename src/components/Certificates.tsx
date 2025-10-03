import { getAllCertificates } from "@/src/app/actions/certificatesActions"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/ui/hover-card"
import { Certificate } from "@prisma/client"
import { Eye } from "lucide-react"

export default async function Certificates() {
  const { allCertificates } = await getAllCertificates()
  return (
    <section
      className="flex flex-col items-center my-16"
      id="certificates"
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight sm:text-5xl">
          My <span className="text-blue-600">Certificates</span>
        </h2>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          A collection of my certifications and qualifications. Hover over a
          card to see the certificate.
        </p>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allCertificates?.map((cert: Certificate) => (
          <HoverCard key={cert.id}>
            <HoverCardTrigger asChild>
              <Card className="flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold flex-grow pr-2">
                      {cert.title}
                    </h3>
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                    <Link href={cert.courseLink} target="_blank">
                      <Button variant="outline">Course</Button>
                    </Link>
                    <Link href={cert.profLink} target="_blank">
                      <Button>Proof</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              <Image
                src={cert.imageLink}
                alt={cert.title}
                width={400}
                height={300}
                className="rounded-md"
              />
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </section>
  )
}

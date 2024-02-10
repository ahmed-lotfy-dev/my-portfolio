import { getAllCertificates } from "@/lib/getCertificates";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Certificate } from "../db/schema/certificates";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

export default async function certificates() {
  const { allCertificates } = await getAllCertificates();
  return (
    <section
      className="bg-blue-200 flex flex-col mx-auto justify-center items-center sm:items-start p-6 max-w-screen-xl mb-10"
      id="certificates"
    >
      <div className="container max-w-screen-xl justify-center items-center p-6">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-center">Certificates</h2>
        </div>
        <div className="flex flex-col gap-y-6">
          {allCertificates?.map((cert: Certificate) => (
            <Accordion
              key={cert.id}
              className="gap-y-6"
              type="single"
              collapsible
            >
              <AccordionItem value={cert.certTitle} className="">
                <AccordionTrigger className="font-bold text-1xl m-auto text-center">
                  {cert.certTitle}
                </AccordionTrigger>
                <AccordionContent className="">
                  <Image
                    className="m-auto my-6 aspect-auto object-cover"
                    loading="lazy"
                    src={cert.certImageLink}
                    width={500}
                    height={500}
                    alt={`${cert.certTitle} certification image`}
                  />
                  <div className="text-center space-x-5">
                    <Link href={cert.courseLink} target="_blank">
                      <Button>Course Link</Button>
                    </Link>
                    <Link href={cert.profLink} target="_blank">
                      <Button>Cerification Proof</Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

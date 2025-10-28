"use client";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import { deleteCertificateAction } from "@/src/app/actions/certificatesActions";
import { EditPopover } from "../EditPopover";
import ImageViewer from "@/src/components/ui/ImageViewer";
import { IoImage } from "react-icons/io5";
function CertificateList({ allCertificates }: any) {
  return (
    <div className="w-full">
      <div className="m-auto w-full lg:w-2/3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-extrabold">
                Certificate Title
              </TableHead>
              <TableHead className="font-extrabold">Course Author</TableHead>
              <TableHead className="font-extrabold">Course Link</TableHead>
              <TableHead className="font-extrabold">
                Certificate Proof
              </TableHead>
              <TableHead className="font-extrabold">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCertificates?.map((cert: any) => (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">
                  <Link href={`/certificates/${cert.title}`}>
                    {cert.title}
                  </Link>
                </TableCell>
                <TableCell>{cert.desc}</TableCell>
                <TableCell>
                  <Link href={cert.courseLink} target="_blank">
                    Course Link
                  </Link>
                </TableCell>
                <TableCell>
                  <ImageViewer
                    imageUrl={cert.profLink}
                    altText={`Certificate proof for ${cert.title}`}
                    trigger={
                      <div className="relative group cursor-pointer">
                        <img
                          src={cert.profLink}
                          alt={`Certificate proof for ${cert.title}`}
                          className="w-16 h-16 object-cover rounded border transition-all duration-300 group-hover:w-32 group-hover:h-32 group-hover:z-10 group-hover:shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 rounded flex items-center justify-center">
                          <IoImage className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    }
                  />
                </TableCell>

                <TableCell>
                  <EditPopover
                    EditedObject={cert}
                    onDeleteClick={() => deleteCertificateAction(cert.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export { CertificateList };

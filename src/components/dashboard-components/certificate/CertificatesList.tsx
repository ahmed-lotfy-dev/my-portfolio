"use client";

import Link from "next/link";
import { Certificate } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import { deleteCertificateAction } from "@/src/app/actions";
import { EditPopover } from "../EditPopover";

type Props = {
  allCertificates: Certificate[] | undefined;
};

function CertificateList({ allCertificates }: Props) {
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
            {allCertificates?.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">
                  <Link href={`/certificates/${cert.title}`}>{cert.title}</Link>
                </TableCell>
                <TableCell>{cert.desc}</TableCell>
                <TableCell>
                  <Link href={cert.profLink} target="_blank">
                    Course Link
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={cert.profLink} target="_blank">
                    Certificate Proof
                  </Link>
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

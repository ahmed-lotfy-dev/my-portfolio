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
} from "@/src/app/components/ui/table";

import { HiEllipsisVertical, HiMiniTrash } from "react-icons/hi2";
import { AiTwotoneEdit } from "react-icons/ai";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Card } from "../ui/card";

import { deleteCertificateAction } from "../../actions";
import { Button } from "../ui/button";
import { EditCertificate } from "./EditCertificate";
import { EditPopover } from "../ui/EditPopover";

type Props = {
  allCertificates: Certificate[] | undefined;
};
function CertificateList({ allCertificates }: Props) {
  console.log(allCertificates);
  return (
    <div className="mt-16 w-full">
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
                <TableCell className="font-medium">{cert.certTitle}</TableCell>
                <TableCell>{cert.certDesc}</TableCell>
                <TableCell>
                  <Link href={cert.certProfLink} target="_blank">
                    Course Link
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={cert.certProfLink} target="_blank">
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

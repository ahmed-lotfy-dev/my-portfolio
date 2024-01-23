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

type Props = {
  allCertificates: Certificate[] | undefined;
};
export default function CertificateList({ allCertificates }: Props) {
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
                  {" "}
                  <Link href={cert.certProfLink} target="_blank">
                    Certificate Proof
                  </Link>
                </TableCell>
                <TableCell>
                  {" "}
                  <Popover>
                    <PopoverTrigger>
                      <HiEllipsisVertical size={22} />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="p-5 cursor-pointer">
                        <div
                          className="flex justify-start items-center"
                          // onClick={() => editProjectAction(proj.id)}
                        >
                          <AiTwotoneEdit className="mr-3" size={20} />
                          <p>Edit Project</p>
                        </div>
                        <div
                          className="flex justify-start items-center mt-4 cursor-pointer"
                          onClick={() => deleteCertificateAction(cert.id)}
                        >
                          <HiMiniTrash className="mr-3" size={20} />
                          <p>Delete Project</p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

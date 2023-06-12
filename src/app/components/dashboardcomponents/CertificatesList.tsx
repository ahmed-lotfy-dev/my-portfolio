"use client"

import Link from "next/link"
import { Certificate } from "@prisma/client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/app/components/ui/table"

type Props = {
  allCertificates: Certificate[] | undefined
}
export default function ProjectList({ allCertificates }: Props) {
  console.log(allCertificates)
  return (
    <div className='mt-16 w-full'>
      <div className='w-1/2 m-auto'>
        <Table className=''>
          <TableHeader>
            <TableRow>
              <TableHead className='font-extrabold'>
                Certificate Title
              </TableHead>
              <TableHead className='font-extrabold'>Course Author</TableHead>
              <TableHead className='font-extrabold'>Course Link</TableHead>
              <TableHead className='font-extrabold'>
                Certificate Proof
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCertificates?.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell className='font-medium'>{cert.certTitle}</TableCell>
                <TableCell>{cert.certDesc}</TableCell>
                <TableCell>
                  <Link href={cert.certProfLink} target='_blank'>
                    Course Link
                  </Link>
                </TableCell>
                <TableCell className='text-right'>
                  {" "}
                  <Link href={cert.certProfLink} target='_blank'>
                    Certificate Proof
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

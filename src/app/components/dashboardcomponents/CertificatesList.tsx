"use client"

import { Certificate } from "@prisma/client"

type Props = {
  allCertificates: Certificate[] | undefined
}
export default function ProjectList({ allCertificates }: Props) {
  console.log(allCertificates)
  return (
    <div className='mt-6'>
      {allCertificates?.map((proj) => (
        <div key={proj.id}>{proj.certTitle}</div>
      ))}
    </div>
  )
}

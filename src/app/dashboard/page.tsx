import getAllCertificates from "../lib/getCertificates"
import getAllProjects from "../lib/getProjects"
import Image from "next/image"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card"

import Welcome from "./components/Welcome"

type Props = {}

export default async function Page({}: Props) {
  const { allCertificates } = await getAllCertificates()
  const { allProjects } = await getAllProjects()

  return (
    <div className='min-h-screen flex flex-col gap-3 w-full justify-start items-center mt-10'>
      <Welcome />
      <div className='flex gap-5 w-full justify-center items-center'>
        <Card className='w-[350px] flex flex-col justify-center items-center'>
          <CardHeader>
            <CardTitle className='text-3xl'>Projects Count</CardTitle>
            <CardContent className='text-3xl text-center py-3'>
              {allProjects?.length}
            </CardContent>
          </CardHeader>
        </Card>
        <Card className='w-[350px] flex flex-col justify-center items-center'>
          <CardHeader>
            <CardTitle className='text-3xl'>Certificates Count</CardTitle>
            <CardContent className='text-3xl text-center py-3'>
              {allCertificates?.length}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
      <div className='grid grid-cols-1 gap-20'>
        <div className='w-full'>
          {allCertificates?.length ? (
            allCertificates.map((cert) => (
              <div key={cert.id} className=''>
                <h1>{cert.certTitle}</h1>
                <Image
                  width={500}
                  height={300}
                  src={cert.certImageLink}
                  alt=''
                  key={cert.id}
                  content='Content-Disposition: inline'
                />
              </div>
            ))
          ) : (
            <>
              <p>No certificates available.</p>
            </>
          )}
        </div>
        <div className='w-full'>
          {allProjects?.length ? (
            allProjects.map((proj) => (
              <div key={proj.id}>
                <h1>{proj.projTitle}</h1>
                <Image
                  width={500}
                  height={300}
                  src={proj.projImageLink}
                  alt=''
                  key={proj.id}
                  content='Content-Disposition: inline'
                />
              </div>
            ))
          ) : (
            <>
              <p>No certificates available.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

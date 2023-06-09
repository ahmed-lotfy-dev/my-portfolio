import getAllCertificates from "../lib/getCertificates"
import getAllProjects from "../lib/getProjects"

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
  console.log(allCertificates)
  console.log(allProjects)

  return (
    <div className='min-h-full flex flex-col gap-3 w-full justify-start items-center mt-10'>
      <Welcome />
      <div className='flex gap-5'>
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
        <div>
          {allCertificates?.length ? (
            allCertificates.map((cert) => (
              <>
                <h1>{cert.certTitle}</h1>
                <img
                  src={cert.certImageLink}
                  alt=''
                  key={cert.id}
                  content='Content-Disposition: inline'
                />
              </>
            ))
          ) : (
            <>
              <p>No certificates available.</p>
            </>
          )}
          {allProjects?.length ? (
            allProjects.map((cert) => (
              <>
                <h1>{cert.projTitle}</h1>
                <img
                  src={cert.projImageLink}
                  alt=''
                  key={cert.id}
                  content='Content-Disposition: inline'
                />
              </>
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

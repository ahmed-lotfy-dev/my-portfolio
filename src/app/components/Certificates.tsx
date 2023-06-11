import getAllCertificates from "../lib/getCertificates"
export const dynamic = "force-dynamic"

export type Certificate = {
  id: string
  certTitle: string
  certDesc: string
  certImage: string
  courseLink: string
  certProfLink: string
}


import { type ReactNode } from "react"

export default async function certificates() {
  const allCertificates = await getAllCertificates()
  return (
    <section className='bg-blue-200 flex justify-center items-center text-center sm:text-start p-6 '>
      <div className='container max-w-screen-xl justify-center items-center p-6'>
        <div className='p-6'>
          <h2 className='text-3xl font-bold text-center'>Certificates</h2>
          <h3></h3>
        </div>
        <div></div>
      </div>
    </section>
  )
}

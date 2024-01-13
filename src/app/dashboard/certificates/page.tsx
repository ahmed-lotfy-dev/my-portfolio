import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"

import NotAuthenticated from "@/src/app/components/dashboardcomponents/NotAuthenticated"
import AddCertificateComponent from "@/src/app/components/dashboardcomponents/AddCertificateComponent"
import CertificatesList from "@/src/app/components/dashboardcomponents/CertificatesList"
import getAllCertificates from "../../lib/getCertificates"

export default async function AddProject({}) {
  const user = await getServerSession(authOptions)
  const { allCertificates } = await getAllCertificates()

  return (
    <div className='w-full flex justify-center items-start'>
      {!user && <NotAuthenticated />}
      {user && (
        <div className='flex flex-col justify-center items-center w-full'>
          <AddCertificateComponent />
          <CertificatesList allCertificates={allCertificates} />
        </div>
      )}
    </div>
  )
}

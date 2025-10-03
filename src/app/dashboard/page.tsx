import { Card } from "@/src/components/ui/card"
import { getAllCertificates } from "@/src/app/actions/certificatesActions"
import { getAllProjects } from "@/src/app/actions/projectsActions"

import Welcome from "@/src/components/dashboard-components/Welcome"
import Link from "next/link"
import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"
import SignInForm from "@/src/components/auth/SignInForm"

export default async function Page({}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return (
      <div className="w-full p-5 pt-10">
        <div className="max-w-xl">
          <SignInForm />
        </div>
      </div>
    )
  }

  const { allCertificates } = await getAllCertificates()
  const { allProjects } = await getAllProjects()
  const projectsCount = allProjects?.length
  const certificatesCount = allCertificates?.length
  return (
    <div className="flex flex-col gap-6 w-full p-5 pt-10">
      <Welcome />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-start">
        <Link href={"/dashboard/projects"}>
          <Card className="cursor-pointer p-6 bg-muted hover:bg-accent/30 transition-colors">
            <h2 className="text-sm font-medium text-muted-foreground">
              Projects
            </h2>
            <p className="text-3xl font-bold">{projectsCount}</p>
          </Card>
        </Link>
        <Link href={"/dashboard/certificates"}>
          <Card className="cursor-pointer p-6 bg-muted hover:bg-accent/30 transition-colors">
            <h2 className="text-sm font-medium text-muted-foreground">
              Certificates
            </h2>
            <p className="text-3xl font-bold">{certificatesCount}</p>
          </Card>
        </Link>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        <h1>Welcome {session.user.name}</h1>
      </div>
    </div>
  )
}

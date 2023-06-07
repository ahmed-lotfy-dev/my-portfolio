import Aside from "./components/aside"
import Loading from "./components/loading"
import Notauth from "./components/notauth"

// import { useSession, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route"

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  // const { data: session, status } = useSession()
  const session = await getServerSession(authOptions)
  console.log(session)
  const role = session?.user?.role
  // if (!session) {
  //   return <Loading />
  // }
  if (!session) {
    return <Notauth />
  }
  console.log(session)
  if (role === "ADMIN" || role === "USER") {
    return (
      <div className='flex h-[calc(100vh_-_10vh)] w-full'>
        <Aside />
        {children}
      </div>
    )
  }
}

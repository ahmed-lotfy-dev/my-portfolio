import Aside from "./components/aside"
import Loading from "./components/loading"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-[calc(100vh_-_10vh)] w-full'>
      <Aside />
      {children}
    </div>
  )
}

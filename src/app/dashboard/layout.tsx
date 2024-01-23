import Aside from "../components/dashboardcomponents/Aside"

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

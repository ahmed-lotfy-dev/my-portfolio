"use client"
import toast, { Toaster } from "react-hot-toast"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover"

import { useSession } from "next-auth/react"

import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

import { AddCertificateAction } from "../../_actions"

import NotAuthenticated from "@/src/components/dashboardcomponents/NotAuthenticated"
import AddCertificateComponent from "@/src/components/dashboardcomponents/AddCertificateComponent"
import CertificatesList from "@/src/components/dashboardcomponents/CertificatesList"

const notify = (message: string, status: boolean) =>
  status ? toast.success(message) : toast.error(message)


export default function AddProject({}) {
  const { data: session } = useSession()
  const emailAddress = session?.user.email
  const user = session?.user
  console.log(emailAddress)

  return (
    <div className='w-full flex justify-center items-start'>
      {!user && <NotAuthenticated />}
      {user && (
        <div className='flex flex-col justify-center items-center'>
          <AddCertificateComponent />
          <CertificatesList />
        </div>
      )}
    </div>
  )
}

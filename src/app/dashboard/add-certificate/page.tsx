"use client"
import { useState } from "react"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"

import { AddCertificateAction } from "../../_actions"
import { Input } from "@/src/app/components/ui/input"
import { Label } from "@/src/app/components/ui/label"
import { useUser } from "@clerk/nextjs"

type Props = {}

const notify = (message: string, status: boolean) =>
  status ? toast.success(message) : toast.error(message)

export default function AddProject({}: Props) {
  const [image, setImage] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const emailAddress = useUser().user?.emailAddresses[0].emailAddress as any

  return (
    <div className='flex w-full min-h-full'>
      <form
        className='flex flex-col justify-center items-center w-full gap-5 bg-gray-100 text-black '
        action={AddCertificateAction}
      >
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='certTitle'>
            Certificate Title
          </label>
          <input type='text' name='certTitle' />
        </div>
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='certDesc'>
            Certificate Description
          </label>
          <input type='text' name='certDesc' />
        </div>
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='courseLink'>
            Certificate Repo Link
          </label>
          <input type='text' name='courseLink' />
        </div>
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='certProfLink'>
            Certificate Live Link
          </label>
          <input type='text' name='certProfLink' />
        </div>
        <Label htmlFor='picture'>Picture</Label>
        <Input className='w-1/4' type='file' name='certImageLink' />
        <Input
          className='w-1/4'
          type='hidden'
          name='emailAddress'
          value={emailAddress}
        />

        {previewUrl ? (
          <Image src={image!} width={300} height={300} alt={`${previewUrl}`} />
        ) : (
          ""
        )}

        <Toaster position='top-right' />
        <button
          type='submit'
          onClick={() => {
            if (emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
              console.log(emailAddress)
              console.log(process.env.NEXT_PUBLIC_ADMIN_EMAIL)
              notify("sorry you don't have admin priviliges", false)
            } else {
              notify("Adding Completed Successfully", true)
            }
          }}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

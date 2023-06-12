"use client"
import { useState, useRef } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/app/components/ui/popover"

import { Button } from "../ui/button"
import { Input } from "@/src/app/components/ui/input"
import { Label } from "@/src/app/components/ui/label"
import { AddCertificateAction } from "@/src/app/_actions"

import toast, { Toaster } from "react-hot-toast"

import { useSession } from "next-auth/react"

const notify = (message: string, status: boolean) =>
  status ? toast.success(message) : toast.error(message)

export default function AddCertificateComponent() {
  const formRef = useRef<HTMLFormElement>(null)
  const { data: session } = useSession()
  const emailAddress = session?.user.email

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex w-full min-h-full justify-center items-center mt-6'>
        <Popover>
          <Button>
            <PopoverTrigger>Add New Certificate</PopoverTrigger>
          </Button>
          <PopoverContent className='w-[500px] mt-7'>
            <form
              className='flex flex-col justify-center items-center w-full gap-5 bg-gray-100 text-black'
              action={AddCertificateAction}
            >
              <div className='flex flex-col items-center'>
                <Label className='mb-5 m-10' htmlFor='certTitle'>
                  Certificate Title
                </Label>
                <Input type='text' name='certTitle' />
              </div>
              <div className='flex flex-col items-center'>
                <Label className='mb-5' htmlFor='certDesc'>
                  Certificate Description
                </Label>
                <Input type='text' name='certDesc' />
              </div>
              <div className='flex flex-col items-center'>
                <Label className='mb-5' htmlFor='courseLink'>
                  Course Link
                </Label>
                <Input type='text' name='courseLink' />
              </div>
              <div className='flex flex-col items-center'>
                <Label className='mb-5' htmlFor='certProfLink'>
                  Certificate Proof
                </Label>
                <Input type='text' name='certProfLink' />
              </div>
              <Label htmlFor='picture'>Certificate Image</Label>
              <Input className='w-1/4' type='file' name='certImageLink' />

              <Input type='hidden' name='emailAddress' value={emailAddress} />

              <button
                className='m-10'
                type='submit'
                onClick={() => {
                  if (emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                    console.log(emailAddress)
                    notify("sorry you don't have admin priviliges", false)
                  } else {
                    notify("Adding Completed Successfully", true)
                  }
                }}
              >
                Submit
              </button>
            </form>
          </PopoverContent>
        </Popover>
        <Toaster position='top-right' />
      </div>
    </div>
  )
}

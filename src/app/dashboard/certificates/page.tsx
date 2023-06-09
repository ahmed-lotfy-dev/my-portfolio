"use client"
import { useState } from "react"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/app/components/ui/dialog"
import { Input } from "@/src/app/components/ui/input"
import { Label } from "@/src/app/components/ui/label"
import { AddCertificateAction } from "../../_actions"

import { useUser } from "@clerk/nextjs"
import { TagsInput } from "react-tag-input-component"

const notify = (message: string, status: boolean) =>
  status ? toast.success(message) : toast.error(message)

export default function AddProject({}) {
  const emailAddress = useUser().user?.emailAddresses[0].emailAddress as any
  return (
    <div className='flex w-full min-h-full'>
      <div className=''>
        <Dialog>
          <DialogTrigger>Add New Certificate</DialogTrigger>
          <DialogContent>
            <form
              className='flex flex-col justify-center items-center w-full gap-5 bg-gray-100 text-black '
              action={AddCertificateAction}
            >
              <div className='flex flex-col items-center'>
                <label className='mb-5' htmlFor='certTitle'>
                  Project Title
                </label>
                <input type='text' name='certTitle' />
              </div>
              <div className='flex flex-col items-center'>
                <label className='mb-5' htmlFor='certDesc'>
                  Project Description
                </label>
                <input type='text' name='certDesc' />
              </div>
              <div className='flex flex-col items-center'>
                <label className='mb-5' htmlFor='courseLink'>
                  Project Repo Link
                </label>
                <input type='text' name='courseLink' />
              </div>
              <div className='flex flex-col items-center'>
                <label className='mb-5' htmlFor='certProfLink'>
                  Project Live Link
                </label>
                <input type='text' name='certProfLink' />
              </div>
              <Label htmlFor='picture'>Project Image</Label>
              <Input className='w-1/4' type='file' name='certImageLink' />
              <Input
                className='w-1/4'
                type='hidden'
                name='emailAddress'
                value={emailAddress}
              />

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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

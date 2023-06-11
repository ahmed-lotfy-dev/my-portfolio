"use client"
import { useState } from "react"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/components/ui/dialog"

import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { AddProjectAction } from "../../_actions"
// import { useUser } from "@clerk/nextjs"

import { TagsInput } from "react-tag-input-component"

const notify = (message: string, status: boolean) =>
  status ? toast.success(message) : toast.error(message)

export default function AddProject({}) {
  const [selected, setSelected] = useState(["react"])
  // const emailAddress = useUser().user?.emailAddresses[0].emailAddress as any

  return (
    <div className='flex w-full min-h-full'>
      <div className=''>
        <Dialog>
          <DialogTrigger>Add New Project</DialogTrigger>
          <DialogContent>
            <form
              className='flex flex-col justify-center items-center w-full gap-5 bg-gray-100 text-black '
              action={AddProjectAction}
            >
              <div className='flex flex-col items-center'>
                <label className='mb-5 m-10' htmlFor='projTitle'>
                  Project Title
                </label>
                <input type='text' name='projTitle' />
              </div>
              <div className='flex flex-col items-center'>
                <label className='mb-5' htmlFor='projDesc'>
                  Project Description
                </label>
                <input type='text' name='projDesc' />
              </div>
              <div className='flex flex-col items-center'>
                <label className='mb-5' htmlFor='projRepoLink'>
                  Project Repo Link
                </label>
                <input type='text' name='projRepoLink' />
              </div>
              <div className='flex flex-col items-center'>
                <label className='mb-5' htmlFor='projLiveLink'>
                  Project Live Link
                </label>
                <input type='text' name='projLiveLink' />
              </div>
              <Label htmlFor='picture'>Project Image</Label>
              <Input className='w-1/4' type='file' name='projImageLink' />
              {/* <Input
                className='w-1/4'
                type='hidden'
                name='emailAddress'
                value={emailAddress}
              /> */}

              <input type='hidden' name='tags' value={selected} />

              <Toaster position='top-right' />
              <div>
                <h1>Project Tags</h1>
                <TagsInput
                  value={selected}
                  onChange={setSelected}
                  name='tags'
                  placeHolder='enter fruits'
                />
              </div>
              <button
                className='m-10'
                type='submit'
                // onClick={() => {
                //   if (emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                //     console.log(emailAddress)
                //     console.log(process.env.NEXT_PUBLIC_ADMIN_EMAIL)
                //     notify("sorry you don't have admin priviliges", false)
                //   } else {
                //     notify("Adding Completed Successfully", true)
                //   }
                // }}
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

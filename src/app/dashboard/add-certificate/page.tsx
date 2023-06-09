"use client"
import { useState } from "react"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"
import { TagsInput } from "react-tag-input-component"

import { AddCertificateAction } from "../../_actions"
import { Input } from "@/src/app/components/ui/input"
import { Label } from "@/src/app/components/ui/label"

type Props = {}

export default function AddProject({}: Props) {
  const [image, setImage] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")

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
        {previewUrl ? (
          <Image src={image!} width={300} height={300} alt={`${previewUrl}`} />
        ) : (
          ""
        )}

        {/* <UploadButton<OurFileRouter>
          //@ts-ignore
          endpoint='imageUploader'
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res)
            const imageUrl = res![0].fileUrl
            setPreviewUrl(imageUrl)
            setImage(imageUrl)
            imageLinkRef.current = imageUrl
            toast.success("poject image uploaded successfully", {
              position: "top-right",
            })
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`)
          }}
        /> */}
        <Toaster />
        <button
          type='submit'
          onClick={() => {
            setImage("")
            setPreviewUrl("")
            console.log("hello world frontend")
          }}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

"use client"
import Image from "next/image"
import { AddCertificateAction } from "@/src/app/actions"
import toast, { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react"

import "@uploadthing/react/styles.css"
import { UploadButton } from "@uploadthing/react"
//@ts-ignore
import { OurFileRouter } from "./api/uploadthing/core"

const notify = (message: string) => toast.success(message)

const AddCertificate = () => {
  const [image, setImage] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  useEffect(() => {}, [isSubmitted])
  return (
    <form
      action={AddCertificateAction}
      className='min-h-full flex flex-col justify-center items-center w-full gap-5 bg-gray-300 text-black'
    >
      <div className='flex flex-col items-center'>
        <label className='mb-5' htmlFor='certTitle'>
          Certificate Title
        </label>
        <input className='editable' type='text' name='certTitle' />
      </div>
      <div className='flex flex-col items-center'>
        <label className='mb-5' htmlFor='certDesc'>
          Certificate Description
        </label>
        <input type='textarea' name='certDesc' />
      </div>
      <div className='flex flex-col items-center'>
        <label className='mb-5' htmlFor='courseLink'>
          Course Link
        </label>
        <input type='text' name='courseLink' />
      </div>
      <div className='flex flex-col items-center'>
        <label className='mb-5' htmlFor='certProfLink'>
          Certificate Proof
        </label>
        <input type='text' name='certProfLink' />
      </div>
      <label htmlFor='upload'>Image Upload</label>
      <input type='hidden' name='certImageLink' value={previewUrl} />
      {previewUrl ? (
        <Image src={image!} width={300} height={300} alt={`${previewUrl}`} />
      ) : (
        ""
      )}

      <UploadButton<OurFileRouter>
        //@ts-ignore
        endpoint='imageUploader'
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res)
          setPreviewUrl(res![0].fileUrl)
          setImage(res![0].fileUrl)
          toast("certificate image uploaded successfully", {
            position: "top-right",
          })
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`)
        }}
      />
      <Toaster />
      <button
        type='submit'
        onClick={() => {
          setImage("")
          setPreviewUrl("")
          setIsSubmitted(true)
        }}
      >
        Submit
      </button>
    </form>
  )
}

export default AddCertificate

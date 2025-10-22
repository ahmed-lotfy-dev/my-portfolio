"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog"
import Image from "next/image"

type ImageViewerProps = {
  imageUrl: string
  altText: string
  trigger: React.ReactNode // The element that triggers the dialog (e.g., an icon, a thumbnail image)
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  altText,
  trigger,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>{altText}</DialogTitle>
          <DialogDescription>Full view of {altText}</DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[80vh] flex justify-center items-center">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageViewer

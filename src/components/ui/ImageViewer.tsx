"use client"

import React, { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog"
import { cn } from "@/src/lib/utils"

type ImageViewerProps = {
  imageUrl: string
  altText: string
  children: React.ReactNode
  className?: string
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  altText,
  children,
  className,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={cn("relative group cursor-pointer overflow-hidden", className)}>
          {children}
          {/* Hover Overlay */}
          {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 bg-background/20 backdrop-blur-[2px]">
            <span className="flex items-center gap-2 bg-background/80 text-foreground px-5 py-2.5 rounded-full backdrop-blur-xl text-sm font-semibold border border-border/50 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"/>
              Click to View
            </span>
          </div> */}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-full p-2 bg-background/60 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/10 dark:ring-white/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-300">
        <DialogHeader className="sr-only">
          <DialogTitle>{altText}</DialogTitle>
          <DialogDescription>Full view of {altText}</DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden bg-black/3 dark:bg-black/3 border border-border/20">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-contain"
            sizes="95vw"
            quality={100}
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageViewer

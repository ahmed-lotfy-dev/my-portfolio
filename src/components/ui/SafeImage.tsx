"use client"
import Image, { ImageProps } from "next/image"

const trustedDomains = [
  "images.ahmedlotfy.site",
  "lh3.googleusercontent.com",
  "avatars.githubusercontent.com",
]

function isTrusted(url: string) {
  try {
    const { hostname } = new URL(url)
    return trustedDomains.includes(hostname)
  } catch {
    return false
  }
}
type SafeImageProps = ImageProps & {
  fallbackClassName?: string // optional extra if you want special styling for fallback <img>
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  ...props
}: ImageProps) {
  if (isTrusted(String(src))) {
    // ✅ Optimized by Next.js
    return (
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        {...props}
      />
    )
  }
  if (props.layout === "fill") {
    return <img src={String(src)} alt={alt} {...props} />
  }

  return (
    <img
      src={String(src)}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  )
}

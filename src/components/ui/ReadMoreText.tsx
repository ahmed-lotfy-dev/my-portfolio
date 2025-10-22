"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "./button"

type ReadMoreTextProps = {
  text: string
  maxLines?: number
  className?: string
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text,
  maxLines = 5,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight)
      const maxHeight = lineHeight * maxLines
      if (textRef.current.scrollHeight > maxHeight) {
        setIsTruncated(true)
      } else {
        setIsTruncated(false)
      }
    }
  }, [text, maxLines])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const style: React.CSSProperties = isExpanded
    ? {}
    : {
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }

  return (
    <div className={className}>
      <p ref={textRef} style={style}>
        {text}
      </p>
      {isTruncated && (
        <Button variant="link" onClick={toggleExpanded} className="p-0 h-auto mt-2">
          {isExpanded ? "Show Less" : "Read More"}
        </Button>
      )}
    </div>
  )
}

export default ReadMoreText

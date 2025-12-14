"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";

type ReadMoreTextProps = {
  text: string;
  maxLines?: number;
  className?: string;
  readMoreText?: string;
  showLessText?: string;
};

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text,
  maxLines = 5,
  className,
  readMoreText = "Read more",
  showLessText = "Show less",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || !textRef.current) return;

    const lineHeight = parseFloat(
      getComputedStyle(textRef.current).lineHeight
    );
    const maxHeight = lineHeight * maxLines;
    if (textRef.current.scrollHeight > maxHeight) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  }, [text, maxLines]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const style: React.CSSProperties = isExpanded
    ? {}
    : {
      display: "-webkit-box",
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    };

  return (
    <div className={className}>
      <p
        ref={textRef}
        style={style}
        onClick={isTruncated ? toggleExpanded : undefined}
        className={`${isTruncated ? "cursor-pointer" : ""}`}
      >
        {text}
      </p>
      {isTruncated && (
        <Button
          variant="link"
          onClick={toggleExpanded}
          className="p-0 h-auto mt-2 text-blue-900 dark:to-blue-300"
        >
          {isExpanded ? showLessText : readMoreText}
        </Button>
      )}
    </div>
  );
};

export default ReadMoreText;

"use client"

import Image from "next/image"
import { useState } from "react"

interface GuideSectionImageProps {
  imageUrl: string
  imageAlt: string
}

export function GuideSectionImage({ imageUrl, imageAlt }: GuideSectionImageProps) {
  const [error, setError] = useState(false)
  
  return (
    <div className="relative aspect-video bg-gray-200 dark:bg-dark-charcoal rounded-sm overflow-hidden">
      <Image
        src={error ? "/placeholder.jpg" : imageUrl}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        className="object-contain"
        onError={() => setError(true)}
      />
    </div>
  )
}

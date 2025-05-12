"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface GuideSectionImageProps {
  imageUrl: string
  imageAlt: string
}

export function GuideSectionImage({ imageUrl, imageAlt }: GuideSectionImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Reset error state when imageUrl changes
  useEffect(() => {
    setError(false)
    setLoading(true)
  }, [imageUrl])
  
  return (
    <div className="relative aspect-video bg-gray-200 dark:bg-dark-charcoal rounded-sm overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
            <path d="M21 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H21C22.1046 21 23 20.1046 23 19V5C23 3.89543 22.1046 3 21 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 9L12 15L23 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21V12L12 10L15 12V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm">Изображение недоступно</p>
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          className="object-contain"
          onError={() => {
            setError(true)
            setLoading(false)
          }}
          onLoad={() => setLoading(false)}
        />
      )}
    </div>
  )
}

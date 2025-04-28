"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallbackSrc?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

/**
 * OptimizedImage component that enhances the Next.js Image component with:
 * - Proper image loading states
 * - Fallback image support
 * - Better error handling
 * - Quality preservation
 * - Maintains aspect ratio
 * 
 * @param props Image props plus additional optimization props
 * @returns A fully optimized image component
 */
export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg",
  objectFit = "cover",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  
  // Determine the source to use (original or fallback if error)
  const imageSrc = error ? fallbackSrc : src
  
  return (
    <div className={cn(
      "relative overflow-hidden",
      isLoading && "animate-pulse bg-gray-200 dark:bg-gray-700",
      className
    )}>
      <Image
        src={imageSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === 'contain' && "object-contain",
          objectFit === 'cover' && "object-cover",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down",
        )}
        unoptimized={true} // Disable Next.js image optimization to preserve original quality
        quality={100} // Keep maximum quality
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        {...props}
      />
    </div>
  )
} 
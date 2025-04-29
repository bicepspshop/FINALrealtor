"use client"

import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

/**
 * A simplified wrapper around Next.js Image component with unoptimized quality
 */
export function OptimizedImage({
  src,
  alt,
  className,
  objectFit = "cover",
  ...props
}: ImageProps & { objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' }) {
  // Map object-fit to the appropriate class
  const objectFitClass = 
    objectFit === 'contain' ? 'object-contain' :
    objectFit === 'cover' ? 'object-cover' :
    objectFit === 'fill' ? 'object-fill' :
    objectFit === 'none' ? 'object-none' :
    objectFit === 'scale-down' ? 'object-scale-down' : '';
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src} 
        alt={alt}
        className={objectFitClass}
        unoptimized={true}
        {...props}
      />
    </div>
  )
} 
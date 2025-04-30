"use client"

import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

// Simple blur hash placeholder (gray gradient)
const defaultBlurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2YzZjRmNiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIgLz48L3N2Zz4=';

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  usePlaceholder?: boolean;
  fadeIn?: boolean;
}

/**
 * An enhanced wrapper around Next.js Image component with:
 * - Proper lazy loading
 * - Blur placeholders
 * - Fade-in animation
 * - Proper object-fit handling
 */
export function OptimizedImage({
  src,
  alt,
  className,
  objectFit = "cover",
  width,
  height,
  usePlaceholder = true,
  fadeIn = true,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Map object-fit to the appropriate class
  const objectFitClass = 
    objectFit === 'contain' ? 'object-contain' :
    objectFit === 'cover' ? 'object-cover' :
    objectFit === 'fill' ? 'object-fill' :
    objectFit === 'none' ? 'object-none' :
    objectFit === 'scale-down' ? 'object-scale-down' : '';
  
  // Handle loading state
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  return (
    <div className={cn(
      "relative overflow-hidden", 
      className
    )}>
      <Image
        src={src} 
        alt={alt}
        width={width}
        height={height}
        className={cn(
          objectFitClass,
          fadeIn && "transition-opacity duration-300",
          fadeIn && !isLoaded && "opacity-0",
          fadeIn && isLoaded && "opacity-100"
        )}
        loading={priority ? "eager" : "lazy"}
        placeholder={usePlaceholder ? "blur" : "empty"}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleImageLoad}
        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        {...props}
      />
    </div>
  )
} 
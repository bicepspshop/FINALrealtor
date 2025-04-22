"use client"

import { useTheme } from "next-themes"
import Image, { ImageProps } from "next/image"
import { useEffect, useState } from "react"

interface ThemeImageProps extends Omit<ImageProps, 'src'> {
  lightSrc: string
  darkSrc: string
}

export function FallbackThemeImage({ 
  lightSrc, 
  darkSrc,
  alt,
  ...rest
}: ThemeImageProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Always use the light image, regardless of theme
  // This is a temporary fallback until the dark mode images are moved to the public directory
  return (
    <Image
      src={lightSrc}
      alt={alt}
      {...rest}
    />
  )
}

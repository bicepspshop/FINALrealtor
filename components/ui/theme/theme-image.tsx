"use client"

import { useTheme } from "next-themes"
import Image, { ImageProps } from "next/image"
import { useEffect, useState, memo } from "react"
import { cn } from "@/lib/utils"

interface ThemeImageProps extends Omit<ImageProps, 'src' | 'className'> {
  lightSrc: string
  darkSrc: string
  className?: string
  brightnessFactor?: number // Optional prop to adjust brightness for dark mode
}

export const ThemeImage = memo(function ThemeImage({ 
  lightSrc, 
  darkSrc,
  alt,
  className,
  brightnessFactor = 1, // Default to no brightness adjustment
  ...rest
}: ThemeImageProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure darkSrc is properly formatted to use from public directory
  const formattedDarkSrc = darkSrc.startsWith('/images/') 
    ? `/images/${darkSrc.split('/').pop()}` // Keep just the filename and prepend /images/
    : darkSrc

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply brightness filter for backnight.png or any image with brightnessFactor
  const isDarkMode = mounted && resolvedTheme === 'dark'
  const isBacknight = formattedDarkSrc.includes('backnight.png')
  
  // Apply brightness boost to the backnight image or any image with brightnessFactor > 1
  const shouldBoostBrightness = isDarkMode && (isBacknight || brightnessFactor > 1)
  
  // Default brightness factor for backnight is 1.5x
  const actualBrightnessFactor = isBacknight ? 1.5 : brightnessFactor
  
  // Get the appropriate src based on theme
  const currentSrc = !mounted ? lightSrc : resolvedTheme === 'dark' ? formattedDarkSrc : lightSrc

  // Improved crossfade effect with both images preloaded
  return (
    <div className="relative overflow-hidden" style={{ width: '100%', height: '100%' }}>
      {mounted && (
        <>
          {/* Light mode image */}
          <Image
            src={lightSrc}
            alt={alt}
            className={cn(
              className || "",
              "absolute inset-0 transition-all duration-700 ease-in-out",
              resolvedTheme === 'dark' ? 'opacity-0 transform scale-[1.02]' : 'opacity-100 transform scale-100'
            )}
            {...rest}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Dark mode image */}
          <Image
            src={formattedDarkSrc}
            alt={alt}
            className={cn(
              className || "",
              "absolute inset-0 transition-all duration-700 ease-in-out",
              resolvedTheme === 'dark' ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-[0.98]'
            )}
            style={shouldBoostBrightness ? { filter: `brightness(${actualBrightnessFactor})` } : {}}
            {...rest}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </>
      )}
      
      {/* Fallback for SSR */}
      {!mounted && (
        <Image
          src={lightSrc}
          alt={alt}
          className={className}
          {...rest}
        />
      )}
    </div>
  )
})

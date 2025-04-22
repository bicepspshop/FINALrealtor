"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { ThemeImage } from "@/components/ui/theme/theme-image"

const galleryImages = [
  { light: "/images/house6.png", dark: "/images/flat4.png", alt: "Пример интерьера 1" },
  { light: "/images/house7.png", dark: "/images/flat5.png", alt: "Пример интерьера 2" },
  { light: "/images/house8.png", dark: "/images/flat6.png", alt: "Пример интерьера 3" },
  { light: "/images/house9.png", dark: "/images/flat7.png", alt: "Пример интерьера 4" },
  { light: "/images/house10.png", dark: "/images/flat8.png", alt: "Пример интерьера 5" },
  { light: "/images/house11.png", dark: "/images/flat9.png", alt: "Пример интерьера 6" },
]

export function GallerySlider() {
  const { resolvedTheme } = useTheme()
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
      {galleryImages.map((image, index) => (
        <div 
          key={index} 
          className="relative aspect-[3/2] rounded-sm overflow-hidden shadow-subtle dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark transition-all duration-300 hover:scale-105 dark:border dark:border-luxury-gold/20 property-image theme-transition"
        >
          <ThemeImage 
            lightSrc={image.light} 
            darkSrc={image.dark} 
            alt={image.alt} 
            fill 
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}

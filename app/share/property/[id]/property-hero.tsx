"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"

interface PropertyHeroProps {
  images: string[]
  propertyTitle: string
  collection: {
    share_id?: string
  } | null
}

export function PropertyHero({ images, propertyTitle, collection }: PropertyHeroProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={!mounted || resolvedTheme === "dark" ? "/images/flat8.png" : (images[0] || "/images/house1.png")}
          alt={propertyTitle}
          className="w-full h-full object-cover theme-transition"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 dark:from-black/40 dark:to-black/80 theme-transition"></div>
      </div>
      
      {/* Floating navigation */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center gap-2 text-white/90 bg-black/20 dark:bg-dark-charcoal/40 backdrop-blur-sm px-4 py-2 
            rounded-sm inline-block shadow-sm animate-fade-in-up theme-transition">
            <Link href={`/share/${collection?.share_id}`} className="hover:text-white transition-colors flex items-center gap-1">
              <Home size={14} />
              <span>К списку объектов</span>
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">{propertyTitle}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

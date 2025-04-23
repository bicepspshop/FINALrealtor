"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import Image from "next/image"

interface ShareHeroProps {
  collection: {
    name: string
    description?: string
  }
  agent?: {
    name?: string
    email?: string
    phone?: string
    description?: string
    avatar_url?: string
  }
}

export function ShareHero({ collection, agent }: ShareHeroProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative h-[25vh] md:h-[30vh] w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#FAF9F6] dark:bg-dark-charcoal theme-transition">
        <Image 
          src={!mounted || resolvedTheme === "dark" ? "/images/flat8.png" : "/images/background1.png"}
          alt="Premium Real Estate" 
          fill 
          className="object-cover opacity-80 brightness-125 contrast-105 dark:opacity-60 dark:brightness-75 theme-transition"
          priority
        />
        {/* Subtle gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/30 dark:from-black/40 dark:to-black/70 theme-transition"></div>
      </div>
      <div className="container mx-auto px-6 md:px-12 relative z-10 h-full flex flex-col justify-end pb-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-white mb-4 animate-fade-in-up text-shadow-md">{collection.name}</h1>
        <div className="w-20 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-6 animate-fade-in-up theme-transition" style={{animationDelay: '100ms'}}></div>
        {collection.description ? (
          <p className="text-lg md:text-xl text-white/90 max-w-3xl animate-fade-in-up text-shadow-sm" style={{animationDelay: '200ms'}}>
            {collection.description}
          </p>
        ) : (
          <p className="text-lg md:text-xl text-white/90 max-w-2xl animate-fade-in-up text-shadow-sm" style={{animationDelay: '200ms'}}>
            Представляем вашему вниманию эксклюзивную подборку премиальной недвижимости от {agent?.name || "Агента недвижимости"}
          </p>
        )}
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { X, Expand } from "lucide-react"

interface GuideSectionImageProps {
  imageUrl: string
  imageAlt: string
}

export function GuideSectionImage({ imageUrl, imageAlt }: GuideSectionImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const scrollPositionRef = useRef(0)
  
  // Reset error state when imageUrl changes
  useEffect(() => {
    setError(false)
    setLoading(true)
  }, [imageUrl])
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
      }
    }
    
    if (isFullscreen) {
      window.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isFullscreen])
  
  const openFullscreen = () => {
    scrollPositionRef.current = window.scrollY
    setIsFullscreen(true)
  }
  
  const closeFullscreen = () => {
    setIsFullscreen(false)
    // Restore scroll position after modal closes
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPositionRef.current)
    })
  }
  
  return (
    <>
      <div 
        className="relative aspect-[16/10] bg-gray-200 dark:bg-dark-charcoal rounded-sm overflow-hidden cursor-zoom-in" 
        onClick={openFullscreen}
      >
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
          <>
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-contain"
              onError={() => {
                setError(true)
                setLoading(false)
              }}
              onLoad={() => setLoading(false)}
            />
            {/* Hover overlay with expand icon */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <Expand className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </>
        )}
      </div>
      
      {/* Fullscreen Modal */}
      {isFullscreen && !error && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-modal-in overflow-y-auto"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <button
            className="fixed top-4 right-4 z-[101] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300"
            onClick={closeFullscreen}
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Make the entire modal area clickable */}
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] cursor-zoom-out"
            onClick={closeFullscreen}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="100vw"
              className="object-contain cursor-zoom-out"
              priority
            />
          </div>
          
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm pointer-events-none">
            {imageAlt}
          </div>
        </div>
      )}
    </>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize, ArrowLeft, ArrowRight } from "lucide-react"
import { PropertyGallery } from "../../../v2/components/property-gallery"

interface PropertyCarouselProps {
  images: string[]
  propertyType: string
}

export function PropertyCarousel({ images, propertyType }: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  // Используем placeholder, если нет изображений
  const imageUrls = images.length > 0 ? images : ["/placeholder.svg"]

  const goToNext = () => {
    if (isAnimating || imageUrls.length <= 1) return
    setDirection("right")
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length)
  }

  const goToPrev = () => {
    if (isAnimating || imageUrls.length <= 1) return
    setDirection("left")
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
  }

  const handleThumbnailClick = (index: number) => {
    if (index === currentIndex || isAnimating) return
    
    setDirection(index > currentIndex ? "right" : "left")
    setIsAnimating(true)
    setCurrentIndex(index)
  }

  const openGallery = () => {
    setIsGalleryOpen(true)
  }

  const scrollToActiveThumbnail = () => {
    if (thumbnailsRef.current && imageUrls.length > 1) {
      const container = thumbnailsRef.current
      const activeThumb = container.children[currentIndex] as HTMLElement
      if (activeThumb) {
        const containerWidth = container.offsetWidth
        const thumbLeft = activeThumb.offsetLeft
        const thumbWidth = activeThumb.offsetWidth
        
        // Center the active thumbnail
        container.scrollTo({
          left: thumbLeft - containerWidth / 2 + thumbWidth / 2,
          behavior: 'smooth'
        })
      }
    }
  }

  // Scroll to active thumbnail when index changes
  useEffect(() => {
    scrollToActiveThumbnail()
  }, [currentIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === carouselRef.current || carouselRef.current?.contains(document.activeElement)) {
        if (e.key === 'ArrowRight') {
          goToNext()
        } else if (e.key === 'ArrowLeft') {
          goToPrev()
        } else if (e.key === 'Enter' || e.key === ' ') {
          openGallery()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAnimating, imageUrls.length])

  // Reset animation state
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  // Auto-play (optional)
  useEffect(() => {
    if (isHovered || imageUrls.length <= 1) return

    const interval = setInterval(() => {
      goToNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [isHovered, isAnimating, imageUrls.length, currentIndex])

  // Handle touch events for swiping on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    
    const touchEnd = e.touches[0].clientX
    const diff = touchStart - touchEnd
    
    // If swipe is significant enough, change slide
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go to next
        goToNext()
      } else {
        // Swipe right, go to previous
        goToPrev()
      }
      setTouchStart(null)
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  return (
    <>
      <div 
        ref={carouselRef}
        className="relative w-full h-full group focus:outline-none"
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Image with luxury effects */}
        <div className="w-full h-full overflow-hidden">
          {imageUrls.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-out
                ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}
                ${isAnimating && index === currentIndex && direction === "right"
                  ? "animate-slide-in-right"
                  : isAnimating && index === currentIndex && direction === "left"
                    ? "animate-slide-in-left"
                    : ""
                }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${propertyType} - изображение ${index + 1}`}
                fill
                className="object-cover transform transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
              
              {/* Subtle gold overlay on hover - reduced opacity and removed blur-causing effects */}
              <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
            </div>
          ))}
        </div>

        {/* Controls with luxury styling - larger arrows for better visibility */}
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 
                bg-black/50 backdrop-blur-sm text-white hover:text-gold rounded-full p-3 md:p-4
                opacity-0 group-hover:opacity-100 hover:opacity-100 border border-gold/20
                transition-all duration-300 hover:border-gold hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] 
                active:scale-95 focus:outline-none"
              aria-label="Предыдущее изображение"
              disabled={isAnimating}
            >
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 
                bg-black/50 backdrop-blur-sm text-white hover:text-gold rounded-full p-3 md:p-4
                opacity-0 group-hover:opacity-100 hover:opacity-100 border border-gold/20
                transition-all duration-300 hover:border-gold hover:shadow-[0_0_12px_rgba(212,175,55,0.25)]
                active:scale-95 focus:outline-none"
              aria-label="Следующее изображение"
              disabled={isAnimating}
            >
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}

        {/* Image counter and full screen button with luxury styling */}
        <div className="absolute bottom-24 md:bottom-6 right-4 z-20 flex items-center gap-3">
          <div className="bg-black/60 backdrop-blur-sm border border-gold/20 px-3 py-1.5 text-sm text-white rounded-sm">
            <span className="text-gold">{currentIndex + 1}</span>
            <span className="mx-1 text-white/80">/</span>
            <span className="text-white/80">{imageUrls.length}</span>
          </div>
          
          <button
            onClick={openGallery}
            className="bg-gold hover:bg-gold-dark text-black rounded-sm p-2
              transition-all duration-300 hover:scale-105 active:scale-95 
              focus:outline-none hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]"
            aria-label="Открыть галерею"
          >
            <Maximize size={20} />
          </button>
        </div>

        {/* Enhanced thumbnail navigation with luxury styling */}
        {imageUrls.length > 1 && (
          <div 
            ref={thumbnailsRef}
            className="absolute -bottom-2 left-0 right-0 z-20 px-4 md:px-6"
          >
            <div className="relative overflow-hidden">
              {/* Gold accent lines */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-r from-gold/60 to-transparent"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-l from-gold/60 to-transparent"></div>
              
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 pt-1 snap-x hide-scrollbar">
                {imageUrls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative h-14 w-20 md:h-18 md:w-28 flex-shrink-0 overflow-hidden snap-start
                      transition-all duration-300 transform hover:scale-105 focus:outline-none
                      ${index === currentIndex 
                        ? 'ring-2 ring-gold border-2 border-gold shadow-[0_0_12px_rgba(212,175,55,0.4)]' 
                        : 'ring-1 ring-gold/20 border border-transparent opacity-60 hover:opacity-90 hover:border-gold/40'}`}
                    aria-label={`Перейти к изображению ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : 'false'}
                  >
                    <Image
                      src={image}
                      alt={`Миниатюра ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                    {/* Gold overlay for selected thumbnail */}
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent mix-blend-overlay"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full screen gallery */}
      <PropertyGallery
        images={imageUrls}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={currentIndex}
      />
    </>
  )
} 
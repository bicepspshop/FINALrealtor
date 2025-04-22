"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, ArrowLeft, ArrowRight } from "lucide-react"

interface PropertyGalleryProps {
  images: (string | { url: string, isVideo: boolean })[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export function PropertyGallery({ images, isOpen, onClose, initialIndex = 0 }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null)

  const goToNext = useCallback(() => {
    if (zoom > 1 || isTransitioning || images.length <= 1) return // Disable navigation when zoomed
    
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % images.length)
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 400)
  }, [images.length, zoom, isTransitioning])

  const goToPrev = useCallback(() => {
    if (zoom > 1 || isTransitioning || images.length <= 1) return // Disable navigation when zoomed
    
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 400)
  }, [images.length, zoom, isTransitioning])

  const resetZoom = useCallback(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const zoomIn = () => {
    if (zoom < 3) {
      setZoom((prev) => prev + 0.5)
    }
  }

  const zoomOut = () => {
    if (zoom > 1) {
      setZoom((prev) => {
        const newZoom = prev - 0.5
        if (newZoom === 1) {
          setPosition({ x: 0, y: 0 }) // Reset position when returning to normal zoom
        }
        return newZoom
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true)
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1) {
      setIsPanning(true)
      setStartPosition({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      })
    } else if (images.length > 1) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && zoom > 1) {
      setPosition({
        x: e.touches[0].clientX - startPosition.x,
        y: e.touches[0].clientY - startPosition.y
      })
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPanning(false)
    
    if (touchStart && zoom === 1 && images.length > 1) {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
      
      const deltaX = touchEnd.x - touchStart.x
      const deltaY = touchEnd.y - touchStart.y
      
      // Ensure it's a horizontal swipe
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          goToPrev()
        } else {
          goToNext()
        }
      }
      
      setTouchStart(null)
    }
  }

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'ArrowLeft') {
        goToPrev()
      } else if (e.key === '+' || e.key === '=') {
        zoomIn()
      } else if (e.key === '-') {
        zoomOut()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToNext, goToPrev, onClose])

  // Reset current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Reset zoom when changing images
  useEffect(() => {
    resetZoom()
  }, [currentIndex, resetZoom])

  // Prevent body scrolling when gallery is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Luxury pattern background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'44\' height=\'44\' viewBox=\'0 0 44 44\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0h22v22H0V0zm22 22h22v22H22V22z\' /%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>
      
      {/* Light beams effect */}
      <div className="absolute top-0 left-1/3 w-px h-screen bg-gradient-to-b from-gold/0 via-gold/15 to-gold/0 opacity-50 pointer-events-none"></div>
      <div className="absolute top-20 right-1/4 w-px h-screen bg-gradient-to-b from-gold/0 via-gold/10 to-gold/0 opacity-50 pointer-events-none"></div>

      {/* Close button */}
      <button 
        className="absolute top-6 right-6 z-[110] bg-black/40 text-white hover:text-gold rounded-full p-3 
          border border-gold/20 hover:border-gold transition-all duration-300 hover:scale-105 active:scale-95"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Закрыть галерею"
      >
        <X size={24} />
      </button>

      {/* Image container with luxury styling */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500
              ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div 
              className="relative w-full h-full max-w-[90vw] max-h-[90vh] overflow-hidden"
              style={{ 
                transform: `scale(${zoom})`,
                transition: isPanning ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
              }}
            >
              {typeof image === 'object' && image.isVideo ? (
                <video
                  src={image.url}
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={typeof image === 'object' ? image.url : image}
                  alt={`Property image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                  priority={index === 0}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  quality={90}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows - larger and more visible */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] bg-black/50 backdrop-blur-sm text-white hover:text-gold rounded-full p-4
              border border-gold/20 hover:border-gold/60 transition-all duration-300 hover:scale-105 active:scale-95
              hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation()
              goToPrev()
            }}
            disabled={zoom > 1 || isTransitioning}
            aria-label="Предыдущее изображение"
          >
            <ArrowLeft size={28} className="transform transition-transform duration-300 group-hover:scale-110" />
          </button>
          
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] bg-black/50 backdrop-blur-sm text-white hover:text-gold rounded-full p-4
              border border-gold/20 hover:border-gold/60 transition-all duration-300 hover:scale-105 active:scale-95
              hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            disabled={zoom > 1 || isTransitioning}
            aria-label="Следующее изображение"
          >
            <ArrowRight size={28} className="transform transition-transform duration-300 group-hover:scale-110" />
          </button>
        </>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-6">
        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 pb-1 max-w-[90vw]">
            {images.map((image, idx) => (
              <button
                key={idx}
                className={`relative h-16 w-24 md:h-20 md:w-28 flex-shrink-0 overflow-hidden transition-all duration-300
                  ${idx === currentIndex
                    ? 'ring-2 ring-gold border-2 border-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]' 
                    : 'border border-white/30 opacity-60 hover:opacity-100 hover:border-gold/40'
                  }`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isTransitioning) {
                    setIsTransitioning(true)
                    setCurrentIndex(idx)
                    setTimeout(() => setIsTransitioning(false), 400)
                  }
                }}
                disabled={isTransitioning}
              >
                <Image
                  src={typeof image === 'object' ? image.url : image}
                  alt={`Миниатюра ${idx + 1}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
                {/* Gold overlay for selected thumbnail */}
                {idx === currentIndex && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent mix-blend-overlay"></div>
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* Controls bar */}
        <div className="bg-black/70 backdrop-blur-md border border-gold/20 rounded-md overflow-hidden">
          <div className="flex items-center px-2 py-2 gap-4">
            {/* Zoom controls */}
            <div className="flex gap-1 px-3 border-r border-gold/20">
              <button
                className="text-white hover:text-gold rounded-full p-2 
                  transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation()
                  zoomOut()
                }}
                disabled={zoom <= 1}
                aria-label="Уменьшить"
              >
                <ZoomOut size={20} />
              </button>
              <button
                className="text-white hover:text-gold rounded-full p-2 
                  transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation()
                  zoomIn()
                }}
                disabled={zoom >= 3}
                aria-label="Увеличить"
              >
                <ZoomIn size={20} />
              </button>
            </div>

            {/* Image counter with gold accent */}
            <div className="text-white/90 px-4 py-1 font-light">
              <span className="text-gold font-medium">{currentIndex + 1}</span>
              <span className="mx-1">/</span>
              <span className="text-white/80">{images.length}</span>
            </div>
            
            {/* Navigation arrows for mobile */}
            {images.length > 1 && (
              <div className="flex gap-2 pl-3 border-l border-gold/20 md:hidden">
                <button
                  className="text-white hover:text-gold rounded-full p-2
                    transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrev()
                  }}
                  disabled={zoom > 1 || isTransitioning}
                  aria-label="Предыдущее"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="text-white hover:text-gold rounded-full p-2
                    transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  disabled={zoom > 1 || isTransitioning}
                  aria-label="Следующее"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
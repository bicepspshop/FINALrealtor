"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Info } from "lucide-react"

interface PropertyGalleryProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export function PropertyGallery({ images, isOpen, onClose, initialIndex = 0 }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Reset to initialIndex when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  const nextImage = () => {
    if (images.length <= 1 || isTransitioning) return
    
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % images.length)
    
    // Reset transitioning state after animation
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  const prevImage = () => {
    if (images.length <= 1 || isTransitioning) return
    
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    
    // Reset transitioning state after animation
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false)
        }).catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        })
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextImage()
    } else if (e.key === 'ArrowLeft') {
      prevImage()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (images.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Added DialogTitle for accessibility - visually hidden */}
      <DialogTitle className="sr-only">Просмотр изображений</DialogTitle>
      
      <DialogContent 
        className="max-w-7xl w-full p-0 bg-[#121212]/95 border-none rounded-none md:rounded-sm overflow-hidden" 
        onKeyDown={handleKeyDown}
      >
        <div className="relative h-[85vh] w-full">
          {/* Top controls */}
          <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center gap-2 text-white/90">
              <span className="text-sm font-medium bg-black/30 px-2 py-1 rounded-sm backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-white/90 hover:text-white p-2 rounded-full hover:bg-black/20 backdrop-blur-sm 
                  transition-all duration-200 active:scale-95"
                onClick={() => setShowInfo(!showInfo)}
                title={showInfo ? "Скрыть информацию" : "Показать информацию"}
              >
                <Info className="h-5 w-5" />
              </button>
              <button
                className="text-white/90 hover:text-white p-2 rounded-full hover:bg-black/20 backdrop-blur-sm 
                  transition-all duration-200 active:scale-95"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
              <button
                className="text-white/90 hover:text-white p-2 rounded-full hover:bg-black/20 backdrop-blur-sm 
                  transition-all duration-200 active:scale-95"
                onClick={onClose}
                title="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main image display */}
          <div className="relative h-full w-full flex items-center justify-center">
            {images.map((image, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out
                  ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Изображение ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority={idx === currentIndex}
                />
              </div>
            ))}

            {/* Navigation controls */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 md:left-8 z-20 bg-white/90 backdrop-blur-sm text-[#2C2C2C] rounded-full p-3 
                    transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 
                    focus:outline-none focus:ring-2 focus:ring-[#CBA135]/50"
                  onClick={prevImage}
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-4 md:right-8 z-20 bg-white/90 backdrop-blur-sm text-[#2C2C2C] rounded-full p-3 
                    transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-[#CBA135]/50"
                  onClick={nextImage}
                  disabled={isTransitioning}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail navigation - Moved up 100px */}
          <div className="absolute bottom-24 md:bottom-32 left-0 right-0 px-4 md:px-8">
            <div className="flex justify-center items-center gap-2 max-w-2xl mx-auto overflow-x-auto py-2 px-4 
              bg-white/10 backdrop-blur-md rounded-sm scrollbar-hide">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  className={`relative h-16 w-16 md:h-20 md:w-20 rounded-sm overflow-hidden border-2 
                    transition-all duration-300 hover:scale-105 flex-shrink-0
                    ${idx === currentIndex 
                      ? 'border-[#CBA135] shadow-[0_0_10px_rgba(203,161,53,0.5)]' 
                      : 'border-white/30 opacity-70 hover:opacity-100'}`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <Image
                    src={image}
                    alt={`Миниатюра ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

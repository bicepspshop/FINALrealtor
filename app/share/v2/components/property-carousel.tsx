"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import { PropertyGallery } from "./property-gallery"

interface PropertyCarouselProps {
  images: string[]
  className?: string
}

export function PropertyCarousel({ images, className = "" }: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length)
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <>
      <div className={`relative overflow-hidden group ${className}`}>
        {/* Main image */}
        <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out
                ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={image}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
            </div>
          ))}
        </div>

        {/* Fullscreen button */}
        <button
          className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm text-white hover:text-gold rounded-full p-2
            border border-gold/20 hover:border-gold transition-all duration-300 opacity-0 group-hover:opacity-100"
          onClick={() => setIsGalleryOpen(true)}
          aria-label="View fullscreen"
        >
          <Expand size={20} />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 backdrop-blur-sm text-white hover:text-gold rounded-full p-2
                border border-gold/20 hover:border-gold transition-all duration-300 opacity-0 group-hover:opacity-100"
              onClick={goToPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 backdrop-blur-sm text-white hover:text-gold rounded-full p-2
                border border-gold/20 hover:border-gold transition-all duration-300 opacity-0 group-hover:opacity-100"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white px-3 py-1 text-sm rounded-sm border border-gold/20">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 z-10 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 justify-center">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-sm transition-all duration-300
                    ${index === currentIndex
                      ? "border-2 border-gold ring-1 ring-gold"
                      : "border border-white/30 opacity-70 hover:opacity-100"
                    }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen gallery */}
      <PropertyGallery
        images={images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={currentIndex}
      />
    </>
  )
} 
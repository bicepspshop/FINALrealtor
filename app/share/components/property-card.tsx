"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Copy, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { PropertyGallery } from "./property-gallery"

interface PropertyImage {
  id: string
  image_url: string
}

interface PropertyCardProps {
  property: {
    id: string
    address: string
    property_type: string
    price: number
    area: number
    rooms: number | null
    description: string | null
    agent_comment?: string | null
    property_images: PropertyImage[]
    floor_plan_url?: string | null
    living_area?: number | null
    floor?: number | null
    total_floors?: number | null
    bathroom_count?: number | null
    residential_complex?: string | null
  }
  index?: number
  isSelected?: boolean
  onSelect?: () => void
}

export function PropertyCard({ property, index, isSelected, onSelect }: PropertyCardProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isFloorPlanView, setIsFloorPlanView] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const hasMultipleImages = property.property_images.length > 1

  // Animation delay based on index
  const animationDelay = index ? `${index * 100}ms` : '0ms';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const roomsText =
    property.rooms === 1
      ? "1-комн. квартира"
      : property.rooms === 2
        ? "2-комн. квартира"
        : property.rooms === 3
          ? "3-комн. квартира"
          : property.property_type === "house"
            ? `Дом`
            : property.property_type === "land"
              ? `Участок`
              : "Студия"

  const copyLink = (e: React.MouseEvent) => {
    // Stop propagation to prevent card navigation
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/share/property/${property.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextImage = useCallback((e: React.MouseEvent) => {
    // Stop propagation to prevent card navigation
    e.stopPropagation()
    e.preventDefault()
    if (property.property_images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.property_images.length)
    }
  }, [property.property_images.length])

  const prevImage = useCallback((e: React.MouseEvent) => {
    // Stop propagation to prevent card navigation
    e.stopPropagation()
    e.preventDefault()
    if (property.property_images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.property_images.length) % property.property_images.length)
    }
  }, [property.property_images.length])

  const openGallery = (e: React.MouseEvent, isFloorPlan = false) => {
    // Stop propagation to prevent card navigation
    e.stopPropagation()
    e.preventDefault()
    setIsFloorPlanView(isFloorPlan)
    setIsGalleryOpen(true)
  }

  // Navigate to property detail page
  const navigateToProperty = () => {
    router.push(`/share/property/${property.id}`)
  }

  return (
    <>
      {/* Make entire card clickable */}
      <div 
        ref={cardRef}
        className="bg-white dark:bg-dark-graphite rounded-sm overflow-hidden flex flex-col transition-all duration-500 
          shadow-sm hover:shadow-elegant dark:shadow-elegant-dark dark:hover:shadow-luxury-dark opacity-0 transform translate-y-6
          border border-gray-100 dark:border-dark-slate cursor-pointer theme-transition"
        style={{ animationDelay }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={navigateToProperty}
      >
        {/* Image Carousel */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          {property.property_images.length > 0 ? (
            <>
              <Image
                src={property.property_images[currentImageIndex]?.image_url || "/placeholder.svg"}
                alt={`${roomsText}, ${property.area} м²`}
                fill
                quality={80}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                decoding="async"
                className={`object-cover transform transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-40 dark:opacity-60 theme-transition"></div>

              {/* Property type label */}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-charcoal/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-medium text-[#2C2C2C] dark:text-white shadow-sm z-10 theme-transition hidden md:block">
                {roomsText}
              </div>

              {/* Navigation arrows - only show if multiple images */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-dark-charcoal/90 backdrop-blur-sm text-[#2C2C2C] dark:text-white rounded-full p-1.5 
                      opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-300 
                      hover:shadow-elegant dark:hover:shadow-elegant-dark hover:scale-105 active:scale-95 z-20 theme-transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-dark-charcoal/90 backdrop-blur-sm text-[#2C2C2C] dark:text-white rounded-full p-1.5 
                      opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-300
                      hover:shadow-elegant dark:hover:shadow-elegant-dark hover:scale-105 active:scale-95 z-20 theme-transition"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Image counter indicator */}
                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-dark-charcoal/90 backdrop-blur-sm text-[#2C2C2C] dark:text-white text-xs px-2 py-1 rounded-sm font-medium shadow-sm z-10 theme-transition hidden md:block">
                    {currentImageIndex + 1} / {property.property_images.length}
                  </div>
                </>
              )}

              {/* View gallery button */}
              <button
                onClick={(e) => openGallery(e, false)}
                className="absolute bottom-4 left-4 bg-[#CBA135] hover:bg-[#D4AF37] dark:bg-luxury-royalBlue dark:hover:bg-luxury-royalBlueMuted text-white text-xs px-3 py-1.5 
                  rounded-sm transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100 shadow-sm z-10 theme-transition"
              >
                Просмотр галереи
              </button>
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center theme-transition">
              <p className="text-[#2C2C2C]/50 dark:text-white/50 theme-transition">Нет изображения</p>
            </div>
          )}
        </div>

        <div className="p-6 dark:bg-dark-graphite theme-transition">
          {/* Content */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-serif font-medium text-[#2C2C2C] dark:text-white leading-tight theme-transition">
                  {property.residential_complex ? <span className="font-bold">{property.residential_complex}, </span> : ""}{roomsText}, {property.area} м²
                </h3>
                <div className="text-lg font-bold text-[#CBA135] dark:text-luxury-royalBlue theme-transition">{formatPrice(property.price)}</div>
              </div>
              <p className="text-sm text-[#2C2C2C]/70 dark:text-white/70 mt-1 theme-transition">{property.address}</p>
            </div>

            {/* Horizontal line */}
            <div className="w-12 h-0.5 bg-[#CBA135]/40 dark:bg-luxury-royalBlue/40 theme-transition"></div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-[#2C2C2C]/80 dark:text-white/80 theme-transition">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#CBA135]/70 dark:bg-luxury-royalBlue/70 theme-transition"></div>
                <span>Площадь: {property.area} м²</span>
              </div>
              {property.rooms !== null && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#CBA135]/70 dark:bg-luxury-royalBlue/70 theme-transition"></div>
                  <span>Комнат: {property.rooms}</span>
                </div>
              )}
              {property.floor && property.total_floors && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#CBA135]/70 dark:bg-luxury-royalBlue/70 theme-transition"></div>
                  <span>Этаж: {property.floor}/{property.total_floors}</span>
                </div>
              )}
              {property.bathroom_count && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#CBA135]/70 dark:bg-luxury-royalBlue/70 theme-transition"></div>
                  <span>Санузлы: {property.bathroom_count}</span>
                </div>
              )}
            </div>

            {/* Description and agent comment indicator */}
            <div className="text-sm text-[#2C2C2C]/70 dark:text-white/70 min-h-[2.5rem] theme-transition">
              {property.description && (
                <p className="line-clamp-2">{property.description}</p>
              )}
              {!property.description && !property.agent_comment && (
                <p className="text-[#2C2C2C]/50 dark:text-white/50 italic">Нет описания</p>
              )}
              {property.agent_comment && (
                <div className="flex items-center gap-1 mt-1 text-[#CBA135] dark:text-luxury-royalBlue theme-transition">
                  <div className="w-2 h-2 rounded-full bg-[#CBA135] dark:bg-luxury-royalBlue theme-transition"></div>
                  <span className="text-xs font-medium">Есть комментарий риелтора</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Button and actions */}
        <div className="px-6 pb-6 mt-auto dark:bg-dark-graphite theme-transition">
          {/* This button is now redundant since the whole card is clickable, but keeping for design consistency */}
          <div
            className="flex items-center justify-between w-full border border-[#CBA135] dark:border-luxury-royalBlue text-[#CBA135] dark:text-luxury-royalBlue hover:bg-[#CBA135] dark:hover:bg-luxury-royalBlue hover:text-white dark:hover:text-white 
              font-medium py-3 px-5 rounded-sm text-center transition-all duration-300 group cursor-pointer theme-transition"
          >
            <span>Подробнее об объекте</span>
            <ArrowRight size={18} className="transition-transform duration-300 transform group-hover:translate-x-1" />
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={copyLink}
              className="text-xs text-[#2C2C2C]/60 dark:text-white/60 hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors duration-300 flex items-center gap-1 z-20 theme-transition"
              title="Копировать ссылку"
            >
              <Copy size={14} />
              <span>Скопировать ссылку</span>
            </button>

            {copied && (
              <span className="text-xs text-[#CBA135] dark:text-luxury-royalBlue animate-fade-in theme-transition">
                Ссылка скопирована
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <PropertyGallery
        images={
          isFloorPlanView && property.floor_plan_url
            ? [property.floor_plan_url]
            : property.property_images.map((img) => img.image_url)
        }
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={isFloorPlanView ? 0 : currentImageIndex}
      />
    </>
  )
}
"use client"

import { useEffect, useRef, useState } from 'react'

interface LuxurySealProps {
  className?: string
  size?: number
  text?: string
}

export function LuxurySeal({ className = "", size = 140, text = 'PREMIUM' }: LuxurySealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sealRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    
    if (sealRef.current) {
      observer.observe(sealRef.current)
    }
    
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div 
      ref={sealRef} 
      className={`relative ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px` 
      }}
    >
      {/* Outer circle with golden border */}
      <div 
        className={`absolute inset-0 rounded-full border-2 border-gold/30 transition-all duration-1500 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        style={{ transitionDelay: '300ms' }}
      ></div>
      
      {/* Middle circle with pattern */}
      <div 
        className={`absolute inset-2 rounded-full border border-gold/20 transition-all duration-1500 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        style={{ transitionDelay: '600ms' }}
      >
        <div className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-sm"></div>
        <div className="absolute inset-0 rounded-full opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 0h22v22H0V0zm22 22h22v22H22V22z' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '8px 8px'
        }}></div>
      </div>
      
      {/* Inner circle with radial gradient */}
      <div 
        className={`absolute inset-8 rounded-full bg-black/50 backdrop-blur-sm border border-gold/40 flex items-center justify-center transition-all duration-1500 ease-out overflow-hidden ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        style={{ transitionDelay: '900ms' }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-gold/10 to-transparent opacity-60"></div>
        
        {/* Text */}
        <div className="relative">
          <div 
            className={`text-center transition-all duration-1500 ease-out ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}
            style={{ transitionDelay: '1200ms' }}
          >
            <div className="text-xs tracking-widest text-gold/70 font-light mb-1">{text}</div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative dots around the seal */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180)
        const x = Math.cos(angle) * (size / 2 - 6)
        const y = Math.sin(angle) * (size / 2 - 6)
        
        return (
          <div 
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full bg-gold/60 transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
            style={{ 
              top: `calc(50% - 3px)`,
              left: `calc(50% - 3px)`,
              transform: `translate(${x}px, ${y}px)`,
              transitionDelay: `${1500 + i * 50}ms`
            }}
          ></div>
        )
      })}
      
      {/* Light rays */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60) * (Math.PI / 180)
        const startX = Math.cos(angle) * (size / 4)
        const startY = Math.sin(angle) * (size / 4)
        const endX = Math.cos(angle) * (size / 2 - 10)
        const endY = Math.sin(angle) * (size / 2 - 10)
        
        return (
          <div 
            key={i}
            className={`absolute bg-gradient-to-b from-gold/0 via-gold/20 to-gold/0 transition-all duration-1500 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
            style={{ 
              top: `calc(50% - 0.5px)`,
              left: `calc(50%)`,
              width: '1px',
              height: `${Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))}px`,
              transform: `rotate(${angle * (180 / Math.PI)}deg) translateX(${size / 4}px)`,
              transformOrigin: 'left center',
              transitionDelay: `${2000 + i * 100}ms`
            }}
          ></div>
        )
      })}
    </div>
  )
}

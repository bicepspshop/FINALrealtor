"use client"

import { useEffect, useRef, useState } from 'react'

interface OrnateFrameProps {
  className?: string
  children?: React.ReactNode
  color?: string
  animated?: boolean
}

export function OrnateFrame({ 
  className = "", 
  children,
  color = "#D4AF37",
  animated = true
}: OrnateFrameProps) {
  const [isVisible, setIsVisible] = useState(!animated)
  const frameRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!animated) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    
    if (frameRef.current) {
      observer.observe(frameRef.current)
    }
    
    return () => {
      observer.disconnect()
    }
  }, [animated])

  return (
    <div 
      ref={frameRef}
      className={`relative ${className}`}
    >
      {/* Top-left corner */}
      <div className={`absolute -top-1 -left-1 w-16 h-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
           style={{ transitionDelay: '100ms' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M63 63V40C63 18.46 45.54 1 24 1H1" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
          <path d="M1 1L6 6" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="12" cy="12" r="2" fill={color} fillOpacity="0.3" />
        </svg>
      </div>
      
      {/* Top-right corner */}
      <div className={`absolute -top-1 -right-1 w-16 h-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
           style={{ transitionDelay: '200ms' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 63V40C1 18.46 18.46 1 40 1H63" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
          <path d="M63 1L58 6" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="52" cy="12" r="2" fill={color} fillOpacity="0.3" />
        </svg>
      </div>
      
      {/* Bottom-left corner */}
      <div className={`absolute -bottom-1 -left-1 w-16 h-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
           style={{ transitionDelay: '300ms' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M63 1V24C63 45.54 45.54 63 24 63H1" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
          <path d="M1 63L6 58" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="12" cy="52" r="2" fill={color} fillOpacity="0.3" />
        </svg>
      </div>
      
      {/* Bottom-right corner */}
      <div className={`absolute -bottom-1 -right-1 w-16 h-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
           style={{ transitionDelay: '400ms' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1V24C1 45.54 18.46 63 40 63H63" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
          <path d="M63 63L58 58" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="52" cy="52" r="2" fill={color} fillOpacity="0.3" />
        </svg>
      </div>
      
      {/* Inner elements with delayed animation */}
      <div className={`relative ${animated ? 'transition-all duration-1000 ease-out' : ''} ${isVisible ? 'opacity-100 transform-none' : animated ? 'opacity-0 scale-98' : ''}`}
           style={{ transitionDelay: '500ms' }}>
        {children}
      </div>
    </div>
  )
}

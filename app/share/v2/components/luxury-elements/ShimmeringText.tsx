"use client"

import { useState, useEffect } from 'react'
import React from 'react'

interface ShimmeringTextProps {
  text: string
  className?: string
  color?: string
  delay?: number
}

export function ShimmeringText({ 
  text, 
  className = "",
  color = "rgba(212, 175, 55, 0.8)",
  delay = 0
}: ShimmeringTextProps) {
  const [isShimmering, setIsShimmering] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShimmering(true)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [delay])
  
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      
      {/* Shimmering overlay */}
      <span 
        className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${isShimmering ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      >
        <span 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            transform: 'translateX(-100%)',
            animation: isShimmering ? 'shimmerEffect 3s ease-in-out infinite' : 'none',
          }}
        ></span>
      </span>
      
      <style jsx>{`
        @keyframes shimmerEffect {
          0% {
            transform: translateX(-100%);
          }
          50%, 100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </span>
  )
}

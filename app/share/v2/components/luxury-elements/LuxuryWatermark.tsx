"use client"

import { useEffect, useState } from 'react'

interface LuxuryWatermarkProps {
  text?: string
  opacity?: number
  className?: string
  size?: number
}

export function LuxuryWatermark({ 
  text = 'PREMIUM',
  opacity = 0.03,
  className = "",
  size = 240
}: LuxuryWatermarkProps) {
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    // Set initial random rotation between -15 and 15 degrees
    setRotation(-15 + Math.random() * 30)
    
    // Random subtle movement on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Calculate subtle movement based on scroll position
      // Maximum movement is 10px in any direction
      const moveX = Math.sin(scrollY * 0.001) * 10
      const moveY = Math.cos(scrollY * 0.001) * 10
      
      setPosition({ x: moveX, y: moveY })
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <div 
      className={`fixed pointer-events-none select-none z-0 ${className}`}
      style={{ 
        opacity,
        transform: `rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      <div 
        className="rounded-full border-2 border-gold flex items-center justify-center"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
        }}
      >
        <div 
          className="text-gold uppercase tracking-widest font-serif text-center"
          style={{ fontSize: `${size / 12}px` }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}

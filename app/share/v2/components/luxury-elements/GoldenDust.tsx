"use client"

import { useEffect, useRef } from 'react'

interface GoldenDustProps {
  className?: string
  particleCount?: number
  duration?: number
  startDelay?: number
}

export function GoldenDust({ 
  className = "", 
  particleCount = 15,
  duration = 3000,
  startDelay = 0
}: GoldenDustProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    
    // Remove any existing particles
    const existingParticles = container.querySelectorAll('.golden-dust-particle')
    existingParticles.forEach(particle => {
      particle.remove()
    })
    
    // Wait for the start delay
    const timeoutId = setTimeout(() => {
      // Create particles
      for (let i = 0; i < particleCount; i++) {
        createParticle(container, containerWidth, containerHeight, duration)
      }
      
      // Create a few particles every second for continuous effect
      const intervalId = setInterval(() => {
        for (let i = 0; i < Math.ceil(particleCount / 5); i++) {
          createParticle(container, containerWidth, containerHeight, duration)
        }
      }, 1000)
      
      return () => {
        clearInterval(intervalId)
      }
    }, startDelay)
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [particleCount, duration, startDelay])
  
  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    ></div>
  )
}

function createParticle(
  container: HTMLDivElement, 
  containerWidth: number, 
  containerHeight: number,
  duration: number
) {
  // Create particle element
  const particle = document.createElement('div')
  particle.classList.add('golden-dust-particle')
  
  // Random size between 2px and 6px
  const size = 2 + Math.random() * 4
  
  // Apply styles
  Object.assign(particle.style, {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: `rgba(212, 175, 55, ${0.2 + Math.random() * 0.4})`,
    boxShadow: `0 0 ${2 + size}px rgba(212, 175, 55, 0.7)`,
    filter: 'blur(1px)',
    opacity: `${0.3 + Math.random() * 0.7}`,
    zIndex: '10',
    pointerEvents: 'none',
  })
  
  // Initial position - start at the bottom edge
  const startX = Math.random() * containerWidth
  const startY = containerHeight - 10
  
  // End position - random point higher up
  const endX = startX + (Math.random() * 100 - 50)
  const endY = Math.random() * containerHeight * 0.7
  
  // Set initial position
  particle.style.left = `${startX}px`
  particle.style.top = `${startY}px`
  
  // Add to container
  container.appendChild(particle)
  
  // Animation duration with some randomness
  const animDuration = duration * (0.7 + Math.random() * 0.6)
  
  // Animated movement
  setTimeout(() => {
    // Random delays for a more natural effect
    Object.assign(particle.style, {
      transition: `all ${animDuration}ms cubic-bezier(0.2, 0.8, 0.3, 1)`,
      transform: 'translate(0, 0)',
    })
    
    setTimeout(() => {
      Object.assign(particle.style, {
        transform: `translate(${endX - startX}px, ${endY - startY}px)`,
        opacity: '0',
      })
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode === container) {
          container.removeChild(particle)
        }
      }, animDuration)
    }, 50)
  }, Math.random() * 200)
}

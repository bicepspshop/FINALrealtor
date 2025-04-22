"use client"

import React, { useEffect, useRef, useState } from "react"

interface FogTextEffectProps {
  text: string
  className?: string
  delay?: number
  style?: React.CSSProperties
  interactionRadius?: number
}

export function FogTextEffect({
  text,
  className = "",
  delay = 0,
  style = {},
  interactionRadius = 120
}: FogTextEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [characters, setCharacters] = useState<{ char: string; active: boolean }[]>([])
  
  // Process text into characters on first render
  useEffect(() => {
    const chars = text.split('').map(char => ({
      char,
      active: false
    }))
    setCharacters(chars)
  }, [text])

  // Simple mouse move handler that activates characters within radius
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Get character elements
    const charElements = containerRef.current.querySelectorAll('.fog-char')
    const newCharacters = [...characters]
    let updated = false
    
    charElements.forEach((charEl, index) => {
      if (!charEl) return
      
      const charRect = charEl.getBoundingClientRect()
      const charCenterX = charRect.left + charRect.width / 2 - rect.left
      const charCenterY = charRect.top + charRect.height / 2 - rect.top
      
      const dx = charCenterX - mouseX
      const dy = charCenterY - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Update character state based on distance to mouse
      const shouldBeActive = distance <= interactionRadius
      
      if (shouldBeActive !== newCharacters[index].active) {
        newCharacters[index].active = shouldBeActive
        updated = true
      }
    })
    
    if (updated) {
      setCharacters(newCharacters)
    }
  }
  
  // Reset all characters when mouse leaves
  const handleMouseLeave = () => {
    const anyActive = characters.some(char => char.active)
    
    if (anyActive) {
      setCharacters(characters.map(char => ({
        ...char,
        active: false
      })))
    }
  }
  
  // Subtle automatic animation when not hovered
  useEffect(() => {
    // Skip auto-animation if any character is already active
    if (characters.some(char => char.active)) return
    
    const interval = setInterval(() => {
      // Skip if any character is already active from mouse interaction
      if (characters.some(char => char.active)) return
      
      const newCharacters = [...characters]
      const totalChars = newCharacters.length
      
      if (totalChars < 3) return
      
      // Pick a random character
      const randomIndex = Math.floor(Math.random() * totalChars)
      
      // Toggle this character
      newCharacters[randomIndex].active = true
      setCharacters(newCharacters)
      
      // Reset after a short delay
      setTimeout(() => {
        if (containerRef.current) {
          setCharacters(prev => 
            prev.map((char, idx) => idx === randomIndex ? { ...char, active: false } : char)
          )
        }
      }, 500)
      
    }, 2000)
    
    return () => clearInterval(interval)
  }, [characters])
  
  return (
    <div
      ref={containerRef}
      className={`fog-text-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {characters.map((char, index) => (
        <span
          key={index}
          className={`fog-char ${char.char === ' ' ? 'space' : ''} ${char.active ? 'active' : ''}`}
          style={{
            transitionDelay: `${index * 20}ms`,
          }}
        >
          {char.char === ' ' ? '\u00A0' : char.char}
        </span>
      ))}
    </div>
  )
}

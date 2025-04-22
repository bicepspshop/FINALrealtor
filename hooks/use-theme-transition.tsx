'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useThemeTransition() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Avoid hydration mismatch by only rendering once mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const toggleTheme = () => {
    setIsTransitioning(true)
    
    // Small delay to allow transition to complete
    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark')
      
      // Reset the transitioning state after theme change
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300) // Match this with the CSS transition duration
    }, 50)
  }
  
  return {
    theme,
    setTheme,
    mounted,
    isTransitioning,
    toggleTheme
  }
}

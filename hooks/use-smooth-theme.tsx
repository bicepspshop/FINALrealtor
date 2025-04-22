'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useCallback, useRef } from 'react'
import { toggleThemeWithTransition } from '@/lib/theme-transition'

/**
 * Enhanced theme hook that provides smoother transitions
 * This hook optimizes theme changes to prevent flickering
 */
export function useSmoothTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevThemeRef = useRef(theme)
  
  // Avoid hydration mismatch by only rendering once mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Track theme changes to detect transitions
  useEffect(() => {
    if (mounted && theme !== prevThemeRef.current) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 400) // Match this with CSS transition duration
      
      return () => clearTimeout(timer)
    }
    prevThemeRef.current = theme
  }, [theme, mounted])
  
  // Smooth theme toggle function
  const toggleTheme = useCallback(() => {
    if (isTransitioning) return // Prevent toggle during transition
    
    toggleThemeWithTransition(setTheme, resolvedTheme || theme)
  }, [setTheme, resolvedTheme, theme, isTransitioning])
  
  // Set theme with transition
  const setThemeWithTransition = useCallback((newTheme: string) => {
    if (isTransitioning) return // Prevent toggle during transition
    
    // If the new theme is the same as current theme, do nothing
    if (newTheme === theme) return;
    
    // If selecting a specific theme (not toggling), directly set it
    if (newTheme === 'system') {
      toggleThemeWithTransition(setTheme, 'system');
    } else {
      toggleThemeWithTransition(setTheme, resolvedTheme || theme);
    }
  }, [setTheme, isTransitioning, theme, resolvedTheme]);
  
  return {
    theme,
    resolvedTheme,
    mounted,
    isTransitioning,
    toggleTheme,
    setThemeWithTransition
  }
}

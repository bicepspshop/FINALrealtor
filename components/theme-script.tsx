"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeScript() {
  const { setTheme } = useTheme()
  
  useEffect(() => {
    // Set dark theme as default on first load
    try {
      const savedTheme = localStorage.getItem("theme")
      if (!savedTheme) {
        setTheme("dark")
        localStorage.setItem("theme", "dark")
      }
    } catch (e) {
      // If localStorage fails, still set the theme to dark
      setTheme("dark")
    }
  }, [setTheme])
  
  return null
}

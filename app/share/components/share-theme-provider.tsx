"use client"

import React from "react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/ui/theme/theme-toggle"

interface ShareThemeProviderProps {
  children: React.ReactNode
  displayToggle?: boolean
}

export function ShareThemeProvider({ children, displayToggle = true }: ShareThemeProviderProps) {
  const { theme, resolvedTheme = "dark" } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render UI after mounted on client to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  const isDark = resolvedTheme === "dark"

  return (
    <>
      {displayToggle && (
        <div className="fixed top-5 left-5 z-50">
          <ThemeToggle />
        </div>
      )}
      <div className={isDark ? "dark" : ""}>
        {children}
      </div>
    </>
  )
}

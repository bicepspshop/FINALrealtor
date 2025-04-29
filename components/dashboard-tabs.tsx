"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardTabsProps {
  activeTab: "collections" | "clients"
}

export function DashboardTabs({ activeTab }: DashboardTabsProps) {
  const collectionsRef = useRef<HTMLAnchorElement>(null)
  const clientsRef = useRef<HTMLAnchorElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0
  })
  const [mounted, setMounted] = useState(false)
  
  // Update indicator position and width based on active tab
  useEffect(() => {
    setMounted(true)
    
    // Update indicator position after DOM is fully loaded
    const updateIndicator = () => {
      const activeRef = activeTab === "collections" ? collectionsRef.current : clientsRef.current
      
      if (activeRef) {
        const { offsetLeft, offsetWidth } = activeRef
        // Apply a slight offset to the left if clients tab is active
        const leftOffset = activeTab === "clients" ? -20 : 0
        
        setIndicatorStyle({
          left: offsetLeft + leftOffset,
          width: offsetWidth
        })
      }
    }
    
    // Initial update
    updateIndicator()
    
    // Update on window resize to ensure proper positioning
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeTab])

  // Apply left offset for clients tab
  const containerStyles = activeTab === "clients" 
    ? { transform: 'translateX(-20px)' }
    : {}

  if (!mounted) {
    return (
      <div 
        className="relative flex items-center gap-10 mb-4"
        style={containerStyles}
      >
        <div className="flex flex-col">
          <span className="text-3xl font-serif font-medium text-luxury-black dark:text-white">
            Ваши подборки
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-3xl font-serif font-medium text-luxury-black/60 dark:text-white/60">
            Клиенты
          </span>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative flex items-center gap-10 mb-4"
      style={containerStyles}
    >
      <div className="flex flex-col">
        <Link
          ref={collectionsRef}
          href="/dashboard"
          className={`text-3xl font-serif font-medium pb-2 theme-transition ${
            activeTab === "collections" 
              ? "text-luxury-black dark:text-white" 
              : "text-luxury-black/60 dark:text-white/60 hover:text-luxury-black dark:hover:text-white"
          }`}
        >
          Ваши подборки
        </Link>
      </div>
      
      <div className="flex flex-col">
        <Link
          ref={clientsRef}
          href="/dashboard/clients"
          className={`text-3xl font-serif font-medium pb-2 theme-transition ${
            activeTab === "clients" 
              ? "text-luxury-black dark:text-white" 
              : "text-luxury-black/60 dark:text-white/60 hover:text-luxury-black dark:hover:text-white"
          }`}
        >
          Клиенты
        </Link>
      </div>

      <div 
        className="absolute bottom-[-2px] h-1 bg-luxury-gold dark:bg-luxury-royalBlue theme-transition rounded-sm"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)"
        }}
      />
    </div>
  )
} 
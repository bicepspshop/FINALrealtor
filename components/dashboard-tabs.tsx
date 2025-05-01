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
  const [mounted, setMounted] = useState(false)
  
  // Update indicator position and width based on active tab
  useEffect(() => {
    setMounted(true)
  }, [activeTab])

  // Apply left offset for clients tab
  const containerStyles = activeTab === "clients" 
    ? { transform: 'translateX(-7px)' }
    : {}

  if (!mounted) {
    return (
      <div 
        className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 mb-4"
        style={containerStyles}
      >
        <div className="flex flex-col">
          <span className="text-3xl font-serif font-medium text-luxury-black dark:text-white">
            <span className="sm:hidden">Подборки</span>
            <span className="hidden sm:inline">Ваши подборки</span>
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
      className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 mb-4"
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
          <span className="sm:hidden">Подборки</span>
          <span className="hidden sm:inline">Ваши подборки</span>
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
    </div>
  )
} 
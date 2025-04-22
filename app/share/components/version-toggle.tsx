"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface VersionToggleProps {
  currentVersion: "v1" | "v2"
  shareId: string
  variant?: "light" | "dark"
}

export function VersionToggle({ currentVersion, shareId, variant = "light" }: VersionToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)
  
  const toggleVersion = () => {
    // Switch between v1 and v2
    if (currentVersion === "v1") {
      router.push(`/share/v2/${shareId}`)
    } else {
      router.push(`/share/${shareId}`)
    }
  }

  return (
    <div 
      className={`fixed top-5 right-5 z-50 flex items-center rounded-full p-1 transition-all duration-300 ${
        variant === "light" 
          ? "bg-white/90 backdrop-blur-sm shadow-md" 
          : "bg-black/30 backdrop-blur-sm border border-gold/20 shadow-gold/10"
      } ${isHovered ? "scale-105" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative flex rounded-full overflow-hidden text-sm font-medium w-32 h-10`}>
        <div 
          className={`absolute top-0 rounded-full transition-all duration-300 h-full w-1/2 ${
            currentVersion === "v1"
              ? "left-0 bg-gradient-to-r from-gray-200 to-white"
              : "left-1/2 bg-gradient-to-r from-[#101010] to-[#1A1A1A] border-gold/10"
          }`}
        />
        
        <button 
          onClick={toggleVersion}
          className={`flex-1 z-10 flex items-center justify-center ${
            currentVersion === "v1"
              ? variant === "light" ? "text-black" : "text-white"
              : variant === "light" ? "text-black/50" : "text-white/50"
          } transition-colors duration-300`}
        >
          v1
        </button>
        
        <button 
          onClick={toggleVersion}
          className={`flex-1 z-10 flex items-center justify-center ${
            currentVersion === "v2"
              ? variant === "light" ? "text-black" : "text-white" 
              : variant === "light" ? "text-black/50" : "text-white/50"
          } transition-colors duration-300`}
        >
          v2
        </button>
      </div>
    </div>
  )
} 
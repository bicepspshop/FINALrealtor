"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toggleThemeWithTransition } from "@/lib/theme-transition"
import { useSmoothTheme } from "@/hooks/use-smooth-theme"

export function ThemeToggle() {
  const { mounted, isTransitioning, resolvedTheme, setThemeWithTransition } = useSmoothTheme()

  if (!mounted) {
    return <div className="w-10 h-10"></div> // Placeholder to avoid layout shift
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full w-10 h-10 flex items-center justify-center hover:bg-luxury-gold/5 dark:hover:bg-luxury-royalBlue/5 hover:text-luxury-gold dark:hover:text-white transition-all duration-300 dark:text-white theme-transition relative overflow-hidden theme-toggle-icon-button ${isTransitioning ? 'pointer-events-none' : ''}`}
          disabled={isTransitioning}
        >
          <div className="relative w-5 h-5 theme-toggle-icon">
            <Sun className="absolute inset-0 transition-all duration-500 ease-out opacity-100 transform scale-100 dark:opacity-0 dark:scale-75" />
            <Moon className="absolute inset-0 transition-all duration-500 ease-out opacity-0 transform scale-75 dark:opacity-100 dark:scale-100 dark:text-white" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-1.5">
        <DropdownMenuItem 
          onClick={() => setThemeWithTransition("light")}
          className="cursor-pointer flex items-center gap-2.5 py-2.5 rounded-sm"
          disabled={isTransitioning}
        >
          <Sun className="h-4 w-4" />
          <span>Светлая</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setThemeWithTransition("dark")}
          className="cursor-pointer flex items-center gap-2.5 py-2.5 rounded-sm"
          disabled={isTransitioning}
        >
          <Moon className="h-4 w-4" />
          <span>Тёмная</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setThemeWithTransition("system")}
          className="cursor-pointer flex items-center gap-2.5 py-2.5 rounded-sm"
          disabled={isTransitioning}
        >
          <span className="flex h-4 w-4 items-center justify-center">
            <span className="h-full w-full rounded-full bg-gradient-to-tr from-black to-white" />
          </span>
          <span>Системная</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
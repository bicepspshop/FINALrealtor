"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./client-auth-provider"
import { WifiOff, User, ChevronDown, LogOut, Settings, Home } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavBarProps {
  userName: string
  isOfflineMode?: boolean
}

export function NavBar({ userName, isOfflineMode = false }: NavBarProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { logout } = useAuth()

  const handleLogout = async () => {
    logout()
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы.",
    })
  }

  return (
    <header className="bg-white dark:bg-dark-graphite border-b border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark py-3 sticky top-0 z-50 theme-transition">
      <div className="container-luxury flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-white dark:gold-accent theme-transition">
            РиелторПро
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/dashboard" 
            className="text-luxury-black/80 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 font-medium flex items-center gap-2 theme-transition"
          >
            <Home size={18} />
            Главная
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isOfflineMode && (
            <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-sm text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-1.5 border border-amber-200 dark:border-amber-700/50 theme-transition">
              <WifiOff className="h-3.5 w-3.5" />
              Офлайн режим
            </div>
          )}
          
          {/* Theme Toggle Button */}
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-luxury-gold/5 hover:text-luxury-gold dark:hover:bg-luxury-royalBlue/10 dark:hover:text-luxury-royalBlue transition-all duration-300 theme-transition"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center theme-transition">
                  <User size={18} className="text-white opacity-90" />
                </div>
                <span className="font-medium dark:text-white theme-transition">{userName}</span>
                <ChevronDown size={16} className="dark:text-white/70 theme-transition" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5 bg-gray-800 border-gray-700 theme-transition">
              <DropdownMenuLabel className="text-white/70 font-normal text-xs theme-transition">
                Ваш аккаунт
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700 theme-transition" />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2.5 py-2.5 rounded-sm hover:bg-gray-700 focus:bg-gray-700 theme-transition">
                  <User size={16} className="text-white opacity-80 theme-transition" />
                  <span className="text-white theme-transition">Профиль</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer flex items-center gap-2.5 py-2.5 hover:bg-red-900/30 focus:bg-red-900/30 focus:text-red-400 rounded-sm theme-transition"
              >
                <LogOut size={16} className="text-red-400 opacity-80 theme-transition" />
                <span className="text-white group-focus:text-red-400 theme-transition">Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

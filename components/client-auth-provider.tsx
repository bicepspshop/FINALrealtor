"use client"

import { useEffect, useState, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  userId: string | null
  isOfflineMode: boolean
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  isOfflineMode: false,
  logout: () => {},
  checkAuth: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Функция для проверки состояния сети
  const checkNetworkStatus = () => {
    setIsOfflineMode(!navigator.onLine)
  }

  const checkAuth = () => {
    // Проверяем наличие cookie auth-token
    const cookies = document.cookie.split(";")
    const authCookie = cookies.find((c) => c.trim().startsWith("auth-token="))

    if (authCookie) {
      const token = authCookie.split("=")[1]
      setIsAuthenticated(true)
      setUserId(token)
    } else {
      setIsAuthenticated(false)
      setUserId(null)
    }

    // Проверяем состояние сети
    checkNetworkStatus()

    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()

    // Добавляем обработчики событий для проверки аутентификации и состояния сети
    const handleFocus = () => {
      checkAuth()
    }

    const handleOnline = () => {
      setIsOfflineMode(false)
      console.log("Соединение восстановлено")
    }

    const handleOffline = () => {
      setIsOfflineMode(true)
      console.log("Соединение потеряно")
    }

    window.addEventListener("focus", handleFocus)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const logout = async () => {
    try {
      // Отправляем запрос на сервер для удаления cookie
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        // Удаляем cookie на клиенте
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        setIsAuthenticated(false)
        setUserId(null)
        router.push("/login")
      }
    } catch (error) {
      console.error("Ошибка при выходе:", error)
      // Удаляем cookie на клиенте в любом случае
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      setIsAuthenticated(false)
      setUserId(null)
      router.push("/login")
    }
  }

  if (isLoading) {
    // Можно добавить компонент загрузки, если нужно
    return null
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, isOfflineMode, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

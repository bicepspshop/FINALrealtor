"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WifiOff, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OfflineAlert() {
  const [isOffline, setIsOffline] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    // Инициализация состояния
    setIsOffline(!navigator.onLine)
    setShowAlert(!navigator.onLine)

    // Обработчики событий для отслеживания состояния сети
    const handleOnline = () => {
      setIsOffline(false)
      setShowAlert(true)
      // Скрываем уведомление о восстановлении соединения через 5 секунд
      setTimeout(() => setShowAlert(false), 5000)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setShowAlert(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showAlert) return null

  return (
    <Alert
      variant={isOffline ? "destructive" : "default"}
      className={`fixed bottom-4 right-4 w-auto max-w-md z-50 ${isOffline ? "bg-red-50" : "bg-green-50"}`}
    >
      {isOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
      <AlertTitle>{isOffline ? "Нет подключения к интернету" : "Подключение восстановлено"}</AlertTitle>
      <AlertDescription>
        {isOffline
          ? "Некоторые функции могут быть недоступны. Проверьте подключение к интернету."
          : "Все функции приложения снова доступны."}
      </AlertDescription>
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => {
          if (isOffline) {
            window.location.reload()
          } else {
            setShowAlert(false)
          }
        }}
      >
        {isOffline ? "Обновить страницу" : "Закрыть"}
      </Button>
    </Alert>
  )
}

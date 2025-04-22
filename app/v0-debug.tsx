"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function V0DebugPage() {
  const [authStatus, setAuthStatus] = useState<{
    isLoading: boolean
    isAuthenticated: boolean
    error: string | null
    cookieExists: boolean
    userId: string | null
  }>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    cookieExists: false,
    userId: null,
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем наличие cookie
        const cookies = document.cookie.split(";")
        const authCookie = cookies.find((c) => c.trim().startsWith("auth-token="))
        const cookieExists = !!authCookie

        // Получаем ID пользователя из cookie если есть
        let userId = null
        if (cookieExists) {
          userId = authCookie.split("=")[1]
        }

        setAuthStatus({
          isLoading: false,
          isAuthenticated: cookieExists,
          error: null,
          cookieExists,
          userId,
        })
      } catch (error) {
        setAuthStatus({
          isLoading: false,
          isAuthenticated: false,
          error: error instanceof Error ? error.message : "Неизвестная ошибка",
          cookieExists: false,
          userId: null,
        })
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Отладка v0 Dashboard</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Статус аутентификации</CardTitle>
          </CardHeader>
          <CardContent>
            {authStatus.isLoading ? (
              <p>Проверка статуса аутентификации...</p>
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>Аутентифицирован:</strong>{" "}
                  <span className={authStatus.isAuthenticated ? "text-green-600" : "text-red-600"}>
                    {authStatus.isAuthenticated ? "Да" : "Нет"}
                  </span>
                </p>
                <p>
                  <strong>Cookie auth-token:</strong>{" "}
                  <span className={authStatus.cookieExists ? "text-green-600" : "text-red-600"}>
                    {authStatus.cookieExists ? "Существует" : "Отсутствует"}
                  </span>
                </p>
                {authStatus.userId && (
                  <p>
                    <strong>ID пользователя:</strong> {authStatus.userId}
                  </p>
                )}
                {authStatus.error && (
                  <p className="text-red-600">
                    <strong>Ошибка:</strong> {authStatus.error}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Навигация</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/">
              <Button variant="outline">Главная</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Страница входа</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Регистрация</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default">Dashboard</Button>
            </Link>
            <Link href="/debug">
              <Button variant="outline">Страница отладки</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Действия</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button
              variant="destructive"
              onClick={() => {
                document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                window.location.reload()
              }}
            >
              Удалить cookie auth-token
            </Button>
            <Button
              variant="default"
              onClick={() => {
                window.location.href = "/dashboard"
              }}
            >
              Перейти на Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

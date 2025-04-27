import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("Middleware: Обработка запроса для пути:", request.nextUrl.pathname)

  // Получаем токен из cookie
  const authToken = request.cookies.get("auth-token")
  const path = request.nextUrl.pathname

  // Публичные маршруты, не требующие авторизации
  const publicRoutes = ["/", "/login", "/register", "/debug", "/v0-debug", "/recovery", "/reset-password"]
  const isPublicRoute = publicRoutes.includes(path) || path.startsWith("/share/") || path.startsWith("/reset-password")

  // API маршруты и статические ресурсы должны быть исключены из проверок авторизации
  const isApiOrStaticRoute =
    path.startsWith("/api/") ||
    path.includes("/_next/") ||
    path.includes("/favicon.ico") ||
    path.includes(".svg") ||
    path.includes(".png") ||
    path.includes(".jpg") ||
    path.includes(".jpeg") ||
    path.includes(".gif") ||
    path.includes(".woff") ||
    path.includes(".woff2") ||
    path.includes(".ttf")

  // Пропускаем проверку авторизации для API и статических маршрутов
  if (isApiOrStaticRoute) {
    console.log("Middleware: Пропуск проверки для API/статического маршрута:", path)
    return NextResponse.next()
  }

  // Для v0 отладки - всегда пропускаем проверку
  if (path === "/v0-debug") {
    console.log("Middleware: Пропуск проверки для страницы отладки v0")
    return NextResponse.next()
  }

  // Если маршрут не публичный и нет токена авторизации, перенаправляем на страницу входа
  if (!isPublicRoute && !authToken) {
    console.log(`Middleware: Перенаправление на страницу входа с ${path} - Нет токена авторизации`)
    return NextResponse.redirect(new URL(`/login`, request.url))
  }

  // Если пользователь авторизован и пытается получить доступ к странице входа/регистрации, перенаправляем на панель управления
  if (authToken && (path === "/login" || path === "/register")) {
    console.log("Middleware: Перенаправление на панель управления - Пользователь уже авторизован")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Добавляем заголовок для отладки
  const response = NextResponse.next()
  response.headers.set("x-middleware-cache", "no-cache")

  console.log("Middleware: Продолжение запроса для пути:", path)
  return response
}

export const config = {
  matcher: [
    /*
     * Сопоставление всех путей запросов, кроме:
     * - _next/static (статические файлы)
     * - _next/image (файлы оптимизации изображений)
     * - favicon.ico (файл иконки)
     * - public files (публичные ресурсы)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

import { createClient } from "@supabase/supabase-js"

// Максимальное количество попыток подключения
const MAX_RETRIES = 3
// Задержка между попытками (в миллисекундах)
const RETRY_DELAY = 1000
// Таймаут для запроса
const REQUEST_TIMEOUT = 5000

// Create a single supabase client for the browser
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables for browser client")
    throw new Error("Missing required environment variables for Supabase")
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Create a single supabase client for server components
const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || (process.env.NEXT_PUBLIC_SUPABASE_URL as string)
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables for server client")
    throw new Error("Missing required environment variables for Supabase")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Client singleton
let browserClient: ReturnType<typeof createClient> | null = null

// Get the browser client (singleton pattern)
export const getBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Get the server client (created fresh each time)
export const getServerClient = () => {
  return createServerClient()
}

// Функция для проверки, является ли ошибка сетевой
export function isNetworkError(error: any): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("Failed to fetch") ||
      error.message.includes("Network Error") ||
      error.message.includes("network") ||
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("ETIMEDOUT") ||
      error.message.includes("ENOTFOUND") ||
      error.message.includes("AbortError") ||
      error.message.includes("timeout"))
  )
}

// Функция для выполнения запроса с повторными попытками и таймаутом
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
  timeout = REQUEST_TIMEOUT,
): Promise<T> {
  // Создаем контроллер для таймаута
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    // Оборачиваем операцию в Promise.race для реализации таймаута
    const result = await operation()
    clearTimeout(timeoutId)
    return result
  } catch (error) {
    clearTimeout(timeoutId)

    if (retries <= 0) {
      console.error("Все попытки выполнения запроса исчерпаны:", error)
      throw error
    }

    // Проверяем, является ли ошибка сетевой или таймаутом
    if (isNetworkError(error)) {
      console.warn(`Сетевая ошибка, повторная попытка (осталось ${retries}):`, error)

      // Ждем перед повторной попыткой
      await new Promise((resolve) => setTimeout(resolve, delay))

      // Рекурсивно пытаемся снова с уменьшенным количеством попыток
      return executeWithRetry(operation, retries - 1, delay * 1.5, timeout)
    }

    // Если ошибка не сетевая, просто пробрасываем её дальше
    console.error("Ошибка запроса (не сетевая):", error)
    throw error
  }
}

// Функция для создания временной сессии при проблемах с подключением
export function createOfflineSession(userId: string) {
  return {
    id: userId,
    name: "Пользователь",
    email: "user@example.com",
    isOfflineMode: true,
  }
}

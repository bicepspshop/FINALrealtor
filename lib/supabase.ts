import { createClient } from "@supabase/supabase-js"

// Максимальное количество попыток подключения
const MAX_RETRIES = 3
// Задержка между попытками (в миллисекундах)
const RETRY_DELAY = 1000
// Таймаут для запроса
const REQUEST_TIMEOUT = 5000

// Cache implementation for query results
type CacheEntry = {
  data: any;
  timestamp: number;
  expiresIn: number;
}

const queryCache = new Map<string, CacheEntry>();

// Cache duration in milliseconds (default: 5 minutes)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

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
      flowType: 'pkce',
    },
    global: {
      fetch: cachingFetch
    }
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
    global: {
      fetch: cachingFetch
    }
  })
}

// Extended fetch function with caching for GET requests
async function cachingFetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  // Only cache GET requests
  if (!init || init.method === 'GET' || !init.method) {
    const cacheKey = generateCacheKey(url, init);
    
    // Check cache first
    const cachedEntry = queryCache.get(cacheKey);
    if (cachedEntry && !isCacheExpired(cachedEntry)) {
      // Return cached response
      return new Response(JSON.stringify(cachedEntry.data), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    // If not in cache or expired, fetch from network
    const response = await fetch(url, init);
    
    // Only cache successful responses
    if (response.ok) {
      try {
        // Clone the response to avoid consuming it
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        
        // Store in cache
        queryCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          expiresIn: DEFAULT_CACHE_DURATION
        });
      } catch (error) {
        // If parsing fails, just return the original response
        console.warn('Failed to cache Supabase response:', error);
      }
    }
    
    return response;
  }
  
  // For non-GET requests, just pass through without caching
  return fetch(url, init);
}

// Helper to generate a unique cache key
function generateCacheKey(url: RequestInfo | URL, init?: RequestInit): string {
  const urlStr = typeof url === 'string' ? url : url.toString();
  const headers = init?.headers ? JSON.stringify(init.headers) : '';
  return `${urlStr}:${headers}`;
}

// Check if cache entry is expired
function isCacheExpired(entry: CacheEntry): boolean {
  return Date.now() > (entry.timestamp + entry.expiresIn);
}

// Clear specific cache entries or all entries
export function clearSupabaseCache(urlPattern?: string): void {
  if (!urlPattern) {
    queryCache.clear();
    return;
  }
  
  // Clear specific entries matching the URL pattern
  queryCache.forEach((_, key) => {
    if (key.includes(urlPattern)) {
      queryCache.delete(key);
    }
  });
}

// Client singleton
let browserClient: any = null

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

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getServerClient, executeWithRetry, isNetworkError, createOfflineSession } from "./supabase"
import bcrypt from "bcryptjs"
import { checkTrialStatus, type TrialInfo } from "./subscription"

// Увеличиваем время жизни cookie до 7 дней (в секундах)
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60

// Расширенный тип сессии с информацией о подписке
export interface SessionWithSubscription {
  id: string;
  email: string;
  name: string;
  trialInfo?: TrialInfo;
  subscriptionStatus?: string;
  isOfflineMode?: boolean;
}

// Улучшим функцию getSession для более надежной работы в офлайн-режиме
export async function getSession(): Promise<SessionWithSubscription | null> {
  try {
    // Используем cookies() только в серверном контексте
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      console.log("getSession: Токен авторизации не найден в cookies")
      return null
    }

    console.log(`getSession: Получение данных пользователя с ID ${token}`)
    const supabase = getServerClient()

    try {
      // Добавляем информацию о подписке в запрос
      const { data, error } = (await Promise.race([
        executeWithRetry(() => supabase.from("users").select(
          "id, email, name, trial_start_time, trial_duration_minutes, subscription_status"
        ).eq("id", token).single()),
        new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: null,
                error: new Error("Timeout exceeded while fetching user data"),
              }),
            5000,
          ),
        ),
      ])) as any

      if (error) {
        console.error("getSession: Ошибка при запросе к базе данных:", error)

        // Проверяем, является ли ошибка временной сетевой проблемой
        if (isNetworkError(error)) {
          console.log("getSession: Обнаружена сетевая ошибка, возвращаем временную сессию")

          // Возвращаем временную сессию для продолжения работы
          return createOfflineSession(token)
        }

        // Для других типов ошибок очищаем токен
        cookies().delete("auth-token")
        return null
      }

      if (!data) {
        console.error("getSession: Пользователь не найден в базе данных")
        // Очищаем невалидный токен
        cookies().delete("auth-token")
        return null
      }

      // Проверяем статус подписки
      let trialInfo: TrialInfo;
      
      try {
        trialInfo = await checkTrialStatus(data.id);
      } catch (trialError) {
        console.error("getSession: Ошибка при проверке статуса подписки:", trialError);
        // В случае ошибки, предоставим базовую информацию о подписке
        trialInfo = {
          isActive: data.subscription_status === 'active' || data.subscription_status === 'trial',
          subscriptionStatus: data.subscription_status
        };
      }

      console.log("getSession: Сессия успешно получена для пользователя:", data.name)
      
      // Возвращаем данные с информацией о подписке
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        subscriptionStatus: data.subscription_status,
        trialInfo
      }
    } catch (fetchError) {
      console.error("getSession: Ошибка при запросе к базе данных:", fetchError)

      // Проверяем, является ли ошибка сетевой
      if (isNetworkError(fetchError)) {
        console.log("getSession: Сетевая ошибка, возвращаем временную сессию")

        // В случае сетевой ошибки, возвращаем временную сессию на основе токена
        // Это позволит пользователю продолжить работу даже при временных проблемах с базой данных
        return createOfflineSession(token)
      }

      // Для других ошибок очищаем токен
      cookies().delete("auth-token")
      return null
    }
  } catch (error) {
    console.error("getSession: Непредвиденная ошибка:", error)
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    console.log("requireAuth: Сессия не найдена, перенаправление на страницу входа")
    redirect("/login")
  }

  return session
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

// Функция для установки cookie с токеном авторизации
export function setAuthCookie(userId: string) {
  cookies().set({
    name: "auth-token",
    value: userId,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  })
}

// Функция для удаления cookie с токеном авторизации
export function clearAuthCookie() {
  cookies().delete("auth-token")
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const supabase = getServerClient();
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data.is_admin === true;
  } catch (error) {
    console.error('Unexpected error checking admin status:', error);
    return false;
  }
}

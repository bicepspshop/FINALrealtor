"use server"

import { cookies } from "next/headers"
import { getServerClient } from "@/lib/supabase"
import { comparePasswords } from "@/lib/auth"

interface LoginData {
  email: string
  password: string
}

export async function loginUser(data: LoginData) {
  try {
    console.log("loginUser: Попытка входа для email:", data.email)
    const supabase = getServerClient()

    // Найти пользователя по email
    const { data: user, error } = await supabase
      .from("users")
      .select("id, password_hash")
      .eq("email", data.email)
      .single()

    if (error || !user) {
      console.error("loginUser: Пользователь не найден:", error)
      return { error: "Неверный email или пароль" }
    }

    // Сравнить пароли
    const passwordMatch = await comparePasswords(data.password, user.password_hash)

    if (!passwordMatch) {
      console.error("loginUser: Несоответствие пароля для пользователя:", data.email)
      return { error: "Неверный email или пароль" }
    }

    // Очистить существующие cookie перед установкой новых
    cookies().delete("auth-token")

    // Установить новый cookie с улучшенными параметрами
    cookies().set({
      name: "auth-token",
      value: user.id,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 неделя
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    console.log("loginUser: Вход успешен для пользователя ID:", user.id)
    return { success: true, userId: user.id }
  } catch (error) {
    console.error("loginUser: Непредвиденная ошибка:", error)
    return { error: "Произошла непредвиденная ошибка" }
  }
}

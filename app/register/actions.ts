"use server"

import { cookies } from "next/headers"
import { getServerClient } from "@/lib/supabase"
import { hashPassword } from "@/lib/auth"

interface RegisterData {
  name: string
  email: string
  password: string
}

export async function registerUser(data: RegisterData) {
  try {
    const supabase = getServerClient()

    // Проверка, существует ли пользователь
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", data.email).single()

    if (existingUser) {
      return { error: "Пользователь с таким email уже существует" }
    }

    // Хеширование пароля
    const hashedPassword = await hashPassword(data.password)

    // Вставка нового пользователя
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Ошибка регистрации:", error)
      return { error: "Не удалось зарегистрировать пользователя" }
    }

    // Установка cookie с улучшенными параметрами
    cookies().set({
      name: "auth-token",
      value: newUser.id,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 неделя
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    return { success: true, userId: newUser.id }
  } catch (error) {
    console.error("Непредвиденная ошибка при регистрации:", error)
    return { error: "Произошла непредвиденная ошибка" }
  }
}

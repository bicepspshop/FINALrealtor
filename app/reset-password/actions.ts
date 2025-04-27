"use server"

import { getServerClient } from "@/lib/supabase"
import { hashPassword } from "@/lib/auth"

export async function resetPassword(token: string, newPassword: string) {
  try {
    // Проверка валидности токена
    const supabase = getServerClient()
    
    // Пытаемся сбросить пароль через API Supabase Auth
    const { error: authError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery',
    })
    
    if (authError) {
      console.error("Ошибка при проверке токена восстановления:", authError)
      return { 
        error: "Недействительный или просроченный токен восстановления пароля." 
      }
    }
    
    // Получаем данные о пользователе из токена
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError || !userData.user) {
      console.error("Ошибка при получении данных пользователя:", userError)
      return { 
        error: "Не удалось получить данные пользователя." 
      }
    }
    
    // Хешируем новый пароль
    const hashedPassword = await hashPassword(newPassword)
    
    // Обновляем пароль в нашей таблице пользователей
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: hashedPassword })
      .eq("email", userData.user.email)
    
    if (updateError) {
      console.error("Ошибка при обновлении пароля:", updateError)
      return { 
        error: "Не удалось обновить пароль. Пожалуйста, попробуйте позже." 
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error("Непредвиденная ошибка при сбросе пароля:", error)
    return { 
      error: "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже." 
    }
  }
}
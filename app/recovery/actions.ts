"use server"

import { getServerClient } from "@/lib/supabase"

export async function requestPasswordReset(email: string) {
  try {
    console.log("requestPasswordReset: Начало обработки для", email)
    const supabase = getServerClient()
    
    // Проверяем, существует ли пользователь с таким email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()
    
    if (userError || !user) {
      // В целях безопасности не сообщаем пользователю, что email не существует
      console.log(`Запрос на сброс пароля для несуществующего email: ${email}`)
      // Всё равно возвращаем success для безопасности (чтобы не раскрывать, есть такой email или нет)
      return { success: true }
    }
    
    // Отправляем ссылку для сброса пароля
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`;
    console.log("requestPasswordReset: Отправка ссылки для сброса пароля с redirectTo:", redirectUrl);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })
    
    if (error) {
      console.error("Ошибка при отправке ссылки для сброса пароля:", error)
      return { 
        error: "Не удалось отправить ссылку для сброса пароля. Пожалуйста, попробуйте позже." 
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error("Непредвиденная ошибка при запросе сброса пароля:", error)
    return { 
      error: "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже." 
    }
  }
}
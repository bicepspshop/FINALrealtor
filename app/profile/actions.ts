"use server"

import { getServerClient } from "@/lib/supabase"

interface ProfileData {
  name: string
  phone: string
  description?: string
  avatar_url?: string | null
}

export async function updateProfile(userId: string, data: ProfileData) {
  try {
    const supabase = getServerClient()
    
    // Update user profile
    const { error } = await supabase
      .from("users")
      .update({
        name: data.name,
        phone: data.phone,
        description: data.description || null,
        avatar_url: data.avatar_url || null,
      })
      .eq("id", userId)
    
    if (error) {
      console.error("Ошибка при обновлении профиля:", error)
      return { 
        success: false, 
        error: `Не удалось обновить профиль: ${error.message}` 
      }
    }
    
    return { 
      success: true 
    }
  } catch (error) {
    console.error("Непредвиденная ошибка при обновлении профиля:", error)
    return { 
      success: false, 
      error: "Произошла ошибка при обновлении профиля" 
    }
  }
}

export async function getProfile(userId: string) {
  try {
    const supabase = getServerClient()
    
    // Get user profile
    const { data, error } = await supabase
      .from("users")
      .select("name, phone, email, description, avatar_url")
      .eq("id", userId)
      .single()
    
    if (error) {
      console.error("Ошибка при получении профиля:", error)
      return { 
        success: false, 
        error: `Не удалось получить данные профиля: ${error.message}` 
      }
    }
    
    return { 
      success: true,
      profile: {
        name: data.name || "",
        phone: data.phone || "",
        email: data.email,
        description: data.description || "",
        avatar_url: data.avatar_url || null
      }
    }
  } catch (error) {
    console.error("Непредвиденная ошибка при получении профиля:", error)
    return { 
      success: false, 
      error: "Произошла ошибка при получении данных профиля" 
    }
  }
}

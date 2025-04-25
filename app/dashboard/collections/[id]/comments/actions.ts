"use server"

import { requireAuth } from "@/lib/auth"
import { getServerClient } from "@/lib/supabase"

export async function updateCommentStatus(commentId: string, isApproved: boolean) {
  try {
    await requireAuth()
    const supabase = getServerClient()
    
    // Update comment status
    const { error } = await supabase
      .from("property_comments")
      .update({ is_approved: isApproved })
      .eq("id", commentId)
      
    if (error) {
      console.error("Error updating comment status:", error)
      return { success: false, error: "Не удалось обновить статус комментария" }
    }
    
    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating comment status:", error)
    return { success: false, error: "Произошла ошибка" }
  }
}

export async function deleteComment(commentId: string) {
  try {
    await requireAuth()
    const supabase = getServerClient()
    
    // Delete comment
    const { error } = await supabase
      .from("property_comments")
      .delete()
      .eq("id", commentId)
      
    if (error) {
      console.error("Error deleting comment:", error)
      return { success: false, error: "Не удалось удалить комментарий" }
    }
    
    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting comment:", error)
    return { success: false, error: "Произошла ошибка" }
  }
}
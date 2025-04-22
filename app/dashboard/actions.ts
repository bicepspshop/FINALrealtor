"use server"

import { cookies } from "next/headers"
import { getServerClient } from "@/lib/supabase"
import { nanoid } from "nanoid"

export async function logoutUser() {
  cookies().delete("auth-token")
}

export async function createCollection(name: string, userId: string) {
  try {
    const supabase = getServerClient()

    const { data, error } = await supabase
      .from("collections")
      .insert({
        name,
        user_id: userId,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Create collection error:", error)
      return { error: "Failed to create collection" }
    }

    return { success: true, collectionId: data.id }
  } catch (error) {
    console.error("Unexpected error creating collection:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function deleteCollection(collectionId: string, userId: string) {
  try {
    const supabase = getServerClient()

    // Verify ownership
    const { data: collection } = await supabase
      .from("collections")
      .select("id")
      .eq("id", collectionId)
      .eq("user_id", userId)
      .single()

    if (!collection) {
      return { error: "Collection not found or you don't have permission" }
    }

    // Delete collection (cascade will delete properties and images)
    const { error } = await supabase.from("collections").delete().eq("id", collectionId)

    if (error) {
      console.error("Delete collection error:", error)
      return { error: "Failed to delete collection" }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting collection:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function generateShareLink(collectionId: string, userId: string) {
  try {
    const supabase = getServerClient()

    // Verify ownership
    const { data: collection } = await supabase
      .from("collections")
      .select("id, share_id")
      .eq("id", collectionId)
      .eq("user_id", userId)
      .single()

    if (!collection) {
      return { error: "Collection not found or you don't have permission" }
    }

    // Generate share ID if it doesn't exist
    if (!collection.share_id) {
      const shareId = nanoid(10)

      const { error } = await supabase.from("collections").update({ share_id: shareId }).eq("id", collectionId)

      if (error) {
        console.error("Generate share link error:", error)
        return { error: "Failed to generate share link" }
      }

      return { success: true, shareId }
    }

    return { success: true, shareId: collection.share_id }
  } catch (error) {
    console.error("Unexpected error generating share link:", error)
    return { error: "An unexpected error occurred" }
  }
}

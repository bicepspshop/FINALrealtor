"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface Comment {
  id: string
  property_id: string
  collection_id?: string
  author_name: string
  author_email: string
  content: string
  position_x: number
  position_y: number
  created_at: string
}

interface CommentContextType {
  addSimpleComment: (content: string, propertyId: string) => Promise<{ success: boolean, error?: string }>
}

const CommentContext = createContext<CommentContextType | null>(null)

export const useComments = () => {
  const context = useContext(CommentContext)
  if (!context) {
    throw new Error("useComments must be used within a CommentProvider")
  }
  return context
}

interface CommentProviderProps {
  children: ReactNode
  propertyId?: string
  collectionId?: string
}

export function CommentProvider({ children, propertyId, collectionId }: CommentProviderProps) {
  // We don't need to track comments state anymore since we don't display them
  
  const addSimpleComment = async (content: string, specificPropertyId: string) => {
    try {
      // Default values for name and email
      const defaultName = "Клиент"
      const defaultEmail = "client@example.com"
      
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          propertyId: specificPropertyId,
          collectionId: collectionId,
          authorName: defaultName,
          authorEmail: defaultEmail,
          content: content,
          // Use center of viewport as default position since it's not relevant anymore
          positionX: 50,
          positionY: 50,
          honeypot: "" // Include empty honeypot field for bot detection
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        return { success: true }
      }
      
      return { success: false, error: data.error }
    } catch (error) {
      console.error("Error adding comment:", error)
      return { success: false, error: "Не удалось добавить комментарий" }
    }
  }

  return (
    <CommentContext.Provider value={{
      addSimpleComment
    }}>
      {children}
    </CommentContext.Provider>
  )
}
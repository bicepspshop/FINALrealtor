"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Trash2, AlertCircle } from "lucide-react"
import { deleteComment } from "./actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Property {
  id: string
  address: string
  property_type: string
}

interface Comment {
  id: string
  author_name: string
  author_email: string
  content: string
  position_x: number
  position_y: number
  created_at: string
  is_approved: boolean
  property_id: string
  properties: Property
}

interface InlineCommentListProps {
  comments: Comment[]
  collectionId: string
}

export function InlineCommentList({ comments, collectionId }: InlineCommentListProps) {
  const [managedComments, setManagedComments] = useState<Comment[]>(comments)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить.")) {
      return
    }
    
    setIsLoading(prev => ({ ...prev, [commentId]: true }))
    
    try {
      const result = await deleteComment(commentId)
      
      if (result.success) {
        // Remove the comment from state
        setManagedComments(prev => prev.filter(comment => comment.id !== commentId))
        
        // Show success message
        setAlertMessage("Комментарий удален")
        setAlertType("success")
        setShowAlert(true)
      } else {
        // Show error message
        setAlertMessage(result.error || "Не удалось удалить комментарий")
        setAlertType("error")
        setShowAlert(true)
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      setAlertMessage("Произошла ошибка при удалении комментария")
      setAlertType("error")
      setShowAlert(true)
    } finally {
      setIsLoading(prev => ({ ...prev, [commentId]: false }))
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    }
  }
  
  return (
    <div className="relative">
      {/* Alert message */}
      {showAlert && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-sm shadow-elegant dark:shadow-elegant-dark border ${
          alertType === "success" 
            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30 text-green-700 dark:text-green-400" 
            : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30 text-red-700 dark:text-red-400"
        } animate-fade-in-up theme-transition`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{alertMessage}</span>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark border border-gray-100 dark:border-dark-slate p-6 theme-transition">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-serif font-medium mb-2 dark:text-white theme-transition">Комментарии</h2>
            <p className="text-luxury-black/70 dark:text-white/70 theme-transition">
              Последние комментарии посетителей к объектам
            </p>
          </div>
          <Link href={`/dashboard/collections/${collectionId}/comments`}>
            <Button className="bg-luxury-black dark:bg-blue-500 hover:bg-black dark:hover:bg-blue-600 text-white rounded-sm px-4 py-2 shadow-sm hover:shadow-md text-sm theme-transition" animation="scale">
              Все комментарии
            </Button>
          </Link>
        </div>
        
        {managedComments.length === 0 ? (
          <div className="text-center p-8 border border-gray-100 dark:border-dark-slate rounded-sm bg-gray-50 dark:bg-dark-slate/30 theme-transition">
            <p className="text-luxury-black/60 dark:text-white/60 theme-transition">Пока нет комментариев от посетителей.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {managedComments.slice(0, 5).map(comment => (
              <div 
                key={comment.id}
                className="border border-gray-100 dark:border-dark-slate rounded-sm p-4 hover:bg-gray-50 dark:hover:bg-dark-slate/30 transition-colors theme-transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium dark:text-white theme-transition truncate max-w-sm">
                      {comment.properties?.address || "Объект без адреса"}
                    </h3>
                    <p className="text-sm text-luxury-black/60 dark:text-white/60 theme-transition">
                      {formatDistanceToNow(new Date(comment.created_at), { 
                        addSuffix: true,
                        locale: ru
                      })}
                    </p>
                  </div>
                  <button
                    disabled={isLoading[comment.id]}
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1.5 rounded-full text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors theme-transition"
                    title="Удалить комментарий"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="bg-gray-50 dark:bg-dark-slate/40 p-3 rounded-sm border border-gray-100 dark:border-dark-slate theme-transition">
                  <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">{comment.content}</p>
                </div>
              </div>
            ))}
            
            {managedComments.length > 5 && (
              <div className="text-center mt-4">
                <Link href={`/dashboard/collections/${collectionId}/comments`}>
                  <Button variant="outline" className="border-luxury-black/20 dark:border-blue-400/40 hover:bg-luxury-black/5 dark:hover:bg-blue-400/10 hover:border-luxury-black/30 dark:hover:border-blue-400/60 rounded-sm dark:text-white text-sm theme-transition">
                    Просмотреть все комментарии ({managedComments.length})
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Check, X, Trash2, AlertCircle } from "lucide-react"
import { updateCommentStatus, deleteComment } from "./actions"

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

interface CommentManagementProps {
  comments: Comment[]
  collectionId: string
}

export function CommentManagement({ comments, collectionId }: CommentManagementProps) {
  const [managedComments, setManagedComments] = useState<Comment[]>(comments)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")

  const handleUpdateStatus = async (commentId: string, isApproved: boolean) => {
    setIsLoading(prev => ({ ...prev, [commentId]: true }))
    
    try {
      const result = await updateCommentStatus(commentId, isApproved)
      
      if (result.success) {
        // Update the comment in state
        setManagedComments(prev => 
          prev.map(comment => 
            comment.id === commentId ? { ...comment, is_approved: isApproved } : comment
          )
        )
        
        // Show success message
        setAlertMessage(isApproved ? "Комментарий одобрен" : "Комментарий скрыт")
        setAlertType("success")
        setShowAlert(true)
      } else {
        // Show error message
        setAlertMessage(result.error || "Не удалось обновить статус комментария")
        setAlertType("error")
        setShowAlert(true)
      }
    } catch (error) {
      console.error("Error updating comment status:", error)
      setAlertMessage("Произошла ошибка при обновлении статуса комментария")
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
            {alertType === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{alertMessage}</span>
          </div>
        </div>
      )}
      
      {managedComments.length === 0 ? (
        <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-sm border border-gray-100 dark:border-dark-slate p-8 text-center theme-transition">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center mb-4 theme-transition">
            <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500 theme-transition" />
          </div>
          <h2 className="text-xl font-serif font-medium mb-2 dark:text-white theme-transition">Комментариев пока нет</h2>
          <p className="text-gray-600 dark:text-gray-400 theme-transition">
            К этой коллекции еще не добавлено ни одного комментария посетителями.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-graphite rounded-sm overflow-hidden shadow-sm border border-gray-100 dark:border-dark-slate theme-transition">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-slate theme-transition">
                  <th className="text-left p-4 font-medium text-[#2C2C2C] dark:text-white theme-transition">Автор</th>
                  <th className="text-left p-4 font-medium text-[#2C2C2C] dark:text-white theme-transition">Комментарий</th>
                  <th className="text-left p-4 font-medium text-[#2C2C2C] dark:text-white theme-transition">Объект</th>
                  <th className="text-left p-4 font-medium text-[#2C2C2C] dark:text-white theme-transition">Дата</th>
                  <th className="text-left p-4 font-medium text-[#2C2C2C] dark:text-white theme-transition">Статус</th>
                  <th className="text-right p-4 font-medium text-[#2C2C2C] dark:text-white theme-transition">Действия</th>
                </tr>
              </thead>
              <tbody>
                {managedComments.map(comment => (
                  <tr 
                    key={comment.id}
                    className="border-b border-gray-100 dark:border-dark-slate hover:bg-gray-50 dark:hover:bg-dark-slate/50 transition-colors theme-transition"
                  >
                    <td className="p-4">
                      <div className="font-medium text-[#2C2C2C] dark:text-white theme-transition">{comment.author_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 theme-transition">{comment.author_email}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="line-clamp-2 text-[#2C2C2C] dark:text-white theme-transition">{comment.content}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-[#2C2C2C] dark:text-white theme-transition">
                        {comment.properties?.address || "Неизвестный адрес"}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-gray-600 dark:text-gray-400 theme-transition">
                        {formatDistanceToNow(new Date(comment.created_at), { 
                          addSuffix: true,
                          locale: ru
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        comment.is_approved 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400"
                      } theme-transition`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          comment.is_approved
                            ? "bg-green-500 dark:bg-green-400"
                            : "bg-gray-500 dark:bg-gray-400" 
                        } theme-transition`}></span>
                        {comment.is_approved ? "Виден" : "Скрыт"}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={isLoading[comment.id]}
                          onClick={() => handleUpdateStatus(comment.id, !comment.is_approved)}
                          className={`p-2 rounded-full transition-colors theme-transition ${
                            comment.is_approved
                              ? "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-slate"
                              : "text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                          title={comment.is_approved ? "Скрыть комментарий" : "Показать комментарий"}
                        >
                          {comment.is_approved ? (
                            <X className="h-5 w-5" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          disabled={isLoading[comment.id]}
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-2 rounded-full text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors theme-transition"
                          title="Удалить комментарий"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Hidden component
function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}
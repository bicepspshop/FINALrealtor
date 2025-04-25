"use client"

import { useState } from "react"
import { useComments } from "./comment-provider"

interface SimpleCommentFormProps {
  propertyId: string
}

export function SimpleCommentForm({ propertyId }: SimpleCommentFormProps) {
  const { addSimpleComment } = useComments()
  const [content, setContent] = useState("")
  const [website, setWebsite] = useState("") // Honeypot field
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content) {
      setError("Пожалуйста, введите ваш вопрос")
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await addSimpleComment(content, propertyId)
      
      if (!result.success) {
        setError(result.error || "Не удалось отправить комментарий")
      } else {
        setSuccess(true)
        // Reset form after success
        setContent("")
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      }
    } catch (err) {
      setError("Произошла ошибка при отправке комментария")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark border border-gray-100 dark:border-dark-slate p-5 mt-4 theme-transition">
      <div className="mb-4">
        <h4 className="text-lg font-serif font-medium text-[#2C2C2C] dark:text-white mb-2 theme-transition">Оставить комментарий объекту</h4>
        <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-2 theme-transition"></div>
      </div>
      
      {success ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-sm p-4 text-center animate-fade-in-up theme-transition">
          <div className="text-green-600 dark:text-green-400 mb-2 theme-transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h5 className="text-lg font-medium text-green-700 dark:text-green-400 mb-1 theme-transition">Отправлено</h5>
          <p className="text-green-700/80 dark:text-green-400/80 text-sm theme-transition">Риелтор свяжется с вами в ближайшее время</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field - hidden from users but bots will fill it */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            aria-hidden="true"
          />
          
          <div>
            <textarea
              id={`comment-${propertyId}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-sm border border-gray-200 dark:border-dark-slate bg-white dark:bg-dark-slate focus:outline-none focus:ring-1 focus:ring-[#CBA135] dark:focus:ring-luxury-royalBlue text-[#2C2C2C] dark:text-white placeholder-[#2C2C2C]/40 dark:placeholder-white/40 min-h-[80px] resize-y theme-transition"
              placeholder="Ваш комментарий об объекте..."
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-sm p-2 text-red-600 dark:text-red-400 text-sm theme-transition">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#CBA135] dark:bg-luxury-royalBlue hover:bg-[#D4AF37] dark:hover:bg-luxury-royalBlueMuted text-white font-medium py-2 px-4 rounded-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
            >
              {isSubmitting ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
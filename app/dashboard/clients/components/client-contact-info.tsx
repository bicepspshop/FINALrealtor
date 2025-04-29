"use client"

import { Phone, Mail } from "lucide-react"

interface ContactInfoProps {
  phone?: string | null
  email?: string | null
}

export function ClientContactInfo({ phone, email }: ContactInfoProps) {
  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (phone) {
      window.open(`tel:${phone}`, '_blank')
    }
  }

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (email) {
      window.open(`mailto:${email}`, '_blank')
    }
  }

  return (
    <>
      {phone && (
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
          <span 
            onClick={handlePhoneClick}
            className="hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors truncate max-w-[180px] cursor-pointer"
          >
            {phone}
          </span>
        </div>
      )}
      
      {email && (
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
          <span 
            onClick={handleEmailClick}
            className="hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors truncate max-w-[180px] cursor-pointer"
          >
            {email}
          </span>
        </div>
      )}
    </>
  )
} 
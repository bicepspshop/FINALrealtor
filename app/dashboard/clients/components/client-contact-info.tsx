"use client"

import { Phone, Mail } from "lucide-react"

interface ContactInfoProps {
  phone?: string | null
  email?: string | null
}

export function ClientContactInfo({ phone, email }: ContactInfoProps) {
  const handleContactClick = (e: React.MouseEvent, type: 'phone' | 'email', value: string) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`${type === 'phone' ? 'tel:' : 'mailto:'}${value}`, '_blank')
  }

  // No need to render an empty fragment if there are no contact details
  if (!phone && !email) return null;

  return (
    <>
      {phone && (
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
          <span 
            onClick={(e) => handleContactClick(e, 'phone', phone)}
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
            onClick={(e) => handleContactClick(e, 'email', email)}
            className="hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors truncate max-w-[180px] cursor-pointer"
          >
            {email}
          </span>
        </div>
      )}
    </>
  )
} 
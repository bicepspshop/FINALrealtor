"use client"

import { useState } from "react"
import { Mail, Phone, MessageSquare } from "lucide-react"

interface AgentInfoProps {
  name: string
  email?: string
}

export function AgentInfo({ name, email }: AgentInfoProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="bg-white dark:bg-dark-graphite rounded-sm overflow-hidden shadow-sm hover:shadow-elegant dark:shadow-elegant-dark dark:hover:shadow-luxury-dark transition-all duration-500 border border-gray-100 dark:border-dark-slate relative theme-transition">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CBA135]/80 to-[#CBA135]/20 dark:from-luxury-royalBlue/80 dark:to-luxury-royalBlue/20 theme-transition"></div>
      <div className="px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div 
            className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#FAF9F6] to-[#F5EDD7] dark:from-dark-slate dark:to-dark-slate flex items-center justify-center 
              border-4 border-white dark:border-dark-charcoal shadow-sm transition-transform duration-500 transform hover:scale-105 theme-transition"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="text-3xl font-serif text-[#CBA135] dark:text-luxury-royalBlue theme-transition">{name.charAt(0).toUpperCase()}</span>
            {isHovered && (
              <div className="absolute inset-0 bg-[#CBA135]/10 dark:bg-luxury-royalBlue/10 rounded-full animate-pulse theme-transition"></div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm uppercase tracking-wider text-[#CBA135] dark:text-luxury-royalBlue mb-1 font-medium theme-transition">Ваш персональный консультант</p>
            <h2 className="text-2xl font-serif font-medium text-[#2C2C2C] dark:text-white mb-1 theme-transition">{name}</h2>
            <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue my-3 mx-auto md:mx-0 theme-transition"></div>
            {email && <p className="text-[#2C2C2C]/70 dark:text-white/70 mb-3 theme-transition">{email}</p>}
            <p className="text-[#2C2C2C]/80 dark:text-white/80 leading-relaxed max-w-2xl theme-transition">
              Профессиональный эксперт по недвижимости с многолетним опытом работы на рынке премиальной недвижимости. Поможет вам найти идеальное решение, соответствующее вашим требованиям и предпочтениям.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-col md:flex-row items-center gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center border border-[#CBA135] dark:border-luxury-royalBlue bg-white dark:bg-dark-graphite text-[#CBA135] dark:text-luxury-royalBlue hover:bg-[#CBA135] dark:hover:bg-luxury-royalBlue hover:text-white dark:hover:text-white 
                font-medium py-2.5 px-5 rounded-sm transition-all duration-300 shadow-sm dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark group theme-transition"
              >
                <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Написать</span>
              </a>
            )}
            
            <a
              href="tel:+79001234567"
              className="inline-flex items-center border border-[#2C2C2C]/15 dark:border-white/15 bg-white dark:bg-dark-graphite text-[#2C2C2C]/80 dark:text-white/80 hover:bg-[#2C2C2C] dark:hover:bg-white/10 hover:text-white dark:hover:text-white 
                font-medium py-2.5 px-5 rounded-sm transition-all duration-300 shadow-sm dark:shadow-elegant-dark hover:shadow-md dark:hover:shadow-luxury-dark group theme-transition"
            >
              <Phone className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              <span>Позвонить</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

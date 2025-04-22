"use client"

import { useState } from "react"
import { Mail, Phone, MessageSquare, PhoneCall } from "lucide-react"

interface AgentInfoProps {
  name: string
  email?: string
  phone?: string
  description?: string
  avatarUrl?: string
}

export function AgentInfo({ name, email, phone, description, avatarUrl }: AgentInfoProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use the name as provided
  const fullName = name;
  
  // Format the phone number for display
  const displayPhone = phone || "+7 (XXX) XXX-XX-XX";
  
  return (
    <div className="bg-white dark:bg-dark-graphite rounded-sm overflow-hidden shadow-sm hover:shadow-elegant dark:shadow-elegant-dark dark:hover:shadow-luxury-dark transition-all duration-500 border border-gray-100 dark:border-dark-slate relative theme-transition">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CBA135]/80 to-[#CBA135]/20 dark:from-luxury-royalBlue/80 dark:to-luxury-royalBlue/20 theme-transition"></div>
      <div className="px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div 
            className="relative w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#F5EDD7] dark:from-dark-slate dark:to-dark-slate flex items-center justify-center 
              border-4 border-white dark:border-dark-charcoal shadow-sm transition-transform duration-500 transform hover:scale-105 theme-transition"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-serif text-[#CBA135] dark:text-luxury-royalBlue theme-transition">{name.charAt(0).toUpperCase()}</span>
            )}
            {isHovered && (
              <div className="absolute inset-0 bg-[#CBA135]/10 dark:bg-luxury-royalBlue/10 rounded-full animate-pulse theme-transition"></div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm uppercase tracking-wider text-[#CBA135] dark:text-luxury-royalBlue mb-1 font-medium theme-transition">Ваш персональный консультант</p>
            <h2 className="text-2xl font-serif font-medium text-[#2C2C2C] dark:text-white mb-1 theme-transition">{fullName}</h2>
            <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue my-3 mx-auto md:mx-0 theme-transition"></div>
            {email && <p className="text-[#2C2C2C]/70 dark:text-white/70 mb-3 theme-transition">{email}</p>}
            
            {/* Description with stars */}
            <div className="border-t border-b border-gray-100 dark:border-dark-slate py-4 mb-4 space-y-2 theme-transition">
              {description ? (
                <p className="text-[#2C2C2C]/80 dark:text-white/80 leading-relaxed max-w-2xl theme-transition">
                  {description}
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-[#2C2C2C]/80 dark:text-white/80 theme-transition">
                    <span className="text-[#CBA135] dark:text-luxury-royalBlue theme-transition">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.25495L8.90702 8.25495L11.993 2.00195L15.079 8.25495L21.979 9.25495L16.979 14.122L18.158 20.995L12 17.75Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>Специализация: элитная недвижимость</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2C2C2C]/80 dark:text-white/80 theme-transition">
                    <span className="text-[#CBA135] dark:text-luxury-royalBlue theme-transition">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.25495L8.90702 8.25495L11.993 2.00195L15.079 8.25495L21.979 9.25495L16.979 14.122L18.158 20.995L12 17.75Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>Опыт работы: более 5 лет</span>
                  </div>
                </>
              )}
            </div>
            
            <p className="text-[#2C2C2C]/80 dark:text-white/80 leading-relaxed max-w-2xl theme-transition">
              Профессиональный эксперт по недвижимости. Поможет вам найти идеальное решение, соответствующее вашим требованиям и предпочтениям.
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
              href={`tel:${phone || '+79001234567'}`}
              className="inline-flex items-center border border-[#2C2C2C]/15 dark:border-white/15 bg-white dark:bg-dark-graphite text-[#2C2C2C]/80 dark:text-white/80 hover:bg-[#2C2C2C] dark:hover:bg-white/10 hover:text-white dark:hover:text-white 
                font-medium py-2.5 px-5 rounded-sm transition-all duration-300 shadow-sm dark:shadow-elegant-dark hover:shadow-md dark:hover:shadow-luxury-dark group theme-transition"
            >
              <Phone className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              <span>Позвонить</span>
            </a>

            {phone && (
              <a
                href={`https://wa.me/${phone?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-green-500 bg-white dark:bg-dark-graphite text-green-500 hover:bg-green-500 hover:text-white
                  font-medium py-2.5 px-5 rounded-sm transition-all duration-300 shadow-sm dark:shadow-elegant-dark hover:shadow-md dark:hover:shadow-luxury-dark group theme-transition"
              >
                <svg className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M20.4736 3.6062C18.2235 1.3443 15.2502 0.0842 12.0992 0.0801C5.6406 0.0801 0.3836 5.3359 0.3777 11.7965C0.3761 13.8188 0.9303 15.7922 1.9765 17.5284L0.291 23.7521L6.6555 22.1021C8.3225 23.0469 10.1949 23.5516 12.0934 23.5521H12.0998C18.5584 23.5521 23.8166 18.2951 23.8213 11.8345C23.8254 8.6917 22.7236 5.7197 20.4736 3.6062ZM12.0992 21.5759H12.0939C10.4049 21.5754 8.753 21.0889 7.3231 20.1778L6.9539 19.9578L3.1949 20.9379L4.1949 17.2722L3.9516 16.8851C2.9473 15.4015 2.3953 13.6233 2.3969 11.797C2.4016 6.4269 6.731 2.0559 12.1045 2.0559C14.7225 2.0594 17.1871 3.1051 19.0202 4.9565C20.8533 6.808 21.8909 9.2871 21.8874 11.8334C21.8828 17.2046 17.5539 21.5759 12.0992 21.5759ZM17.6773 14.2687C17.375 14.1204 15.9018 13.3964 15.6237 13.2966C15.3456 13.1969 15.1402 13.1469 14.936 13.4504C14.7318 13.7539 14.1617 14.4278 13.9817 14.6321C13.8017 14.8364 13.6228 14.8616 13.3206 14.7133C11.8252 14.0201 10.8648 13.4822 9.8982 11.7941C9.6628 11.3711 10.3123 11.4066 10.9131 10.2049C11.0128 10.0006 10.9629 9.8261 10.8882 9.6777C10.8135 9.5294 10.1867 8.0559 9.9322 7.4495C9.6845 6.8599 9.4333 6.9335 9.2449 6.9231C9.065 6.9134 8.8608 6.9119 8.6565 6.9119C8.4523 6.9119 8.12401 6.9866 7.84581 7.2902C7.56763 7.5937 6.79355 8.3177 6.79355 9.7912C6.79355 11.2647 7.87083 12.6885 8.02063 12.8929C8.17043 13.0973 10.1755 16.1576 13.2173 17.4605C15.1456 18.2973 15.9017 18.3611 16.864 18.1854C17.4513 18.0775 18.6301 17.4428 18.8845 16.7366C19.139 16.0305 19.139 15.4242 19.0643 15.2997C18.9896 15.1752 18.7842 15.0996 18.4819 14.9513C18.1796 14.803 17.6773 14.2687 17.6773 14.2687Z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ExpiredSharePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-dark-charcoal text-[#2C2C2C] dark:text-white font-sans theme-transition flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white/70 dark:bg-dark-graphite/70 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-dark-slate shadow-sm dark:shadow-elegant-dark animate-fade-in-up p-8 md:p-12 text-center theme-transition">
        <div className="w-[120px] h-[120px] mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#FAF9F6] dark:border-dark-charcoal theme-transition">
          <img
            src="/images/house3.png"
            alt="Expired share"
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-3xl font-serif font-medium text-[#2C2C2C] dark:text-white mb-4 theme-transition">
          Доступ приостановлен
        </h1>
        
        <div className="w-16 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mx-auto mb-6 theme-transition"></div>
        
        <p className="text-[#2C2C2C]/80 dark:text-white/80 mb-8 theme-transition">
          Эта коллекция недвижимости временно недоступна, так как пробный период владельца истек. 
          Пожалуйста, свяжитесь с вашим агентом для получения дополнительной информации.
        </p>
        
        <Link href="/">
          <Button 
            className="bg-[#CBA135] hover:bg-[#CBA135]/90 dark:bg-luxury-royalBlue dark:hover:bg-luxury-royalBlue/90 text-white py-5 px-8 rounded-sm theme-transition"
            animation="scale"
          >
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  )
} 
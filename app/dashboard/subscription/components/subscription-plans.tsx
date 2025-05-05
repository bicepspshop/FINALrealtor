'use client'

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SubscriptionPlans() {
  // Function to handle plan selection
  const handleSelectPlan = (planType: 'monthly' | 'yearly') => {
    document.dispatchEvent(new CustomEvent('select-plan', { detail: planType }));
  };
  
  return (
    <Card className="mb-8 rounded-sm border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark theme-transition">
      <CardHeader>
        <CardTitle className="text-2xl font-medium text-luxury-black dark:text-white theme-transition">Тарифы</CardTitle>
        <CardDescription className="text-luxury-black/70 dark:text-white/70 theme-transition">
          Информация о доступных планах подписки
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Standard Plan - Enhanced */}
          <div className="rounded-sm overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-all duration-300 group theme-transition transform hover:-translate-y-1 relative">
            {/* Background Image and Overlay */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/65 dark:from-dark-graphite/70 dark:to-dark-graphite/65 backdrop-blur-sm z-10 theme-transition"></div>
              <div className="absolute inset-0 bg-[url('/images/stdhouse.png')] dark:bg-[url('/images/stdhouse.png')] bg-cover bg-center opacity-80 z-0 theme-transition"></div>
              {/* Subtle texture overlay */}
              <div className="absolute inset-0 opacity-25 bg-repeat pointer-events-none z-0 theme-transition" 
                   style={{backgroundImage: "url('/images/pattern.png')", backgroundSize: "100px"}}></div>
              {/* Subtle bottom vignette */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/40 dark:from-dark-graphite/40 to-transparent z-5 theme-transition"></div>
            </div>
            
            {/* Card Content */}
            <div className="relative z-10 p-7 border border-gray-200 dark:border-dark-slate h-full flex flex-col">
              {/* Left accent border */}
              <div className="absolute left-0 top-0 w-1 h-full bg-gray-200 dark:bg-dark-slate theme-transition group-hover:bg-luxury-gold dark:group-hover:bg-luxury-royalBlue transition-colors duration-500"></div>
              
              <div className="mb-6">
                <h3 className="text-xl font-serif font-medium text-luxury-black dark:text-white mb-2 theme-transition group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue transition-colors duration-300">Стандартный</h3>
                <div className="relative h-[2px] mb-4 theme-transition overflow-hidden">
                  <div className="absolute left-0 w-16 h-full bg-luxury-gold/50 dark:bg-luxury-royalBlue/50 theme-transition"></div>
                  <div className="absolute left-0 w-0 h-full bg-luxury-gold dark:bg-luxury-royalBlue group-hover:w-24 transition-all duration-700 ease-in-out theme-transition"></div>
                </div>
                <p className="text-3xl font-bold text-luxury-black dark:text-white mb-1 theme-transition font-serif">
                  2 000 ₽<span className="text-sm font-normal text-luxury-black/60 dark:text-white/60">/месяц</span>
                </p>
                <p className="text-sm text-luxury-black/60 dark:text-white/60 theme-transition">
                  Ежемесячная оплата
                </p>
              </div>
              
              <div className="flex-1">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300">
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Без ограничений на количество подборок</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: "50ms"}}>
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Неограниченное количество объектов</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: "100ms"}}>
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Премиум техническая поддержка</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: "150ms"}}>
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Доступ к будущим премиум-функциям</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: "200ms"}}>
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Приоритетная разработка запрашиваемых функций</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-2 border-luxury-black/20 dark:border-luxury-royalBlue/30 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 rounded-sm py-6 text-luxury-black dark:text-white theme-transition group-hover:border-luxury-gold dark:group-hover:border-luxury-royalBlue transition-colors duration-300"
                onClick={() => handleSelectPlan('monthly')}
              >
                Выбрать
              </Button>
            </div>
          </div>
          
          {/* Professional Plan - Enhanced */}
          <div className="rounded-sm overflow-hidden flex flex-col h-full shadow-xl hover:shadow-2xl transition-all duration-300 group theme-transition transform hover:-translate-y-1 relative">
            {/* Highlight ribbon */}
            <div className="absolute -right-12 top-7 bg-luxury-gold dark:bg-luxury-royalBlue text-white py-1 px-14 transform rotate-45 text-xs font-medium z-20 shadow-md theme-transition">
              Рекомендуем
            </div>
            
            {/* Background Image and Overlay */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/65 dark:from-dark-graphite/70 dark:to-dark-graphite/65 backdrop-blur-sm z-10 theme-transition"></div>
              <div className="absolute inset-0 bg-[url('/images/prohouse.png')] dark:bg-[url('/images/prohouse.png')] bg-cover bg-center opacity-80 z-0 theme-transition"></div>
              {/* Subtle texture overlay */}
              <div className="absolute inset-0 opacity-25 bg-repeat pointer-events-none z-0 theme-transition" 
                   style={{backgroundImage: "url('/images/luxury-pattern.png')", backgroundSize: "200px"}}></div>
              {/* Light effects */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-luxury-gold/15 to-transparent dark:from-luxury-royalBlue/15 dark:to-transparent opacity-70 z-5 theme-transition"></div>
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/40 dark:from-dark-graphite/40 to-transparent z-5 theme-transition"></div>
            </div>
            
            {/* Card Content */}
            <div className="relative z-10 p-7 border-2 border-luxury-gold dark:border-luxury-royalBlue h-full flex flex-col theme-transition">
              <div className="mb-6">
                <h3 className="text-xl font-serif font-medium text-luxury-black dark:text-white mb-2 theme-transition group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue transition-colors duration-300">Профессиональный</h3>
                <div className="relative h-[2px] mb-4 theme-transition overflow-hidden">
                  <div className="absolute left-0 w-16 h-full bg-luxury-gold/50 dark:bg-luxury-royalBlue/50 theme-transition"></div>
                  <div className="absolute left-0 w-0 h-full bg-luxury-gold dark:bg-luxury-royalBlue group-hover:w-24 transition-all duration-700 ease-in-out theme-transition"></div>
                </div>
                <p className="text-3xl font-bold text-luxury-black dark:text-white mb-1 theme-transition font-serif">
                  16 800 ₽<span className="text-sm font-normal text-luxury-black/60 dark:text-white/60">/год</span>
                </p>
                <p className="text-sm text-luxury-black/60 dark:text-white/60 theme-transition">
                  Ежегодная оплата <span className="text-green-600 dark:text-green-500 font-medium">Экономия 30%</span>
                </p>
              </div>
              
              <div className="flex-1">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300">
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Без ограничений на количество подборок</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: "50ms"}}>
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Неограниченное количество объектов</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: "100ms"}}>
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Премиум техническая поддержка</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: "150ms"}}>
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Доступ к будущим премиум-функциям</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-luxury-black/90 dark:text-white/90 theme-transition group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: "200ms"}}>
                    <CheckCircle className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue mt-0.5 flex-shrink-0 theme-transition" />
                    <span>Приоритетная разработка запрашиваемых функций</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-2 border-luxury-black/20 dark:border-luxury-royalBlue/30 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 rounded-sm py-6 text-luxury-black dark:text-white theme-transition group-hover:border-luxury-gold dark:group-hover:border-luxury-royalBlue transition-colors duration-300"
                onClick={() => handleSelectPlan('yearly')}
              >
                Выбрать
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/auth"
import { getServerClient, executeWithRetry } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, WifiOff, UserPlus, User, Calendar, Phone, Mail, Clock, Home } from "lucide-react"
import { SubscriptionBanner } from "@/components/subscription-banner"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { ClientContactInfo } from "./components/client-contact-info"

export default async function ClientsPage() {
  // Получаем сессию
  const session = await getSession()

  // Если нет сессии, отображаем сообщение об ошибке вместо перенаправления
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-luxury p-4 py-16 theme-transition dashboard">
        <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-12 max-w-lg w-full animate-fade-in-up theme-transition">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-white mb-2 theme-transition">
              РиелторПро
            </h1>
            <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mb-6 theme-transition"></div>
            <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black dark:text-white theme-transition">Требуется авторизация</h2>
            <p className="text-luxury-black/70 dark:text-white/70 mb-8 theme-transition">Для доступа к этой странице необходимо войти в систему.</p>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/login">
              <Button className="w-full bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-6 theme-transition" animation="scale">
                Войти в систему
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full border-luxury-black/20 dark:border-luxury-royalBlue/30 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 dark:text-white rounded-sm py-6 theme-transition" animation="scale">
                Зарегистрироваться
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Теперь мы знаем, что у нас есть сессия, можем безопасно использовать её
  const user = session

  // Проверяем, является ли сессия временной (офлайн режим)
  const isOfflineMode = "isOfflineMode" in user && user.isOfflineMode === true

  try {
    // Получаем клиентов пользователя
    const supabase = getServerClient()

    let clients = []
    let fetchError = null

    try {
      // Проверяем, находимся ли мы в офлайн-режиме
      if (isOfflineMode) {
        clients = [] // В офлайн-режиме возвращаем пустой массив
      } else {
        // Используем функцию с повторными попытками и таймаутом
        const result = await executeWithRetry(
          () =>
            supabase
              .from("clients")
              .select("id, full_name, phone, email, last_contact_date, lead_source")
              .eq("agent_id", user.id)
              .order("created_at", { ascending: false }),
          3, // Максимальное количество попыток
          2000, // Увеличенный таймаут между попытками
        )
        
        const { data, error } = result as { data: any[], error: any }

        if (error) {
          console.error("Ошибка при получении клиентов:", error)
          fetchError = error
        } else {
          clients = data || []
        }
      }
    } catch (error) {
      console.error("Ошибка при получении клиентов:", error)
      fetchError = error
    }

    // Функция для форматирования даты
    const formatDate = (dateString: string | null | undefined) => {
      if (!dateString) return "Н/Д"
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate relative theme-transition dashboard">
        
        <NavBar userName={user.name} isOfflineMode={isOfflineMode} />

        <main className="flex-1 container-wide py-8 relative z-10">
          {/* Subscription Banner */}
          {user.trialInfo && !isOfflineMode && user.trialInfo.isActive && (
            <SubscriptionBanner trialInfo={user.trialInfo} />
          )}
          
          {isOfflineMode && (
            <Alert variant="warning" className="mb-8 rounded-sm border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30 theme-transition ml-[-20px]">
              <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-500 theme-transition" />
              <AlertTitle className="font-medium text-amber-700 dark:text-amber-500 theme-transition">Режим офлайн</AlertTitle>
              <AlertDescription className="text-amber-700/80 dark:text-amber-500/90 theme-transition">
                Обнаружены проблемы с подключением к базе данных. Вы находитесь в режиме офлайн с ограниченной
                функциональностью. Попробуйте обновить страницу позже, когда соединение будет восстановлено.
              </AlertDescription>
            </Alert>
          )}

          {fetchError && !isOfflineMode && (
            <Alert variant="destructive" className="mb-8 rounded-sm border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 theme-transition ml-[-20px]">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 theme-transition" />
              <AlertTitle className="font-medium text-red-700 dark:text-red-500 theme-transition">Ошибка загрузки данных</AlertTitle>
              <AlertDescription className="text-red-700/80 dark:text-red-500/90 theme-transition">
                Не удалось загрузить ваших клиентов. Пожалуйста, попробуйте обновить страницу.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center mb-10 px-4">
            <div className="max-w-3xl">
              <DashboardTabs activeTab="clients" />
              <p className="text-luxury-black/60 dark:text-white/60 theme-transition mt-2 ml-[-22px]">Управляйте клиентами и их запросами на недвижимость</p>
            </div>
            {!isOfflineMode && !fetchError && user.trialInfo?.isActive && (
              <Link href="/dashboard/clients/new" className="ml-12">
                <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-white py-5 px-6 rounded-sm flex items-center gap-2">
                  <UserPlus size={18} />
                  Добавить клиента
                </Button>
              </Link>
            )}
            {!isOfflineMode && !fetchError && user.trialInfo && !user.trialInfo.isActive && (
              <Link href="/dashboard/subscription">
                <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-white py-5 px-5 rounded-sm">
                  Оформить подписку
                </Button>
              </Link>
            )}
          </div>

          {!isOfflineMode && !fetchError && user.trialInfo && !user.trialInfo.isActive && (
            <Alert className="mb-8 rounded-sm border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30 theme-transition ml-[-20px]">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 theme-transition" />
              <AlertTitle className="font-medium text-amber-700 dark:text-amber-500 theme-transition">Пробный период истек</AlertTitle>
              <AlertDescription className="text-amber-700/80 dark:text-amber-500/90 theme-transition">
                Ваш пробный период истек. Для продолжения использования системы необходимо оформить подписку. 
                <Link href="/dashboard/subscription" className="text-amber-800 dark:text-amber-400 ml-1 underline underline-offset-2">
                  Оформить подписку
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {(!fetchError || isOfflineMode) && clients.length === 0 ? (
            <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-16 text-center max-w-xl mx-auto mt-12 animate-fade-in-up theme-transition">
              <div className="mb-8">
                <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center theme-transition">
                  <User className="h-20 w-20 text-luxury-gold dark:text-luxury-royalBlue/80 theme-transition" />
                </div>
                <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mt-4 theme-transition"></div>
              </div>
              
              <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black dark:text-white theme-transition">
                {isOfflineMode ? "Клиенты недоступны в режиме офлайн" : "Пока нет клиентов"}
              </h2>
              <p className="text-luxury-black/70 dark:text-white/70 mb-8 max-w-lg mx-auto leading-relaxed theme-transition">
                {isOfflineMode
                  ? "Для доступа к клиентам необходимо подключение к интернету. Попробуйте обновить страницу позже."
                  : "Добавьте своего первого клиента, чтобы начать работать с клиентскими карточками и запросами на недвижимость."}
              </p>
              {!isOfflineMode && user.trialInfo?.isActive && (
                <Link href="/dashboard/clients/new">
                  <Button className="bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-5 px-5 rounded-sm flex items-center gap-2">
                    <UserPlus size={18} />
                    Добавить первого клиента
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 ml-[-20px]">
              {clients.map((client: any, index: number) => (
                <Link href={user.trialInfo?.isActive ? `/dashboard/clients/${client.id}` : "/dashboard/subscription"} key={client.id}>
                  <Card 
                    className="overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark transition-all duration-500 animate-fade-in-up hover:-translate-y-1 property-card theme-transition bg-transparent relative h-full p-6"
                    style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 theme-transition">
                        <User className="h-7 w-7 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-luxury-black dark:text-white truncate max-w-[200px] theme-transition">
                          {client.full_name}
                        </h3>
                        {client.lead_source && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 theme-transition flex items-center gap-1.5 mt-1">
                            <Home size={14} className="text-luxury-gold dark:text-luxury-royalBlue/80 theme-transition" />
                            {client.lead_source}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 theme-transition">
                      <ClientContactInfo phone={client.phone} email={client.email} />
                      
                      {client.last_contact_date && (
                        <div className="flex items-center gap-2 pt-1">
                          <Clock size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                          <span className="text-xs">Последний контакт: {formatDate(client.last_contact_date)}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    )
  } catch (error) {
    console.error("Непредвиденная ошибка:", error)
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate relative theme-transition dashboard">
        <NavBar userName={session?.name || "Пользователь"} isOfflineMode={true} />
        
        <main className="flex-1 container-luxury py-8 relative z-10">
          <Alert variant="destructive" className="mb-8 rounded-sm border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 theme-transition">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 theme-transition" />
            <AlertTitle className="font-medium text-red-700 dark:text-red-500 theme-transition">Ошибка системы</AlertTitle>
            <AlertDescription className="text-red-700/80 dark:text-red-500/90 theme-transition">
              Произошла непредвиденная ошибка при загрузке данных. Пожалуйста, попробуйте обновить страницу.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }
} 
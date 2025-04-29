"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, WifiOff, UserPlus, User, Clock, Home, Trash2 } from "lucide-react"
import { SubscriptionBanner } from "@/components/subscription-banner"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { ClientContactInfo } from "./components/client-contact-info"
import { ClientAvatar } from "./components/client-avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Define types for ClientCard props
interface ClientCardProps {
  client: {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
    last_contact_date?: string;
    lead_source?: string;
  };
  formatDate: (dateString: string | null | undefined) => string;
  isTrialActive?: boolean;
}

// Client component for interactivity
function ClientCard({ client, formatDate, isTrialActive }: ClientCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteClient = async () => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error("Ошибка при удалении клиента")
      }
      
      toast({
        title: "Клиент удален",
        description: "Клиент успешно удален из системы",
      })
      
      // Refresh the page to update the client list
      router.refresh()
    } catch (error) {
      console.error("Error deleting client:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить клиента. Пожалуйста, попробуйте снова.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }
  
  return (
    <>
      <Link href={isTrialActive ? `/dashboard/clients/${client.id}` : "/dashboard/subscription"}>
        <Card 
          className="overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark transition-all duration-500 animate-fade-in-up hover:-translate-y-1 property-card theme-transition bg-transparent relative h-full p-6"
          style={{ animationDelay: `${Math.min(0, 500)}ms` }}
        >
          <button 
            onClick={handleDeleteClick}
            className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all theme-transition z-10"
            aria-label="Удалить клиента"
          >
            <Trash2 size={16} />
          </button>
          
          <div className="flex items-center gap-4">
            <ClientAvatar 
              clientId={client.id}
              clientName={client.full_name}
              size="sm"
            />
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
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-dark-graphite theme-transition">
          <DialogHeader>
            <DialogTitle className="text-luxury-black dark:text-white theme-transition">Удаление клиента</DialogTitle>
            <DialogDescription className="text-luxury-black/70 dark:text-white/70 theme-transition">
              Вы действительно хотите удалить клиента <span className="font-medium text-luxury-black dark:text-white theme-transition">{client.full_name}</span>? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              className="border-gray-200 dark:border-dark-slate hover:bg-gray-100 dark:hover:bg-dark-slate/60 text-luxury-black dark:text-white theme-transition"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
              onClick={handleDeleteClient}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function ClientsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [clients, setClients] = useState<any[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard/clients')
        
        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized - redirect to login
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch data')
        }
        
        const data = await response.json()
        
        if (data.error) {
          setFetchError(data.error)
        } else {
          setClients(data.clients || [])
          setUserData(data.user || null)
        }
      } catch (error) {
        console.error('Error fetching client data:', error)
        setFetchError('Не удалось загрузить данные клиентов')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [router])

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate relative theme-transition dashboard">
        <NavBar userName="Загрузка..." />
        <main className="flex-1 container-wide py-8 relative z-10">
          <div className="flex justify-center items-center h-full">
            <p className="text-luxury-black/60 dark:text-white/60 theme-transition">
              Загрузка данных...
            </p>
          </div>
        </main>
      </div>
    )
  }

  // Show login message if no user data
  if (!userData) {
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

  const isOfflineMode = userData.isOfflineMode || false
  const trialInfo = userData.trialInfo || null
  const isTrialActive = trialInfo?.isActive || false

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate relative theme-transition dashboard">
      
      <NavBar userName={userData.name} isOfflineMode={isOfflineMode} />

      <main className="flex-1 container-wide py-8 relative z-10">
        {/* Subscription Banner */}
        {trialInfo && !isOfflineMode && trialInfo.isActive && (
          <SubscriptionBanner trialInfo={trialInfo} />
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
          {!isOfflineMode && !fetchError && isTrialActive && (
            <Link href="/dashboard/clients/new" className="ml-12">
              <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-white py-5 px-6 rounded-sm flex items-center gap-2">
                <UserPlus size={18} />
                Добавить клиента
              </Button>
            </Link>
          )}
          {!isOfflineMode && !fetchError && trialInfo && !trialInfo.isActive && (
            <Link href="/dashboard/subscription">
              <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-white py-5 px-5 rounded-sm">
                Оформить подписку
              </Button>
            </Link>
          )}
        </div>

        {!isOfflineMode && !fetchError && trialInfo && !trialInfo.isActive && (
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
            <div className="mb-8 flex flex-col items-center">
              <div className="mx-auto mb-6 flex justify-center">
                <ClientAvatar 
                  clientId="00000000-0000-0000-0000-000000000000"
                  size="lg"
                />
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
            {!isOfflineMode && isTrialActive && (
              <div className="flex justify-center">
                <Link href="/dashboard/clients/new">
                  <Button className="bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-5 px-5 rounded-sm flex items-center gap-2">
                    <UserPlus size={18} />
                    Добавить первого клиента
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 ml-[-20px]">
            {clients.map((client: any) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                formatDate={formatDate} 
                isTrialActive={isTrialActive}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 
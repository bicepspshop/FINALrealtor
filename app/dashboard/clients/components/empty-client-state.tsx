import Link from "next/link"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClientAvatar } from "./client-avatar"

interface EmptyClientStateProps {
  isOfflineMode: boolean;
  isTrialActive: boolean;
}

export default function EmptyClientState({ isOfflineMode, isTrialActive }: EmptyClientStateProps) {
  // Content text based on mode
  const title = isOfflineMode ? "Клиенты недоступны в режиме офлайн" : "Пока нет клиентов";
  const description = isOfflineMode
    ? "Для доступа к клиентам необходимо подключение к интернету. Попробуйте обновить страницу позже."
    : "Добавьте своего первого клиента, чтобы начать работать с клиентскими карточками и запросами на недвижимость.";
  
  // Only show add button if online and trial is active
  const showAddButton = !isOfflineMode && isTrialActive;

  return (
    <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-16 text-center max-w-xl mx-auto mt-12 animate-fade-in-up theme-transition">
      <div className="flex flex-col items-center mb-8">
        <ClientAvatar 
          clientId="00000000-0000-0000-0000-000000000000"
          size="lg"
        />
        <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mt-6 theme-transition"></div>
      </div>
      
      <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black dark:text-white theme-transition">
        {title}
      </h2>
      
      <p className="text-luxury-black/70 dark:text-white/70 mb-8 max-w-lg mx-auto leading-relaxed theme-transition">
        {description}
      </p>
      
      {showAddButton && (
        <Link href="/dashboard/clients/new">
          <Button className="mt-[12px] sm:mt-0 bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-5 px-5 rounded-sm flex items-center gap-2">
            <UserPlus size={18} />
            Добавить первого клиента
          </Button>
        </Link>
      )}
    </div>
  )
} 
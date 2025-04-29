import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { NavBar } from "@/components/nav-bar"
import { ArrowLeft } from "lucide-react"
import { NewClientForm } from "./new-client-form"

export default async function NewClientPage() {
  const session = await getSession()
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-luxury p-4 py-16 theme-transition">
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate relative theme-transition">
      <NavBar userName={session.name} />
      <main className="flex-1 container-luxury py-8 relative z-10">
        <div className="mb-6">
          <Link href="/dashboard/clients" className="inline-flex items-center text-luxury-black/70 dark:text-white/70 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors theme-transition mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Назад к списку клиентов
          </Link>
          
          <div>
            <h1 className="text-3xl font-serif font-medium text-luxury-black dark:text-white theme-transition">
              Добавление нового клиента
            </h1>
            <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mt-2 mb-3 theme-transition"></div>
            <p className="text-luxury-black/60 dark:text-white/60 theme-transition">
              Заполните информацию о новом клиенте
            </p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <NewClientForm userId={session.id} />
        </div>
      </main>
    </div>
  )
} 
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Image as ImageIcon, HelpCircle, Settings, Users } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white dark:bg-dark-graphite border-b border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark py-3 sticky top-0 z-50 theme-transition">
        <div className="container-luxury flex justify-between items-center">
          <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-white dark:gold-accent theme-transition">
            РиелторПро <span className="text-primary text-lg">Администратор</span>
          </h1>
          <div>
            <Link 
              href="/" 
              className="text-luxury-black/80 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors"
            >
              Вернуться на сайт
            </Link>
          </div>
        </div>
      </header>

      <main className="container-luxury py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2">Панель управления</h2>
          <p className="text-muted-foreground">
            Добро пожаловать в административную панель РиелторПро.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Help Images Management */}
          <Link href="/admin/help-images">
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>FAQ и Справка</CardTitle>
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>
                  Управление изображениями для страницы справки
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-sm">
                  <p>Добавление и управление изображениями, которые отображаются в разделах справки и FAQ.</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          {/* Users Management Placeholder */}
          <Card className="h-full opacity-70">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Пользователи</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                Управление пользователями системы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                <p>Просмотр и редактирование пользователей, управление ролями и правами доступа.</p>
                <div className="mt-2 text-xs text-muted-foreground italic">Скоро будет доступно</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Settings Placeholder */}
          <Card className="h-full opacity-70">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Настройки</CardTitle>
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                Системные настройки платформы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                <p>Настройка параметров системы, интеграций и общих опций платформы.</p>
                <div className="mt-2 text-xs text-muted-foreground italic">Скоро будет доступно</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 
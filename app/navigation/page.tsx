import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, MessageSquare, Home, UserCircle, Settings, HelpCircle, Info } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ThemeToggle } from "@/components/ui/theme/theme-toggle"
import { GuideUserNavButton } from "../guide/guide-user-nav-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = 'force-dynamic'

export default function NavigationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-white dark:from-dark-charcoal dark:to-dark-slate transition-colors duration-300 relative">
      {/* Background with overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-white dark:from-luxury-black/60 dark:to-luxury-black/80 z-10"></div>
      </div>
      
      {/* Header with transparent background */}
      <header className="absolute top-0 left-0 right-0 z-20 py-6">
        <div className="container-luxury flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-white text-shadow-md theme-transition">
              РиелторПро
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Suspense fallback={null}>
              <GuideUserNavButton />
            </Suspense>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container-luxury py-8 pt-24 relative z-10">
        {/* Кнопка назад */}
        <Link href="/">
          <Button 
            variant="outline" 
            className="mb-6 gap-2 border border-luxury-black/20 text-luxury-black dark:border-white/40 dark:text-white hover:bg-luxury-black/5 dark:hover:bg-white/10 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>

        {/* Заголовок страницы */}
        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-luxury-black dark:text-white mb-3 transition-colors duration-300">
            Навигация по платформе «РиелторПро»
          </h1>
          <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mb-4"></div>
          <p className="text-luxury-black/80 dark:text-white/80 max-w-2xl mx-auto">
            Добро пожаловать! Здесь вы найдете все необходимые руководства и информацию для эффективной работы с платформой «РиелторПро».
          </p>
        </div>

        {/* Навигационные категории */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="guides" className="data-[state=active]:bg-luxury-gold/10 data-[state=active]:text-luxury-gold dark:data-[state=active]:bg-luxury-royalBlue/10 dark:data-[state=active]:text-luxury-royalBlue">
                Руководства
              </TabsTrigger>
              <TabsTrigger value="quick-start" className="data-[state=active]:bg-luxury-gold/10 data-[state=active]:text-luxury-gold dark:data-[state=active]:bg-luxury-royalBlue/10 dark:data-[state=active]:text-luxury-royalBlue">
                Быстрый старт
              </TabsTrigger>
              <TabsTrigger value="tools" className="data-[state=active]:bg-luxury-gold/10 data-[state=active]:text-luxury-gold dark:data-[state=active]:bg-luxury-royalBlue/10 dark:data-[state=active]:text-luxury-royalBlue">
                Инструменты
              </TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-luxury-gold/10 data-[state=active]:text-luxury-gold dark:data-[state=active]:bg-luxury-royalBlue/10 dark:data-[state=active]:text-luxury-royalBlue">
                FAQ
              </TabsTrigger>
              <TabsTrigger value="support" className="data-[state=active]:bg-luxury-gold/10 data-[state=active]:text-luxury-gold dark:data-[state=active]:bg-luxury-royalBlue/10 dark:data-[state=active]:text-luxury-royalBlue">
                Поддержка
              </TabsTrigger>
            </TabsList>

            {/* Руководства */}
            <TabsContent value="guides" className="space-y-6">
              <NavigationCard
                title="Подробное руководство пользователя"
                description="Детальная инструкция по всем функциям платформы. Это полное руководство с пошаговыми инструкциями."
                icon={<BookOpen className="h-5 w-5" />}
                link="/guide"
                linkText="Перейти к детальному руководству"
              />
              <NavigationCard
                title="Работа с объектами недвижимости"
                description="Как добавлять, редактировать и оформлять объекты недвижимости на платформе"
                icon={<Home className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Управление профилем"
                description="Настройка профиля агента, персональные данные и фотографии"
                icon={<UserCircle className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Продвинутые возможности"
                description="Расширенные функции для опытных пользователей, интеграции и аналитика"
                icon={<Settings className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
            </TabsContent>

            {/* Быстрый старт */}
            <TabsContent value="quick-start" className="space-y-6">
              <NavigationCard
                title="Первые шаги на платформе"
                description="Как быстро начать работу: создание аккаунта, настройка профиля и первая подборка"
                icon={<UserCircle className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Создание первой подборки за 5 минут"
                description="Пошаговое руководство по созданию первой подборки объектов недвижимости"
                icon={<Home className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Как поделиться подборкой с клиентом"
                description="Различные способы отправки ссылки на подборку вашим клиентам"
                icon={<MessageSquare className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
            </TabsContent>

            {/* Инструменты */}
            <TabsContent value="tools" className="space-y-6">
              <NavigationCard
                title="Настройки платформы"
                description="Персонализация интерфейса и основных параметров работы с платформой"
                icon={<Settings className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Управление подписками"
                description="Информация о тарифах, платежах и управлении подпиской"
                icon={<Info className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Интеграции с внешними сервисами"
                description="Как интегрировать РиелторПро с популярными CRM системами и сервисами"
                icon={<Settings className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq" className="space-y-6">
              <NavigationCard
                title="Часто задаваемые вопросы"
                description="Ответы на популярные вопросы о работе с платформой"
                icon={<HelpCircle className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Решение технических проблем"
                description="Руководство по устранению распространенных проблем при работе с платформой"
                icon={<HelpCircle className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Вопросы по оплате и подписке"
                description="Ответы на вопросы, связанные с тарифами, оплатой и продлением подписки"
                icon={<Info className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
            </TabsContent>

            {/* Поддержка */}
            <TabsContent value="support" className="space-y-6">
              <NavigationCard
                title="Связаться с поддержкой"
                description="Обратитесь к нам, если у вас возникли вопросы или проблемы с платформой"
                icon={<MessageSquare className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Запросить обучение"
                description="Заказать персональное обучение по работе с платформой для вас или вашей команды"
                icon={<UserCircle className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
              <NavigationCard
                title="Предложить улучшение"
                description="Поделитесь своими идеями по улучшению платформы с нашей командой"
                icon={<MessageSquare className="h-5 w-5" />}
                link="#"
                linkText="Скоро будет доступно"
                disabled
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Useful advices section - always visible */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-luxury-black dark:text-white mb-3 transition-colors duration-300">
              Полезные советы
            </h2>
            <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mb-4"></div>
            <p className="text-luxury-black/80 dark:text-white/80 max-w-2xl mx-auto">
              Рекомендации для эффективной работы с платформой РиелторПро
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdviceCard 
              title="Персонализируйте подборки"
              description="Добавляйте персональные комментарии к каждому объекту недвижимости. Это помогает клиентам принять решение и показывает ваш профессионализм."
              icon={<MessageSquare className="h-5 w-5" />}
            />
            <AdviceCard 
              title="Загружайте качественные фото"
              description="Хорошие фотографии объектов повышают вероятность заинтересованности клиентов на 40%. Используйте только четкие и хорошо освещенные снимки."
              icon={<Home className="h-5 w-5" />}
            />
            <AdviceCard 
              title="Следите за активностью клиентов"
              description="Регулярно проверяйте статистику просмотров ваших подборок. Это поможет понять, какие объекты вызывают наибольший интерес."
              icon={<UserCircle className="h-5 w-5" />}
            />
            <AdviceCard 
              title="Обновляйте свой профиль"
              description="Клиенты больше доверяют риелторам с полным профилем. Добавьте профессиональное фото и информацию о своем опыте работы."
              icon={<Settings className="h-5 w-5" />}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-luxury-black dark:bg-dark-charcoal py-10 text-white/60 mt-20 border-t border-white/5 dark:border-dark-slate relative z-10">
        <div className="container-luxury flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <h2 className="text-xl font-display text-white mr-2">РиелторПро</h2>
            <span className="text-sm">• Платформа для риелторов</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Все права защищены</p>
        </div>
      </footer>
    </div>
  )
}

// Компонент для карточки навигации
interface NavigationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  linkText: string;
  disabled?: boolean;
}

function NavigationCard({ title, description, icon, link, linkText, disabled = false }: NavigationCardProps) {
  return (
    <Card className="rounded-sm shadow-subtle dark:shadow-elegant-dark border-gray-100 dark:border-dark-slate bg-white dark:bg-dark-graphite animate-fade-in-up">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-display font-medium text-luxury-black dark:text-white mb-2">
              {title}
            </h2>
            <p className="text-luxury-black/80 dark:text-white/80 mb-4">
              {description}
            </p>
            {disabled ? (
              <Button 
                variant="outline" 
                className="text-luxury-gold/60 dark:text-luxury-royalBlue/60 border-luxury-gold/20 dark:border-luxury-royalBlue/20 cursor-not-allowed"
                disabled
              >
                {linkText}
              </Button>
            ) : (
              <Link href={link}>
                <Button 
                  variant="outline" 
                  className="text-luxury-gold dark:text-luxury-royalBlue border-luxury-gold/30 dark:border-luxury-royalBlue/30 hover:bg-luxury-gold/10 dark:hover:bg-luxury-royalBlue/10"
                >
                  {linkText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component for advice card
interface AdviceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function AdviceCard({ title, description, icon }: AdviceCardProps) {
  return (
    <Card className="rounded-sm shadow-subtle dark:shadow-elegant-dark border-gray-100 dark:border-dark-slate bg-white dark:bg-dark-graphite animate-fade-in-up overflow-hidden">
      <CardContent className="p-6 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-medium text-luxury-black dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-luxury-black/70 dark:text-white/70">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
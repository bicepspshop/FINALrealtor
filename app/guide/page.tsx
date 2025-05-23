import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserCircle, FolderPlus, Home, MessageSquare, Users, CreditCard, CheckCircle, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { GuideSectionImage } from "./guide-section-image"
import { GuideUserNavButton } from "./guide-user-nav-button"
import { Suspense } from "react"
import { GuideBottomButton } from "./guide-bottom-button"
import { ThemeToggle } from "@/components/ui/theme/theme-toggle"

export const dynamic = 'force-dynamic'

export default function GuidePage() {
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
        <Link href="/navigation">
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
            Руководство по работе на платформе «РиелторПро»
          </h1>
          <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mb-4"></div>
          <p className="text-luxury-black/80 dark:text-white/80 max-w-2xl mx-auto">
            Добро пожаловать! В этом руководстве описан основной функционал сервиса для агентов: как настроить профиль, создавать подборки, работать с объектами и клиентами.
          </p>
        </div>

        {/* Контент руководства */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. Профиль агента */}
          <GuideSection
            number="1"
            title="Профиль агента"
            icon={<UserCircle className="h-5 w-5" />}
            steps={[
              "Нажмите в правом верхнем углу на своё имя → «Профиль».",
              "Загрузите фотографию, укажите имя, телефон.",
              "В поле «О себе» добавьте краткое описание (2–3 предложения).",
              "Нажмите «Сохранить изменения». Ваши данные отобразятся в карточке агента на подборках."
            ]}
            imageUrl="https://raw.githubusercontent.com/bicepspshop/FINALrealtor/main/public/images/profile-edit.png"
            imageAlt="Окно редактирования профиля"
          />

          {/* 2. Создание подборки */}
          <GuideSection
            number="2"
            title="Создание подборки (микро-лендинга)"
            icon={<FolderPlus className="h-5 w-5" />}
            steps={[
              "Перейдите в раздел «Подборки».",
              "Нажмите кнопку «Создать подборку».",
              "Введите название и описание подборки—они видны клиенту.",
              "Загрузите обложку (видно в личном кабинете).",
              "Кликните «Создать» — карточка подборки появится в списке."
            ]}
            imageUrl="https://raw.githubusercontent.com/bicepspshop/FINALrealtor/main/public/images/create-collection.png"
            imageAlt="Форма создания подборки"
          />

          {/* 3. Работа с объектами */}
          <GuideSection
            number="3"
            title="Работа с объектами"
            icon={<Home className="h-5 w-5" />}
            steps={[
              "В списке подборок нажмите «Объекты» на нужной карточке.",
              "Кликните «+ Добавить объект».",
              "Введите адрес, цену, описание и загрузите фотографии.",
              "Сохраните — объект появится в подборке.",
              "Для просмотра обратной связи перейдите во вкладку «Комментарии»."
            ]}
            imageUrl="https://raw.githubusercontent.com/bicepspshop/FINALrealtor/main/public/images/add-property.png"
            imageAlt="Меню объектов и форма добавления"
          />

          {/* 4. Просмотр мини‑сайта */}
          <GuideSection
            number="4"
            title="Просмотр мини‑сайта"
            icon={<MessageSquare className="h-5 w-5" />}
            steps={[
              "В списке подборок нажмите «Перейти», чтобы открыть подборку в режиме клиента.",
              "Проверьте оформление: заголовок, объекты, карточка агента.",
              "Все контакты (звонок, WhatsApp) кликабельны для ваших клиентов."
            ]}
            imageUrl="https://raw.githubusercontent.com/bicepspshop/FINALrealtor/main/public/images/client-view.png"
            imageAlt="Вид для клиента"
          />

          {/* 5. Ведение клиентов */}
          <GuideSection
            number="5"
            title="Ведение клиентов"
            icon={<Users className="h-5 w-5" />}
            steps={[
              "Перейдите в раздел «Клиенты».",
              "Нажмите «Добавить клиента» и заполните:",
              "• ФИО, телефон, email, дату рождения",
              "• Источник (как узнал о вас)",
              "Сохраните карточку клиента."
            ]}
            imageUrl="https://raw.githubusercontent.com/bicepspshop/FINALrealtor/main/public/images/add-client.png"
            imageAlt="Форма добавления клиента"
          />

          {/* 6. Запросы клиентов и статус сделки */}
          <GuideSection
            number="6"
            title="Запросы клиентов и статус сделки"
            icon={<CheckCircle className="h-5 w-5" />}
            steps={[
              "Откройте карточку клиента.",
              "Во вкладке «Запрос на недвижимость» укажите:",
              "• Тип недвижимости",
              "• Бюджет (мин/макс)",
              "• Предпочтительные районы",
              "• Способ оплаты",
              "Перейдите к «Прогресс сделки» и переключайте этапы (Потребность → Закрыто)."
            ]}
            imageUrl="https://raw.githubusercontent.com/bicepspshop/FINALrealtor/main/public/images/client-request.png"
            imageAlt="Вкладки «Запрос на недвижимость» и «Прогресс сделки»"
          />

          {/* 7. Заметки и задачи */}
          <GuideSection
            number="7"
            title="Заметки и задачи"
            icon={<Calendar className="h-5 w-5" />}
            steps={[
              "В карточке клиента перейдите в блок «Заметки и задачи».",
              "Добавьте новые заметки или создайте задачи с планируемыми датами.",
              "Отмечайте выполнение задач и фиксируйте важные детали."
            ]}
            imageUrl="https://raw.githubusercontent.com/bicepspshop/FINALrealtor/main/public/images/notes-tasks.png"
            imageAlt="Блок заметок и задач"
          />

          {/* 8. Управление подпиской */}
          <GuideSection
            number="8"
            title="Управление подпиской"
            icon={<CreditCard className="h-5 w-5" />}
            steps={[
              "Индикатор пробного периода отображается в верхней части экрана.",
              "Для оформления подписки нажмите «Оформить подписку» и выберите тариф (2 000 ₽/мес или 16 800 ₽/год)."
            ]}
            imageUrl="https://raw.githubusercontent.com/bicepspshop/FINALrealtor/main/public/images/subscription.png"
            imageAlt="Индикатор подписки и кнопка оформления"
          />

          {/* Заключение */}
          <Card className="rounded-sm shadow-subtle dark:shadow-elegant-dark border-gray-100 dark:border-dark-slate bg-white dark:bg-dark-graphite animate-fade-in-up">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-luxury-gold dark:text-luxury-royalBlue" />
                </div>
              </div>
              <h3 className="text-xl font-display font-medium text-luxury-black dark:text-white mb-3">
                Надеемся, что это руководство поможет вам быстро освоить площадку РиелторПро. Удачных сделок!
              </h3>
              <GuideBottomButton />
            </CardContent>
          </Card>
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

// Компонент для секции руководства
function GuideSection({ 
  number, 
  title, 
  icon, 
  steps, 
  imageUrl, 
  imageAlt 
}: {
  number: string
  title: string
  icon: React.ReactNode
  steps: string[]
  imageUrl: string
  imageAlt: string
}) {
  return (
    <Card className="rounded-sm shadow-subtle dark:shadow-elegant-dark border-gray-100 dark:border-dark-slate bg-white dark:bg-dark-graphite animate-fade-in-up">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 flex items-center justify-center">
            <span className="text-lg font-display font-medium text-luxury-gold dark:text-luxury-royalBlue">
              {number}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-display font-medium text-luxury-black dark:text-white flex items-center gap-3">
              {icon}
              {title}
            </h2>
          </div>
        </div>

        <div className="pl-14 space-y-2 mb-6">
          {steps.map((step, index) => (
            <p key={index} className="text-luxury-black/80 dark:text-white/80 leading-relaxed">
              {step}
            </p>
          ))}
        </div>

        {/* Placeholder для скриншота */}
        <div className="mt-6">
          <div className="bg-white dark:bg-dark-slate rounded-sm p-4 border border-gray-200 dark:border-dark-slate">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">{imageAlt}</p>
            <GuideSectionImage imageUrl={imageUrl} imageAlt={imageAlt} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

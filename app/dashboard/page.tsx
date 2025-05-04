import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/auth"
import { getServerClient, executeWithRetry } from "@/lib/supabase"
import { CreateCollectionDialog } from "./create-collection-dialog"
import { EditCollectionDialog } from "./edit-collection-dialog"
import { CollectionActions } from "./collection-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, WifiOff, FolderPlus, Home, MessageSquare, Bell, ChevronRight, Plus } from "lucide-react"
import { SubscriptionBanner } from "@/components/subscription-banner"
import { Database } from "@/lib/types/database.types"
import { DashboardTabs } from "@/components/dashboard-tabs"

// Add these type definitions before the DashboardPage function
type Collection = Database['public']['Tables']['collections']['Row']
type CommentsCountMap = Record<string, number>

export default async function DashboardPage() {
  console.log("DashboardPage: Начало загрузки страницы")

  // Получаем сессию
  const session = await getSession()

  // Если нет сессии, отображаем сообщение об ошибке вместо перенаправления
  if (!session) {
    console.log("DashboardPage: Сессия не найдена, отображение сообщения об ошибке")
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
            <Link href="/v0-debug" className="mt-4">
              <Button 
                variant="minimal" 
                className="w-full text-luxury-black/50 dark:text-white/50 hover:text-luxury-black dark:hover:text-white underline underline-offset-4 py-4 text-sm theme-transition"
              >
                Отладка v0
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Теперь мы знаем, что у нас есть сессия, можем безопасно использовать её
  const user = session
  console.log("DashboardPage: Сессия найдена для пользователя:", user.name)

  // Проверяем, является ли сессия временной (офлайн режим)
  const isOfflineMode = "isOfflineMode" in user && user.isOfflineMode === true

  try {
    // Получаем коллекции пользователя
    console.log("DashboardPage: Получение коллекций для пользователя ID:", user.id)
    const supabase = getServerClient()

    let collections = []
    let fetchError = null
    let commentsCountMap: CommentsCountMap = {}

    try {
      // Проверяем, находимся ли мы в офлайн-режиме
      if (isOfflineMode) {
        console.log("DashboardPage: Работа в офлайн-режиме, пропускаем запрос к базе данных")
        collections = [] // В офлайн-режиме возвращаем пустой массив
      } else {
        // Используем функцию с повторными попытками и таймаутом
        const { data, error } = await executeWithRetry(
          () =>
            supabase
              .from("collections")
              .select("id, name, description, share_id, cover_image")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false }),
          3, // Максимальное количество попыток
          2000, // Увеличенный таймаут между попытками
        ) as { 
          data: Collection[] | null; 
          error: Error | null;
        }

        if (error) {
          console.error("DashboardPage: Ошибка при получении коллекций:", error)
          fetchError = error
        } else {
          collections = data || []
          console.log(`DashboardPage: Получено ${collections.length} коллекций`)
          
          // Получаем количество комментариев для каждой коллекции
          if (collections.length > 0) {
            try {
              const { data: commentCounts } = await supabase.rpc("get_comments_count_per_collection", {
                user_id_param: user.id,
              }) as { data: {collection_id: string, count: number}[] | null }

              commentsCountMap = (commentCounts || []).reduce((acc: CommentsCountMap, c: {collection_id: string, count: number}) => {
                acc[c.collection_id] = c.count
                return acc
              }, {})
            } catch (error) {
              console.error("Error fetching comment counts:", error)
            }
          }
        }
      }
    } catch (error) {
      console.error("DashboardPage: Ошибка при получении коллекций:", error)
      fetchError = error
    }

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate relative theme-transition dashboard">
        
        <NavBar userName={user.name} isOfflineMode={isOfflineMode} />

        <main className="flex-1 container-luxury w-[95%] sm:w-auto py-8 relative z-10">
          {/* Subscription Banner */}
          {user.trialInfo && !isOfflineMode && user.trialInfo.isActive && (
            <SubscriptionBanner trialInfo={user.trialInfo} />
          )}
          
          {isOfflineMode && (
            <Alert variant="warning" className="mb-8 rounded-sm border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30 theme-transition">
              <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-500 theme-transition" />
              <AlertTitle className="font-medium text-amber-700 dark:text-amber-500 theme-transition">Режим офлайн</AlertTitle>
              <AlertDescription className="text-amber-700/80 dark:text-amber-500/90 theme-transition">
                Обнаружены проблемы с подключением к базе данных. Вы находитесь в режиме офлайн с ограниченной
                функциональностью. Попробуйте обновить страницу позже, когда соединение будет восстановлено.
              </AlertDescription>
            </Alert>
          )}

          {fetchError && !isOfflineMode && (
            <Alert variant="destructive" className="mb-8 rounded-sm border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 theme-transition">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 theme-transition" />
              <AlertTitle className="font-medium text-red-700 dark:text-red-500 theme-transition">Ошибка загрузки данных</AlertTitle>
              <AlertDescription className="text-red-700/80 dark:text-red-500/90 theme-transition">
                Не удалось загрузить ваши подборки. Пожалуйста, попробуйте обновить страницу.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-start sm:items-center mb-10">
            <div>
              <DashboardTabs activeTab="collections" />
              <p className="text-luxury-black/60 dark:text-white/60 theme-transition hidden sm:block">Управляйте подборками объектов недвижимости для ваших клиентов</p>
            </div>
            {!isOfflineMode && !fetchError && user.trialInfo?.isActive && <CreateCollectionDialog userId={user.id} />}
            {!isOfflineMode && !fetchError && user.trialInfo && !user.trialInfo.isActive && (
              <Link href="/dashboard/subscription">
                <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-white py-5 px-5 rounded-sm mt-3 sm:mt-0">
                  Оформить подписку
                </Button>
              </Link>
            )}
          </div>

          {!isOfflineMode && !fetchError && user.trialInfo && !user.trialInfo.isActive && (
            <Alert className="mb-8 rounded-sm border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30 theme-transition">
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

          {(!fetchError || isOfflineMode) && collections.length === 0 ? (
            <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-16 text-center max-w-xl mx-auto mt-12 animate-fade-in-up theme-transition">
              <div className="mb-8">
                <div className="w-40 h-40 mx-auto mb-6 overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate property-image theme-transition">
                  <Image 
                    src="/images/house3.png"
                    alt="Изображение недвижимости"
                    width={160}
                    height={160}
                    loading="lazy"
                    quality={80}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                </div>
                <div className="w-20 h-20 -mt-10 mx-auto rounded-full bg-white dark:bg-dark-charcoal border border-gray-100 dark:border-dark-slate shadow-md flex items-center justify-center theme-transition">
                  <FolderPlus className="h-8 w-8 text-luxury-gold dark:text-luxury-royalBlue theme-transition" />
                </div>
                <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mt-4 theme-transition"></div>
              </div>
              
              <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black dark:text-white theme-transition">
                {isOfflineMode ? "Подборки недоступны в режиме офлайн" : "Пока нет подборок"}
              </h2>
              <p className="text-luxury-black/70 dark:text-white/70 mb-8 max-w-lg mx-auto leading-relaxed theme-transition">
                {isOfflineMode
                  ? "Для доступа к подборкам необходимо подключение к интернету. Попробуйте обновить страницу позже."
                  : "Создайте свою первую подборку, чтобы начать организацию объектов недвижимости для ваших клиентов."}
              </p>
              {!isOfflineMode && <CreateCollectionDialog userId={user.id} buttonText="Создать первую подборку" />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection: Collection, index: number) => (
                <Card 
                  key={collection.id} 
                  className="overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark transition-all duration-500 animate-fade-in-up hover:-translate-y-1 property-card theme-transition bg-transparent relative flex flex-col h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Comment Count Badge - if there are comments */}
                  {commentsCountMap[collection.id] > 0 && (
                    <Link 
                      href={user.trialInfo?.isActive ? `/dashboard/collections/${collection.id}?tab=comments` : "/dashboard/subscription"}
                      className="absolute top-3 right-10 z-10 bg-black/80 dark:bg-blue-500/90 text-white rounded-full px-1.5 py-1 flex items-center gap-1.5 text-xs hover:bg-black dark:hover:bg-blue-500 transition-colors duration-200 theme-transition"
                    >
                      <MessageSquare size={14} />
                      <span>{commentsCountMap[collection.id]}</span>
                    </Link>
                  )}
                  
                  {!isOfflineMode && user.trialInfo?.isActive && (
                    <EditCollectionDialog
                      userId={user.id}
                      collection={{
                        id: collection.id,
                        name: collection.name,
                        description: collection.description,
                        cover_image: collection.cover_image
                      }}
                    />
                  )}
                  <CardHeader className="bg-white dark:bg-dark-graphite border-b border-gray-100 dark:border-dark-slate pb-4 theme-transition">
                    <CardTitle className="font-display dark:text-white theme-transition">{collection.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-luxury-black/60 dark:text-white/60 theme-transition">
                      {collection.share_id ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 dark:bg-success rounded-full theme-transition"></span>
                          <span className="dark:text-white/60 theme-transition">Есть ссылка для просмотра</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full theme-transition"></span>
                          <span className="dark:text-white/60 theme-transition">Нет ссылки для просмотра</span>
                        </>
                      )}
                    </CardDescription>
                    {collection.description && (
                      <p className="mt-2 text-sm text-luxury-black/70 dark:text-white/70 theme-transition line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6 pb-4 dark:bg-dark-graphite theme-transition flex-1">
                    <div className="mb-4 aspect-[3/2] overflow-hidden border border-gray-100 dark:border-blue-400/20 hover:dark:border-blue-400/60 property-image theme-transition">
                      <Image 
                        src={collection.cover_image || `/images/house${(parseInt(collection.id, 10) % 11) + 1}.png`}
                        alt="Недвижимость"
                        width={400}
                        height={266}
                        quality={80}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        decoding="async"
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {user.trialInfo?.isActive ? (
                        <Link href={`/dashboard/collections/${collection.id}`}>
                          <Button 
                            variant="outline" 
                            className="w-full border-luxury-black/20 hover:border-luxury-black/40 dark:border-blue-400/60 hover:bg-luxury-black/5 dark:hover:bg-blue-500/10 dark:hover:border-blue-400 rounded-sm flex items-center justify-center gap-2 py-5 text-luxury-black dark:text-white dark:border-2 theme-transition" 
                            animation="scale"
                          >
                            <Home size={16} className="text-luxury-black/70 dark:text-blue-400 theme-transition" />
                            <span className="theme-transition">Объекты</span>
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/dashboard/subscription">
                          <Button 
                            variant="outline" 
                            className="w-full border-amber-500/50 dark:border-amber-400/60 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 hover:border-amber-500/70 dark:hover:border-amber-400 rounded-sm flex items-center justify-center gap-2 py-5 text-amber-700 dark:text-amber-400 dark:border-2 theme-transition" 
                            animation="scale"
                          >
                            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 theme-transition" />
                            <span className="theme-transition">Подписка</span>
                          </Button>
                        </Link>
                      )}
                      
                      {user.trialInfo?.isActive ? (
                        <Link href={`/dashboard/collections/${collection.id}?tab=comments`}>
                          <Button 
                            variant="outline"
                            className="w-full border-luxury-black/20 hover:border-luxury-black/40 dark:border-blue-400/60 hover:bg-luxury-black/5 dark:hover:bg-blue-500/10 dark:hover:border-blue-400 rounded-sm flex items-center justify-center gap-2 py-5 text-luxury-black dark:text-white dark:border-2 theme-transition"
                            animation="scale"
                          >
                            <MessageSquare size={16} className="text-luxury-black/70 dark:text-blue-400 theme-transition" />
                            <span className="theme-transition">
                              {commentsCountMap[collection.id] > 0 
                                ? `Комментарии (${commentsCountMap[collection.id]})` 
                                : "Комментарии"}
                            </span>
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/dashboard/subscription">
                          <Button 
                            variant="default"
                            className="w-full rounded-sm flex items-center justify-center gap-2 py-5 bg-amber-600 hover:bg-amber-700 text-white theme-transition"
                            animation="scale"
                          >
                            <ChevronRight size={16} />
                            <span>Оформить</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-dark-slate pt-4 border-t border-gray-100 dark:border-dark-slate theme-transition mt-auto">
                    {!isOfflineMode && user.trialInfo?.isActive && (
                      <CollectionActions
                        collectionId={collection.id}
                        userId={user.id}
                        hasShareLink={!!collection.share_id}
                        shareId={collection.share_id}
                      />
                    )}
                    {!isOfflineMode && user.trialInfo && !user.trialInfo.isActive && (
                      <div className="w-full text-center text-amber-600 dark:text-amber-400 text-sm italic">
                        Для управления подборкой оформите подписку
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
                
        </main>

        <footer className="bg-luxury-black dark:bg-dark-charcoal py-10 text-white/60 mt-auto border-t border-white/5 dark:border-dark-slate theme-transition">
          <div className="container-luxury flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <h2 className="text-xl font-serif text-white mr-2 theme-transition">РиелторПро</h2>
              <span className="text-sm dark:text-white/60 theme-transition">• Платформа для риелторов</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/requisites" className="text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">
                Реквизиты
              </Link>
              <p className="dark:text-white/60 theme-transition">&copy; {new Date().getFullYear()} Все права защищены</p>
            </div>
          </div>
        </footer>
      </div>
    )
  } catch (error) {
    console.error("DashboardPage: Ошибка:", error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-luxury p-4 py-16 theme-transition dashboard">
        <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-12 max-w-lg w-full animate-fade-in-up theme-transition">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-white mb-2 theme-transition">
              РиелторПро
            </h1>
            <div className="w-16 h-0.5 bg-luxury-gold mx-auto mb-6"></div>
            <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black dark:text-white theme-transition">Что-то пошло не так</h2>
            <p className="text-luxury-black/70 dark:text-white/70 mb-8 theme-transition">Произошла ошибка при загрузке вашей панели управления.</p>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/login">
              <Button className="w-full bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-6 theme-transition" animation="scale">
                Вернуться на страницу входа
              </Button>
            </Link>
            <Link href="/debug" className="mt-4">
              <Button 
                variant="minimal" 
                className="w-full text-luxury-black/50 dark:text-white/50 hover:text-luxury-black dark:hover:text-white underline underline-offset-4 py-4 text-sm theme-transition"
              >
                Отладка аутентификации
              </Button>
            </Link>
            <Link href="/v0-debug" className="mt-1">
              <Button 
                variant="minimal" 
                className="w-full text-luxury-black/50 dark:text-white/50 hover:text-luxury-black dark:hover:text-white underline underline-offset-4 py-4 text-sm theme-transition"
              >
                Отладка v0
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
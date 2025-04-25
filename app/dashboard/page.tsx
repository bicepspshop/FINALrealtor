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
import { AlertCircle, WifiOff, FolderPlus, Home, MessageSquare } from "lucide-react"

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
    let commentsCountMap = {}

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
        )

        if (error) {
          console.error("DashboardPage: Ошибка при получении коллекций:", error)
          fetchError = error
        } else {
          collections = data || []
          console.log(`DashboardPage: Получено ${collections.length} коллекций`)
          
          // Получаем количество комментариев для каждой коллекции
          if (collections.length > 0) {
            const collectionIds = collections.map(c => c.id)
            const { data: commentsData } = await supabase
              .from("property_comments")
              .select("collection_id, id")
              .in("collection_id", collectionIds)
            
            // Создаем Map с количеством комментариев для каждой коллекции
            if (commentsData) {
              commentsCountMap = commentsData.reduce((acc, comment) => {
                acc[comment.collection_id] = (acc[comment.collection_id] || 0) + 1
                return acc
              }, {})
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

        <main className="flex-1 container-luxury py-8 relative z-10">
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
                Не удалось загрузить ваши коллекции. Пожалуйста, попробуйте обновить страницу.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-serif font-medium text-luxury-black dark:text-white theme-transition">Ваши коллекции</h1>
              <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mt-2 mb-3 theme-transition"></div>
              <p className="text-luxury-black/60 dark:text-white/60 theme-transition">Управляйте коллекциями объектов недвижимости для ваших клиентов</p>
            </div>
            {!isOfflineMode && !fetchError && <CreateCollectionDialog userId={user.id} />}
          </div>

          {(!fetchError || isOfflineMode) && collections.length === 0 ? (
            <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-16 text-center max-w-xl mx-auto mt-12 animate-fade-in-up theme-transition">
              <div className="mb-8">
                <div className="w-40 h-40 mx-auto mb-6 overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate property-image theme-transition">
                  <Image 
                    src="/images/house3.png"
                    alt="Изображение недвижимости"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                </div>
                <div className="w-20 h-20 -mt-10 mx-auto rounded-full bg-white dark:bg-dark-charcoal border border-gray-100 dark:border-dark-slate shadow-md flex items-center justify-center theme-transition">
                  <FolderPlus className="h-8 w-8 text-luxury-gold dark:text-luxury-royalBlue theme-transition" />
                </div>
                <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mt-4 theme-transition"></div>
              </div>
              
              <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black dark:text-white theme-transition">
                {isOfflineMode ? "Коллекции недоступны в режиме офлайн" : "Пока нет коллекций"}
              </h2>
              <p className="text-luxury-black/70 dark:text-white/70 mb-8 max-w-lg mx-auto leading-relaxed theme-transition">
                {isOfflineMode
                  ? "Для доступа к коллекциям необходимо подключение к интернету. Попробуйте обновить страницу позже."
                  : "Создайте свою первую коллекцию, чтобы начать организацию объектов недвижимости для ваших клиентов."}
              </p>
              {!isOfflineMode && <CreateCollectionDialog userId={user.id} buttonText="Создать первую коллекцию" />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection, index) => (
                <Card 
                  key={collection.id} 
                  className="overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark transition-all duration-500 animate-fade-in-up hover:-translate-y-1 property-card theme-transition bg-transparent relative flex flex-col h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Comment Count Badge - if there are comments */}
                  {commentsCountMap[collection.id] > 0 && (
                    <Link 
                      href={`/dashboard/collections/${collection.id}?tab=comments`}
                      className="absolute top-3 right-10 z-10 bg-black/80 dark:bg-blue-500/90 text-white rounded-full px-1.5 py-1 flex items-center gap-1.5 text-xs hover:bg-black dark:hover:bg-blue-500 transition-colors duration-200 theme-transition"
                    >
                      <MessageSquare size={14} />
                      <span>{commentsCountMap[collection.id]}</span>
                    </Link>
                  )}
                  
                  {!isOfflineMode && (
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
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link href={`/dashboard/collections/${collection.id}`}>
                        <Button 
                          variant="outline" 
                          className="w-full border-luxury-black/20 dark:border-blue-400/60 hover:bg-luxury-black/5 dark:hover:bg-blue-500/10 hover:border-luxury-black/30 dark:hover:border-blue-400 rounded-sm flex items-center justify-center gap-2 py-5 dark:text-white dark:border-2 theme-transition" 
                          animation="scale"
                        >
                          <Home size={16} className="dark:text-blue-400 theme-transition" />
                          <span className="dark:text-white theme-transition">Объекты</span>
                        </Button>
                      </Link>
                      
                      <Link href={`/dashboard/collections/${collection.id}?tab=comments`}>
                        <Button 
                          variant={commentsCountMap[collection.id] > 0 ? "default" : "outline"}
                          className={`w-full rounded-sm flex items-center justify-center gap-2 py-5 theme-transition
                            ${commentsCountMap[collection.id] > 0 
                              ? "bg-black text-white dark:bg-blue-500 dark:text-white hover:bg-black/90 dark:hover:bg-blue-600" 
                              : "border-luxury-black/20 dark:border-blue-400/40 hover:bg-luxury-black/5 dark:hover:bg-blue-500/10 dark:text-white"
                            }`}
                          animation="scale"
                        >
                          <MessageSquare size={16} className={commentsCountMap[collection.id] > 0 ? "" : "dark:text-blue-400"} />
                          <span className="dark:text-white theme-transition">
                            {commentsCountMap[collection.id] > 0 
                              ? `Комментарии (${commentsCountMap[collection.id]})` 
                              : "Комментарии"}
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-dark-slate pt-4 border-t border-gray-100 dark:border-dark-slate theme-transition mt-auto">
                    {!isOfflineMode && (
                      <CollectionActions
                        collectionId={collection.id}
                        userId={user.id}
                        hasShareLink={!!collection.share_id}
                        shareId={collection.share_id}
                      />
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
            <p className="dark:text-white/60 theme-transition">&copy; {new Date().getFullYear()} Все права защищены</p>
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
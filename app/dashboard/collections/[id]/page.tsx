import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/auth"
import { getServerClient } from "@/lib/supabase"
import { PropertyCard } from "./property-card"
import { AddPropertyForm } from "./add-property-form"
import { InlineCommentList } from "./comments/inline-comment-list"
import { ArrowLeft, Plus, HomeIcon, MessageSquare } from "lucide-react"

interface CollectionPageProps {
  params: {
    id: string
  },
  searchParams: {
    tab?: string
  }
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  console.log("CollectionPage: Начало загрузки страницы для коллекции ID:", params.id)
  
  // Get the active tab from URL parameters or default to "properties"
  const activeTab = searchParams.tab || "properties"

  try {
    const session = await getSession()

    if (!session) {
      console.log("CollectionPage: Сессия не найдена, перенаправление на страницу входа")
      redirect("/login")
    }

    // Check subscription status - redirect to subscription page if expired
    if (session.trialInfo && !session.trialInfo.isActive) {
      console.log("CollectionPage: Пробный период истек, перенаправление на страницу подписки")
      redirect("/dashboard/subscription")
    }

    const user = session
    const collectionId = params.id

    console.log("CollectionPage: Сессия найдена для пользователя ID:", user.id)
    console.log("CollectionPage: Получение данных коллекции ID:", collectionId)

    const supabase = getServerClient()

    // Получение данных коллекции с проверкой на ошибки
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .select("id, name, description")
      .eq("id", collectionId)
      .eq("user_id", user.id)
      .single()

    if (collectionError) {
      console.error("CollectionPage: Ошибка при получении коллекции:", collectionError)
      throw new Error(`Не удалось получить данные коллекции: ${collectionError.message}`)
    }

    if (!collection) {
      console.error("CollectionPage: Коллекция не найдена или нет доступа")
      redirect("/dashboard")
    }

    console.log("CollectionPage: Коллекция найдена:", collection.name)
    console.log("CollectionPage: Получение объектов для коллекции ID:", collectionId)

    // Получение объектов в этой коллекции с проверкой на ошибки
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select(`
        id, 
        property_type, 
        address, 
        rooms, 
        area, 
        price, 
        description,
        living_area,
        floor,
        total_floors,
        balcony,
        year_built,
        renovation_type,
        bathroom_count,
        has_parking,
        property_status,
        residential_complex,
        agent_comment,
        property_images (id, image_url)
      `)
      .eq("collection_id", collectionId)
      .order("created_at", { ascending: false })

    if (propertiesError) {
      console.error("CollectionPage: Ошибка при получении объектов:", propertiesError)
      throw new Error(`Не удалось получить объекты недвижимости: ${propertiesError.message}`)
    }

    // Получение комментариев для этой коллекции
    const { data: comments, error: commentsError } = await supabase
      .from("property_comments")
      .select(`
        id, 
        author_name, 
        author_email, 
        content, 
        position_x, 
        position_y, 
        created_at, 
        is_approved,
        property_id,
        properties (id, address, property_type)
      `)
      .eq("collection_id", collectionId)
      .order("created_at", { ascending: false })

    if (commentsError) {
      console.error("CollectionPage: Ошибка при получении комментариев:", commentsError)
      // Не прерываем выполнение, просто отображаем пустой массив комментариев
    }

    console.log(`CollectionPage: Получено ${properties?.length || 0} объектов`)
    console.log(`CollectionPage: Получено ${comments?.length || 0} комментариев`)

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate theme-transition">
        <NavBar userName={user.name} />

        <main className="flex-1 container-luxury py-8 max-w-[1400px]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="flex items-center gap-2 text-sm text-luxury-black/60 dark:text-white/60 mb-2 theme-transition">
                <Link href="/dashboard" className="flex items-center gap-1 hover:text-luxury-gold dark:hover:text-blue-400 transition-colors theme-transition">
                  <HomeIcon size={14} />
                  Подборки
                </Link>
                <span className="px-1">/</span>
                <span>{collection.name}</span>
              </div>
              <h1 className="text-3xl font-serif font-medium text-luxury-black dark:text-white theme-transition">{collection.name}</h1>
              <div className="w-20 h-0.5 bg-luxury-gold dark:bg-blue-400 mt-2 mb-3 theme-transition"></div>
              {collection.description ? (
                <p className="text-luxury-black/70 dark:text-white/70 mb-3 theme-transition">{collection.description}</p>
              ) : null}
              <p className="text-luxury-black/60 dark:text-white/60 theme-transition">Управление объектами недвижимости в этой подборке</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-luxury-black/20 dark:border-blue-400/40 hover:bg-luxury-black/5 dark:hover:bg-blue-400/10 hover:border-luxury-black/30 dark:hover:border-blue-400/60 rounded-sm flex items-center gap-2 dark:text-white theme-transition" animation="scale">
                <ArrowLeft size={16} />
                Назад к подборкам
              </Button>
            </Link>
          </div>

          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="mb-8 bg-white dark:bg-dark-graphite border border-luxury-black/10 dark:border-dark-slate p-1 rounded-sm theme-transition">
              <TabsTrigger 
                value="properties" 
                className="data-[state=active]:bg-luxury-black data-[state=active]:text-white rounded-sm py-2.5 px-4"
              >
                Объекты ({properties?.length || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="add" 
                className="data-[state=active]:bg-luxury-black data-[state=active]:text-white rounded-sm py-2.5 px-4"
              >
                <Plus size={16} className="mr-1" />
                Добавить объект
              </TabsTrigger>
              <TabsTrigger 
                value="comments" 
                className="data-[state=active]:bg-luxury-black data-[state=active]:text-white rounded-sm py-2.5 px-4"
              >
                <MessageSquare size={16} className="mr-1" />
                Комментарии {comments && comments.length > 0 ? `(${comments.length})` : ''}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              {properties && properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} collectionId={collectionId} userId={user.id} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-12 text-center max-w-xl mx-auto mt-8 animate-fade-in-up border border-gray-100 dark:border-dark-slate relative overflow-hidden theme-transition">
                  <div className="absolute inset-0 bg-[url('/images/background.png')] dark:bg-[url('/images/background-dark.png')] bg-cover bg-center opacity-[0.2] z-0 theme-transition"></div>
                  <div className="relative z-10">
                    <div className="mb-8">
                      <div className="w-20 h-20 mx-auto rounded-full bg-luxury-gold/10 dark:bg-blue-500/10 flex items-center justify-center theme-transition">
                        <HomeIcon className="h-10 w-10 text-luxury-gold dark:text-blue-400 theme-transition" />
                      </div>
                      <div className="w-16 h-0.5 bg-luxury-gold dark:bg-blue-400 mx-auto mt-4 theme-transition"></div>
                    </div>
                    
                    <h2 className="text-2xl font-serif font-medium mb-4 text-luxury-black dark:text-white theme-transition">В этой подборке пока нет объектов</h2>
                    <p className="text-luxury-black/70 dark:text-white/70 mb-8 max-w-lg mx-auto leading-relaxed theme-transition">
                      Добавьте объекты недвижимости, чтобы начать формировать подборку.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add" className="relative animate-fade-in w-full">
              <AddPropertyForm collectionId={collectionId} />
            </TabsContent>

            <TabsContent value="comments" className="relative animate-fade-in w-full">
              {/* Показываем встроенный список комментариев */}
              <InlineCommentList comments={comments || []} collectionId={collectionId} />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="bg-luxury-black dark:bg-dark-charcoal py-10 text-white/60 mt-auto border-t border-white/5 dark:border-dark-slate theme-transition">
          <div className="container-luxury flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <h2 className="text-xl font-serif text-white mr-2 theme-transition">РиелторПро</h2>
              <span className="text-sm dark:text-white/60 theme-transition">• Платформа для риелторов</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/agreement" className="text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">
                Пользовательское соглашение
              </Link>
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
    console.error("CollectionPage: Непредвиденная ошибка:", error)

    // Перенаправляем на страницу ошибки с информацией об ошибке
    redirect(`/error?message=${encodeURIComponent("Произошла ошибка при загрузке коллекции")}`)
  }
}
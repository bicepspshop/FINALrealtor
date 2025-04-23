import { notFound } from "next/navigation"
import { getServerClient } from "@/lib/supabase"
import { PropertyList } from "../components/property-list"
import { AgentInfo } from "../components/agent-info"
import { VersionToggle } from "../components/version-toggle"
import { ShareThemeProvider } from "../components/share-theme-provider"
import { ShareHero } from "./share-hero"

interface SharePageProps {
  params: {
    id: string
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const shareId = params.id
  const supabase = getServerClient()

  // Find collection by share_id
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("id, name, description, user_id")
    .eq("share_id", shareId)
    .single()

  if (collectionError || !collection) {
    notFound()
  }

  // Get agent info with phone number, description and avatar
  const { data: agent } = await supabase.from("users").select("name, email, phone, description, avatar_url").eq("id", collection.user_id).single()

  // Fetch properties in this collection
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
      bathroom_count,
      property_images (id, image_url)
    `)
    .eq("collection_id", collection.id)
    .order("created_at", { ascending: false })

  if (propertiesError) {
    notFound()
  }

  return (
    <ShareThemeProvider>
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-dark-charcoal text-[#2C2C2C] dark:text-white font-sans theme-transition">
        {/* Version Toggle */}
        <VersionToggle currentVersion="v1" shareId={shareId} variant="light" />
        
        {/* Hero Section */}
        <ShareHero collection={collection} agent={agent} />

        {/* Main Content */}
        <main className="container mx-auto px-6 md:px-12 py-8 md:py-12">
          {/* Agent Info Card - Redesigned with glass effect */}
          <div className="mb-10 animate-fade-in-up">
            <AgentInfo name={agent?.name || "Агент недвижимости"} email={agent?.email} phone={agent?.phone} description={agent?.description} avatarUrl={agent?.avatar_url} />
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12 bg-white/70 dark:bg-dark-graphite/70 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-dark-slate shadow-sm dark:shadow-elegant-dark animate-fade-in-up theme-transition">
              <div className="w-[120px] h-[120px] mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#FAF9F6] dark:border-dark-charcoal theme-transition">
                <img
                  src="/images/house3.png"
                  alt="No properties"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-serif font-medium text-[#2C2C2C] dark:text-white mb-3 theme-transition">В этой подборке пока нет объектов</h2>
              <div className="w-16 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mx-auto mb-4 theme-transition"></div>
              <p className="text-[#2C2C2C]/70 dark:text-white/70 max-w-md mx-auto theme-transition">
                Агент ещё не добавил объекты недвижимости в эту коллекцию. Пожалуйста, свяжитесь с агентом для получения дополнительной информации.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-12 flex justify-between items-center">
                <div className="animate-fade-in-up">
                  <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#2C2C2C] dark:text-white theme-transition">Представленные объекты</h2>
                  <div className="w-16 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mt-3 mb-2 theme-transition"></div>
                  <p className="text-[#2C2C2C]/70 dark:text-white/70 theme-transition">Найдено эксклюзивных предложений: {properties.length}</p>
                </div>
                
                <div className="hidden md:flex items-center gap-2 text-[#CBA135] dark:text-luxury-royalBlue font-medium animate-fade-in-up theme-transition">
                  <span>Просмотреть все</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="theme-transition">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <PropertyList properties={properties} />
            </>
          )}
        </main>

        {/* Footer with luxury design */}
        <footer className="bg-white dark:bg-dark-charcoal mt-20 border-t border-gray-100 dark:border-dark-slate py-12 theme-transition">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-xl font-serif font-medium text-[#2C2C2C] dark:text-white mb-2 theme-transition">РиелторПро</h3>
                <div className="w-10 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-3 theme-transition"></div>
                <p className="text-[#2C2C2C]/60 dark:text-white/60 text-sm theme-transition">&copy; {new Date().getFullYear()} Эксклюзивная платформа для риелторов</p>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="text-[#2C2C2C]/60 dark:text-white/60 hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors theme-transition">Правила использования</a>
                <a href="#" className="text-[#2C2C2C]/60 dark:text-white/60 hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors theme-transition">Конфиденциальность</a>
                <a href="#" className="text-[#2C2C2C]/60 dark:text-white/60 hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors theme-transition">Контакты</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ShareThemeProvider>
  )
}

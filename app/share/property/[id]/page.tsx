import { notFound } from "next/navigation"
import Link from "next/link"
import { getServerClient } from "@/lib/supabase"
import { PropertyCarousel } from "./property-carousel"
import { YandexMap } from "@/components/yandex-map"
import { ChevronRight, Home, MapPin, Phone, Mail, MessageSquare, Copy, Star, Globe } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ElegantTabs, ElegantTabsList, ElegantTabsTrigger, ElegantTabsContent } from "@/components/ui/tabs-elegant"
import { ShareThemeProvider } from "../../components/share-theme-provider"
import { PropertyHero } from "./property-hero"
import { SubscriptionChecker } from "../../components/subscription-checker"
import { TextFolding } from "@/components/ui/text-folding"
import { getPropertyImagesByCategory, formatPropertyWithImageArrays } from "@/lib/image-utils"

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const propertyId = params.id
  const supabase = getServerClient()

  // Получаем данные объекта недвижимости с обновленными полями для нескольких изображений
  const { data: propertyRaw, error } = await supabase
    .from("properties")
    .select(`
      id, 
      property_type, 
      address, 
      rooms, 
      area, 
      price, 
      description,
      floor_plan_url1,
      floor_plan_url2,
      floor_plan_url3,
      window_view_url1,
      window_view_url2,
      window_view_url3,
      interior_finish_url1,
      interior_finish_url2,
      interior_finish_url3,
      living_area,
      floor,
      total_floors,
      bathroom_count,
      renovation_type,
      residential_complex,
      agent_comment,
      property_images (id, image_url),
      collection_id
    `)
    .eq("id", propertyId)
    .single()

  if (error || !propertyRaw) {
    notFound()
  }

  // Format property with image arrays
  const property = formatPropertyWithImageArrays(propertyRaw)

  // Получаем данные о коллекции и агенте
  const { data: collection } = await supabase
    .from("collections")
    .select("id, name, user_id, share_id")
    .eq("id", property.collection_id)
    .single()

  if (!collection) {
    notFound()
  }

  const { data: agent } = await supabase.from("users").select("id, name, email, phone, description, avatar_url").eq("id", collection?.user_id).single()

  // Форматирование цены
  const formattedPrice = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(property.price)

  // Определение типа объекта недвижимости
  const propertyTypeLabel =
    {
      apartment: "Квартира",
      house: "Дом",
      land: "Земельный участок",
    }[property.property_type as 'apartment' | 'house' | 'land'] || "Объект"

  // Получаем изображения объекта
  const images = property.property_images?.map((img: { image_url: string }) => img.image_url) || []

  // Формирование заголовка объекта
  const propertyTitle = `${property.residential_complex ? `${property.residential_complex}, ` : ""}${property.rooms ? `${property.rooms}-комн. ` : ""}${propertyTypeLabel.toLowerCase()}, ${property.area} м²`
  
  // Проверка наличия дополнительных изображений по категориям
  const hasFloorPlanImages = property.floor_plan_images.length > 0
  const hasWindowViewImages = property.window_view_images.length > 0
  const hasInteriorFinishImages = property.interior_finish_images.length > 0
  const hasAdditionalImages = hasFloorPlanImages || hasWindowViewImages || hasInteriorFinishImages

  return (
    <ShareThemeProvider>
      {/* Real-time subscription checker */}
      <SubscriptionChecker collectionId={collection.id} userId={collection.user_id} />
      
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-dark-charcoal text-[#2C2C2C] dark:text-white pb-16 theme-transition overflow-x-hidden w-full">
        {/* Hero section with property images */}
        <PropertyHero images={images} propertyTitle={propertyTitle} collection={collection} />

        <main className="container mx-auto px-4 sm:px-6 md:px-8 -mt-20 relative z-10 max-w-[100vw] overflow-x-hidden">
          {/* Custom CSS variable controls content width, fixed at 80% for desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 animate-fade-in-up items-start content-start" 
               style={{ 
                 "--property-content-width": "var(--property-content-custom-width, 100%)",
                 maxWidth: "var(--property-content-width)",
                 margin: "0 auto"
               } as React.CSSProperties}>
            {/* Main content */}
            <div className="w-full overflow-hidden">
              {/* Property info card */}
              <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-gray-100 dark:border-dark-slate theme-transition w-full">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#2C2C2C] dark:text-white leading-tight theme-transition">
                      {property.residential_complex && <span className="font-bold">{property.residential_complex}, </span>}
                      {property.rooms ? `${property.rooms}-комн. ` : ""}{propertyTypeLabel.toLowerCase()}, {property.area} м²
                    </h1>
                    <div className="flex items-center gap-2 text-[#2C2C2C]/70 dark:text-white/70 mt-2 theme-transition">
                      <MapPin size={16} className="text-[#CBA135] dark:text-luxury-royalBlue theme-transition" />
                      <span>{property.address}</span>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-serif font-medium text-[#CBA135] dark:text-luxury-royalBlue theme-transition">{formattedPrice}</div>
                </div>
                
                <div className="w-full h-0.5 bg-gray-100 dark:bg-dark-slate my-6 theme-transition"></div>
                
                {/* Property images carousel */}
                <div className="aspect-[16/9] overflow-hidden rounded-sm mb-10 border border-gray-100 dark:border-dark-slate theme-transition">
                  <PropertyCarousel images={images} propertyType={propertyTypeLabel} />
                </div>
                
                {/* Description */}
                <div className="mb-10">
                  <ElegantTabs defaultValue="description">
                    <ElegantTabsList className="w-full" indicatorClassName="bg-[#CBA135] dark:bg-luxury-royalBlue">
                      <ElegantTabsTrigger value="description" className="text-xl font-serif font-medium dark:text-white theme-transition">Описание</ElegantTabsTrigger>
                      {property.agent_comment && (
                        <ElegantTabsTrigger value="agent_comment" className="text-xl font-serif font-medium dark:text-white theme-transition">Комментарий риелтора</ElegantTabsTrigger>
                      )}
                    </ElegantTabsList>

                    <ElegantTabsContent value="description">
                      <div className="text-[#2C2C2C]/80 dark:text-white/80 leading-relaxed theme-transition">
                        {property.description ? (
                          <TextFolding 
                            text={property.description}
                            className="text-[#2C2C2C]/80 dark:text-white/80 theme-transition"
                            title="Описание объекта"
                          />
                        ) : (
                          <p>Описание объекта недвижимости не представлено агентом.</p>
                        )}
                      </div>
                    </ElegantTabsContent>

                    {property.agent_comment && (
                      <ElegantTabsContent value="agent_comment">
                        <div className="text-[#2C2C2C]/80 dark:text-white/80 leading-relaxed theme-transition">
                          <TextFolding 
                            text={property.agent_comment}
                            className="text-[#2C2C2C]/80 dark:text-white/80 theme-transition"
                            title="Комментарий риелтора"
                          />
                        </div>
                      </ElegantTabsContent>
                    )}
                  </ElegantTabs>
                </div>
                
                {/* Features */}
                <div className="mb-8">
                  <h2 className="text-xl font-serif font-medium mb-4 dark:text-white theme-transition">Характеристики</h2>
                  <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-6 theme-transition"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-[#FAF9F6] dark:bg-dark-slate p-4 sm:p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                      <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Площадь общая</div>
                      <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.area} м²</div>
                    </div>
                    
                    {property.living_area && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-4 sm:p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Площадь жилая</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.living_area} м²</div>
                      </div>
                    )}
                    
                    {property.floor && property.total_floors && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-4 sm:p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Этаж</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">
                          {property.floor} из {property.total_floors}
                        </div>
                      </div>
                    )}
                    
                    {property.rooms !== null && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-4 sm:p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Комнаты</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.rooms}</div>
                      </div>
                    )}
                    
                    {property.bathroom_count && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-4 sm:p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Санузлы</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.bathroom_count}</div>
                      </div>
                    )}
                    
                    {property.renovation_type && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-4 sm:p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Ремонт</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.renovation_type}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Feature images */}
                {hasAdditionalImages && (
                  <div className="mb-8">
                    <h2 className="text-xl font-serif font-medium mb-4 dark:text-white theme-transition">Дополнительные изображения</h2>
                    <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-6 theme-transition"></div>
                    
                    <Tabs defaultValue={hasFloorPlanImages ? "floor-plan" : hasInteriorFinishImages ? "interior" : "window-view"} className="w-full">
                      <TabsList className="w-full justify-start mb-4 bg-transparent border-b border-gray-200 dark:border-dark-slate theme-transition p-0 h-auto">
                        {hasFloorPlanImages && (
                          <TabsTrigger 
                            value="floor-plan" 
                            className="data-[state=active]:border-b-2 data-[state=active]:border-[#CBA135] dark:data-[state=active]:border-luxury-royalBlue rounded-none px-4 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:text-[#CBA135] dark:data-[state=active]:text-luxury-royalBlue data-[state=active]:shadow-none theme-transition"
                          >
                            Планировка
                          </TabsTrigger>
                        )}
                        {hasInteriorFinishImages && (
                          <TabsTrigger 
                            value="interior" 
                            className="data-[state=active]:border-b-2 data-[state=active]:border-[#CBA135] dark:data-[state=active]:border-luxury-royalBlue rounded-none px-4 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:text-[#CBA135] dark:data-[state=active]:text-luxury-royalBlue data-[state=active]:shadow-none theme-transition"
                          >
                            Интерьер
                          </TabsTrigger>
                        )}
                        {hasWindowViewImages && (
                          <TabsTrigger 
                            value="window-view" 
                            className="data-[state=active]:border-b-2 data-[state=active]:border-[#CBA135] dark:data-[state=active]:border-luxury-royalBlue rounded-none px-4 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:text-[#CBA135] dark:data-[state=active]:text-luxury-royalBlue data-[state=active]:shadow-none theme-transition"
                          >
                            Вид из окна
                          </TabsTrigger>
                        )}
                      </TabsList>
                      
                      {hasFloorPlanImages && (
                        <TabsContent value="floor-plan" className="mt-0">
                          <div className="aspect-[16/9] overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate theme-transition">
                            <PropertyCarousel images={property.floor_plan_images} propertyType={`${propertyTypeLabel} - Планировка`} />
                          </div>
                        </TabsContent>
                      )}
                      
                      {hasInteriorFinishImages && (
                        <TabsContent value="interior" className="mt-0">
                          <div className="aspect-[16/9] overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate theme-transition">
                            <PropertyCarousel images={property.interior_finish_images} propertyType={`${propertyTypeLabel} - Интерьер`} />
                          </div>
                        </TabsContent>
                      )}
                      
                      {hasWindowViewImages && (
                        <TabsContent value="window-view" className="mt-0">
                          <div className="aspect-[16/9] overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate theme-transition">
                            <PropertyCarousel images={property.window_view_images} propertyType={`${propertyTypeLabel} - Вид из окна`} />
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </div>
                )}
              </div>
              
              {/* Map section */}
              <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-sm border border-gray-100 dark:border-dark-slate p-4 sm:p-6 md:p-8 theme-transition w-full overflow-hidden">
                <h2 className="text-xl font-serif font-medium mb-4 dark:text-white theme-transition">Расположение</h2>
                <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-6 theme-transition"></div>
                <div className="h-[300px] sm:h-[350px] md:h-[400px] rounded-sm overflow-hidden border border-gray-100 dark:border-dark-slate theme-transition">
                  <YandexMap address={property.address} className="w-full h-full" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[#2C2C2C]/70 dark:text-white/70 theme-transition">
                  <MapPin size={16} className="text-[#CBA135] dark:text-luxury-royalBlue theme-transition" />
                  <span>{property.address}</span>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:mt-0">
              {/* Agent card with integrated collection link */}
              <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-4 sm:p-6 lg:sticky lg:top-6 border border-gray-100 dark:border-dark-slate theme-transition w-full overflow-hidden">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#FAF9F6] to-[#F5EDD7] dark:from-dark-slate dark:to-dark-slate
                    flex items-center justify-center border-3 sm:border-4 border-white dark:border-dark-charcoal shadow-sm theme-transition shrink-0">
                    {agent?.avatar_url ? (
                      <img 
                        src={agent.avatar_url} 
                        alt={agent.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-serif text-[#CBA135] dark:text-luxury-royalBlue theme-transition">
                        {agent?.name?.charAt(0).toUpperCase() || "А"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-[#CBA135] dark:text-luxury-royalBlue mb-1 font-medium theme-transition">Ваш консультант</div>
                    <div className="text-lg font-serif font-medium text-[#2C2C2C] dark:text-white theme-transition truncate">{agent?.name || "Агент недвижимости"}</div>
                    {agent?.email && <div className="text-sm text-[#2C2C2C]/70 dark:text-white/70 mt-1 theme-transition truncate">{agent.email}</div>}
                  </div>
                </div>
                
                <div className="w-full h-0.5 bg-gray-100 dark:bg-dark-slate mb-4 sm:mb-6 theme-transition"></div>
                
                {agent?.description ? (
                  <div className="text-sm text-[#2C2C2C]/70 dark:text-white/70 theme-transition mb-2">
                    {agent.description}
                  </div>
                ) : (
                  <div className="text-sm text-[#2C2C2C]/70 dark:text-white/70 theme-transition italic">
                    Информация о специализации агента не указана
                  </div>
                )}
                
                <div className="w-full h-0.5 bg-gray-100 dark:bg-dark-slate my-4 sm:my-6 theme-transition"></div>
                
                <div className="space-y-3 mb-4 sm:mb-6">
                  <a href={`tel:${agent?.phone || ''}`} className="w-full flex items-center justify-center gap-2 bg-[#CBA135] dark:bg-luxury-royalBlue hover:bg-[#D4AF37] dark:hover:bg-luxury-royalBlueMuted text-white 
                    font-medium py-2 sm:py-3 px-4 rounded-sm transition-all duration-300 shadow-sm hover:shadow-md theme-transition text-sm sm:text-base">
                    <Phone size={16} />
                    <span className="truncate">{agent?.phone ? 'Позвонить: ' + agent.phone : 'Позвонить'}</span>
                  </a>
                  
                  {agent?.phone && (
                    <a 
                      href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white 
                        font-medium py-2 sm:py-3 px-4 rounded-sm transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  )}
                  
                  <a href={`mailto:${agent?.email}`} className="w-full flex items-center justify-center gap-2 border border-[#CBA135] dark:border-luxury-royalBlue
                    text-[#CBA135] dark:text-luxury-royalBlue hover:bg-[#CBA135]/10 dark:hover:bg-luxury-royalBlue/10 font-medium py-2 sm:py-3 px-4 rounded-sm transition-all duration-300 theme-transition text-sm sm:text-base">
                    <Mail size={16} />
                    <span>Написать письмо</span>
                  </a>
                  
                  {/* Telegram button temporarily removed */}
                </div>
                
                <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 text-center theme-transition">
                  <button className="inline-flex items-center gap-1 hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors theme-transition">
                    <Copy size={14} />
                    <span>Скопировать контакты</span>
                  </button>
                </div>
                
                {/* Back to collection */}
                <div className="border-t border-gray-100 dark:border-dark-slate mt-4 sm:mt-6 pt-4 sm:pt-6">
                  <Link 
                    href={`/share/${collection?.share_id}`}
                    className="flex items-center justify-between text-[#2C2C2C]/80 dark:text-white/80 hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors group theme-transition"
                  >
                    <span className="font-medium">Вернуться к коллекции</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
              
              {/* Remove separate Back to collection div since it's now included in agent card */}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-dark-charcoal mt-12 sm:mt-16 md:mt-20 border-t border-gray-100 dark:border-dark-slate py-6 sm:py-8 theme-transition w-full overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Link href="/" className="text-xl font-serif font-medium text-[#2C2C2C] dark:text-white mb-2 theme-transition hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors">РиелторПро</Link>
                <div className="w-10 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-3 theme-transition"></div>
                <p className="text-[#2C2C2C]/60 dark:text-white/60 text-sm theme-transition">&copy; {new Date().getFullYear()} Эксклюзивная платформа для риелторов</p>
              </div>
              <div className="flex items-center gap-6">
                {/* Footer links removed as requested */}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ShareThemeProvider>
  )
}
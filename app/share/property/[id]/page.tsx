import { notFound } from "next/navigation"
import Link from "next/link"
import { getServerClient } from "@/lib/supabase"
import { PropertyCarousel } from "./property-carousel"
import { YandexMap } from "@/components/yandex-map"
import { ChevronRight, Home, MapPin, Phone, Mail, MessageSquare, Copy, Star } from "lucide-react"
import { ShareThemeProvider } from "../../components/share-theme-provider"
import { PropertyHero } from "./property-hero"

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const propertyId = params.id
  const supabase = getServerClient()

  // Получаем данные объекта недвижимости
  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      id, 
      property_type, 
      address, 
      rooms, 
      area, 
      price, 
      description,
      floor_plan_url,
      living_area,
      floor,
      total_floors,
      bathroom_count,
      renovation_type,
      property_images (id, image_url),
      collection_id
    `)
    .eq("id", propertyId)
    .single()

  if (error || !property) {
    notFound()
  }

  // Получаем данные о коллекции и агенте
  const { data: collection } = await supabase
    .from("collections")
    .select("id, name, user_id, share_id")
    .eq("id", property.collection_id)
    .single()

  const { data: agent } = await supabase.from("users").select("id, name, email").eq("id", collection?.user_id).single()

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
    }[property.property_type] || "Объект"

  // Получаем изображения объекта
  const images = property.property_images?.map((img) => img.image_url) || []

  // Формирование заголовка объекта
  const propertyTitle = `${property.rooms ? `${property.rooms}-комн. ` : ""}${propertyTypeLabel.toLowerCase()}, ${property.area} м²`

  return (
    <ShareThemeProvider>
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-dark-charcoal text-[#2C2C2C] dark:text-white pb-16 theme-transition">
        {/* Hero section with property images */}
        <PropertyHero images={images} propertyTitle={propertyTitle} collection={collection} />

        <main className="container mx-auto px-6 md:px-12 -mt-20 relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] animate-fade-in-up">
            {/* Main content */}
            <div>
              {/* Property info card */}
              <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-8 md:p-10 mb-10 border border-gray-100 dark:border-dark-slate theme-transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#2C2C2C] dark:text-white leading-tight theme-transition">{propertyTitle}</h1>
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
                  <h2 className="text-xl font-serif font-medium mb-4 dark:text-white theme-transition">Описание</h2>
                  <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-6 theme-transition"></div>
                  <div className="text-[#2C2C2C]/80 dark:text-white/80 leading-relaxed theme-transition">
                    {property.description ? (
                      <p>{property.description}</p>
                    ) : (
                      <p>Описание объекта недвижимости не представлено агентом.</p>
                    )}
                  </div>
                </div>
                
                {/* Features */}
                <div className="mb-10">
                  <h2 className="text-xl font-serif font-medium mb-4 dark:text-white theme-transition">Характеристики</h2>
                  <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-6 theme-transition"></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div className="bg-[#FAF9F6] dark:bg-dark-slate p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                      <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Площадь общая</div>
                      <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.area} м²</div>
                    </div>
                    
                    {property.living_area && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Площадь жилая</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.living_area} м²</div>
                      </div>
                    )}
                    
                    {property.floor && property.total_floors && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Этаж</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">
                          {property.floor} из {property.total_floors}
                        </div>
                      </div>
                    )}
                    
                    {property.rooms !== null && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Комнаты</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.rooms}</div>
                      </div>
                    )}
                    
                    {property.bathroom_count && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Санузлы</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.bathroom_count}</div>
                      </div>
                    )}
                    
                    {property.renovation_type && (
                      <div className="bg-[#FAF9F6] dark:bg-dark-slate p-5 rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                        <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 mb-1 theme-transition">Ремонт</div>
                        <div className="text-lg font-medium text-[#2C2C2C] dark:text-white theme-transition">{property.renovation_type}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Floor plan */}
                {property.floor_plan_url && (
                  <div className="mb-10">
                    <h2 className="text-xl font-serif font-medium mb-4 dark:text-white theme-transition">Планировка</h2>
                    <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-6 theme-transition"></div>
                    <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-gray-100 dark:border-dark-slate theme-transition">
                      <img
                        src={property.floor_plan_url}
                        alt="Планировка"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Map section */}
              <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-sm border border-gray-100 dark:border-dark-slate p-8 md:p-10 theme-transition">
                <h2 className="text-xl font-serif font-medium mb-4 dark:text-white theme-transition">Расположение</h2>
                <div className="w-12 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mb-6 theme-transition"></div>
                <div className="h-[400px] rounded-sm overflow-hidden border border-gray-100 dark:border-dark-slate theme-transition">
                  <YandexMap address={property.address} className="w-full h-full" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[#2C2C2C]/70 dark:text-white/70 theme-transition">
                  <MapPin size={16} className="text-[#CBA135] dark:text-luxury-royalBlue theme-transition" />
                  <span>{property.address}</span>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Agent card */}
              <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-6 sticky top-6 border border-gray-100 dark:border-dark-slate theme-transition">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FAF9F6] to-[#F5EDD7] dark:from-dark-slate dark:to-dark-slate
                    flex items-center justify-center border-4 border-white dark:border-dark-charcoal shadow-sm theme-transition">
                    <span className="text-xl font-serif text-[#CBA135] dark:text-luxury-royalBlue theme-transition">{agent?.name?.charAt(0).toUpperCase() || "А"}</span>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#CBA135] dark:text-luxury-royalBlue mb-1 font-medium theme-transition">Ваш консультант</div>
                    <div className="text-lg font-serif font-medium text-[#2C2C2C] dark:text-white theme-transition">{agent?.name || "Агент недвижимости"}</div>
                    {agent?.email && <div className="text-sm text-[#2C2C2C]/70 dark:text-white/70 mt-1 theme-transition">{agent.email}</div>}
                  </div>
                </div>
                
                <div className="w-full h-0.5 bg-gray-100 dark:bg-dark-slate mb-6 theme-transition"></div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#2C2C2C]/80 dark:text-white/80 theme-transition">
                    <Star size={16} className="text-[#CBA135] dark:text-luxury-royalBlue theme-transition" />
                    <span>Специализация: элитная недвижимость</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#2C2C2C]/80 dark:text-white/80 theme-transition">
                    <Star size={16} className="text-[#CBA135] dark:text-luxury-royalBlue theme-transition" />
                    <span>Опыт работы: более 5 лет</span>
                  </div>
                </div>
                
                <div className="w-full h-0.5 bg-gray-100 dark:bg-dark-slate my-6 theme-transition"></div>
                
                <div className="space-y-3 mb-6">
                  <button className="w-full flex items-center justify-center gap-2 bg-[#CBA135] dark:bg-luxury-royalBlue hover:bg-[#D4AF37] dark:hover:bg-luxury-royalBlueMuted text-white 
                    font-medium py-3 px-4 rounded-sm transition-all duration-300 shadow-sm hover:shadow-md theme-transition">
                    <Phone size={16} />
                    <span>Позвонить</span>
                  </button>
                  
                  <a href={`mailto:${agent?.email}`} className="w-full flex items-center justify-center gap-2 border border-[#CBA135] dark:border-luxury-royalBlue
                    text-[#CBA135] dark:text-luxury-royalBlue hover:bg-[#CBA135]/10 dark:hover:bg-luxury-royalBlue/10 font-medium py-3 px-4 rounded-sm transition-all duration-300 theme-transition">
                    <Mail size={16} />
                    <span>Написать письмо</span>
                  </a>
                  
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-dark-slate
                    text-[#2C2C2C]/80 dark:text-white/80 hover:border-[#2C2C2C]/80 dark:hover:border-white/30 font-medium py-3 px-4 rounded-sm transition-all duration-300 theme-transition">
                    <MessageSquare size={16} />
                    <span>Telegram</span>
                  </button>
                </div>
                
                <div className="text-sm text-[#2C2C2C]/60 dark:text-white/60 text-center theme-transition">
                  <button className="inline-flex items-center gap-1 hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors theme-transition">
                    <Copy size={14} />
                    <span>Скопировать контакты</span>
                  </button>
                </div>
              </div>
              
              {/* Back to collection */}
              <div className="bg-white dark:bg-dark-graphite rounded-sm p-6 border border-gray-100 dark:border-dark-slate shadow-sm dark:shadow-elegant-dark theme-transition">
                <Link 
                  href={`/share/${collection?.share_id}`}
                  className="flex items-center justify-between text-[#2C2C2C]/80 dark:text-white/80 hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors group theme-transition"
                >
                  <span className="font-medium">Вернуться к коллекции</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-dark-charcoal mt-20 border-t border-gray-100 dark:border-dark-slate py-8 theme-transition">
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

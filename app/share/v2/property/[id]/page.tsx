import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getServerClient } from "@/lib/supabase"
import { PropertyCarousel } from "./property-carousel"
import { YandexMap } from "@/components/yandex-map"
import { ChevronRight, Home, MapPin, Phone, Mail, MessageSquare, Copy, Star, ArrowRight, Sparkles, Award } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { VersionToggle } from "../../../components/version-toggle"
import { LuxuryEffects } from "../../components/luxury-effects"
import { LuxurySeal, GoldenDust, OrnateFrame, ShimmeringText, LuxuryWatermark } from "../../components/luxury-elements"
import "@/styles/luxury-experience.css"

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default async function PropertyPageV2({ params }: PropertyPageProps) {
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
      residential_complex,
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

  // Определение типа объекта недвижимости
  const propertyTypeLabel =
    {
      apartment: "Квартира",
      house: "Дом",
      land: "Земельный участок",
    }[property.property_type as 'apartment' | 'house' | 'land'] || "Объект"

  // Получаем изображения объекта
  const images = property.property_images?.map((img) => img.image_url) || []

  // Формирование заголовка объекта
  const propertyTitle = `${property.residential_complex ? `${property.residential_complex}, ` : ""}${property.rooms ? `${property.rooms}-комн. ` : ""}${propertyTypeLabel.toLowerCase()}, ${property.area} м²`

  return (
    <div className="min-h-screen bg-dark-charcoal text-white font-sans overflow-hidden luxury-experience-wrapper">
      {/* Client-side luxury effects */}
      <LuxuryEffects />
      {/* Version Toggle */}
      <VersionToggle currentVersion="v2" shareId={collection?.share_id} variant="dark" />

      {/* Hero section with property images */}
      <div className="relative h-[60vh] md:h-[75vh] overflow-hidden luxury-property-hero">
        {/* Premium corner flourish */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-30 pointer-events-none z-10">
          <div className="absolute top-0 right-0 w-px h-24 bg-gradient-to-b from-gold/80 to-transparent"></div>
          <div className="absolute top-0 right-0 h-px w-24 bg-gradient-to-l from-gold/80 to-transparent"></div>
          <div className="absolute top-4 right-4 w-4 h-4 rounded-full border border-gold/40 opacity-60"></div>
        </div>
        <div className="absolute inset-0 z-0">
          <Image 
            src={images[0] || "/images/house1.png"} 
            alt={propertyTitle}
            fill 
            className="object-cover filter contrast-110 hero-parallax-image"
            priority
          />
          {/* Luxury overlay treatment */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80"></div>
          <div className="absolute inset-0 bg-pattern-overlay opacity-10"></div>
          <div className="absolute inset-0 luxury-noise-texture"></div>
          
          {/* Accent light beams */}
          <div className="absolute top-0 left-1/3 w-px h-[40vh] bg-gradient-to-b from-gold/0 via-gold/15 to-gold/0 luxury-light-beam"></div>
          <div className="absolute top-20 right-1/4 w-px h-[30vh] bg-gradient-to-b from-gold/0 via-gold/10 to-gold/0 luxury-light-beam-slow"></div>
        </div>
        
        {/* Floating navigation with luxury styling */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <div className="container mx-auto px-6 md:px-12 py-6 pt-20">
            <div className="flex items-center gap-3 text-white/90 bg-black/20 backdrop-blur-md px-5 py-3 
              border border-gold/20 inline-block animate-fade-in-up luxury-nav-pill">
              <Link 
                href={`/share/v2/${collection?.share_id}`} 
                className="hover:text-gold transition-all duration-500 flex items-center gap-2 group relative"
              >
                <Home size={16} className="transition-transform duration-500 group-hover:-translate-x-1" />
                <span className="relative">
                  Вернуться к коллекции
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500"></span>
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Gold dust animation effect */}
        <GoldenDust particleCount={25} startDelay={1200} />
        
        {/* Centered property title */}
        <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-6 md:px-12 pb-20">
          <div className="max-w-4xl">
            <div className="flex flex-col gap-2 animate-fade-in-up">
              <div className="inline-flex items-center gap-2.5 bg-black/30 backdrop-blur-md px-4 py-2 rounded-sm text-sm border border-gold/20 self-start mb-4 luxury-property-badge">
                <Sparkles size={14} className="text-gold mr-1" />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold">{propertyTypeLabel}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif font-light text-white mb-4 leading-tight luxury-property-heading" style={{ textShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
                <span className="relative inline-block">
                  {property.property_type === 'house' ? (
                    <>
                      <ShimmeringText text="Элитный" className="mr-2 text-gold" delay={800} />
                      {property.residential_complex && <span className="font-bold">{property.residential_complex}, </span>}
                      {propertyTitle.replace('дом', '').replace(property.residential_complex ? `${property.residential_complex} ` : "", "")}
                    </>
                  ) : property.price > 15000000 ? (
                    <>
                      <ShimmeringText text="Премиум" className="mr-2 text-gold" delay={800} />
                      {property.residential_complex && <span className="font-bold">{property.residential_complex}, </span>}
                      {propertyTitle.replace(property.residential_complex ? `${property.residential_complex} ` : "", "")}
                    </>
                  ) : (
                    <>
                      {property.residential_complex && <span className="font-bold">{property.residential_complex}, </span>}
                      {propertyTitle.replace(property.residential_complex ? `${property.residential_complex} ` : "", "")}
                    </>
                  )}
                  <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-gradient-to-r from-gold via-gold/70 to-transparent luxury-heading-underline"></span>
                </span>
              </h1>
              
              <div className="w-24 h-px bg-gradient-to-r from-gold/90 to-gold/20 mb-6 luxury-divider"></div>
              
              <div className="flex items-center gap-2 text-white/90 mb-4 luxury-address group">
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gold/10 transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  <MapPin size={18} className="text-gold relative z-10" />
                </div>
                <span className="relative inline-block">
                  {property.address}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gold/40 group-hover:w-full transition-all duration-700 ease-out"></span>
                </span>
              </div>
              
              <div className="text-3xl md:text-4xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-light luxury-price relative group">
                <div className="absolute -inset-1 bg-gold/5 rounded-md filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <span className="relative z-10">
                {formatPrice(property.price)}
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 bg-dark-charcoal luxury-property-content">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 bg-pattern-grid opacity-[0.02] pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
        
        {/* Subtle luxury watermark */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -right-20">
            <LuxuryWatermark text={property.property_type === 'house' ? 'EXCLUSIVE' : 'PREMIUM'} />
          </div>
          <div className="absolute -bottom-20 -left-20">
            <LuxuryWatermark text="REALTOR PRO" opacity={0.02} />
          </div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 py-16 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] relative">
            {/* Decorative luxury element */}
            <div className="absolute -top-10 -left-20 w-40 h-40 rounded-full bg-gradient-radial from-gold/5 to-transparent opacity-30 blur-2xl pointer-events-none"></div>
            <div className="absolute -right-10 bottom-1/4 w-64 h-64 border border-gold/5 rounded-full opacity-20 pointer-events-none transform rotate-45"></div>
            {/* Main content */}
            <div>
              {/* Property images carousel */}
              <div className="aspect-[16/9] overflow-hidden mb-16 border border-gold/10 bg-black/50 luxury-carousel-container relative">
                <div className="absolute top-0 left-0 w-12 h-12 luxury-corner-accent">
                  <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"></div>
                  <div className="absolute top-0 left-0 h-px w-8 bg-gradient-to-r from-gold/60 to-transparent"></div>
                </div>
                <PropertyCarousel images={images} propertyType={propertyTypeLabel} />
              </div>
              
              {/* Description */}
              <OrnateFrame className="mb-16">
                <div className="luxury-description-section relative p-6 border border-gold/10 bg-dark-graphite">
                  <div className="absolute left-0 top-1/4 w-1 h-40 bg-gradient-to-b from-gold/0 via-gold/20 to-gold/0 -translate-x-8 luxury-description-accent"></div>
                  
                  <div className="flex items-center mb-6">
                    <div className="mr-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-radial from-gold/20 to-transparent flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-gold/10 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-gold/60"></div>
                        </div>
                      </div>
                    </div>
                    <h2 className="text-2xl font-serif font-light text-white luxury-section-title">
                      <span className="relative inline-block">
                        Описание
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold luxury-title-underline"></span>
                      </span>
                    </h2>
                  </div>
                  
                  <div className="w-16 h-px bg-gradient-to-r from-gold/70 to-gold/10 mb-8 luxury-divider"></div>
                
                <div className="text-white/90 leading-relaxed max-w-3xl luxury-description-text">
                  {property.description ? (
                    <p>{property.description}</p>
                  ) : (
                    <p>Описание объекта недвижимости не представлено агентом.</p>
                  )}
                </div>
                </div>
              </OrnateFrame>
              
              {/* Features with luxury styling */}
              <div className="mb-16 luxury-features-section">
                <h2 className="text-2xl font-serif font-light text-white mb-4 luxury-section-title">
                  <span className="relative inline-block">
                    Характеристики
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold luxury-title-underline"></span>
                  </span>
                </h2>
                
                <div className="w-16 h-px bg-gradient-to-r from-gold/70 to-gold/10 mb-8 luxury-divider"></div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 luxury-features-grid">
                  <div className="bg-dark-graphite p-6 border border-gold/10 group hover:border-gold/30 transition-all duration-500 hover:shadow-[0_10px_25px_-5px_rgba(212,175,55,0.1)] hover:-translate-y-1 luxury-feature-card relative overflow-hidden">
                      {/* Subtle diagonal gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      {/* Diagonal line accent */}
                      <div className="absolute -top-1 -right-1 w-10 h-px transform rotate-45 bg-gold/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="text-sm text-white/50 mb-2 group-hover:text-white/70 transition-colors duration-500">Площадь общая</div>
                    <div className="text-xl font-light text-white group-hover:text-gold transition-all duration-500">
                      <span className="relative">
                        {property.area} м²
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold/50 group-hover:w-full transition-all duration-500"></span>
                      </span>
                    </div>
                    {/* Corner accent */}
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-gold/0 group-hover:border-gold/30 group-hover:w-3 group-hover:h-3 transition-all duration-500"></div>
                  </div>
                  
                  {property.living_area && (
                    <div className="bg-dark-graphite p-6 border border-gold/10 group hover:border-gold/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 luxury-feature-card">
                      <div className="text-sm text-white/50 mb-2 group-hover:text-white/70 transition-colors duration-500">Площадь жилая</div>
                      <div className="text-xl font-light text-white group-hover:text-gold transition-all duration-500">
                        <span className="relative">
                          {property.living_area} м²
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold/50 group-hover:w-full transition-all duration-500"></span>
                        </span>
                      </div>
                      {/* Corner accent */}
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-gold/0 group-hover:border-gold/30 group-hover:w-3 group-hover:h-3 transition-all duration-500"></div>
                    </div>
                  )}
                  
                  {property.floor && property.total_floors && (
                    <div className="bg-dark-graphite p-6 border border-gold/10 group hover:border-gold/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 luxury-feature-card">
                      <div className="text-sm text-white/50 mb-2 group-hover:text-white/70 transition-colors duration-500">Этаж</div>
                      <div className="text-xl font-light text-white group-hover:text-gold transition-all duration-500">
                        <span className="relative">
                          {property.floor} из {property.total_floors}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold/50 group-hover:w-full transition-all duration-500"></span>
                        </span>
                      </div>
                      {/* Corner accent */}
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-gold/0 group-hover:border-gold/30 group-hover:w-3 group-hover:h-3 transition-all duration-500"></div>
                    </div>
                  )}
                  
                  {property.rooms !== null && (
                    <div className="bg-dark-graphite p-6 border border-gold/10 group hover:border-gold/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 luxury-feature-card">
                      <div className="text-sm text-white/50 mb-2 group-hover:text-white/70 transition-colors duration-500">Комнаты</div>
                      <div className="text-xl font-light text-white group-hover:text-gold transition-all duration-500">
                        <span className="relative">
                          {property.rooms}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold/50 group-hover:w-full transition-all duration-500"></span>
                        </span>
                      </div>
                      {/* Corner accent */}
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-gold/0 group-hover:border-gold/30 group-hover:w-3 group-hover:h-3 transition-all duration-500"></div>
                    </div>
                  )}
                  
                  {property.bathroom_count && (
                    <div className="bg-dark-graphite p-6 border border-gold/10 group hover:border-gold/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 luxury-feature-card">
                      <div className="text-sm text-white/50 mb-2 group-hover:text-white/70 transition-colors duration-500">Санузлы</div>
                      <div className="text-xl font-light text-white group-hover:text-gold transition-all duration-500">
                        <span className="relative">
                          {property.bathroom_count}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold/50 group-hover:w-full transition-all duration-500"></span>
                        </span>
                      </div>
                      {/* Corner accent */}
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-gold/0 group-hover:border-gold/30 group-hover:w-3 group-hover:h-3 transition-all duration-500"></div>
                    </div>
                  )}
                  
                  {property.renovation_type && (
                    <div className="bg-dark-graphite p-6 border border-gold/10 group hover:border-gold/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 luxury-feature-card">
                      <div className="text-sm text-white/50 mb-2 group-hover:text-white/70 transition-colors duration-500">Ремонт</div>
                      <div className="text-xl font-light text-white group-hover:text-gold transition-all duration-500">
                        <span className="relative">
                          {property.renovation_type}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold/50 group-hover:w-full transition-all duration-500"></span>
                        </span>
                      </div>
                      {/* Corner accent */}
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-gold/0 group-hover:border-gold/30 group-hover:w-3 group-hover:h-3 transition-all duration-500"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Floor plan with elegant styling */}
              {property.floor_plan_url && (
                <div className="mb-16 relative">
                  <h2 className="text-2xl font-serif font-light text-white mb-4 relative inline-block">
                    Планировка
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold luxury-title-underline"></span>
                  </h2>
                  <div className="w-16 h-px bg-gradient-to-r from-gold/70 to-gold/10 mb-8"></div>
                  {/* Decorative corner element */}
                  <div className="absolute -left-4 top-1/4 w-8 h-8">
                    <div className="w-2 h-2 rounded-full border border-gold/30 absolute"></div>
                    <div className="w-px h-16 bg-gradient-to-b from-gold/0 via-gold/20 to-gold/0 absolute left-1"></div>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden border border-gold/10 bg-black/50">
                    <Image
                      src={property.floor_plan_url}
                      alt="Планировка"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            
              {/* Map section with dark theme */}
              <div className="bg-dark-graphite border border-gold/10 p-8 md:p-10 relative group">
                <h2 className="text-2xl font-serif font-light text-white mb-4 relative inline-block">
                  Расположение
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold luxury-title-underline"></span>
                </h2>
                <div className="w-16 h-px bg-gradient-to-r from-gold/70 to-gold/10 mb-8"></div>
                {/* Luxury corner effect on hover */}
                <div className="absolute top-0 left-0 w-0 h-0 border-t border-l border-gold/0 group-hover:border-gold/30 group-hover:w-8 group-hover:h-8 transition-all duration-700"></div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-gold/0 group-hover:border-gold/30 group-hover:w-8 group-hover:h-8 transition-all duration-700"></div>
                <div className="h-[400px] overflow-hidden border border-gold/10">
                  <YandexMap address={property.address} className="w-full h-full" />
                </div>
                <div className="mt-6 flex items-center gap-2 text-white/80">
                  <MapPin size={18} className="text-gold" />
                  <span>{property.address}</span>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Agent card with luxury styling */}
              <OrnateFrame>
                <div className="bg-dark-graphite border border-gold/10 p-8 sticky top-6 relative overflow-hidden">
                  {/* Luxury diagonal accent */}
                  <div className="absolute -top-9 -right-9 w-18 h-18 border border-gold/10 rounded-full transform rotate-45"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-gold/5 to-transparent opacity-20 pointer-events-none"></div>
                  {/* Small gold dust effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <GoldenDust particleCount={10} startDelay={2000} duration={4000} />
                  </div>
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center border-2 border-gold/30">
                    <span className="text-xl font-serif text-gold">{agent?.name?.charAt(0).toUpperCase() || "А"}</span>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gold/80 mb-2 font-light">Ваш персональный менеджер</div>
                    <div className="text-xl font-serif font-light text-white flex items-center">
                      {agent?.name || "Агент недвижимости"}
                      <span className="ml-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-xs text-gold px-2 py-0.5 rounded-sm border border-gold/20">
                        <Award size={10} className="text-gold" />
                        <span>VIP эксперт</span>
                      </span>
                    </div>
                    {agent?.email && <div className="text-sm text-white/60 mt-1">{agent.email}</div>}
                  </div>
                </div>
                
                <div className="w-full h-px bg-gold/10 mb-8"></div>
                
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-white/70 p-2 transition-all duration-500 hover:bg-black/30 group relative">
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-1 scale-y-0 group-hover:scale-y-100 group-hover:translate-x-0"></div>
                    <Star size={16} className="text-gold relative z-10" />
                    <span className="relative z-10">Специализация: <span className="text-gold/90">элитная недвижимость</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70 p-2 transition-all duration-500 hover:bg-black/30 group relative">
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-1 scale-y-0 group-hover:scale-y-100 group-hover:translate-x-0"></div>
                    <Star size={16} className="text-gold relative z-10" />
                    <span className="relative z-10">Профессиональные <span className="text-gold/90">консультации</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70 p-2 transition-all duration-500 hover:bg-black/30 group relative">
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-1 scale-y-0 group-hover:scale-y-100 group-hover:translate-x-0"></div>
                    <Star size={16} className="text-gold relative z-10" />
                    <span className="relative z-10">Индивидуальный <span className="text-gold/90">подход</span></span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <button className="group relative w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-black 
                    font-medium py-3 px-4 overflow-hidden transition-all duration-300 shadow-[0_4px_12px_rgba(212,175,55,0.3)]">
                    <span className="relative z-10">Позвонить</span>
                    <Phone size={16} className="relative z-10" />
                    <div className="absolute left-0 top-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></div>
                  </button>
                  
                  <a href={`mailto:${agent?.email}`} className="group relative w-full flex items-center justify-center gap-2 border border-gold/50 
                    text-gold hover:border-gold font-medium py-3 px-4 overflow-hidden transition-all duration-300">
                    <span className="relative z-10">Написать письмо</span>
                    <Mail size={16} className="relative z-10" />
                    <div className="absolute left-0 top-0 h-full w-0 bg-gold/10 transition-all duration-300 group-hover:w-full"></div>
                  </a>
                  
                  <button className="group relative w-full flex items-center justify-center gap-2 bg-dark-slate border border-gold/20 
                    text-white hover:border-gold/50 font-medium py-3 px-4 overflow-hidden transition-all duration-300 relative">
                    {/* Subtle animated glow effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -inset-[100%] w-[300%] h-[300%] bg-gradient-conic from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 animate-spin-slow transform -rotate-45 pointer-events-none"></div>
                    </div>
                    <span className="relative z-10">Telegram</span>
                    <MessageSquare size={16} className="relative z-10" />
                    <div className="absolute left-0 top-0 h-full w-0 bg-gold/10 transition-all duration-300 group-hover:w-full"></div>
                  </button>
                </div>
                
                <div className="text-sm text-white/40 text-center">
                  <button className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
                    <Copy size={14} />
                    <span>Скопировать контакты</span>
                  </button>
                </div>
                </div>
              </OrnateFrame>
              
              {/* Back to collection with animated button */}
              <Link 
                href={`/share/v2/${collection?.share_id}`}
                className="group relative inline-flex items-center gap-2 bg-dark-graphite border border-gold/20 hover:border-gold text-white py-3 px-6 overflow-hidden transition-all duration-300 w-full justify-between"
              >
                <span className="relative z-10">Вернуться к коллекции</span>
                <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1" />
                <div className="absolute right-0 top-0 h-full w-0 bg-gold/10 transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer with luxury styling */}
      <footer className="bg-black py-16 border-t border-gold/10 relative overflow-hidden luxury-footer">
        {/* Background elements */}
        <div className="absolute inset-0 bg-pattern-grid opacity-5"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
        
        {/* Glowing orbs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-radial from-gold/10 to-transparent blur-2xl opacity-30 luxury-footer-orb"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-gradient-radial from-gold/5 to-transparent blur-2xl opacity-20 luxury-footer-orb-slow"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <Link href="/" className="text-2xl font-serif font-light text-white mb-1 luxury-brand hover:text-gold transition-all duration-500">
                <span className="relative inline-block">
                  РиелторПро
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-gold via-gold/70 to-transparent luxury-brand-underline"></span>
                </span>
              </Link>
              <div className="w-10 h-px bg-gradient-to-r from-gold/70 to-gold/10 mb-3 luxury-divider"></div>
              <p className="text-white/40 text-sm luxury-copyright">
                &copy; {new Date().getFullYear()} 
                <span className="relative inline-block">
                  Эксклюзивная платформа для риелторов
                </span>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
              {/* Footer links removed as requested */}
            </div>
          </div>
          
          {/* Luxury signature element */}
          <div className="mt-12 flex justify-center">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 border border-gold/20 rounded-full transform rotate-45 luxury-signature-rotate"></div>
              <div className="absolute inset-2 border border-gold/10 rounded-full transform -rotate-45 luxury-signature-counter-rotate"></div>
              <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-gold/50 rounded-full luxury-signature-dot"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 
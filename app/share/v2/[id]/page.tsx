import { notFound } from "next/navigation"
import { getServerClient } from "@/lib/supabase"
import Image from "next/image"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import { VersionToggle } from "../../components/version-toggle"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import "@/styles/luxury-experience.css"
import { LuxuryEffects } from "../components/luxury-effects"
import { FogTextEffect } from "../components/fog-text-effect"
import { SubscriptionChecker } from "../../components/subscription-checker"

interface SharePageProps {
  params: {
    id: string
  }
}

export default async function SharePageV2({ params }: SharePageProps) {
  const shareId = params.id
  const supabase = getServerClient()

  // Find collection by share_id
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("id, name, user_id")
    .eq("share_id", shareId)
    .single()

  if (collectionError || !collection) {
    notFound()
  }

  // Get agent info
  const { data: agent } = await supabase.from("users").select("name, email").eq("id", collection.user_id).single()

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
      residential_complex,
      property_images (id, image_url)
    `)
    .eq("collection_id", collection.id)
    .order("created_at", { ascending: false })

  if (propertiesError) {
    notFound()
  }

  const propertyTypeLabels: Record<string, string> = {
    apartment: "Квартира",
    house: "Дом",
    land: "Земельный участок",
  }

  return (
    <div className={`min-h-screen bg-dark-charcoal text-white font-sans overflow-hidden luxury-experience-wrapper`}>
      {/* Real-time subscription checker */}
      <SubscriptionChecker collectionId={collection.id} userId={collection.user_id} />
      
      {/* Client-side luxury effects */}
      <LuxuryEffects />
      {/* Version Toggle */}
      <VersionToggle currentVersion="v2" shareId={shareId} variant="dark" />
      
      {/* Hero Section with Full-Height Background */}
      <div className="relative h-screen w-full overflow-hidden hero-parallax">
        {/* Background with darker overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black"></div>
          <Image 
            src="/images/background-dark.png" 
            alt="Luxury Real Estate" 
            fill 
            className="object-cover transform scale-110 filter contrast-125 hero-parallax-image blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-pattern-overlay"></div>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70 opacity-90"></div>
          <div className="absolute inset-0 luxury-noise-texture"></div>
        </div>
        
        {/* Centered Hero Content with Animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div className="opacity-0 animate-fade-in-up text-white mb-6 flex flex-col items-center">
            <FogTextEffect 
              text={agent?.name || "Real Estate Agency"} 
              className="text-gold block mb-6 text-5xl md:text-7xl lg:text-8xl" 
              delay={300} 
              style={{ fontFamily: 'Kudry, serif', fontWeight: 'normal' }}
              interactionRadius={180}
            />
            <FogTextEffect 
              text="ПРЕДСТАВЛЯЕТ" 
              className="font-light block text-3xl md:text-4xl lg:text-5xl" 
              delay={500}
              style={{ fontFamily: 'NT Somic, sans-serif' }}
              interactionRadius={180}
            />
          </div>
          
          {/* Decorative circle with animations */}
          <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] mb-16 opacity-0 animate-fade-in-up luxury-orbital-system" style={{animationDelay: '400ms'}}>
            <div className="absolute inset-0 rounded-full border border-gold/30 orbital-circle orbital-pulse-slow"></div>
            <div className="absolute inset-5 rounded-full border border-gold/20 orbital-circle orbital-rotate"></div>
            <div className="absolute inset-10 rounded-full border border-gold/10 orbital-circle orbital-counter-rotate"></div>
            <div className="absolute inset-20 rounded-full border border-gold/5 orbital-circle" style={{animation: "orbitalBreatheSlow 15s infinite alternate-reverse var(--animation-timing)"}}></div>
            
            {/* Orbital particles - more of them with different sizes and speeds - spread around the circle */}
            <div className="absolute w-3 h-3 rounded-full bg-gold/50 top-0 left-1/2 transform -translate-x-1/2 orbital-particle"></div>
            <div className="absolute w-2 h-2 rounded-full bg-gold/70 top-1/6 right-0 orbital-particle-slow"></div>
            <div className="absolute w-4 h-4 rounded-full bg-gold/40 bottom-0 left-1/4 orbital-particle-reverse"></div>
            <div className="absolute w-2.5 h-2.5 rounded-full bg-gold/50 top-1/5 left-0 orbital-particle-medium"></div>
            
            {/* Additional particles - positioned more evenly */}
            <div className="absolute w-1.5 h-1.5 rounded-full bg-gold/60 bottom-1/6 right-0 orbital-particle-extra-slow"></div>
            <div className="absolute w-1 h-1 rounded-full bg-gold/80 bottom-1/4 left-1/6 orbital-particle-fast"></div>
            <div className="absolute w-3.5 h-3.5 rounded-full bg-gold/30 top-1/3 right-1/6 orbital-particle-reverse-slow"></div>
            <div className="absolute w-2 h-2 rounded-full bg-gold/65 bottom-1/3 right-1/4 orbital-particle-reverse-fast"></div>
            <div className="absolute w-1.5 h-1.5 rounded-full bg-gold/70 top-2/3 right-1/5 orbital-particle-fast"></div>
            <div className="absolute w-2.5 h-2.5 rounded-full bg-gold/50 right-1/2 bottom-1/6 transform translate-x-1/2 orbital-particle-medium"></div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center opacity-0 animate-fade-in-up luxury-scroll-indicator" style={{animationDelay: '800ms'}}>
            <p className="uppercase tracking-widest text-xs mb-4 text-white/70 scroll-text">SCROLL DOWN</p>
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gold/20 filter blur-sm scroll-glow"></div>
              <ChevronDown className="h-6 w-6 text-gold animate-bounce relative" />
            </div>
          </div>
        </div>
      </div>

      {/* Luxurious Design Description */}
      <div className="relative bg-dark-charcoal py-24 overflow-hidden luxury-description" data-scroll-section>
        {/* Animated background elements */}
        <div className="absolute left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gold/10 to-gold/1 blur-3xl -translate-x-1/2 -translate-y-1/2 luxury-orb luxury-float"></div>
        <div className="absolute right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-aqua/10 to-aqua/1 blur-3xl translate-x-1/2 translate-y-1/2 luxury-orb luxury-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gold/5 luxury-subtle-rotate"></div>
        
        {/* Light beams */}
        <div className="absolute top-0 left-1/4 w-px h-[30vh] bg-gradient-to-b from-gold/0 via-gold/20 to-gold/0 luxury-light-beam"></div>
        <div className="absolute top-0 right-1/3 w-px h-[40vh] bg-gradient-to-b from-gold/0 via-gold/15 to-gold/0 luxury-light-beam-slow"></div>
        
        {/* Content */}
        <div className="container mx-auto px-8 max-w-5xl relative z-10">
          <div className="mx-auto max-w-3xl">
            <div className="luxury-quote-mark">❝</div>
            <div className="text-lg leading-relaxed text-white/80 animate-fade-in-up luxury-text-revealer">
              <span className="block reveal-text" style={{fontFamily: 'NT Somic, sans-serif'}}>
                Роскошная отделка и изысканные детали делают каждую резиденцию уникальным отражением вашего выбора.
              </span>
              <span className="block reveal-text mt-5" style={{fontFamily: 'NT Somic, sans-serif'}}>
                Вдохновлённые видением <span className="text-gold luxury-highlight relative inline-block group">
                  {/* Rose image without the dark overlay */}
                  <span 
                    className="absolute -inset-x-16 -inset-y-14 pointer-events-none transition-all duration-700 ease-out"
                    style={{
                      zIndex: -1,
                    }}
                  >
                    <span 
                      className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-90"
                      style={{
                        backgroundImage: 'url("/images/rose.png")',
                        backgroundSize: '250%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    ></span>
                  </span>
                  {agent?.name || "Real Estate Agency"}
                </span>, каждый элемент пространства создан с особым вниманием к деталям, чтобы воплотить элегантность и стиль, превосходящие обычные представления о комфорте.
              </span>
            </div>
            <div className="w-full flex justify-end mt-10">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent luxury-fade-in"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modern Photo Gallery of Properties */}
      <div className="relative bg-black py-24 luxury-gallery-section" data-scroll-section>
        {/* Rose background with direct image element - now always visible */}
        <div 
          className="absolute inset-0 mix-blend-luminosity pointer-events-none luxury-rose-background"
          style={{
            backgroundImage: "url('/images/bigrose.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(3.5) contrast(1.5) sepia(0.3)",
            zIndex: 1
          }}
        ></div>
        {/* Fade overlay - this will change opacity to reveal/hide the background */}
        <div className="absolute inset-0 bg-black transition-opacity duration-1000 ease-out luxury-fade-overlay" style={{ zIndex: 2 }}></div>
        
        {/* Luxury background elements */}
        <div className="absolute inset-0 overflow-hidden luxury-bg-grid">
          <div className="absolute inset-0 opacity-10 luxury-grid-pattern"></div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-70"></div>
        <div className="absolute top-24 left-10 w-20 h-20 rounded-full bg-gradient-radial from-gold/20 to-transparent blur-xl luxury-pulse-slow"></div>
        <div className="absolute bottom-24 right-10 w-16 h-16 rounded-full bg-gradient-radial from-gold/15 to-transparent blur-xl luxury-pulse-slow-2"></div>
        
        <div className="container mx-auto px-8 relative z-10">
          {/* Section content with semi-transparent background for readability */}
          <div className="relative z-10 p-6 bg-black bg-opacity-60 backdrop-blur-sm rounded-sm border border-gold/10">
            <div className="absolute -left-4 top-0 w-1 h-20 bg-gradient-to-b from-transparent via-gold/30 to-transparent luxury-header-line"></div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-6 animate-fade-in-up luxury-heading">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark luxury-gradient-text">PREMIUM</span> 
              <span className="relative inline-block">COLLECTION</span>
            </h2>
            
            <div className="w-24 h-px bg-gradient-to-r from-gold/70 to-gold/20 mb-8 animate-fade-in-up luxury-divider" style={{animationDelay: '100ms'}}></div>
            
            <p className="text-white/60 max-w-2xl animate-fade-in-up luxury-description-text" style={{animationDelay: '200ms'}}>
              {collection.name} представляет коллекцию элитной недвижимости, созданную для истинных ценителей роскоши и комфорта.
            </p>
          </div>
          
          {properties.length === 0 ? (
            <div className="py-24 text-center animate-fade-in-up">
              <div className="w-20 h-20 mx-auto border border-gold/20 rounded-full flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-gold/10 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-serif text-white mb-4">В этой коллекции пока нет объектов</h3>
              <p className="text-white/60 max-w-md mx-auto">
                Агент ещё не добавил объекты недвижимости в эту коллекцию. Пожалуйста, свяжитесь с агентом для получения дополнительной информации.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 luxury-grid relative" id="propertyCardsContainer">
              {properties.map((property: any, index: number) => (
                <div 
                  key={property.id} 
                  className="group relative overflow-hidden bg-dark-graphite border border-gold/10 hover:border-gold/30 transition-all duration-700 animate-fade-in-up luxury-property-card"
                  style={{ animationDelay: `${index * 150}ms`, zIndex: `${properties.length - index}` }}
                  data-index={index}
                >
                  {/* Luxury interior pattern - hidden by default */}
                  <div className="luxury-interior-pattern absolute inset-0 opacity-0 pointer-events-none z-[-1] transition-opacity duration-700">
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'44\' height=\'44\' viewBox=\'0 0 44 44\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0h22v22H0V0zm22 22h22v22H22V22z\' /%3E%3C/g%3E%3C/svg%3E")' }}></div>
                  </div>
                  
                  {/* Gold border shimmer effect */}
                  <div className="absolute inset-0 border border-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-gold/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out"></div>
                  </div>
                  {/* Property Image with Overlay */}
                  <div className="aspect-[4/3] overflow-hidden relative luxury-property-image">
                    {property.property_images && property.property_images.length > 0 ? (
                      <>
                        <div className="property-image-wrapper">
                        <Image
                        src={property.property_images[0].image_url}
                        alt={property.address}
                        fill
                        className="object-cover transition-transform duration-1200 filter saturate-[1.05] contrast-[1.02] property-image"
                        style={{ willChange: 'transform' }}
                        />
                          {/* Luxury gold gradient overlay (very subtle) */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-700 mix-blend-overlay"></div>
                        </div>
                        {/* Image grain texture */}
                        <div className="absolute inset-0 bg-grain-texture opacity-10 mix-blend-overlay"></div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-dark-slate flex items-center justify-center">
                        <p className="text-white/40">Нет изображения</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-75 transition-opacity duration-700 luxury-overlay"></div>
                  </div>
                  
                  {/* Property Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md text-xs font-medium text-white border border-gold/20 luxury-badge">
                    <span className="relative inline-block">
                      <span className="relative z-10">{propertyTypeLabels[property.property_type] || 'Объект'}</span>
                      <span className="absolute inset-0 bg-gold/10 -m-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                    </span>
                  </div>
                  
                  {/* Corner accent - removed bottom-left corner accent */}
                  <div className="absolute top-0 right-0 w-10 h-10 luxury-corner-accent">
                    <div className="absolute top-0 right-0 w-px h-6 bg-gradient-to-b from-gold/60 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-700 delay-100 origin-top"></div>
                    <div className="absolute top-0 right-0 h-px w-6 bg-gradient-to-l from-gold/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100 origin-right"></div>
                  </div>
                  
                  {/* Property Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-0 group-hover:translate-y-0 transition-all duration-700 luxury-property-info">
                    {/* Premium texture overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.03)_0%,transparent_70%)]">
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-serif mb-2 leading-tight luxury-property-title">
                        {property.residential_complex && <span className="font-bold mr-1">{property.residential_complex}, </span>}
                        {property.address}
                      </h3>
                      <div className="w-12 h-px bg-gradient-to-r from-gold via-gold/70 to-transparent mb-3 transition-all duration-700 group-hover:w-24 luxury-property-divider"></div>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4 luxury-property-details">
                      <div className="luxury-detail-item">
                        <p className="text-xs text-white/60 luxury-detail-label">Цена</p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-light font-medium luxury-price">{formatPrice(property.price)}</p>
                      </div>
                      <div className="luxury-detail-item">
                        <p className="text-xs text-white/60 luxury-detail-label">Площадь</p>
                        <p className="text-white luxury-detail-value">{property.area} кв.м</p>
                      </div>
                      {property.rooms !== null && (
                        <div className="luxury-detail-item">
                          <p className="text-xs text-white/60 luxury-detail-label">Комнаты</p>
                          <p className="text-white luxury-detail-value">{property.rooms}</p>
                        </div>
                      )}
                    </div>
                    
                    </div>
                    
                    <Link 
                      href={`/share/v2/property/${property.id}`}
                      className="mt-2 inline-flex items-center text-gold text-sm opacity-0 group-hover:opacity-100 transition-all duration-700 luxury-link relative z-10"
                    >
                      {/* Removed gold shimmer effect */}
                      
                      <span className="relative z-10">Подробнее</span>
                      <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      {/* Removed gold underline */}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* РиелторПро App Section */}
      <div className="relative bg-gradient-to-br from-dark-charcoal to-navy-dark py-24 overflow-hidden luxury-app-section" data-scroll-section>
        {/* Top border light beam */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent luxury-border-beam"></div>
        
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.1)_0%,transparent_50%)] luxury-radial-glow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(24,90,219,0.1)_0%,transparent_60%)] blur-2xl luxury-pulse-slow"></div>
        </div>
        
        {/* Floating particle effects */}
        <div className="absolute w-2 h-2 rounded-full bg-gold/50 blur-sm top-1/4 left-1/4 luxury-float-particle"></div>
        <div className="absolute w-3 h-3 rounded-full bg-gold/30 blur-sm bottom-1/3 right-1/3 luxury-float-particle-slow"></div>
        <div className="absolute w-1.5 h-1.5 rounded-full bg-gold/70 blur-sm top-1/3 right-1/4 luxury-float-particle-reverse"></div>
        
        {/* Content */}
        <div className="container mx-auto px-8 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-12 md:mb-0 relative">
            {/* Title with animated effects */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 animate-fade-in-up luxury-title-container">
              <span className="inline-block relative luxury-app-title">РиелторПро</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark luxury-app-gradient">Приложение</span>
              <div className="absolute -left-4 top-6 w-8 h-8 rounded-full border border-gold/20 opacity-0 luxury-circle-accent"></div>
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-gold/80 to-gold/10 mb-8 animate-fade-in-up luxury-title-underline" style={{animationDelay: '100ms'}}></div>
            
            {/* Code grid pattern */}
            <div className="absolute top-1/2 -right-4 transform rotate-45 opacity-10 luxury-code-pattern">
              <div className="grid grid-cols-4 gap-1">
                {Array.from({length: 16}).map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${i % 3 === 0 ? 'bg-gold/40' : 'bg-gold/20'}`}></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-12 animate-fade-in-up luxury-text-content" style={{animationDelay: '200ms'}}>
            {/* Text content with better styling */}
            <p className="text-white/90 leading-relaxed mb-6 text-lg luxury-app-text">
              Наше приложение РиелторПро создано для того, чтобы революционизировать взаимодействие между риелторами и клиентами. Риелторы могут создавать индивидуальные подборки объектов недвижимости, адаптированные под требования конкретных клиентов, а клиенты получают удобный инструмент для поиска подходящих риелторов и объектов, отвечающих их потребностям и желаниям.
            </p>
            <div className="mt-8">
              <button className="group relative inline-flex items-center gap-2 bg-transparent border border-gold/30 hover:border-gold text-gold py-3 px-8 overflow-hidden transition-all duration-500 luxury-button">
                <span className="relative z-10 tracking-wide">СКОРО В РАЗРАБОТКЕ</span>
                <ArrowRight size={16} className="relative z-10 transition-transform duration-500 group-hover:translate-x-2" />
                {/* Enhanced hover effects */}
                <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-gold/5 to-gold/20 transition-all duration-500 ease-out group-hover:w-full luxury-button-fill"></div>
                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t border-r border-gold/0 group-hover:border-gold/60 transition-all duration-500 delay-100 group-hover:w-3 group-hover:h-3"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0 border-b border-l border-gold/0 group-hover:border-gold/60 transition-all duration-500 delay-100 group-hover:w-3 group-hover:h-3"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_50%)] blur-xl animate-pulse"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Agent Contact */}
      <div className="bg-black py-20 relative overflow-hidden luxury-contact-section" data-scroll-section>
        {/* Background patterns and effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.05)_0%,transparent_50%)] opacity-70"></div>
        <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-gold/5 to-transparent opacity-30 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full border border-gold/10 luxury-slow-spin"></div>
        
        {/* Content container */}
        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border border-gold/10 p-8 bg-black/50 backdrop-blur-sm rounded-sm luxury-contact-card" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(212,175,55,0.05)' }}>
            {/* Agent Information */}
            <div className="relative">
              {/* Decorative accent */}
              <div className="absolute -left-4 top-0 h-full w-px bg-gradient-to-b from-gold/0 via-gold/30 to-gold/0 luxury-vertical-accent"></div>
              
              <p className="text-white/60 text-sm uppercase tracking-wider mb-2 luxury-label">
                <span className="relative inline-block">
                  ПРЕДСТАВИТЕЛЬ
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gold/40 luxury-label-underline"></span>
                </span>
              </p>
              
              <h3 className="text-xl md:text-2xl font-serif text-white mb-1 luxury-agent-name">{agent?.name || "Агент недвижимости"}</h3>
              
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-light luxury-agent-email">
                {agent?.email}
              </p>
              
              {/* Gold decorator dot */}
              <div className="absolute -left-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-gold/80 to-gold/40 luxury-gold-dot"></div>
            </div>
            
            {/* Contact Button with luxury effects */}
            <button className="group relative inline-flex items-center gap-2 bg-transparent border border-gold/30 hover:border-gold text-gold py-3 px-8 overflow-hidden transition-all duration-500 luxury-contact-button">
              <span className="relative z-10 tracking-wider font-light">СВЯЗАТЬСЯ</span>
              <ArrowRight size={16} className="relative z-10 transition-all duration-500 group-hover:translate-x-1.5" />
              
              {/* Background hover effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 group-hover:opacity-100 transition-all duration-700 luxury-btn-bg"></div>
              
              {/* Animated borders */}
              <div className="absolute top-0 left-0 w-0 group-hover:w-full h-px bg-gold/50 transition-all duration-700 delay-75"></div>
              <div className="absolute bottom-0 right-0 w-0 group-hover:w-full h-px bg-gold/50 transition-all duration-700 delay-75"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                <div className="absolute inset-0 bg-gold/5 filter blur-md"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-charcoal py-16 border-t border-gold/10 relative overflow-hidden luxury-footer">
        {/* Background elements */}
        <div className="absolute inset-0 bg-pattern-grid opacity-5"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
        
        {/* Glowing orbs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-radial from-gold/10 to-transparent blur-2xl opacity-30 luxury-footer-orb"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-gradient-radial from-gold/5 to-transparent blur-2xl opacity-20 luxury-footer-orb-slow"></div>
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <Link href="/" className="text-2xl font-serif text-white mb-1 luxury-brand hover:text-gold transition-all duration-500">
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
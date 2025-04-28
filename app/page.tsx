"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ThemeToggle } from "@/components/ui/theme/theme-toggle"
import { ThemeImage } from "@/components/ui/theme/theme-image"
import { GallerySlider } from "@/components/ui/gallery-slider"
import "../styles/hero-section.css"
import { Suspense } from "react"
import { UserNavButton } from "./user-nav-button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen theme-transition">
      {/* Navbar with transparent background */}
      <header className="absolute top-0 left-0 right-0 z-10 py-6">
        <div className="container-luxury flex justify-between items-center">
          <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-serif font-medium tracking-tight text-white dark:text-moonstone text-shadow-md theme-transition">
          РиелторПро
          </h1>
          </Link>
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-white dark:text-moonstone hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 font-medium theme-transition">
                Возможности
              </Link>
              <Link href="#about" className="text-white dark:text-moonstone hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 font-medium theme-transition">
                О платформе
              </Link>
              <Link href="#contact" className="text-white dark:text-moonstone hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 font-medium theme-transition">
                Контакты
              </Link>
            </nav>
            <div className="flex space-x-4 items-center">
              <ThemeToggle />
              <Suspense fallback={null}>
                <UserNavButton />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with full-screen image */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background image with enhanced texture overlay */}
          <div className="absolute inset-0 z-0">
            {/* Premium overlay with stronger gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30 dark:from-black/70 dark:via-black/70 dark:to-black/70 z-10 theme-transition"></div>
            {/* Gold accent vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-luxury-gold/0 via-luxury-gold/80 to-luxury-gold/0 dark:from-luxury-royalBlue/0 dark:via-luxury-royalBlue/80 dark:to-luxury-royalBlue/0 z-20 shadow-gold-glow dark:shadow-royal-glow theme-transition"></div>
            {/* Enhanced texture overlay */}
            <div className="absolute inset-0 bg-[url('/images/luxury-pattern.png')] bg-repeat opacity-30 mix-blend-overlay z-20 pointer-events-none theme-transition"></div>
            <ThemeImage 
              lightSrc="/images/house1.png"
              darkSrc="/images/backnight.png"
              alt="Современная недвижимость" 
              fill 
              className="object-cover dark:hero-backnight-image filter contrast-[1.1] saturate-[1.1]"
              brightnessFactor={1.5}
              priority
              sizes="100vw"
              fetchPriority="high"
            />
          </div>
          
          {/* Hero content */}
          <div className="container-luxury relative z-20 mt-16 animate-fade-in-up">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium mb-10 text-white dark:text-moonstone leading-tight text-shadow-md relative z-10 theme-transition">
                {/* Premium gold text effect for dark mode */}
                <span className="relative inline-block">
                  <span className="absolute top-0 left-0 w-full h-full text-white dark:text-luxury-royalBlue blur-[1px] opacity-60 dark:opacity-40 z-0">Превосходный опыт для ваших клиентов</span>
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-luxury-gold via-white to-luxury-gold dark:from-luxury-royalBlue dark:via-white dark:to-luxury-royalBlue">Превосходный опыт для ваших клиентов</span>
                </span>
                {/* Gold accent line below heading with animation */}
                <span className="absolute -bottom-5 left-0 h-1 bg-gradient-to-r from-luxury-gold/0 via-luxury-gold to-luxury-gold/0 dark:from-luxury-royalBlue/0 dark:via-luxury-royalBlue dark:to-luxury-royalBlue/0 rounded-full w-1/2 shadow-[0_0_15px_5px_rgba(212,175,55,0.3)] dark:shadow-[0_0_15px_5px_rgba(10,36,114,0.3)] animate-[width_3s_ease-in-out_infinite_alternate] theme-transition"></span>
              </h2>
              <p className="text-xl md:text-2xl text-white/90 dark:text-moonstone/90 mb-10 max-w-2xl leading-relaxed theme-transition">
                Создавайте элегантные подборки объектов недвижимости и делитесь ими с клиентами. Простой и профессиональный способ презентации недвижимости.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link href="/register">
                  <div className="flex flex-col items-center">
                    <Button variant="luxury" size="lg" animation="scale" className="w-full sm:w-auto bg-luxury-gold dark:bg-luxury-royalBlue text-luxury-black dark:text-white hover:bg-luxury-goldMuted dark:hover:bg-luxury-royalBlueMuted theme-transition py-7 px-10 text-lg">
                      Начать бесплатно
                    </Button>
                    <span className="text-xs mt-2 text-white/80 dark:text-moonstone/80 font-medium tracking-wide" style={{letterSpacing: '0.02em'}}>
                      Пробный период на 14 дней
                    </span>
                  </div>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" animation="scale" className="w-full sm:w-auto border-2 border-white/40 dark:border-moonstone/40 backdrop-blur-sm text-white dark:text-moonstone hover:bg-white/10 dark:hover:bg-moonstone/10 hover:border-white/90 dark:hover:border-moonstone/90 hover:text-white dark:hover:text-white transition-all duration-300 theme-transition relative overflow-hidden group py-7 px-10 text-lg after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-0 after:bg-white dark:after:bg-moonstone after:transition-all after:duration-700 hover:after:w-full">
                    <span className="relative z-10">Узнать больше</span>
                    <span className="absolute inset-0 bg-white/0 dark:bg-moonstone/0 group-hover:bg-white/5 dark:group-hover:bg-moonstone/5 transition-all duration-500 z-0"></span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Scroll down indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-dark-charcoal theme-transition relative">
          {/* Enhanced luxury pattern overlay with material effect */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-repeat pointer-events-none z-0" 
              style={{backgroundImage: "url('/images/pattern.png')", backgroundSize: "100px"}}></div>
          {/* Add subtle texture for material richness */}
          <div className="absolute inset-0 opacity-20 dark:opacity-30 bg-[url('/images/texture-light.png')] dark:bg-[url('/images/texture-dark.png')] bg-repeat mix-blend-overlay pointer-events-none z-0 theme-transition"></div>
              
          <div className="container-luxury relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-luxury-black dark:text-white theme-transition">Возможности для профессионалов недвижимости</h2>
              <div className="relative w-48 h-[3px] mx-auto mb-6 theme-transition overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold via-luxury-gold to-luxury-gold/20 dark:from-luxury-royalBlue dark:via-luxury-royalBlue dark:to-luxury-royalBlue/20 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.7)] dark:shadow-[0_0_10px_rgba(24,90,219,0.7)] theme-transition"></div>
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 dark:bg-white/30 blur-[2px] animate-[shine_3s_ease-in-out_infinite] theme-transition"></div>
              </div>
              <p className="text-lg text-luxury-black/80 dark:text-white/90 max-w-2xl mx-auto theme-transition">
              Наша платформа создана для того, чтобы помочь вам выстраивать более глубокие и персонализированные отношения с клиентами.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Collection Organization Card */}
              <div className="group p-8 rounded-sm bg-white dark:bg-dark-graphite shadow-subtle dark:shadow-elegant-dark transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-4 animate-fade-in-up theme-transition relative border-2 border-gray-100 dark:border-dark-slate dark:hover:border-luxury-royalBlue/30 hover:border-luxury-gold/30 before:absolute before:inset-[3px] before:rounded-sm before:border before:border-transparent before:z-10 before:transition-all before:duration-500 hover:before:border-luxury-gold/20 dark:hover:before:border-luxury-royalBlue/20 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-luxury-gold/70 dark:after:bg-luxury-royalBlue/70 group-hover:after:w-[80%] after:transition-all after:duration-500">
                <div className="w-16 h-16 bg-luxury-gold/15 dark:bg-luxury-royalBlue/20 rounded-sm flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-luxury-gold/30 dark:group-hover:bg-luxury-royalBlue/40 ring-1 ring-luxury-gold/30 dark:ring-luxury-royalBlue/40 shadow-sm group-hover:shadow-gold-glow dark:group-hover:shadow-[0_0_15px_rgba(24,90,219,0.5)] theme-transition before:absolute before:inset-0 before:rounded-sm before:bg-gradient-to-br before:from-luxury-gold/10 before:to-transparent dark:before:from-luxury-royalBlue/10 dark:before:to-transparent before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-500 relative overflow-hidden">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5M19 11C19.5523 11 20 11.4477 20 12V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V12C4 11.4477 4.44772 11 5 11M19 11V9C19 8.44772 18.5523 8 18 8M5 11V9C5 8.44772 5.44772 8 6 8M18 8V7C18 6.44772 17.5523 6 17 6H7C6.44772 6 6 6.44772 6 7V8M18 8H6" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 transition-all duration-300 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue text-luxury-black dark:text-white theme-transition">Организация подборок</h3>
                <p className="text-luxury-black/80 dark:text-white/90 leading-relaxed theme-transition">Создавайте отдельные подборки для каждого клиента, группируйте объекты по локации, цене или типу недвижимости.</p>
              </div>
              
              {/* Instant Exchange Card */}
              <div className="group p-8 rounded-sm bg-white dark:bg-dark-graphite shadow-subtle dark:shadow-elegant-dark transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-4 animate-fade-in-up theme-transition relative border-2 border-gray-100 dark:border-dark-slate dark:hover:border-luxury-royalBlue/30 hover:border-luxury-gold/30 before:absolute before:inset-[3px] before:rounded-sm before:border before:border-transparent before:z-10 before:transition-all before:duration-500 hover:before:border-luxury-gold/20 dark:hover:before:border-luxury-royalBlue/20 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-luxury-gold/70 dark:after:bg-luxury-royalBlue/70 group-hover:after:w-[80%] after:transition-all after:duration-500" style={{animationDelay: '100ms'}}>
                <div className="w-16 h-16 bg-luxury-gold/15 dark:bg-luxury-royalBlue/20 rounded-sm flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-luxury-gold/30 dark:group-hover:bg-luxury-royalBlue/40 ring-1 ring-luxury-gold/30 dark:ring-luxury-royalBlue/40 shadow-sm group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] dark:group-hover:shadow-[0_0_15px_rgba(24,90,219,0.5)] theme-transition relative overflow-hidden">
                  <span className="absolute -top-0 -right-0 w-6 h-6 border-t-2 border-r-2 border-luxury-gold/0 dark:border-luxury-royalBlue/0 group-hover:border-luxury-gold/80 dark:group-hover:border-luxury-royalBlue/80 transition-all duration-700"></span>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.68439 10.6578L5.32155 7.29496M5.32155 7.29496L8.68439 3.93213M5.32155 7.29496L16.3947 7.29496C18.6118 7.29496 20.4105 9.09371 20.4105 11.3108C20.4105 13.5279 18.6118 15.3266 16.3947 15.3266L10.9474 15.3266M15.3156 20.0683L18.6785 16.7055M18.6785 16.7055L15.3156 13.3426M18.6785 16.7055L7.60533 16.7055C5.38818 16.7055 3.58943 14.9068 3.58943 12.6897C3.58943 10.4725 5.38818 8.67377 7.60533 8.67377L13.0527 8.67377" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 transition-all duration-300 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue text-luxury-black dark:text-white theme-transition">Мгновенный обмен</h3>
                <p className="text-luxury-black/80 dark:text-white/90 leading-relaxed theme-transition">Генерируйте уникальные ссылки для обмена подборками с клиентами. Одним нажатием отправьте подборку недвижимости.</p>
              </div>
              
              {/* Real-time Management Card */}
              <div className="group p-8 rounded-sm bg-white dark:bg-dark-graphite shadow-subtle dark:shadow-elegant-dark transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-4 animate-fade-in-up theme-transition relative border-2 border-gray-100 dark:border-dark-slate dark:hover:border-luxury-royalBlue/30 hover:border-luxury-gold/30 before:absolute before:inset-[3px] before:rounded-sm before:border before:border-transparent before:z-10 before:transition-all before:duration-500 hover:before:border-luxury-gold/20 dark:hover:before:border-luxury-royalBlue/20 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-luxury-gold/70 dark:after:bg-luxury-royalBlue/70 group-hover:after:w-[80%] after:transition-all after:duration-500" style={{animationDelay: '200ms'}}>
                <div className="w-16 h-16 bg-luxury-gold/15 dark:bg-luxury-royalBlue/20 rounded-sm flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-luxury-gold/30 dark:group-hover:bg-luxury-royalBlue/40 ring-1 ring-luxury-gold/30 dark:ring-luxury-royalBlue/40 shadow-sm group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] dark:group-hover:shadow-[0_0_15px_rgba(24,90,219,0.5)] theme-transition relative overflow-hidden">
                  <span className="absolute -bottom-0 -left-0 w-6 h-6 border-b-2 border-l-2 border-luxury-gold/0 dark:border-luxury-royalBlue/0 group-hover:border-luxury-gold/80 dark:group-hover:border-luxury-royalBlue/80 transition-all duration-700"></span>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 transition-all duration-300 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue text-luxury-black dark:text-white theme-transition">Управление в реальном времени</h3>
                <p className="text-luxury-black/80 dark:text-white/90 leading-relaxed theme-transition">Редактируйте и обновляйте информацию об объектах в реальном времени. Клиент всегда видит актуальную информацию.</p>
              </div>
            </div>
          </div>
          
          {/* Subtle luxury accent element */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-luxury-gold/0 via-luxury-gold/30 to-luxury-gold/0 dark:from-luxury-royalBlue/0 dark:via-luxury-royalBlue/30 dark:to-luxury-royalBlue/0 theme-transition"></div>
        </section>

        {/* Property Showcase Section */}
        <section className="py-20 bg-white dark:bg-dark-charcoal overflow-hidden theme-transition">
          <div className="container-luxury">
            <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-luxury-black dark:text-white theme-transition">Примеры объектов недвижимости</h2>
            <div className="w-24 h-1 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mb-6 theme-transition"></div>
            <p className="text-lg text-luxury-black/70 dark:text-white/80 max-w-2xl mx-auto theme-transition">
            Представляйте свои объекты недвижимости в выгодном свете с нашей платформой.
            </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="group rounded-sm overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)] dark:hover:shadow-[0_20px_50px_rgba(24,90,219,0.5)] hover:translate-y-[-8px] transition-all duration-700 animate-fade-in-up theme-transition relative">
                  {/* Luxury corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-luxury-gold/0 dark:border-luxury-royalBlue/0 group-hover:border-luxury-gold/80 dark:group-hover:border-luxury-royalBlue/80 transition-all duration-700 z-20"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-luxury-gold/0 dark:border-luxury-royalBlue/0 group-hover:border-luxury-gold/80 dark:group-hover:border-luxury-royalBlue/80 transition-all duration-700 z-20"></div>
                <div className="relative h-64 overflow-hidden property-image">
                  <ThemeImage 
                    lightSrc="/images/house3.png"
                    darkSrc="/images/flat1.png"
                    alt="Современный дом" 
                    fill 
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                  />
                </div>
                <div className="p-6 bg-white dark:bg-dark-graphite theme-transition border-t border-gray-100 dark:border-dark-slate group-hover:border-luxury-gold/20 dark:group-hover:border-luxury-royalBlue/20 relative">
                  {/* Luxury indicator bar */}
                  <div className="absolute top-0 left-0 w-0 h-[3px] bg-luxury-gold dark:bg-luxury-royalBlue group-hover:w-full transition-all duration-700 shadow-[0_0_8px_rgba(212,175,55,0.7)] dark:shadow-[0_0_8px_rgba(24,90,219,0.7)]"></div>
                  <h3 className="text-xl font-semibold mb-2 text-luxury-black dark:text-white theme-transition transition-all duration-300 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue">Современный дом с террасой</h3>
                  <p className="text-luxury-black/70 dark:text-white/80 theme-transition">Просторный дом с панорамными окнами и минималистичным интерьером.</p>
                  {/* Price indicator with luxury styling */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-slate/50 flex justify-between items-center">
                    <span className="text-sm text-luxury-black/60 dark:text-white/60">Цена</span>
                    <span className="font-serif text-lg text-luxury-gold dark:text-luxury-royalBlue font-bold">от 35 000 000 ₽</span>
                  </div>
                </div>
              </div>
              
              <div className="group rounded-sm overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)] dark:hover:shadow-[0_20px_50px_rgba(24,90,219,0.5)] hover:translate-y-[-8px] transition-all duration-700 animate-fade-in-up theme-transition relative" style={{animationDelay: '100ms'}}>
                  {/* Luxury corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-luxury-gold/0 dark:border-luxury-royalBlue/0 group-hover:border-luxury-gold/80 dark:group-hover:border-luxury-royalBlue/80 transition-all duration-700 z-20"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-luxury-gold/0 dark:border-luxury-royalBlue/0 group-hover:border-luxury-gold/80 dark:group-hover:border-luxury-royalBlue/80 transition-all duration-700 z-20"></div>
                <div className="relative h-64 overflow-hidden property-image">
                  <ThemeImage 
                    lightSrc="/images/house4.png"
                    darkSrc="/images/flat2.png"
                    alt="Классический особняк" 
                    fill 
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                  />
                </div>
                <div className="p-6 bg-white dark:bg-dark-graphite theme-transition border-t border-gray-100 dark:border-dark-slate group-hover:border-luxury-gold/20 dark:group-hover:border-luxury-royalBlue/20 relative">
                  {/* Luxury indicator bar */}
                  <div className="absolute top-0 left-0 w-0 h-[3px] bg-luxury-gold dark:bg-luxury-royalBlue group-hover:w-full transition-all duration-700 shadow-[0_0_8px_rgba(212,175,55,0.7)] dark:shadow-[0_0_8px_rgba(24,90,219,0.7)]"></div>
                  <h3 className="text-xl font-semibold mb-2 text-luxury-black dark:text-white theme-transition transition-all duration-300 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue">Классический особняк</h3>
                  <p className="text-luxury-black/70 dark:text-white/80 theme-transition">Элегантный дом с классическим дизайном и просторным участком.</p>
                  {/* Price indicator with luxury styling */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-slate/50 flex justify-between items-center">
                    <span className="text-sm text-luxury-black/60 dark:text-white/60">Цена</span>
                    <span className="font-serif text-lg text-luxury-gold dark:text-luxury-royalBlue font-bold">от 75 000 000 ₽</span>
                  </div>
                </div>
              </div>
              
              <div className="group rounded-sm overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)] dark:hover:shadow-[0_20px_50px_rgba(24,90,219,0.5)] hover:translate-y-[-8px] transition-all duration-700 animate-fade-in-up theme-transition relative" style={{animationDelay: '200ms'}}>
                  {/* Luxury corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-luxury-gold/0 dark:border-luxury-royalBlue/0 group-hover:border-luxury-gold/80 dark:group-hover:border-luxury-royalBlue/80 transition-all duration-700 z-20"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-luxury-gold/0 dark:border-luxury-royalBlue/0 group-hover:border-luxury-gold/80 dark:group-hover:border-luxury-royalBlue/80 transition-all duration-700 z-20"></div>
                <div className="relative h-64 overflow-hidden property-image">
                  <ThemeImage 
                    lightSrc="/images/house5.png"
                    darkSrc="/images/flat3.png"
                    alt="Люкс-апартаменты" 
                    fill 
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                  />
                </div>
                <div className="p-6 bg-white dark:bg-dark-graphite theme-transition border-t border-gray-100 dark:border-dark-slate group-hover:border-luxury-gold/20 dark:group-hover:border-luxury-royalBlue/20 relative">
                  {/* Luxury indicator bar */}
                  <div className="absolute top-0 left-0 w-0 h-[3px] bg-luxury-gold dark:bg-luxury-royalBlue group-hover:w-full transition-all duration-700 shadow-[0_0_8px_rgba(212,175,55,0.7)] dark:shadow-[0_0_8px_rgba(24,90,219,0.7)]"></div>
                  <h3 className="text-xl font-semibold mb-2 text-luxury-black dark:text-white theme-transition transition-all duration-300 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue">Люкс-апартаменты</h3>
                  <p className="text-luxury-black/70 dark:text-white/80 theme-transition">Премиальные апартаменты с изысканным интерьером и панорамным видом.</p>
                  {/* Price indicator with luxury styling */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-slate/50 flex justify-between items-center">
                    <span className="text-sm text-luxury-black/60 dark:text-white/60">Цена</span>
                    <span className="font-serif text-lg text-luxury-gold dark:text-luxury-royalBlue font-bold">от 50 000 000 ₽</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                {/* Decorative corner elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-luxury-gold/50 dark:border-luxury-royalBlue/50 rounded-tl-sm"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-luxury-gold/50 dark:border-luxury-royalBlue/50 rounded-br-sm"></div>
                <Link href="/register">
                  <Button size="xl" animation="scale" className="bg-gradient-to-r from-luxury-gold via-luxury-gold/95 to-luxury-gold dark:from-luxury-royalBlue dark:via-luxury-royalBlue/95 dark:to-luxury-royalBlue text-luxury-black dark:text-white hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] dark:hover:shadow-[0_0_30px_rgba(10,36,114,0.6)] transition-all duration-500 backdrop-filter backdrop-blur-sm theme-transition border-2 border-luxury-gold/40 dark:border-luxury-royalBlue/40 hover:border-luxury-gold dark:hover:border-luxury-royalBlue relative overflow-hidden z-10 font-bold py-8 px-12">
                    <span className="relative inline-block overflow-hidden">
                      <span className="relative z-10">Создать свою подборку</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-luxury-goldMuted to-luxury-gold dark:from-luxury-royalBlueMuted dark:to-luxury-royalBlue opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></span>
                    </span>
                    {/* Shine effect */}
                    <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-all duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 group-hover:animate-shine"></span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section with Parallax */}
        <section id="about" className="py-24 bg-gray-50 dark:bg-dark-slate overflow-hidden theme-transition">
          <div className="container-luxury relative">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2 order-2 lg:order-1">
                <div className="animate-fade-in-up">
                  <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-luxury-black dark:text-white theme-transition">О платформе РиелторПро</h2>
                  <div className="w-24 h-1 bg-luxury-gold dark:bg-luxury-royalBlue mb-8 theme-transition"></div>
                  <p className="text-lg text-luxury-black/70 dark:text-white/80 mb-6 leading-relaxed theme-transition">
                    Мы создали РиелторПро с мыслью о том, как сделать работу риелторов более эффективной и при этом повысить удовлетворенность клиентов.
                  </p>
                  <p className="text-lg text-luxury-black/70 dark:text-white/80 mb-8 leading-relaxed theme-transition">
                    Наша платформа позволяет структурировать работу с объектами недвижимости, делать персонализированные подборки для клиентов и поддерживать профессиональную коммуникацию на всех этапах сделки.
                  </p>
                  
                  {/* Replace the grid with our new GallerySlider component */}
                  <GallerySlider />
                  
                  <Link href="/register">
                    <Button size="lg" className="bg-luxury-black dark:bg-luxury-royalBlue text-white dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted theme-transition" animation="scale">
                      Начать работу
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full lg:w-1/2 order-1 lg:order-2 relative">
                <div className="relative h-[400px] md:h-[500px] animate-fade-in-up overflow-hidden rounded-sm dark:border dark:border-luxury-gold/20 property-image theme-transition">
                  <ThemeImage 
                    lightSrc="/images/house2.png"
                    darkSrc="/images/flat0.png"
                    alt="Работа на платформе" 
                    fill 
                    className="object-cover transition-all duration-700 hover:scale-105"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-luxury-black/30 to-transparent dark:from-luxury-black/50 theme-transition"></div>
                  {/* Add subtle material texture */}
                  <div className="absolute inset-0 bg-[url('/images/texture-dark.png')] bg-repeat opacity-20 mix-blend-overlay z-10 transition-all duration-500 hover:opacity-30"></div>
                  {/* Add gold accent on hover */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-luxury-gold to-transparent dark:from-luxury-royalBlue group-hover:w-full transition-all duration-700 z-20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-luxury-black dark:bg-dark-charcoal text-white theme-transition">
          <div className="container-luxury text-center">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-white dark:text-white theme-transition">Готовы улучшить свой бизнес?</h2>
              <p className="text-lg text-white/90 dark:text-white/90 mb-10 theme-transition">
                Присоединяйтесь к сотням риелторов, которые уже используют РиелторПро для повышения эффективности своей работы и улучшения клиентского опыта.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-luxury-gold dark:bg-luxury-royalBlue text-luxury-black dark:text-white hover:bg-luxury-gold/90 dark:hover:bg-luxury-royalBlueMuted theme-transition" animation="scale">
                    Создать аккаунт
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white dark:border-moonstone text-white dark:text-moonstone hover:bg-white dark:hover:bg-moonstone hover:text-luxury-black dark:hover:text-dark-charcoal theme-transition" animation="scale">
                    Войти в систему
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-luxury-black dark:bg-dark-charcoal text-white pt-16 pb-8 border-t border-white/10 dark:border-dark-slate theme-transition">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-serif mb-6 text-white dark:text-white theme-transition">РиелторПро</h3>
              <p className="text-white/90 dark:text-white/80 mb-6 theme-transition">Платформа для риелторов, которая упрощает работу с клиентами и делает презентацию недвижимости более профессиональной.</p>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-white dark:text-white theme-transition">Навигация</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">Возможности</Link></li>
                <li><Link href="#about" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">О платформе</Link></li>
                <li><Link href="#contact" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">Контакты</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-white dark:text-white theme-transition">Правовая информация</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">Условия использования</Link></li>
                <li><Link href="#" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">Политика конфиденциальности</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-white dark:text-white theme-transition">Контакты</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-luxury-gold dark:text-luxury-royalBlue theme-transition">
                    <path d="M22 12C22 10.6868 21.7413 9.38647 21.2388 8.1731C20.7363 6.95996 19.9997 5.85742 19.0711 4.92893C18.1425 4.00043 17.04 3.26374 15.8269 2.7612C14.6138 2.25866 13.3132 2 12 2C10.6868 2 9.38647 2.25866 8.1731 2.7612C6.95996 3.26374 5.85742 4.00043 4.92893 4.92893C4.00043 5.85742 3.26374 6.95996 2.7612 8.1731C2.25866 9.38647 2 10.6868 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 13H9.67C9.67 13 10 13 10.25 12.8C10.5 12.6 10.5 12.5 10.5 12.5C10.5 12.5 10.5 12.4 10.25 12.2C10 12 9.67 12 9.67 12H8.5C8.5 12 7.83 12 7.33 12.5C6.83 13 6.83 13.67 6.83 13.67V16.33C6.83 16.33 6.83 17 7.33 17.5C7.83 18 8.5 18 8.5 18H9.67C9.67 18 10 18 10.25 17.8C10.5 17.6 10.5 17.5 10.5 17.5C10.5 17.5 10.5 17.4 10.25 17.2C10 17 9.67 17 9.67 17H8V16H9.4C9.4 16 9.73 16 9.98 15.8C10.23 15.6 10.23 15.5 10.23 15.5C10.23 15.5 10.23 15.4 9.98 15.2C9.73 15 9.4 15 9.4 15H8V13Z" fill="currentColor"/>
                    <path d="M12.5 17V13.5V13M12.5 17V13.5C12.5 13 13 12.5 13.5 12.5C14 12.5 14.5 13 14.5 13.5V17M12.5 17H11.5M14.5 17H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 17V13C17.5 12.6 17.6 12.3 17.8 12C18 11.7 18.2 11.5 18.6 11.5C19 11.5 19.2 11.7 19.4 12C19.6 12.3 19.7 12.6 19.7 13V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 13C17.5 13 17.5 12 18.5 12C19.5 12 19.5 13 19.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/90 dark:text-white/80 theme-transition">support@rieltorpro.ru</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-luxury-gold dark:text-luxury-royalBlue theme-transition">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/90 dark:text-white/80 theme-transition">+7 (495) 123-45-67</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 dark:border-dark-slate text-center text-white/50 theme-transition">
            <p className="text-white/90 dark:text-white/80 theme-transition">&copy; {new Date().getFullYear()} РиелторПро. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

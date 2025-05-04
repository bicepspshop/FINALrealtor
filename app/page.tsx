"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ThemeToggle } from "@/components/ui/theme/theme-toggle"
import { ThemeImage } from "@/components/ui/theme/theme-image"
import { GallerySlider } from "@/components/ui/gallery-slider"
import "../styles/hero-section.css"
import { Suspense, useEffect } from "react"
import { UserNavButton } from "./user-nav-button"

export default function Home() {
  useEffect(() => {
    // Mobile collection cards interaction
    const mobileCards = document.getElementById('mobile-collection-cards');
    const topCard = document.getElementById('mobile-card-top');
    const bottomCard = document.getElementById('mobile-card-bottom');
    const instructionText = document.getElementById('mobile-cards-instruction');
    
    let isExpanded = false;

    const toggleCards = () => {
      if (!topCard || !bottomCard || !instructionText) return;
      
      if (!isExpanded) {
        // Expand cards
        topCard.style.transform = 'translateY(-120px)';
        bottomCard.style.transform = 'translateY(100px)';
        instructionText.textContent = 'Коснитесь, чтобы вернуть';
        isExpanded = true;
      } else {
        // Collapse cards
        topCard.style.transform = 'translateY(-30px)';
        bottomCard.style.transform = 'translateY(30px)';
        instructionText.textContent = 'Коснитесь, чтобы увидеть все карточки';
        isExpanded = false;
      }
    };

    mobileCards?.addEventListener('click', toggleCards);
    mobileCards?.addEventListener('touchend', toggleCards);

    // Property Cards Carousel functionality
    const carousel = document.getElementById('mobile-property-carousel');
    const leftCard = document.getElementById('property-card-left');
    const centerCard = document.getElementById('property-card-center');
    const rightCard = document.getElementById('property-card-right');
    const indicators = [
      document.getElementById('indicator-0'),
      document.getElementById('indicator-1'),
      document.getElementById('indicator-2'),
    ];

    if (!carousel || !leftCard || !centerCard || !rightCard) return;

    // Cards data array for easy rotation
    const cards = [
      {
        title: 'ЖК Престиж, 2-комн.',
        price: '8 500 000 ₽',
        address: 'Ленинский пр-т, 136',
        locationTag: 'ЖК Престиж',
        image: '/images/house3.png',
        details: [
          { label: 'Площадь', value: '65 м²' },
          { label: 'Комнат', value: '2' },
          { label: 'Этаж', value: '7/12' },
          { label: 'Санузлы', value: '1' }
        ]
      },
      {
        title: 'ЖК Олимп, 3-комн.',
        price: '15 000 000 ₽',
        address: 'Ленина 43к3',
        locationTag: 'ЖК Олимп',
        image: '/images/flat1.png',
        details: [
          { label: 'Площадь', value: '85 м²' },
          { label: 'Комнат', value: '3' },
          { label: 'Этаж', value: '5/9' },
          { label: 'Санузлы', value: '2' }
        ]
      },
      {
        title: 'Дом, Зеленый сад',
        price: '23 400 000 ₽',
        address: 'Сосновая ул., 12',
        locationTag: 'Коттедж',
        image: '/images/house7.png',
        details: [
          { label: 'Площадь', value: '95 м²' },
          { label: 'Комнат', value: '6' },
          { label: 'Этажей', value: '2' },
          { label: 'Санузлы', value: '3' }
        ]
      }
    ];

    // Current position in the cards array
    let currentIndex = 1; // Start with the center card (index 1)

    // Update indicators to show current slide
    const updateIndicators = () => {
      indicators.forEach((indicator, index) => {
        if (indicator) {
          indicator.className = index === currentIndex 
            ? 'w-2 h-2 rounded-full bg-luxury-gold focus:outline-none' 
            : 'w-2 h-2 rounded-full bg-gray-400 focus:outline-none';
        }
      });
    };

    // Touch handling variables
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Minimum distance to consider a swipe

    // Function to handle swipe left (next slide)
    const swipeLeft = () => {
      if (currentIndex < cards.length - 1) {
        // Add sliding animation classes
        leftCard?.classList.add('animate-slide-out-left');
        centerCard?.classList.add('animate-slide-to-left');
        rightCard?.classList.add('animate-slide-to-center');
        
        // Update current index after a short delay
        setTimeout(() => {
          currentIndex++;
          updateCarousel();
          
          // Remove animation classes
          leftCard?.classList.remove('animate-slide-out-left');
          centerCard?.classList.remove('animate-slide-to-left');
          rightCard?.classList.remove('animate-slide-to-center');
        }, 300);
      }
    };

    // Function to handle swipe right (previous slide)
    const swipeRight = () => {
      if (currentIndex > 0) {
        // Add sliding animation classes
        leftCard?.classList.add('animate-slide-to-center');
        centerCard?.classList.add('animate-slide-to-right');
        rightCard?.classList.add('animate-slide-out-right');
        
        // Update current index after a short delay
        setTimeout(() => {
          currentIndex--;
          updateCarousel();
          
          // Remove animation classes
          leftCard?.classList.remove('animate-slide-to-center');
          centerCard?.classList.remove('animate-slide-to-right');
          rightCard?.classList.remove('animate-slide-out-right');
        }, 300);
      }
    };

    // Simulated function to update DOM elements based on current indexes
    // In a real app you might use React state and refs instead
    const updateCarousel = () => {
      // Calculate the indexes for left, center, and right cards
      const leftIndex = (currentIndex - 1 + cards.length) % cards.length;
      const centerIndex = currentIndex;
      const rightIndex = (currentIndex + 1) % cards.length;

      // Update the carousel display
      updateCardContents(leftCard, cards[leftIndex]);
      updateCardContents(centerCard, cards[centerIndex]);  
      updateCardContents(rightCard, cards[rightIndex]);

      // Update indicator dots
      updateIndicators();
    };

    // Helper function to update a card's contents
    const updateCardContents = (cardElement: HTMLElement | null, cardData: any) => {
      if (!cardElement) return;

      // Update image
      const imageElement = cardElement.querySelector('.relative.h-\\[160px\\] img') as HTMLImageElement;
      if (imageElement) {
        imageElement.setAttribute('src', cardData.image);
        imageElement.setAttribute('alt', cardData.title);
      }

      // Update location tag
      const locationTag = cardElement.querySelector('.absolute.top-4.left-4');
      if (locationTag) {
        locationTag.textContent = cardData.locationTag;
      }

      // Update title and price
      const titleElement = cardElement.querySelector('.text-lg.font-medium.text-white');
      const priceElement = cardElement.querySelector('.text-luxury-gold.text-lg');
      if (titleElement) titleElement.textContent = cardData.title;
      if (priceElement) priceElement.textContent = cardData.price;

      // Update address
      const addressElement = cardElement.querySelector('.text-sm.text-gray-300.mb-4');
      if (addressElement) addressElement.textContent = cardData.address;

      // Update details
      const detailElements = cardElement.querySelectorAll('.grid.grid-cols-2 .flex.items-center.text-sm');
      if (detailElements && detailElements.length === 4) {
        detailElements.forEach((element: Element, index: number) => {
          const detail = cardData.details[index];
          const textNode = element.childNodes[1]; // Text node after the span
          if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            element.innerHTML = `
              <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
              ${detail.label}: ${detail.value}
            `;
          }
        });
      }
    };

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swiped right (previous)
          swipeRight();
        } else {
          // Swiped left (next)
          swipeLeft();
        }
      }
    };

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
      indicator?.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    // Add touch event listeners to the carousel
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchmove', handleTouchMove);
    carousel.addEventListener('touchend', handleTouchEnd);

    // Initialize
    updateIndicators();

    return () => {
      mobileCards?.removeEventListener('click', toggleCards);
      mobileCards?.removeEventListener('touchend', toggleCards);
      
      // Remove carousel event listeners
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('touchend', handleTouchEnd);
      
      // Remove indicator click handlers
      indicators.forEach((indicator, index) => {
        indicator?.removeEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
      });
    };
  }, []);

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
              <Link href="/about" className="text-white dark:text-moonstone hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 font-medium theme-transition">
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
              loading="eager"
              onLoad={() => {
                // Preload other important images after hero loads
                const preloadLinks = [
                  '/images/house3.png',
                  '/images/flat1.png',
                  '/images/luxury-pattern.png'
                ];
                
                preloadLinks.forEach(src => {
                  const link = document.createElement('link');
                  link.rel = 'preload';
                  link.as = 'image';
                  link.href = src;
                  document.head.appendChild(link);
                });
              }}
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
                <span className="absolute -bottom-5 left-0 h-1 bg-gradient-to-r from-luxury-gold/0 via-luxury-gold to-luxury-gold/0 dark:from-luxury-royalBlue/0 dark:via-luxury-royalBlue dark:to-luxury-royalBlue/0 rounded-full w-1/2 shadow-[0_0_15px_5px_rgba(212,175,55,0.3)] dark:shadow-[0_0_15px_5px_rgba(24,90,219,0.3)] animate-[width_3s_ease-in-out_infinite_alternate] theme-transition"></span>
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

        {/* Core Functionalities Section */}
        <section className="py-24 bg-white dark:bg-dark-charcoal theme-transition relative">
          {/* Enhanced luxury pattern overlay with material effect */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-repeat pointer-events-none z-0" 
              style={{backgroundImage: "url('/images/pattern.png')", backgroundSize: "100px"}}></div>
          {/* Add subtle texture for material richness */}
          <div className="absolute inset-0 opacity-20 dark:opacity-30 bg-[url('/images/texture-light.png')] dark:bg-[url('/images/texture-dark.png')] bg-repeat mix-blend-overlay pointer-events-none z-0 theme-transition"></div>
              
          <div className="container-luxury relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-luxury-black dark:text-white theme-transition">Ключевые функции платформы</h2>
              <div className="relative w-48 h-[3px] mx-auto mb-6 theme-transition overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold via-luxury-gold to-luxury-gold/20 dark:from-luxury-royalBlue dark:via-luxury-royalBlue dark:to-luxury-royalBlue/20 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.7)] dark:shadow-[0_0_10px_rgba(24,90,219,0.7)] theme-transition"></div>
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 dark:bg-white/30 blur-[2px] animate-[shine_3s_ease-in-out_infinite] theme-transition"></div>
              </div>
              <p className="text-lg text-luxury-black/80 dark:text-white/90 max-w-3xl mx-auto theme-transition">
                Откройте для себя элегантные инструменты, которые помогут вам организовать работу с недвижимостью и клиентами в единой системе.
              </p>
            </div>
            
            {/* Core Features Cards */}
            <div className="flex flex-col gap-24">
              {/* Collections Card */}
              <div className="relative group animate-fade-in-up w-full max-w-4xl mx-auto">
                <div className="absolute inset-[-2px] bg-gradient-to-br from-luxury-gold/20 via-luxury-gold/5 to-transparent dark:from-luxury-royalBlue/20 dark:via-luxury-royalBlue/5 dark:to-transparent rounded-sm blur-[5px] opacity-0 group-hover:opacity-100 transition-all duration-700 z-0"></div>
                <div className="p-0 relative z-10 h-full flex flex-col md:flex-row bg-white dark:bg-dark-graphite shadow-subtle dark:shadow-elegant-dark rounded-sm border border-gray-100 dark:border-dark-slate group-hover:border-luxury-gold/30 dark:group-hover:border-luxury-royalBlue/30 transition-all duration-500 theme-transition">
                  {/* Left Content Section */}
                  <div className="w-full md:w-1/2 p-8 mr-0">
                    {/* Icon with elegant background */}
                    <div className="w-20 h-20 mb-8 relative">
                      <div className="absolute inset-0 bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 rounded-sm rotate-[10deg] group-hover:rotate-[5deg] transition-all duration-700"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-white/50 dark:from-luxury-royalBlue/20 dark:to-dark-graphite/50 backdrop-blur-[1px] rounded-sm -rotate-[5deg] group-hover:rotate-0 transition-all duration-700 border border-luxury-gold/20 dark:border-luxury-royalBlue/20 group-hover:border-luxury-gold/40 dark:group-hover:border-luxury-royalBlue/40"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 11H5M19 11C19.5523 11 20 11.4477 20 12V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V12C4 11.4477 4.44772 11 5 11M19 11V9C19 8.44772 18.5523 8 18 8M5 11V9C5 8.44772 5.44772 8 6 8M18 8V7C18 6.44772 17.5523 6 17 6H7C6.44772 6 6 6.44772 6 7V8M18 8H6" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-serif font-medium mb-4 text-luxury-black dark:text-white theme-transition">Создание коллекций</h3>
                    <p className="text-base text-luxury-black/70 dark:text-white/70 mb-8 leading-relaxed theme-transition flex-grow">
                      Организуйте объекты недвижимости в тематические коллекции, чтобы структурировать предложения для ваших клиентов.
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 mr-3 mt-0.5 theme-transition">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">Персонализированные подборки для каждого клиента</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 mr-3 mt-0.5 theme-transition">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">Возможность добавления обложки для коллекции</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 mr-3 mt-0.5 theme-transition">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">Удобный доступ по уникальной ссылке</p>
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <div className="mt-auto">
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-luxury-gold/30 dark:via-luxury-royalBlue/30 to-transparent mb-8 theme-transition"></div>
                      <Link href="/register" className="group/btn">
                        <Button variant="ghost" className="px-0 text-luxury-gold dark:text-luxury-royalBlue hover:bg-transparent hover:text-luxury-gold/80 dark:hover:text-luxury-royalBlue/80 theme-transition flex items-center">
                          <span>Начать создавать коллекции</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" className="ml-2 transform translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Gallery Wall Section with gray background */}
                  <div className="w-full md:w-1/2 relative overflow-visible bg-gray-50 dark:bg-dark-slate theme-transition p-8 flex items-start justify-center">
                    {/* Removed background pattern and gradient overlays for monolithic color */}
                    
                    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-visible">
                      {/* Perspective Stack of Collection Cards - Desktop View */}
                      <div className="relative w-full h-full group/gallery hover:scale-105 transition-all duration-700 mt-[-120px] ml-[10px] hidden md:block">
                        {/* Collection Cards Stack */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full transition-all duration-700">
                          {/* Card 1 - Top Right (Criplex) */}
                          <div className="absolute translate-y-[100px] translate-x-[-20px] scale-[1.1] left-1/2 -translate-x-1/2 w-[220px] rounded-sm overflow-hidden group-hover/gallery:translate-x-[33px] group-hover/gallery:translate-y-[-160px] transition-all duration-700 z-30 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <div className="bg-dark-graphite text-white p-3 rounded-t-sm border border-dark-slate">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium text-sm">Criplex</h4>
                                <span className="text-green-400 text-xs flex items-center gap-1">
                                  <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                                  Есть ссылка
                                </span>
                              </div>
                              <p className="text-xs text-gray-300">Новостройка - 5 объектов</p>
                            </div>
                            <div className="w-full h-[120px] relative group/card">
                              <Image 
                                src="/images/flat1.png"
                                alt="Коллекция новостроек"
                                fill
                                className="object-cover"
                              />
                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                              
                              {/* Action buttons */}
                              <div className="absolute bottom-3 left-0 right-0 px-3 flex justify-between opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/card:translate-y-0">
                                <div className="h-7 px-3 flex items-center gap-1 bg-dark-graphite/60 backdrop-blur-sm rounded-full text-white/90 text-xs border border-luxury-gold/30 hover:border-luxury-gold/60 cursor-pointer transition-all">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Объекты
                                </div>
                                
                                <div className="h-7 px-3 flex items-center gap-1 bg-luxury-gold/80 text-luxury-black backdrop-blur-sm rounded-full text-xs border border-luxury-gold/30 hover:bg-luxury-gold cursor-pointer transition-all">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Перейти
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Card 2 - Top Left (Avangard) */}
                          <div className="absolute translate-y-[-180px] translate-x-[-80px] scale-[1.1] left-1/2 -translate-x-1/2 w-[220px] rounded-sm overflow-hidden group-hover/gallery:translate-x-[-233px] group-hover/gallery:translate-y-[-120px] transition-all duration-700 z-10 cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
                            <div className="bg-dark-graphite text-white p-3 rounded-t-sm border border-dark-slate">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium text-sm">Avangard</h4>
                                <span className="text-green-400 text-xs flex items-center gap-1">
                                  <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                                  Есть ссылка
                                </span>
                              </div>
                              <p className="text-xs text-gray-300">Элитный ЖК - 8 объектов</p>
                            </div>
                            <div className="w-full h-[120px] relative group/card">
                              <Image 
                                src="/images/house2.png"
                                alt="Элитная недвижимость"
                                fill
                                className="object-cover"
                              />
                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                              
                              {/* Action buttons */}
                              <div className="absolute bottom-3 left-0 right-0 px-3 flex justify-between opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/card:translate-y-0">
                                <div className="h-7 px-3 flex items-center gap-1 bg-dark-graphite/60 backdrop-blur-sm rounded-full text-white/90 text-xs border border-luxury-gold/30 hover:border-luxury-gold/60 cursor-pointer transition-all">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Объекты
                                </div>
                                
                                <div className="h-7 px-3 flex items-center gap-1 bg-luxury-gold/80 text-luxury-black backdrop-blur-sm rounded-full text-xs border border-luxury-gold/30 hover:bg-luxury-gold cursor-pointer transition-all">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Перейти
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Card 3 - Bottom (Premium) */}
                          <div className="absolute translate-y-[-40px] translate-x-[-200px] scale-[1.1] left-1/2 -translate-x-1/2 w-[220px] rounded-sm overflow-hidden group-hover/gallery:translate-x-[-100px] group-hover/gallery:translate-y-[100px] transition-all duration-700 z-20 cursor-pointer shadow-[0_10px_20px_rgba(0,0,0,0.22)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.45)]">
                            <div className="bg-dark-graphite text-white p-3 rounded-t-sm border border-dark-slate">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium text-sm">Premium</h4>
                                <span className="text-green-400 text-xs flex items-center gap-1">
                                  <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                                  Есть ссылка
                                </span>
                              </div>
                              <p className="text-xs text-gray-300">Премиум класс - 3 объекта</p>
                            </div>
                            <div className="w-full h-[120px] relative group/card">
                              <Image 
                                src="/images/house7.png"
                                alt="Премиум недвижимость"
                                fill
                                className="object-cover"
                              />
                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                              
                              {/* Action buttons */}
                              <div className="absolute bottom-3 left-0 right-0 px-3 flex justify-between opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/card:translate-y-0">
                                <div className="h-7 px-3 flex items-center gap-1 bg-dark-graphite/60 backdrop-blur-sm rounded-full text-white/90 text-xs border border-luxury-gold/30 hover:border-luxury-gold/60 cursor-pointer transition-all">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Объекты
                                </div>
                                
                                <div className="h-7 px-3 flex items-center gap-1 bg-luxury-gold/80 text-luxury-black backdrop-blur-sm rounded-full text-xs border border-luxury-gold/30 hover:bg-luxury-gold cursor-pointer transition-all">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Перейти
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile View Collection Cards - 2 cards half-stacked */}
                      <div className="md:hidden relative w-full h-[400px] flex items-center justify-center mt-10 perspective-[1200px]" id="mobile-collection-cards">
                        {/* Top card (Criplex) */}
                        <div 
                          className="absolute w-[85%] max-w-[280px] rounded-sm overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 transform transition-all duration-500 ease-out translate-y-[-30px]"
                          id="mobile-card-top"
                        >
                          <div className="bg-dark-graphite text-white p-3 rounded-t-sm border border-dark-slate">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-sm">Criplex</h4>
                              <span className="text-green-400 text-xs flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                                Есть ссылка
                              </span>
                            </div>
                            <p className="text-xs text-gray-300">Новостройка - 5 объектов</p>
                          </div>
                          <div className="w-full h-[140px] relative">
                            <Image 
                              src="/images/flat1.png"
                              alt="Коллекция новостроек"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                            
                            <div className="absolute bottom-3 left-0 right-0 px-3 flex justify-between">
                              <div className="h-7 px-3 flex items-center gap-1 bg-dark-graphite/60 backdrop-blur-sm rounded-full text-white/90 text-xs border border-luxury-gold/30">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Объекты
                              </div>
                              
                              <div className="h-7 px-3 flex items-center gap-1 bg-luxury-gold/80 text-luxury-black backdrop-blur-sm rounded-full text-xs border border-luxury-gold/30">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Перейти
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Bottom card (Avangard) */}
                        <div 
                          className="absolute w-[85%] max-w-[280px] rounded-sm overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.4)] z-10 transform transition-all duration-500 ease-out translate-y-[30px]"
                          id="mobile-card-bottom"
                        >
                          <div className="bg-dark-graphite text-white p-3 rounded-t-sm border border-dark-slate">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-sm">Avangard</h4>
                              <span className="text-green-400 text-xs flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                                Есть ссылка
                              </span>
                            </div>
                            <p className="text-xs text-gray-300">Элитный ЖК - 8 объектов</p>
                          </div>
                          <div className="w-full h-[140px] relative">
                            <Image 
                              src="/images/house2.png"
                              alt="Элитная недвижимость"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                            
                            <div className="absolute bottom-3 left-0 right-0 px-3 flex justify-between">
                              <div className="h-7 px-3 flex items-center gap-1 bg-dark-graphite/60 backdrop-blur-sm rounded-full text-white/90 text-xs border border-luxury-gold/30">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Объекты
                              </div>
                              
                              <div className="h-7 px-3 flex items-center gap-1 bg-luxury-gold/80 text-luxury-black backdrop-blur-sm rounded-full text-xs border border-luxury-gold/30">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Перейти
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Instructions indicator */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs text-gray-500 dark:text-gray-400 w-full px-4 animate-pulse flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p id="mobile-cards-instruction">Коснитесь, чтобы увидеть все карточки</p>
                        </div>
                      </div>
                      
                      {/* Removed light effects and gradient overlays */}
                      
                      {/* Removing interaction hint with arrows */}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Properties Card */}
              <div className="relative group animate-fade-in-up w-full max-w-4xl mx-auto" style={{animationDelay: '100ms'}}>
                <div className="absolute inset-[-2px] bg-gradient-to-br from-luxury-gold/20 via-luxury-gold/5 to-transparent dark:from-luxury-royalBlue/20 dark:via-luxury-royalBlue/5 dark:to-transparent rounded-sm blur-[5px] opacity-0 group-hover:opacity-100 transition-all duration-700 z-0"></div>
                <div className="p-0 relative z-10 h-full flex flex-col md:flex-row bg-white dark:bg-dark-graphite shadow-subtle dark:shadow-elegant-dark rounded-sm border border-gray-100 dark:border-dark-slate group-hover:border-luxury-gold/30 dark:group-hover:border-luxury-royalBlue/30 transition-all duration-500 theme-transition">
                  {/* Left Content Section */}
                  <div className="w-full md:w-1/2 p-8 mr-0">
                    {/* Icon with elegant background */}
                    <div className="w-20 h-20 mb-8 relative">
                      <div className="absolute inset-0 bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 rounded-sm rotate-[10deg] group-hover:rotate-[5deg] transition-all duration-700"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-white/50 dark:from-luxury-royalBlue/20 dark:to-dark-graphite/50 backdrop-blur-[1px] rounded-sm -rotate-[5deg] group-hover:rotate-0 transition-all duration-700 border border-luxury-gold/20 dark:border-luxury-royalBlue/20 group-hover:border-luxury-gold/40 dark:group-hover:border-luxury-royalBlue/40"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 21H21M3 7V17M21 7V17M6 7H18M6 17H18M6 12H18M6 7V17M18 7V17M6 7C5.46957 7 4.96086 6.78929 4.58579 6.41421C4.21071 6.03914 4 5.53043 4 5C4 4.46957 4.21071 3.96086 4.58579 3.58579C4.96086 3.21071 5.46957 3 6 3H18C18.5304 3 19.0391 3.21071 19.4142 3.58579C19.7893 3.96086 20 4.46957 20 5C20 5.53043 19.7893 6.03914 19.4142 6.41421C19.0391 6.78929 18.5304 7 18 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-serif font-medium mb-4 text-luxury-black dark:text-white theme-transition">Добавление объектов</h3>
                    <p className="text-base text-luxury-black/70 dark:text-white/70 mb-8 leading-relaxed theme-transition flex-grow">
                      Наполняйте коллекции детальной информацией о каждом объекте недвижимости с высококачественными визуальными материалами.
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 mr-3 mt-0.5 theme-transition">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">Загрузка многочисленных фотографий объекта</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 mr-3 mt-0.5 theme-transition">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">Указание подробных характеристик</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 mr-3 mt-0.5 theme-transition">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">Добавление виртуальных туров и планов</p>
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <div className="mt-auto">
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-luxury-gold/30 dark:via-luxury-royalBlue/30 to-transparent mb-8 theme-transition"></div>
                      <Link href="/register" className="group/btn">
                        <Button variant="ghost" className="px-0 text-luxury-gold dark:text-luxury-royalBlue hover:bg-transparent hover:text-luxury-gold/80 dark:hover:text-luxury-royalBlue/80 theme-transition flex items-center">
                          <span>Начать добавлять объекты</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" className="ml-2 transform translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Right Content Section with gray background */}
                  <div className="w-full md:w-1/2 relative overflow-visible bg-gray-50 dark:bg-dark-slate theme-transition p-8 flex items-center justify-center">
                    {/* Desktop Property Cards Stack - Hidden on Mobile */}
                    <div className="relative w-full h-full pt-20 pb-40 group mt-[-240px] perspective-[1200px] hidden md:block">
                      {/* First Property Card - Left */}
                      <div className="absolute z-10 top-36 -left-16 transform transition-all duration-500 group-hover:-translate-x-12 group-hover:translate-y-0 hover:z-30 transform-style-preserve-3d">
                        <div className="w-[280px] bg-dark-graphite text-white rounded-sm border border-dark-slate overflow-hidden shadow-elegant-dark transition-all duration-500 transform-style-preserve-3d hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:[transform:rotateY(15deg)_translateZ(60px)]">
                          {/* Property Image */}
                          <div className="relative h-[160px] overflow-hidden">
                            <Image 
                              src="/images/house3.png"
                              alt="Современный жилой комплекс"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-sm text-white text-xs md:block hidden">
                              ЖК Престиж
                            </div>
                            <div className="absolute top-4 right-4 px-2 py-1 bg-dark-graphite/80 backdrop-blur-sm rounded-sm text-white text-xs border border-luxury-gold/30 md:block hidden">
                              1/3
                            </div>
                          </div>
                          
                          {/* Property Info */}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-medium text-white">ЖК Престиж, 2-комн.</h4>
                              <span className="text-luxury-gold text-lg font-semibold">8 500 000 ₽</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-4">Ленинский пр-т, 136</p>
                            
                            {/* Property Details */}
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Площадь: 65 м²
                              </div>
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Комнат: 2
                              </div>
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Этаж: 7/12
                              </div>
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Санузлы: 1
                              </div>
                            </div>
                            
                            {/* Realtor Notes */}
                            <div className="flex items-center mb-4 text-xs text-blue-300">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Есть комментарий риелтора
                            </div>
                            
                            {/* Action Button */}
                            <button className="w-full py-2.5 bg-transparent border border-luxury-gold/30 text-luxury-gold text-sm rounded-sm flex items-center justify-center space-x-2 hover:bg-luxury-gold/10 transition-colors duration-300">
                              <span>Подробнее об объекте</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Second Property Card - Middle */}
                      <div className="absolute z-20 top-36 left-1/2 transform -translate-x-1/2 transition-all duration-500 group-hover:translate-y-0 hover:z-30 transform-style-preserve-3d">
                        <div className="w-[280px] bg-dark-graphite text-white rounded-sm border border-dark-slate overflow-hidden shadow-elegant-dark transition-all duration-500 transform-style-preserve-3d hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:[transform:translateZ(40px)]">
                          {/* Property Image */}
                          <div className="relative h-[160px] overflow-hidden">
                            <Image 
                              src="/images/flat1.png"
                              alt="Элитная квартира"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-sm text-white text-xs md:block hidden">
                              ЖК Олимп
                            </div>
                            <div className="absolute top-4 right-4 px-2 py-1 bg-dark-graphite/80 backdrop-blur-sm rounded-sm text-white text-xs border border-luxury-gold/30 md:block hidden">
                              1/2
                            </div>
                          </div>
                          
                          {/* Property Info */}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-medium text-white">ЖК Олимп, 3-комн.</h4>
                              <span className="text-luxury-gold text-lg font-semibold">15 000 000 ₽</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-4">Ленина 43к3</p>
                            
                            {/* Property Details */}
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Площадь: 85 м²
                              </div>
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Комнат: 3
                              </div>
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Этаж: 5/9
                              </div>
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Санузлы: 2
                              </div>
                            </div>
                            
                            {/* Realtor Notes */}
                            <div className="flex items-center mb-4 text-xs text-blue-300">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Есть комментарий риелтора
                            </div>
                            
                            {/* Action Button */}
                            <button className="w-full py-2.5 bg-transparent border border-luxury-gold/30 text-luxury-gold text-sm rounded-sm flex items-center justify-center space-x-2 hover:bg-luxury-gold/10 transition-colors duration-300">
                              <span>Подробнее об объекте</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Third Property Card - Right */}
                      <div className="absolute z-10 top-36 -right-16 transform transition-all duration-500 group-hover:translate-x-12 group-hover:translate-y-0 hover:z-30 transform-style-preserve-3d">
                        <div className="w-[280px] bg-dark-graphite text-white rounded-sm border border-dark-slate overflow-hidden shadow-elegant-dark transition-all duration-500 transform-style-preserve-3d hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:[transform:rotateY(-15deg)_translateZ(60px)]">
                          {/* Property Image */}
                          <div className="relative h-[160px] overflow-hidden">
                            <Image 
                              src="/images/house7.png"
                              alt="Загородный дом"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-sm text-white text-xs md:block hidden">
                              Коттедж
                            </div>
                            <div className="absolute top-4 right-4 px-2 py-1 bg-dark-graphite/80 backdrop-blur-sm rounded-sm text-white text-xs border border-luxury-gold/30 md:block hidden">
                              1/5
                            </div>
                          </div>
                          
                          {/* Property Info */}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-medium text-white">Дом, Зеленый сад</h4>
                              <span className="text-luxury-gold text-lg font-semibold">23 400 000 ₽</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-4">Сосновая ул., 12</p>
                            
                            {/* Property Details */}
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Площадь: 95 м²
                              </div>
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Комнат: 6
                              </div>
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Этажей: 2
                              </div>
                              <div className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Санузлы: 3
                              </div>
                            </div>
                            
                            {/* Realtor Notes */}
                            <div className="flex items-center mb-4 text-xs text-blue-300">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Есть комментарий риелтора
                            </div>
                            
                            {/* Action Button */}
                            <button className="w-full py-2.5 bg-transparent border border-luxury-gold/30 text-luxury-gold text-sm rounded-sm flex items-center justify-center space-x-2 hover:bg-luxury-gold/10 transition-colors duration-300">
                              <span>Подробнее об объекте</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Property Cards Carousel - Visible only on Mobile */}
                    <div className="md:hidden relative w-full h-[500px] flex items-center justify-center mt-0" id="mobile-property-carousel">
                      <div className="relative w-full h-full flex items-center justify-center perspective-[1200px]">
                        {/* Property Cards Container */}
                        <div className="relative w-full h-[420px] flex items-center justify-center">
                          {/* Cards will be positioned absolutely within this container */}
                          {/* Left Card (initially hidden to the left) */}
                          <div 
                            id="property-card-left" 
                            className="absolute transform transition-all duration-500 ease-out -translate-x-[120%] scale-[0.77] z-10 opacity-90"
                          >
                            <div className="w-[280px] bg-dark-graphite text-white rounded-sm border border-dark-slate overflow-hidden shadow-elegant-dark transition-all duration-500">
                              {/* Property Image */}
                              <div className="relative h-[160px] overflow-hidden">
                                <Image 
                                  src="/images/house3.png"
                                  alt="Современный жилой комплекс"
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-sm text-white text-xs md:block hidden">
                                  ЖК Престиж
                                </div>
                                <div className="absolute top-4 right-4 px-2 py-1 bg-dark-graphite/80 backdrop-blur-sm rounded-sm text-white text-xs border border-luxury-gold/30 md:block hidden">
                                  1/3
                                </div>
                              </div>
                              
                              {/* Property Info */}
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-lg font-medium text-white">ЖК Престиж, 2-комн.</h4>
                                  <span className="text-luxury-gold text-lg font-semibold">8 500 000 ₽</span>
                                </div>
                                <p className="text-sm text-gray-300 mb-4">Ленинский пр-т, 136</p>
                                
                                {/* Property Details */}
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Площадь: 65 м²
                                  </div>
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Комнат: 2
                                  </div>
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Этаж: 7/12
                                  </div>
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Санузлы: 1
                                  </div>
                                </div>
                                
                                {/* Action Button */}
                                <button className="w-full py-2.5 bg-transparent border border-luxury-gold/30 text-luxury-gold text-sm rounded-sm flex items-center justify-center space-x-2 hover:bg-luxury-gold/10 transition-colors duration-300">
                                  <span>Подробнее об объекте</span>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Center Card (initially in focus) */}
                          <div 
                            id="property-card-center" 
                            className="absolute transform transition-all duration-500 ease-out z-30"
                          >
                            <div className="w-[280px] bg-dark-graphite text-white rounded-sm border border-dark-slate overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all duration-500">
                              {/* Property Image */}
                              <div className="relative h-[160px] overflow-hidden">
                                <Image 
                                  src="/images/flat1.png"
                                  alt="Элитная квартира"
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-sm text-white text-xs md:block hidden">
                                  ЖК Олимп
                                </div>
                                <div className="absolute top-4 right-4 px-2 py-1 bg-dark-graphite/80 backdrop-blur-sm rounded-sm text-white text-xs border border-luxury-gold/30 md:block hidden">
                                  1/2
                                </div>
                              </div>
                              
                              {/* Property Info */}
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-lg font-medium text-white">ЖК Олимп, 3-комн.</h4>
                                  <span className="text-luxury-gold text-lg font-semibold">15 000 000 ₽</span>
                                </div>
                                <p className="text-sm text-gray-300 mb-4">Ленина 43к3</p>
                                
                                {/* Property Details */}
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Площадь: 85 м²
                                  </div>
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Комнат: 3
                                  </div>
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Этаж: 5/9
                                  </div>
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Санузлы: 2
                                  </div>
                                </div>
                                
                                {/* Action Button */}
                                <button className="w-full py-2.5 bg-transparent border border-luxury-gold/30 text-luxury-gold text-sm rounded-sm flex items-center justify-center space-x-2 hover:bg-luxury-gold/10 transition-colors duration-300">
                                  <span>Подробнее об объекте</span>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Right Card (initially to the right) */}
                          <div 
                            id="property-card-right" 
                            className="absolute transform transition-all duration-500 ease-out translate-x-[120%] scale-[0.77] z-10 opacity-90"
                          >
                            <div className="w-[280px] bg-dark-graphite text-white rounded-sm border border-dark-slate overflow-hidden shadow-elegant-dark transition-all duration-500">
                              {/* Property Image */}
                              <div className="relative h-[160px] overflow-hidden">
                                <Image 
                                  src="/images/house7.png"
                                  alt="Загородный дом"
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-sm text-white text-xs md:block hidden">
                                  Коттедж
                                </div>
                                <div className="absolute top-4 right-4 px-2 py-1 bg-dark-graphite/80 backdrop-blur-sm rounded-sm text-white text-xs border border-luxury-gold/30 md:block hidden">
                                  1/5
                                </div>
                              </div>
                              
                              {/* Property Info */}
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-lg font-medium text-white">Дом, Зеленый сад</h4>
                                  <span className="text-luxury-gold text-lg font-semibold">23 400 000 ₽</span>
                                </div>
                                <p className="text-sm text-gray-300 mb-4">Сосновая ул., 12</p>
                                
                                {/* Property Details */}
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Площадь: 95 м²
                                  </div>
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Комнат: 6
                                  </div>
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Этажей: 2
                                  </div>
                                  <div className="flex items-center text-sm text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    Санузлы: 3
                                  </div>
                                </div>
                                
                                {/* Action Button */}
                                <button className="w-full py-2.5 bg-transparent border border-luxury-gold/30 text-luxury-gold text-sm rounded-sm flex items-center justify-center space-x-2 hover:bg-luxury-gold/10 transition-colors duration-300">
                                  <span>Подробнее об объекте</span>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                          <button className="w-2 h-2 rounded-full bg-gray-400 focus:outline-none" id="indicator-0"></button>
                          <button className="w-2 h-2 rounded-full bg-luxury-gold focus:outline-none" id="indicator-1"></button>
                          <button className="w-2 h-2 rounded-full bg-gray-400 focus:outline-none" id="indicator-2"></button>
                        </div>

                        {/* Slide Instructions */}
                        <div className="absolute bottom-10 left-0 right-0 text-center text-xs text-gray-500">
                          <p>Проведите влево или вправо для просмотра</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Client Management Section */}
              <div className="relative group animate-fade-in-up w-full max-w-4xl mx-auto md:mt-0 mt-[0px]" style={{animationDelay: '200ms'}}>
                <div className="absolute inset-[-2px] bg-gradient-to-br from-luxury-gold/20 via-luxury-gold/5 to-transparent dark:from-luxury-royalBlue/20 dark:via-luxury-royalBlue/5 dark:to-transparent rounded-sm blur-[5px] opacity-0 group-hover:opacity-100 transition-all duration-700 z-0"></div>
                <div className="p-0 relative z-10 h-full flex flex-col md:flex-row rounded-sm border border-gray-100 dark:border-dark-slate group-hover:border-luxury-gold/30 dark:group-hover:border-luxury-royalBlue/30 transition-all duration-500 theme-transition overflow-visible">
                  
                  {/* Content Section */}
                  <div className="w-full md:w-1/2 p-8 bg-white dark:bg-dark-graphite shadow-subtle dark:shadow-elegant-dark theme-transition">
                    {/* Icon with elegant background */}
                    <div className="w-20 h-20 mb-8 relative">
                      <div className="absolute inset-0 bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 rounded-sm rotate-[10deg] group-hover:rotate-[5deg] transition-all duration-700"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-white/50 dark:from-luxury-royalBlue/20 dark:to-dark-graphite/50 backdrop-blur-[1px] rounded-sm -rotate-[5deg] group-hover:rotate-0 transition-all duration-700 border border-luxury-gold/20 dark:border-luxury-royalBlue/20 group-hover:border-luxury-gold/40 dark:group-hover:border-luxury-royalBlue/40"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-serif font-medium mb-4 text-luxury-black dark:text-white theme-transition">Управление клиентами</h3>
                    <p className="text-base text-luxury-black/70 dark:text-white/70 mb-8 leading-relaxed theme-transition">
                      Ведите базу ваших клиентов и их предпочтений для более персонализированного и эффективного обслуживания.
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 mr-3 mt-0.5 theme-transition">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">Хранение контактной информации</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 mr-3 mt-0.5 theme-transition">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">Отслеживание предпочтений по недвижимости</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-gold/10 dark:bg-luxury-royalBlue/10 mr-3 mt-0.5 theme-transition">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="#D4AF37" className="dark:stroke-luxury-royalBlue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition">История взаимодействий с клиентом</p>
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <div className="mt-auto">
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-luxury-gold/30 dark:via-luxury-royalBlue/30 to-transparent mb-8 theme-transition"></div>
                      <Link href="/register" className="group/btn">
                        <Button variant="ghost" className="px-0 text-luxury-gold dark:text-luxury-royalBlue hover:bg-transparent hover:text-luxury-gold/80 dark:hover:text-luxury-royalBlue/80 theme-transition flex items-center">
                          <span>Начать управлять клиентами</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" className="ml-2 transform translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Client Cards Preview Section */}
                  <div className="w-full md:w-1/2 relative overflow-visible bg-gray-50 dark:bg-dark-slate theme-transition p-8 flex items-start justify-center">
                    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-visible">
                      {/* Removed background pattern and gradient overlays for monolithic color */}
                      
                      {/* Client Cards */}
                      <div className="relative w-full max-w-xs pt-20 pb-40 group z-50 md:mt-[-250px] mt-[-50px]">
                        {/* First Client Card */}
                        <div className="absolute z-10 -left-16 transform -rotate-12 transition-all duration-300 group-hover:-translate-x-12 group-hover:-rotate-24 group-hover:translate-y-2 hover:z-30">
                          <div className="w-[280px] bg-white dark:bg-dark-graphite shadow-elegant dark:shadow-elegant-dark rounded-sm border border-gray-100 dark:border-dark-slate p-5 theme-transition">
                            {/* Client Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 overflow-hidden theme-transition">
                                <Image 
                                  src="/images/face1.png"
                                  alt="Alexandra's avatar"
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-luxury-black dark:text-white theme-transition">
                                  Александра
                                </h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 7H12.01M12 17H12.01M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 theme-transition">Социальные сети</span>
                                </div>
                              </div>
                              <button className="ml-auto text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                            
                            {/* Contact Information */}
                            <div className="mb-4 space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 theme-transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>+7 999 5679822</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 theme-transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>alexandra@gmail.com</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 theme-transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>Последний контакт: 02.05.2025, 21:57</span>
                              </div>
                            </div>
                            
                            {/* Client Info Section */}
                            <div className="space-y-3 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-xs font-medium text-luxury-black dark:text-white theme-transition uppercase">ЗАПРОС НА НЕДВИЖИМОСТЬ</span>
                                </div>
                                <div className="px-4 py-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">Таунхаус</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">2.0 млн ₽ - 8.0 млн ₽</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">Ипотека</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-xs font-medium text-luxury-black dark:text-white theme-transition uppercase">ПРЕДПОЧТЕНИЯ</span>
                                </div>
                                <div className="px-4 py-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">1-3 комн.</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01M8.5 8h.01M12 8h.01M15.5 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">35-70 м²</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between mt-4 pt-2 border-t border-gray-100 dark:border-dark-slate">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs ml-1 text-gray-600 dark:text-gray-300 theme-transition">СТАТУС</span>
                                  </div>
                                  <div className="ml-6 flex items-center mt-1">
                                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                                    <span className="text-xs text-green-600 dark:text-green-400 theme-transition">Просмотр</span>
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                      <path d="M21 9v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9M21 9L12 2 3 9M21 9l-9 6-9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs ml-1 text-gray-600 dark:text-gray-300 theme-transition">ОБЪЕКТЫ</span>
                                  </div>
                                  <div className="ml-6 mt-1">
                                    <span className="text-xs text-blue-500">1 объект</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Second Client Card */}
                        <div className="absolute z-20 top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 group-hover:translate-y-8 hover:z-30">
                          <div className="w-[280px] bg-white dark:bg-dark-graphite shadow-elegant dark:shadow-elegant-dark rounded-sm border border-gray-100 dark:border-dark-slate p-5 theme-transition">
                            {/* Client Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 overflow-hidden theme-transition">
                                <Image 
                                  src="/images/face5.png"
                                  alt="Mikhail's avatar"
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-luxury-black dark:text-white theme-transition">
                                  Михаил
                                </h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 7H12.01M12 17H12.01M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 theme-transition">Рабочий контакт</span>
                                </div>
                              </div>
                              <button className="ml-auto text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                            
                            {/* Contact Information */}
                            <div className="mb-4 space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 theme-transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>+7 926 123 45 67</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 theme-transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>mikhail@mail.ru</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 theme-transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>Последний контакт: 15.03.2025, 14:22</span>
                              </div>
                            </div>
                            
                            {/* Client Info Section */}
                            <div className="space-y-3 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-xs font-medium text-luxury-black dark:text-white theme-transition uppercase">ЗАПРОС НА НЕДВИЖИМОСТЬ</span>
                                </div>
                                <div className="px-4 py-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">Квартира</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">6.0 млн ₽ - 12.0 млн ₽</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">Вторичка</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-xs font-medium text-luxury-black dark:text-white theme-transition uppercase">ПРЕДПОЧТЕНИЯ</span>
                                </div>
                                <div className="px-4 py-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">2-3 комн.</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01M8.5 8h.01M12 8h.01M15.5 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">50-90 м²</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between mt-4 pt-2 border-t border-gray-100 dark:border-dark-slate">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs ml-1 text-gray-600 dark:text-gray-300 theme-transition">СТАТУС</span>
                                  </div>
                                  <div className="ml-6 flex items-center mt-1">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                    <span className="text-xs text-green-600 dark:text-green-400 theme-transition">Активно</span>
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                      <path d="M21 9v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9M21 9L12 2 3 9M21 9l-9 6-9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs ml-1 text-gray-600 dark:text-gray-300 theme-transition">ОБЪЕКТЫ</span>
                                  </div>
                                  <div className="ml-6 mt-1">
                                    <span className="text-xs text-green-500">3 объекта</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Third Client Card */}
                        <div className="absolute z-10 top-4 -right-16 transform rotate-12 transition-all duration-300 group-hover:translate-x-12 group-hover:rotate-24 group-hover:translate-y-2 hover:z-30">
                          <div className="w-[280px] bg-white dark:bg-dark-graphite shadow-elegant dark:shadow-elegant-dark rounded-sm border border-gray-100 dark:border-dark-slate p-5 theme-transition">
                            {/* Client Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 overflow-hidden theme-transition">
                                <Image 
                                  src="/images/face8.png"
                                  alt="Elena's avatar"
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-luxury-black dark:text-white theme-transition">
                                  Елена
                                </h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 7H12.01M12 17H12.01M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 theme-transition">Личный контакт</span>
                                </div>
                              </div>
                              <button className="ml-auto text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                            
                            {/* Contact Information */}
                            <div className="mb-4 space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 theme-transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>+7 905 987 65 43</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 theme-transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>elena.kovaleva@yandex.ru</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 theme-transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>Последний контакт: 28.04.2025, 09:15</span>
                              </div>
                            </div>
                            
                            {/* Client Info Section */}
                            <div className="space-y-3 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-xs font-medium text-luxury-black dark:text-white theme-transition uppercase">ЗАПРОС НА НЕДВИЖИМОСТЬ</span>
                                </div>
                                <div className="px-4 py-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">Дом</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">10.0 млн ₽ - 20.0 млн ₽</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">Новостройка</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-xs font-medium text-luxury-black dark:text-white theme-transition uppercase">ПРЕДПОЧТЕНИЯ</span>
                                </div>
                                <div className="px-4 py-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">4+ комн.</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01M8.5 8h.01M12 8h.01M15.5 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 theme-transition">120-200 м²</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between mt-4 pt-2 border-t border-gray-100 dark:border-dark-slate">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs ml-1 text-gray-600 dark:text-gray-300 theme-transition">СТАТУС</span>
                                  </div>
                                  <div className="ml-6 flex items-center mt-1">
                                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                                    <span className="text-xs text-green-600 dark:text-green-400 theme-transition">Просмотр</span>
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                      <path d="M21 9v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9M21 9L12 2 3 9M21 9l-9 6-9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-xs ml-1 text-gray-600 dark:text-gray-300 theme-transition">ОБЪЕКТЫ</span>
                                  </div>
                                  <div className="ml-6 mt-1">
                                    <span className="text-xs text-amber-500">2 объекта</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury accent bar */}
          <div className="relative h-20 mt-16">
            <div className="absolute inset-x-0 h-[1px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-transparent via-luxury-gold/50 dark:via-luxury-royalBlue/50 to-transparent theme-transition"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Link href="/register">
                <Button className="bg-white dark:bg-dark-charcoal hover:bg-white/90 dark:hover:bg-dark-charcoal/80 border-2 border-luxury-gold dark:border-luxury-royalBlue text-luxury-gold dark:text-luxury-royalBlue shadow-[0_0_15px_rgba(212,175,55,0.3)] dark:shadow-[0_0_15px_rgba(24,90,219,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] dark:hover:shadow-[0_0_25px_rgba(24,90,219,0.5)] transition-all duration-500 px-8 py-6 rounded-sm theme-transition" animation="scale">
                  Зарегистрироваться бесплатно
                </Button>
              </Link>
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
                <li><Link href="/about" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">О платформе</Link></li>
                <li><Link href="#contact" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">Контакты</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-white dark:text-white theme-transition">Правовая информация</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/agreement" className="text-white/90 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">
                    Пользовательское соглашение
                  </Link>
                </li>
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
                  <span className="text-white/90 dark:text-white/80 theme-transition">rieltorprorf@mail.ru</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-luxury-gold dark:text-luxury-royalBlue theme-transition">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/90 dark:text-white/80 theme-transition">+79991378919</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-white dark:text-white theme-transition">
                <Link href="/requisites" className="hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300">
                  Реквизиты
                </Link>
              </h4>
              <ul className="space-y-3">
                <li className="text-white/90 dark:text-white/80 theme-transition">Анисимов Константин Александрович</li>
                <li className="text-white/90 dark:text-white/80 theme-transition">ИНН: 526319437963</li>
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

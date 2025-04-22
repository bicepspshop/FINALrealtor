"use client"

import { useEffect } from "react"

export function LuxuryEffects() {
  useEffect(() => {
    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to viewport center
      const mouseX = e.clientX / window.innerWidth - 0.5
      const mouseY = e.clientY / window.innerHeight - 0.5
      // Apply parallax to hero background - with limited radius
      const heroImage = document.querySelector('.hero-parallax-image') as HTMLElement
      if (heroImage) {
        // Limit the movement to a reasonable radius (15px max movement)
        const moveX = mouseX * -30
        const moveY = mouseY * -30
        // Don't add scroll position as part of the transform to avoid image disappearing
        heroImage.style.transform = `scale(1.1) translate3d(${moveX}px, ${moveY}px, 0)`
      }
      
      // Apply parallax to orbital system
      const orbitalSystem = document.querySelector('.luxury-orbital-system') as HTMLElement
      if (orbitalSystem) {
        orbitalSystem.style.transform = `translate3d(${mouseX * 20}px, ${mouseY * 20}px, 0)`
      }
      
      // Apply subtle parallax to luxury orbs
      const orbs = document.querySelectorAll('.luxury-orb') as NodeListOf<HTMLElement>
      orbs.forEach((orb, index) => {
        const depth = index % 2 === 0 ? 15 : 25
        orb.style.transform = `translate3d(${mouseX * depth}px, ${mouseY * depth}px, 0)`
      })
      
      // Apply parallax to property cards
      const propertyCards = document.querySelectorAll('.luxury-property-card') as NodeListOf<HTMLElement>
      propertyCards.forEach((card) => {
        card.style.transform = `translateY(0) translate3d(${mouseX * 10}px, ${mouseY * 10}px, 0)`
        
        // Apply hover state to property card on hover
        card.addEventListener('mouseenter', () => {
          card.style.transform = `translateY(-5px) translate3d(${mouseX * 10}px, ${mouseY * 10}px, 0)`
        })
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = `translateY(0) translate3d(${mouseX * 10}px, ${mouseY * 10}px, 0)`
        })
      })
      
      // Apply parallax to light beams
      const lightBeams = document.querySelectorAll('.luxury-light-beam, .luxury-light-beam-slow') as NodeListOf<HTMLElement>
      lightBeams.forEach((beam) => {
        beam.style.transform = `translate3d(${mouseX * -15}px, 0, 0)`
      })
      
      // Apply subtle parallax to rose background
      const roseBackground = document.querySelector('.luxury-rose-background') as HTMLElement
      if (roseBackground && roseBackground.classList.contains('visible')) {
        // Subtle movement - more subtle than other parallax effects
        roseBackground.style.backgroundPosition = `calc(50% + ${mouseX * 10}px) calc(50% + ${mouseY * 10}px)`
      }
    }
    
    // Scroll animations
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // ROSE BACKGROUND EFFECT
      // Get the luxury gallery section
      const gallerySection = document.querySelector('.luxury-gallery-section')
      const fadeOverlay = document.querySelector('.luxury-fade-overlay') as HTMLElement
      
      if (gallerySection && fadeOverlay) {
        // Get the position of the gallery section relative to the viewport
        const rect = gallerySection.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Calculate how visible the section is
        const sectionTop = rect.top
        const sectionBottom = rect.bottom
        const sectionHeight = rect.height
        
        // Calculate visibility ratio - how centered the section is in the viewport
        // 1 = perfectly centered, 0 = completely out of view
        let visibilityRatio = 0
        
        if (sectionTop <= windowHeight && sectionBottom >= 0) {
          // Section is at least partially visible
          const visibleHeight = Math.min(windowHeight, sectionBottom) - Math.max(0, sectionTop)
          const centerOffset = Math.abs((windowHeight / 2) - (sectionTop + sectionHeight / 2))
          const maxOffset = windowHeight / 2 + sectionHeight / 2
          
          // Calculate ratio based on how centered the section is
          visibilityRatio = (1 - (centerOffset / maxOffset)) * (visibleHeight / Math.min(windowHeight, sectionHeight))
          visibilityRatio = Math.max(0, Math.min(1, visibilityRatio)) // Clamp between 0 and 1
        }
        
        // Control the overlay opacity - higher visibility = lower overlay opacity
        const overlayOpacity = Math.max(0.2, 1 - (visibilityRatio * 0.8)) // Keeps a bit of darkness (min 20%)
        fadeOverlay.style.opacity = String(overlayOpacity)
        
        // Apply styles to the rose background based on visibility ratio
        const roseBackground = document.querySelector('.luxury-rose-background') as HTMLElement
        if (roseBackground) {
          const scaleValue = 1 + (0.1 * (1 - visibilityRatio)) // Reduced scale from 1.15 to 1.1
          const yOffset = 20 * (1 - visibilityRatio) // Move up/down slightly based on scroll
          
          // Apply smooth transitions
          roseBackground.style.transform = `scale(${scaleValue}) translateY(${yOffset}px)`
          // Adjust brightness and contrast based on visibility - with more dramatic values
          roseBackground.style.filter = `brightness(${3.0 + 0.5 * visibilityRatio}) contrast(${1.2 + 0.2 * visibilityRatio}) saturate(${1.2 + 0.3 * visibilityRatio})`
        }
      }
      
      // Animation for text reveal elements
      const revealElements = document.querySelectorAll('.reveal-text') as NodeListOf<HTMLElement>
      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
        
        if (elementTop < windowHeight - 100) {
          // Element is in view
          element.style.animationPlayState = 'running'
        }
      })
      
      // Animation for light beams on scroll
      const beams = document.querySelectorAll('.luxury-light-beam, .luxury-light-beam-slow') as NodeListOf<HTMLElement>
      beams.forEach((beam, index) => {
        const scrollFactor = index % 2 === 0 ? 0.05 : -0.05
        beam.style.height = `${Math.max(30, 30 + scrollY * scrollFactor)}vh`
      })
    }
    
    // Initialize smooth scroll behavior for hash navigation
    const initSmoothScroll = () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
          e.preventDefault()
          const href = this.getAttribute('href')
          if (href) {
            const targetElement = document.querySelector(href)
            if (targetElement) {
              targetElement.scrollIntoView({
                behavior: 'smooth'
              })
            }
          }
        })
      })
    }
    
    // Mouse cursor effect
    const addCursorEffect = () => {
      // Create cursor follower element
      const cursorFollower = document.createElement('div')
      cursorFollower.className = 'luxury-cursor-follower'
      document.body.appendChild(cursorFollower)
      
      // Style the cursor follower
      Object.assign(cursorFollower.style, {
        position: 'fixed',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'rgba(212, 175, 55, 0.2)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        pointerEvents: 'none',
        zIndex: '9999',
        transform: 'translate(-50%, -50%)',
        opacity: '0',
        transition: 'transform 0.15s ease-out, width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
      })
      
      // Move cursor follower with mouse
      document.addEventListener('mousemove', (e) => {
        cursorFollower.style.opacity = '1'
        cursorFollower.style.left = `${e.clientX}px`
        cursorFollower.style.top = `${e.clientY}px`
      })
      
      // Detect interactive elements for cursor effect
      const interactiveElements = document.querySelectorAll('a, button, [role="button"]')
      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          cursorFollower.style.width = '40px'
          cursorFollower.style.height = '40px'
          cursorFollower.style.background = 'rgba(212, 175, 55, 0.1)'
          cursorFollower.style.border = '1px solid rgba(212, 175, 55, 0.5)'
        })
        
        element.addEventListener('mouseleave', () => {
          cursorFollower.style.width = '20px'
          cursorFollower.style.height = '20px'
          cursorFollower.style.background = 'rgba(212, 175, 55, 0.2)'
          cursorFollower.style.border = '1px solid rgba(212, 175, 55, 0.3)'
        })
      })
      
      // Hide cursor follower when mouse leaves the window
      document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget) {
          cursorFollower.style.opacity = '0'
        }
      })
    }
    
    // Apply parallax effect to rose background
    const applyRoseParallax = () => {
      const roseBackground = document.querySelector('.luxury-rose-background') as HTMLElement
      if (roseBackground) {
        const handleRoseMouseMove = (e: MouseEvent) => {
          const mouseX = e.clientX / window.innerWidth - 0.5
          const mouseY = e.clientY / window.innerHeight - 0.5
          roseBackground.style.backgroundPosition = `calc(50% + ${mouseX * 10}px) calc(50% + ${mouseY * 10}px)`
        }
        
        document.addEventListener('mousemove', handleRoseMouseMove)
        
        // Return cleanup function to remove listener
        return () => {
          document.removeEventListener('mousemove', handleRoseMouseMove)
        }
      }
      return () => {}
    }
    
    // Initialize effects when component mounts
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    initSmoothScroll()
    
    // Apply rose parallax effect
    const cleanupRoseParallax = applyRoseParallax()
    
    // Only add cursor effect on desktop
    if (window.innerWidth > 768) {
      addCursorEffect()
    }
    
    // Trigger initial scroll effect
    handleScroll()
    
    // Cleanup when component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      
      // Clean up rose parallax effect
      cleanupRoseParallax()
      
      // Remove cursor follower
      const cursorFollower = document.querySelector('.luxury-cursor-follower')
      if (cursorFollower) {
        document.body.removeChild(cursorFollower)
      }
    }
  }, [])
  
  return null
}

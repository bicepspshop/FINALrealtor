"use client"

import { PropertyCarousel } from "./property-carousel"
import { MapPinIcon, BedDouble as BedIcon, Bath as ShowerIcon, SquareIcon, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

// Define the Property type
interface Property {
  title: string
  description: string
  price: number
  address: string
  city: string
  state: string
  zipCode: string
  photos: string[]
  beds: number
  baths: number
  squareFeet: number
  yearBuilt: number
  features?: string[]
}

interface PropertyDetailProps {
  property: Property
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const {
    title,
    description,
    price,
    address,
    city,
    state,
    zipCode,
    photos,
    beds,
    baths,
    squareFeet,
    yearBuilt,
    features,
  } = property

  return (
    <div className="bg-neutral-950 text-white">
      {/* Property Carousel */}
      <PropertyCarousel images={photos || []} />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                <div className="text-2xl font-semibold text-gold">{formatPrice(price)}</div>
              </div>
              <div className="flex items-center mt-2 text-neutral-400">
                <MapPinIcon size={16} className="mr-1 text-gold" />
                <span>{address}, {city}, {state} {zipCode}</span>
              </div>
            </div>
            
            {/* Property Specs */}
            <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-lg border border-neutral-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center">
                  <BedIcon size={24} className="text-gold mb-2" />
                  <span className="text-xl font-medium">{beds}</span>
                  <span className="text-sm text-neutral-400">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShowerIcon size={24} className="text-gold mb-2" />
                  <span className="text-xl font-medium">{baths}</span>
                  <span className="text-sm text-neutral-400">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center">
                  <SquareIcon size={24} className="text-gold mb-2" />
                  <span className="text-xl font-medium">{squareFeet}</span>
                  <span className="text-sm text-neutral-400">Square Feet</span>
                </div>
                <div className="flex flex-col items-center">
                  <CalendarIcon size={24} className="text-gold mb-2" />
                  <span className="text-xl font-medium">{yearBuilt}</span>
                  <span className="text-sm text-neutral-400">Year Built</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Property Description</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-neutral-300 leading-relaxed">{description}</p>
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                    <span className="text-neutral-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact & Map */}
          <div className="space-y-8">
            {/* Contact Form */}
            <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-lg border border-neutral-800">
              <h3 className="text-xl font-semibold text-white mb-4">Interested in this property?</h3>
              <p className="text-neutral-400 mb-4">Fill out the form below and we'll get back to you as soon as possible.</p>
              
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-neutral-300">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-neutral-300">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm text-neutral-300">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm text-neutral-300">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    defaultValue={`I'm interested in ${address}, ${city}, ${state} ${zipCode}`}
                  ></textarea>
                </div>
                <Button className="w-full bg-gold hover:bg-gold/80 text-black font-semibold">
                  Send Inquiry
                </Button>
              </form>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-neutral-900/50 backdrop-blur-sm p-4 rounded-lg border border-neutral-800">
              <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
              <div className="aspect-video bg-neutral-800 rounded-md flex items-center justify-center">
                <span className="text-neutral-500">Map goes here</span>
              </div>
              <p className="mt-2 text-sm text-neutral-400">
                {address}, {city}, {state} {zipCode}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Properties Section */}
      <div className="bg-neutral-900 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* This would map through related properties */}
            <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-gold transition-all duration-300">
              <div className="h-48 bg-neutral-700"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">Similar Property</h3>
                <p className="text-neutral-400 text-sm">Address here</p>
                <div className="mt-2 text-gold font-semibold">$000,000</div>
              </div>
            </div>
            <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-gold transition-all duration-300">
              <div className="h-48 bg-neutral-700"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">Similar Property</h3>
                <p className="text-neutral-400 text-sm">Address here</p>
                <div className="mt-2 text-gold font-semibold">$000,000</div>
              </div>
            </div>
            <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-gold transition-all duration-300">
              <div className="h-48 bg-neutral-700"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">Similar Property</h3>
                <p className="text-neutral-400 text-sm">Address here</p>
                <div className="mt-2 text-gold font-semibold">$000,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
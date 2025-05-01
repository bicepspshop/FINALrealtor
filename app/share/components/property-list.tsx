"use client"

import { PropertyCardWithComment } from "./property-card-with-comment"

interface PropertyImage {
  id: string
  image_url: string
}

interface Property {
  id: string
  property_type: string
  address: string
  rooms: number | null
  area: number
  price: number
  description: string | null
  property_images: PropertyImage[]
  living_area?: number | null
  floor?: number | null
  total_floors?: number | null
  bathroom_count?: number | null
  floor_plan_url?: string | null
  residential_complex?: string | null
}

interface PropertyListProps {
  properties: Property[]
}

export function PropertyList({ properties }: PropertyListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-8 xl:gap-x-8">
      {properties.map((property, index) => (
        <PropertyCardWithComment key={property.id} property={property} index={index} />
      ))}
    </div>
  )
}
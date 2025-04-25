"use client"

import { PropertyCard } from "./property-card"
import { SimpleCommentForm } from "../components/comments"

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

interface PropertyCardWithCommentProps {
  property: Property
  index?: number
}

export function PropertyCardWithComment({ property, index }: PropertyCardWithCommentProps) {
  return (
    <div className="flex flex-col">
      <PropertyCard property={property} index={index} />
      <SimpleCommentForm propertyId={property.id} />
    </div>
  )
}
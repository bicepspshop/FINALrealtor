"use client"

import { useState } from "react"
import { PropertyCard } from "./property-card"
import { PropertyFilters } from "./property-filters"

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
  description: string
  property_images: PropertyImage[]
  living_area?: number | null
  floor?: number | null
  total_floors?: number | null
  bathroom_count?: number | null
}

interface FilterablePropertyListProps {
  properties: Property[]
}

export function FilterablePropertyList({ properties }: FilterablePropertyListProps) {
  const [filters, setFilters] = useState<{
    priceMin?: number
    priceMax?: number
    areaMin?: number
    areaMax?: number
    rooms?: number | null
    propertyType?: string | null
  }>({})

  const filteredProperties = properties.filter((property) => {
    // Фильтр по цене
    if (filters.priceMin && property.price < filters.priceMin) return false
    if (filters.priceMax && property.price > filters.priceMax) return false

    // Фильтр по площади
    if (filters.areaMin && property.area < filters.areaMin) return false
    if (filters.areaMax && property.area > filters.areaMax) return false

    // Фильтр по комнатам
    if (filters.rooms && property.rooms !== filters.rooms) return false

    // Фильтр по типу объекта
    if (filters.propertyType && property.property_type !== filters.propertyType) return false

    return true
  })

  return (
    <div>
      <PropertyFilters onFilterChange={setFilters} />

      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">Нет объектов, соответствующих фильтрам</h2>
          <p className="text-gray-500 mt-2">Попробуйте изменить параметры фильтрации</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}

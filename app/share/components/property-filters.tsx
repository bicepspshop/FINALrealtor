"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertyFiltersProps {
  onFilterChange: (filters: {
    priceMin?: number
    priceMax?: number
    areaMin?: number
    areaMax?: number
    rooms?: number | null
    propertyType?: string | null
  }) => void
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [priceMin, setPriceMin] = useState<string>("")
  const [priceMax, setPriceMax] = useState<string>("")
  const [areaMin, setAreaMin] = useState<string>("")
  const [areaMax, setAreaMax] = useState<string>("")
  const [rooms, setRooms] = useState<string>("")
  const [propertyType, setPropertyType] = useState<string>("")

  const handleApplyFilters = () => {
    onFilterChange({
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      areaMin: areaMin ? Number(areaMin) : undefined,
      areaMax: areaMax ? Number(areaMax) : undefined,
      rooms: rooms ? Number(rooms) : null,
      propertyType: propertyType || null,
    })
  }

  const handleResetFilters = () => {
    setPriceMin("")
    setPriceMax("")
    setAreaMin("")
    setAreaMax("")
    setRooms("")
    setPropertyType("")
    onFilterChange({})
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Фильтры</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Цена, ₽</p>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="От"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full"
            />
            <span className="text-gray-500">—</span>
            <Input
              type="number"
              placeholder="До"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Площадь, м²</p>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="От"
              value={areaMin}
              onChange={(e) => setAreaMin(e.target.value)}
              className="w-full"
            />
            <span className="text-gray-500">—</span>
            <Input
              type="number"
              placeholder="До"
              value={areaMax}
              onChange={(e) => setAreaMax(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Комнаты</p>
            <Select value={rooms} onValueChange={setRooms}>
              <SelectTrigger>
                <SelectValue placeholder="Любое" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Любое</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Тип объекта</p>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Любой" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Любой</SelectItem>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="house">Дом</SelectItem>
                <SelectItem value="land">Участок</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={handleApplyFilters} className="flex-1">
          Применить
        </Button>
        <Button variant="outline" onClick={handleResetFilters}>
          Сбросить
        </Button>
      </div>
    </div>
  )
}

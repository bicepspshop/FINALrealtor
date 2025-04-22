"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { YandexMap } from "@/components/yandex-map"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useState } from "react"

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
  balcony?: boolean
  year_built?: number | null
  renovation_type?: string | null
  bathroom_count?: number | null
  has_parking?: boolean
  property_status?: string
}

interface PropertyDetailsProps {
  property: Property
  isOpen: boolean
  onClose: () => void
}

export function PropertyDetails({ property, isOpen, onClose }: PropertyDetailsProps) {
  const [mapError, setMapError] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const propertyTypeLabel =
    {
      apartment: "Квартира",
      house: "Дом",
      land: "Земельный участок",
    }[property.property_type] || "Объект"

  const propertyStatusLabel =
    {
      available: "Доступно",
      sold: "Продано",
      reserved: "Забронировано",
    }[property.property_status || "available"] || "Доступно"

  const renovationTypeLabel =
    {
      "без ремонта": "Без ремонта",
      косметический: "Косметический",
      евроремонт: "Евроремонт",
      дизайнерский: "Дизайнерский",
    }[property.renovation_type || ""] || "Не указано"

  const handleMapError = (error: string) => {
    setMapError(error)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property.address}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="photos">
          <TabsList className="mb-4">
            <TabsTrigger value="photos">Фотографии</TabsTrigger>
            <TabsTrigger value="map">Карта</TabsTrigger>
          </TabsList>

          <TabsContent value="photos">
            {property.property_images.length > 0 ? (
              <div className="mb-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {property.property_images.map((image) => (
                      <CarouselItem key={image.id}>
                        <div className="aspect-video relative rounded-md overflow-hidden">
                          <Image
                            src={image.image_url || "/placeholder.svg"}
                            alt={property.address}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 mb-6 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Нет изображений</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <div className="aspect-video mb-6 rounded-md overflow-hidden">
              {!property.address || property.address.trim().length < 5 ? (
                <Alert variant="warning" className="w-full h-full min-h-[200px] flex items-center justify-center">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Адрес не указан или слишком короткий. Укажите полный адрес для отображения на карте.
                  </AlertDescription>
                </Alert>
              ) : mapError ? (
                <Alert variant="destructive" className="w-full h-full min-h-[200px] flex items-center justify-center">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{mapError}</AlertDescription>
                </Alert>
              ) : (
                <YandexMap address={property.address} className="w-full h-full min-h-[200px]" />
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Основная информация</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Тип объекта</p>
                <p className="font-medium">{propertyTypeLabel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Цена</p>
                <p className="font-medium">{formatPrice(property.price)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Общая площадь</p>
                <p className="font-medium">{property.area} кв.м</p>
              </div>
              {property.living_area && (
                <div>
                  <p className="text-sm text-gray-500">Жилая площадь</p>
                  <p className="font-medium">{property.living_area} кв.м</p>
                </div>
              )}
              {property.rooms !== null && (
                <div>
                  <p className="text-sm text-gray-500">Комнаты</p>
                  <p className="font-medium">{property.rooms}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Статус</p>
                <p className="font-medium">{propertyStatusLabel}</p>
              </div>
            </div>
          </div>

          <Separator />

          {(property.floor !== null || property.total_floors !== null || property.year_built !== null) && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Характеристики здания</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.floor !== null && (
                    <div>
                      <p className="text-sm text-gray-500">Этаж</p>
                      <p className="font-medium">{property.floor}</p>
                    </div>
                  )}
                  {property.total_floors !== null && (
                    <div>
                      <p className="text-sm text-gray-500">Всего этажей</p>
                      <p className="font-medium">{property.total_floors}</p>
                    </div>
                  )}
                  {property.year_built !== null && (
                    <div>
                      <p className="text-sm text-gray-500">Год постройки</p>
                      <p className="font-medium">{property.year_built}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {(property.renovation_type ||
            property.bathroom_count !== null ||
            property.balcony !== null ||
            property.has_parking !== null) && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Дополнительные характеристики</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.renovation_type && (
                    <div>
                      <p className="text-sm text-gray-500">Ремонт</p>
                      <p className="font-medium">{renovationTypeLabel}</p>
                    </div>
                  )}
                  {property.bathroom_count !== null && (
                    <div>
                      <p className="text-sm text-gray-500">Санузлы</p>
                      <p className="font-medium">{property.bathroom_count}</p>
                    </div>
                  )}
                  {property.balcony !== null && (
                    <div>
                      <p className="text-sm text-gray-500">Балкон/лоджия</p>
                      <p className="font-medium">{property.balcony ? "Есть" : "Нет"}</p>
                    </div>
                  )}
                  {property.has_parking !== null && (
                    <div>
                      <p className="text-sm text-gray-500">Парковка</p>
                      <p className="font-medium">{property.has_parking ? "Есть" : "Нет"}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {property.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Описание</h3>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

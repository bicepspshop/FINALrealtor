"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ElegantTabs, ElegantTabsList, ElegantTabsTrigger, ElegantTabsContent } from "@/components/ui/tabs-elegant"
import { YandexMap } from "@/components/yandex-map"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { FallbackMap } from "@/components/fallback-map"
import { TextFolding } from "@/components/ui/text-folding"
import { getPropertyImagesByCategory } from "@/lib/image-utils"

interface PropertyImage {
  id: string
  image_url: string
}

interface Property {
  id: string
  residential_complex?: string | null
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
  floor_plan_url1?: string | null
  floor_plan_url2?: string | null
  floor_plan_url3?: string | null
  window_view_url1?: string | null
  window_view_url2?: string | null
  window_view_url3?: string | null
  interior_finish_url1?: string | null
  interior_finish_url2?: string | null
  interior_finish_url3?: string | null
  agent_comment?: string | null
}

interface PropertyDetailsProps {
  property: Property
  isOpen: boolean
  onClose: () => void
}

export function PropertyDetails({ property, isOpen, onClose }: PropertyDetailsProps) {
  const [mapError, setMapError] = useState<string | null>(null)

  // Get image arrays for each category
  const floorPlanImages = getPropertyImagesByCategory(property, 'floor_plan');
  const windowViewImages = getPropertyImagesByCategory(property, 'window_view');
  const interiorFinishImages = getPropertyImagesByCategory(property, 'interior_finish');

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

    // Function to determine if we should show the images tab section
  const hasAdditionalImages = floorPlanImages.length > 0 || windowViewImages.length > 0 || interiorFinishImages.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property.residential_complex ? `${property.residential_complex} ` : ""}
            {property.address}
          </DialogTitle>
        </DialogHeader>

        <ElegantTabs defaultValue="photos">
          <ElegantTabsList className="mb-4" indicatorClassName="bg-blue-500 dark:bg-blue-500">
            <ElegantTabsTrigger value="photos">Фотографии</ElegantTabsTrigger>
            <ElegantTabsTrigger value="map">Карта</ElegantTabsTrigger>
          </ElegantTabsList>

          <ElegantTabsContent value="photos">
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

            {/* Additional image types in tabs */}
            {hasAdditionalImages && (
              <div className="mt-6 mb-6">
                <ElegantTabs defaultValue={floorPlanImages.length > 0 ? "floor-plan" : windowViewImages.length > 0 ? "window-view" : "interior-finish"}>
                  <ElegantTabsList className="mb-4 w-full" indicatorClassName="bg-blue-500 dark:bg-blue-500">
                    {floorPlanImages.length > 0 && <ElegantTabsTrigger value="floor-plan">Планировка</ElegantTabsTrigger>}
                    {windowViewImages.length > 0 && <ElegantTabsTrigger value="window-view">Вид из окна</ElegantTabsTrigger>}
                    {interiorFinishImages.length > 0 && <ElegantTabsTrigger value="interior-finish">Отделка</ElegantTabsTrigger>}
                  </ElegantTabsList>

                  {floorPlanImages.length > 0 && (
                    <ElegantTabsContent value="floor-plan">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {floorPlanImages.map((imageUrl, index) => (
                            <CarouselItem key={`floor-plan-${index}`}>
                              <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                                <img
                                  src={imageUrl}
                                  alt={`Планировка ${index + 1}`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {floorPlanImages.length > 1 && (
                          <>
                            <CarouselPrevious />
                            <CarouselNext />
                          </>
                        )}
                      </Carousel>
                    </ElegantTabsContent>
                  )}

                  {windowViewImages.length > 0 && (
                    <ElegantTabsContent value="window-view">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {windowViewImages.map((imageUrl, index) => (
                            <CarouselItem key={`window-view-${index}`}>
                              <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                                <img
                                  src={imageUrl}
                                  alt={`Вид из окна ${index + 1}`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {windowViewImages.length > 1 && (
                          <>
                            <CarouselPrevious />
                            <CarouselNext />
                          </>
                        )}
                      </Carousel>
                    </ElegantTabsContent>
                  )}

                  {interiorFinishImages.length > 0 && (
                    <ElegantTabsContent value="interior-finish">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {interiorFinishImages.map((imageUrl, index) => (
                            <CarouselItem key={`interior-finish-${index}`}>
                              <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                                <img
                                  src={imageUrl}
                                  alt={`Интерьер ${index + 1}`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {interiorFinishImages.length > 1 && (
                          <>
                            <CarouselPrevious />
                            <CarouselNext />
                          </>
                        )}
                      </Carousel>
                    </ElegantTabsContent>
                  )}
                </ElegantTabs>
              </div>
            )}
          </ElegantTabsContent>

          <ElegantTabsContent value="map">
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
          </ElegantTabsContent>
        </ElegantTabs>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Основная информация</h3>
            <div className="grid grid-cols-2 gap-4">
              {property.residential_complex && (
                <div>
                  <p className="text-sm text-gray-500">Жилой комплекс</p>
                  <p className="font-medium">{property.residential_complex}</p>
                </div>
              )}
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

          <div className="mt-6 mb-6">
            <ElegantTabs defaultValue="description">
              <ElegantTabsList className="mb-4 w-full" indicatorClassName="bg-blue-500 dark:bg-blue-500">
                <ElegantTabsTrigger value="description">Описание</ElegantTabsTrigger>
                {property.agent_comment && (
                  <ElegantTabsTrigger value="agent_comment">Комментарий риелтора</ElegantTabsTrigger>
                )}
              </ElegantTabsList>

              <ElegantTabsContent value="description">
                {property.description ? (
                  <TextFolding 
                    text={property.description} 
                    className="text-gray-700 dark:text-white/90 theme-transition"
                    title="Описание объекта"
                  />
                ) : (
                  <p className="text-gray-500 italic dark:text-white/60 theme-transition">Описание отсутствует</p>
                )}
              </ElegantTabsContent>

              {property.agent_comment && (
                <ElegantTabsContent value="agent_comment">
                  <div className="p-4 bg-amber-50 dark:bg-blue-900/20 rounded-md border border-amber-200 dark:border-blue-800 theme-transition">
                    <TextFolding 
                      text={property.agent_comment} 
                      className="text-gray-700 dark:text-gray-300 theme-transition"
                      title="Комментарий риелтора"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic theme-transition">Эта информация видна только вам и не показывается клиентам</p>
                  </div>
                </ElegantTabsContent>
              )}
            </ElegantTabs>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={onClose}
            className="bg-luxury-gold dark:bg-blue-400 hover:bg-luxury-gold/90 dark:hover:bg-blue-500 text-luxury-black dark:text-white theme-transition"
          >
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

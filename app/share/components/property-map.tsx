"use client"
import { YandexMap } from "@/components/yandex-map"
import { FallbackMap } from "@/components/fallback-map"

interface PropertyMapProps {
  address: string
}

export function PropertyMap({ address }: PropertyMapProps) {
  // Проверка на пустой адрес
  if (!address || address.trim().length < 5) {
    return (
      <FallbackMap
        address="Адрес не указан"
        className="w-full h-full min-h-[200px]"
        errorMessage="Укажите полный адрес для отображения на карте"
      />
    )
  }

  return <YandexMap address={address} className="w-full h-full min-h-[200px]" />
}

"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { useYandexMaps } from "@/hooks/use-yandex-maps"

interface AddressSuggestProps {
  value: string
  onChange: (value: string) => void
  onSelect: (value: string, coordinates?: [number, number]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function AddressSuggest({
  value,
  onChange,
  onSelect,
  placeholder = "Введите адрес",
  className = "",
  disabled = false,
}: AddressSuggestProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isLoaded } = useYandexMaps()
  const [suggestView, setSuggestView] = useState<any>(null)

  // Инициализация SuggestView при загрузке API
  useEffect(() => {
    if (!isLoaded || !inputRef.current || suggestView) return

    try {
      if (!window.ymaps) {
        console.error("Объект ymaps не доступен при инициализации SuggestView")
        return
      }

      console.log("Инициализация SuggestView для поля адреса")

      // Создаем экземпляр SuggestView
      const suggest = new window.ymaps.SuggestView(inputRef.current, {
        results: 5, // Количество предлагаемых вариантов
        boundedBy: [
          [55.14, 36.83], // Юго-западная граница (примерно Москва и область)
          [56.02, 38.17], // Северо-восточная граница
        ],
        provider: {
          suggest: (request: string) => {
            return window.ymaps.suggest(request)
          },
        },
      })

      // Обработчик выбора варианта из списка
      suggest.events.add("select", (e: any) => {
        const selectedItem = e.get("item")
        const selectedValue = selectedItem.value

        console.log("Выбран адрес из подсказок:", selectedValue)

        // Получаем координаты выбранного адреса
        window.ymaps
          .geocode(selectedValue)
          .then((res: any) => {
            const firstGeoObject = res.geoObjects.get(0)
            if (firstGeoObject) {
              const coords = firstGeoObject.geometry.getCoordinates()
              console.log("Получены координаты для выбранного адреса:", coords)
              onSelect(selectedValue, coords)
            } else {
              onSelect(selectedValue)
            }
          })
          .catch((error: any) => {
            console.error("Ошибка геокодирования выбранного адреса:", error)
            onSelect(selectedValue)
          })
      })

      setSuggestView(suggest)

      // Очистка при размонтировании
      return () => {
        if (suggest) {
          suggest.destroy()
        }
      }
    } catch (error) {
      console.error("Ошибка при инициализации SuggestView:", error)
    }
  }, [isLoaded, onSelect, suggestView])

  // Обработчик изменения значения в поле ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled || !isLoaded}
    />
  )
}

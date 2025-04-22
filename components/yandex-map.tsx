"use client"

import { useRef, useEffect, useState } from "react"
import { useYandexMaps } from "@/hooks/use-yandex-maps"
import { FallbackMap } from "./fallback-map"

interface YandexMapProps {
  address: string
  className?: string
  initialCoordinates?: [number, number] | null
}

export function YandexMap({ address, className = "", initialCoordinates = null }: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const { isLoaded, isError, errorMessage } = useYandexMaps()
  const [coordinates, setCoordinates] = useState<[number, number] | null>(initialCoordinates)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geocodingError, setGeocodingError] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  // Добавляем состояние для отслеживания последнего геокодированного адреса
  const [lastGeocodedAddress, setLastGeocodedAddress] = useState<string>("")

  // Обновляем координаты, если были переданы initialCoordinates
  useEffect(() => {
    if (initialCoordinates) {
      setCoordinates(initialCoordinates)
      setLastGeocodedAddress(address) // Считаем, что адрес уже геокодирован
    }
  }, [initialCoordinates, address])

  // Функция для геокодирования адреса
  useEffect(() => {
    // Защита от выполнения в SSR
    if (typeof window === "undefined") {
      return
    }

    // Если у нас уже есть координаты из initialCoordinates, пропускаем геокодирование
    if (initialCoordinates && address === lastGeocodedAddress) {
      return
    }

    // Проверяем, изменился ли адрес с момента последнего геокодирования
    if (isLoaded && address && address !== lastGeocodedAddress && !isGeocoding) {
      setIsGeocoding(true)
      setGeocodingError(null)

      try {
        console.log(`Начало геокодирования адреса: "${address}"`)

        // Проверяем, доступен ли объект ymaps
        if (!window.ymaps) {
          console.error("Объект ymaps не доступен при попытке геокодирования")
          setGeocodingError("API карт не инициализирован")
          setIsGeocoding(false)
          return
        }

        // Используем геокодер для получения координат по адресу
        window.ymaps
          .geocode(address)
          .then((res: any) => {
            try {
              // Получаем первый результат геокодирования
              const firstGeoObject = res.geoObjects.get(0)

              if (firstGeoObject) {
                // Получаем координаты
                const coords = firstGeoObject.geometry.getCoordinates()
                console.log(`Координаты для адреса "${address}":`, coords)
                setCoordinates(coords)
                // Сохраняем адрес, для которого мы получили координаты
                setLastGeocodedAddress(address)
              } else {
                console.warn(`Не удалось найти координаты для адреса: ${address}`)
                setGeocodingError(`Не удалось найти координаты для адреса: ${address}`)
              }
            } catch (error) {
              console.error("Ошибка при обработке результатов геокодирования:", error)
              setGeocodingError(
                `Ошибка обработки результатов: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`,
              )
            }
            // Устанавливаем флаг завершения геокодирования
            setIsGeocoding(false)
          })
          .catch((error: any) => {
            console.error("Ошибка геокодирования:", error)
            setGeocodingError(`Ошибка геокодирования: ${error.message || "Неизвестная ошибка"}`)
            setIsGeocoding(false)
          })
      } catch (error) {
        console.error("Непредвиденная ошибка при геокодировании:", error)
        setGeocodingError(`Непредвиденная ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`)
        setIsGeocoding(false)
      }
    }
  }, [isLoaded, address, isGeocoding, lastGeocodedAddress, initialCoordinates])

  // Инициализация карты
  useEffect(() => {
    // Защита от выполнения в SSR
    if (typeof window === "undefined") {
      return
    }

    if (isLoaded && mapRef.current && coordinates) {
      try {
        console.log("Инициализация карты с координатами:", coordinates)

        // Проверяем, доступен ли объект ymaps
        if (!window.ymaps) {
          console.error("Объект ymaps не доступен при попытке инициализации карты")
          setMapError("API карт не инициализирован")
          return
        }

        // Создаем карту
        const map = new window.ymaps.Map(mapRef.current, {
          center: coordinates,
          zoom: 15,
          controls: ["zoomControl", "fullscreenControl"],
        })

        // Добавляем метку на карту
        const placemark = new window.ymaps.Placemark(
          coordinates,
          {
            hintContent: address,
            balloonContent: address,
          },
          {
            preset: "islands#redDotIcon",
            draggable: true, // Позволяем перетаскивать метку
          },
        )

        // Обработчик перетаскивания метки
        placemark.events.add("dragend", () => {
          const newCoords = placemark.geometry.getCoordinates()
          console.log("Метка перемещена в координаты:", newCoords)

          // Обновляем координаты в состоянии
          setCoordinates(newCoords)

          // Получаем адрес по новым координатам (обратное геокодирование)
          window.ymaps.geocode(newCoords).then((res: any) => {
            const firstGeoObject = res.geoObjects.get(0)
            if (firstGeoObject) {
              const newAddress = firstGeoObject.getAddressLine()
              console.log("Новый адрес после перемещения метки:", newAddress)

              // Здесь можно добавить колбэк для обновления адреса в форме
              // onAddressChange(newAddress)
            }
          })
        })

        map.geoObjects.add(placemark)

        // Очистка при размонтировании
        return () => {
          try {
            map.destroy()
          } catch (error) {
            console.error("Ошибка при уничтожении карты:", error)
          }
        }
      } catch (error) {
        console.error("Ошибка при инициализации карты:", error)
        setMapError(`Ошибка при инициализации карты: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`)
      }
    }
  }, [isLoaded, coordinates, address])

  // Обработка ошибок API
  if (isError) {
    return <FallbackMap address={address} className={className} />
  }

  // Обработка ошибок геокодирования
  if (geocodingError) {
    return <FallbackMap address={address} className={className} errorMessage={geocodingError} />
  }

  // Обработка ошибок инициализации карты
  if (mapError) {
    return <FallbackMap address={address} className={className} errorMessage={mapError} />
  }

  // Состояние загрузки
  if (!isLoaded || !coordinates) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className} min-h-[200px]`}>
        <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Рендер карты
  return <div ref={mapRef} className={`${className} min-h-[200px]`} />
}

import { Check } from "lucide-react"

interface PropertyDetailsProps {
  property: {
    id: string
    address: string
    property_type: string
    price: number
    area: number
    rooms: number | null
    description: string | null
    living_area?: number | null
    floor?: number | null
    total_floors?: number | null
    bathroom_count?: number | null
  }
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const propertyTypeLabels: Record<string, string> = {
    apartment: "Квартира",
    house: "Дом",
    land: "Земельный участок",
  }

  return (
    <div className="p-6 border-l">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">{property.address}</h2>
        <p className="text-gray-500">{propertyTypeLabels[property.property_type] || "Объект недвижимости"}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Цена</p>
          <p className="font-semibold text-xl">{formatPrice(property.price)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Площадь</p>
          <p className="font-semibold">{property.area} м²</p>
        </div>
        {property.rooms !== null && (
          <div>
            <p className="text-sm text-gray-500">Комнаты</p>
            <p className="font-semibold">{property.rooms}</p>
          </div>
        )}
        {property.floor !== null && property.total_floors !== null && (
          <div>
            <p className="text-sm text-gray-500">Этаж</p>
            <p className="font-semibold">
              {property.floor} / {property.total_floors}
            </p>
          </div>
        )}
        {property.living_area !== null && (
          <div>
            <p className="text-sm text-gray-500">Жилая площадь</p>
            <p className="font-semibold">{property.living_area} м²</p>
          </div>
        )}
        {property.bathroom_count !== null && (
          <div>
            <p className="text-sm text-gray-500">Санузлы</p>
            <p className="font-semibold">{property.bathroom_count}</p>
          </div>
        )}
      </div>

      {property.description && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Описание</p>
          <p className="text-sm">{property.description}</p>
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Особенности</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Высота потолков 2.8 м</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Окна на улицу</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Без отделки</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Свободная продажа</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="font-medium mb-2">Комментарий от агента</p>
        <p className="text-sm text-gray-600">
          Первоначальный взнос 3 542 326,79 ₽<br />
          Ежемесячные платежи 71 911,25 ₽<br />
          Средняя цена аренды 70-72 т.р.
        </p>
      </div>
    </div>
  )
}

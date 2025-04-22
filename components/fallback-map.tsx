"use client"

import { MapPin } from "lucide-react"

interface FallbackMapProps {
  address: string
  className?: string
  errorMessage?: string
}

export function FallbackMap({ address, className = "", errorMessage }: FallbackMapProps) {
  return (
    <div className={`bg-gray-100 flex flex-col items-center justify-center ${className} min-h-[200px]`}>
      <MapPin className="h-12 w-12 text-gray-400 mb-2" />
      <p className="text-gray-600 font-medium text-center">{address}</p>
      <p className="text-gray-500 text-sm mt-2">{errorMessage || "Карта недоступна. Попробуйте позже."}</p>
    </div>
  )
}

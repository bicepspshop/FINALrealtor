"use client"

import { SingleImageUpload } from "@/components/ui/single-image-upload"
import { uploadFloorPlanImage } from "@/lib/optimized-upload"

interface FloorPlanUploadProps {
  onImageChange: (imageUrl: string | null) => void
  initialImage?: string | null
}

export function FloorPlanUpload({ onImageChange, initialImage = null }: FloorPlanUploadProps) {
  return (
    <SingleImageUpload
      onImageChange={onImageChange}
      initialImage={initialImage}
      uploadFunction={uploadFloorPlanImage}
      alt="Планировка"
      title="Перетащите планировку сюда или нажмите для выбора"
      subtitle="Загрузите изображение планировки (макс. 20МБ)"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary dark:text-blue-400 theme-transition"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 14h18" />
          <path d="M3 9h18" />
          <path d="M9 19v-5" />
          <path d="M14 19v-5" />
        </svg>
      }
    />
  )
}

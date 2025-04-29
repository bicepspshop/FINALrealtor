"use client"

import { SingleImageUpload } from "@/components/ui/single-image-upload"
import { uploadWindowViewImage } from "@/lib/optimized-upload"

interface WindowViewUploadProps {
  onImageChange: (imageUrl: string | null) => void
  initialImage?: string | null
}

export function WindowViewUpload({ onImageChange, initialImage = null }: WindowViewUploadProps) {
  return (
    <SingleImageUpload
      onImageChange={onImageChange}
      initialImage={initialImage}
      uploadFunction={uploadWindowViewImage}
      alt="Вид из окна"
      title="Перетащите изображение вида из окна сюда или нажмите для выбора"
      subtitle="Загрузите изображение вида из окна (макс. 20МБ)"
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
          <path d="M15 8h.01" />
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="m6 20 8-8 4 4 1-1 1 1 4 4" />
        </svg>
      }
    />
  )
}
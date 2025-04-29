"use client"

import { SingleImageUpload } from "@/components/ui/single-image-upload"
import { uploadInteriorFinishImage } from "@/lib/optimized-upload"

interface InteriorFinishUploadProps {
  onImageChange: (imageUrl: string | null) => void
  initialImage?: string | null
}

export function InteriorFinishUpload({ onImageChange, initialImage = null }: InteriorFinishUploadProps) {
  return (
    <SingleImageUpload
      onImageChange={onImageChange}
      initialImage={initialImage}
      uploadFunction={uploadInteriorFinishImage}
      alt="Интерьер"
      title="Перетащите изображение интерьера сюда или нажмите для выбора"
      subtitle="Загрузите изображение внутренней отделки (макс. 20МБ)"
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
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
          <path d="M3 9V5a2 2 0 0 1 2-2h2L8 7h8" />
          <path d="M15 2h2a2 2 0 0 1 2 2v4" />
        </svg>
      }
    />
  )
}
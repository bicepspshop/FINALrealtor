"use client"

import { useState } from "react"
import { SingleImageUpload } from "@/components/ui/single-image-upload"
import { uploadFloorPlanImage } from "@/lib/optimized-upload"

interface FloorPlanUploadProps {
  onImageChange: (imageUrls: string[]) => void
  initialImages?: (string | null)[]
}

export function FloorPlanUpload({ onImageChange, initialImages = [null, null, null] }: FloorPlanUploadProps) {
  // Ensure initialImages has exactly 3 elements
  const safeInitialImages = [...initialImages]
  while (safeInitialImages.length < 3) safeInitialImages.push(null)
  if (safeInitialImages.length > 3) safeInitialImages.length = 3

  const [images, setImages] = useState<(string | null)[]>(safeInitialImages)

  // Update a specific image by index
  const handleImageChange = (index: number, imageUrl: string | null) => {
    const newImages = [...images]
    newImages[index] = imageUrl
    setImages(newImages)
    onImageChange(newImages.filter(Boolean) as string[])
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        {[0].map((index) => (
          <SingleImageUpload
            key={index}
            onImageChange={(imageUrl) => handleImageChange(index, imageUrl)}
            initialImage={images[index]}
            uploadFunction={uploadFloorPlanImage}
            alt={`Планировка ${index + 1}`}
            title={`Планировка ${index + 1}`}
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
        ))}
        {[1].map((index) => (
          <SingleImageUpload
            key={index}
            onImageChange={(imageUrl) => handleImageChange(index, imageUrl)}
            initialImage={images[index]}
            uploadFunction={uploadFloorPlanImage}
            alt={`Планировка ${index + 1}`}
            title={`Планировка ${index + 1}`}
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
        ))}
        {[2].map((index) => (
          <SingleImageUpload
            key={index}
            onImageChange={(imageUrl) => handleImageChange(index, imageUrl)}
            initialImage={images[index]}
            uploadFunction={uploadFloorPlanImage}
            alt={`Планировка ${index + 1}`}
            title={`Планировка ${index + 1}`}
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
        ))}
      </div>
    </div>
  )
}

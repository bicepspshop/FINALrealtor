"use client"

import { useState } from "react"
import { SingleImageUpload } from "@/components/ui/single-image-upload"
import { uploadWindowViewImage } from "@/lib/optimized-upload"

interface WindowViewUploadProps {
  onImageChange: (imageUrls: string[]) => void
  initialImages?: (string | null)[]
}

export function WindowViewUpload({ onImageChange, initialImages = [null, null, null] }: WindowViewUploadProps) {
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
            uploadFunction={uploadWindowViewImage}
            alt={`Вид из окна ${index + 1}`}
            title={`Вид из окна ${index + 1}`}
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
        ))}
        {[1].map((index) => (
          <SingleImageUpload
            key={index}
            onImageChange={(imageUrl) => handleImageChange(index, imageUrl)}
            initialImage={images[index]}
            uploadFunction={uploadWindowViewImage}
            alt={`Вид из окна ${index + 1}`}
            title={`Вид из окна ${index + 1}`}
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
        ))}
        {[2].map((index) => (
          <SingleImageUpload
            key={index}
            onImageChange={(imageUrl) => handleImageChange(index, imageUrl)}
            initialImage={images[index]}
            uploadFunction={uploadWindowViewImage}
            alt={`Вид из окна ${index + 1}`}
            title={`Вид из окна ${index + 1}`}
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
        ))}
      </div>
    </div>
  )
}
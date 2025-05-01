"use client"

import { useState } from "react"
import { SingleImageUpload } from "@/components/ui/single-image-upload"
import { uploadInteriorFinishImage } from "@/lib/optimized-upload"

interface InteriorFinishUploadProps {
  onImageChange: (imageUrls: string[]) => void
  initialImages?: (string | null)[]
}

export function InteriorFinishUpload({ onImageChange, initialImages = [null, null, null] }: InteriorFinishUploadProps) {
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
            uploadFunction={uploadInteriorFinishImage}
            alt={`Интерьер ${index + 1}`}
            title={`Интерьер ${index + 1}`}
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
        ))}
        {[1].map((index) => (
          <SingleImageUpload
            key={index}
            onImageChange={(imageUrl) => handleImageChange(index, imageUrl)}
            initialImage={images[index]}
            uploadFunction={uploadInteriorFinishImage}
            alt={`Интерьер ${index + 1}`}
            title={`Интерьер ${index + 1}`}
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
        ))}
        {[2].map((index) => (
          <SingleImageUpload
            key={index}
            onImageChange={(imageUrl) => handleImageChange(index, imageUrl)}
            initialImage={images[index]}
            uploadFunction={uploadInteriorFinishImage}
            alt={`Интерьер ${index + 1}`}
            title={`Интерьер ${index + 1}`}
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
        ))}
      </div>
    </div>
  )
}
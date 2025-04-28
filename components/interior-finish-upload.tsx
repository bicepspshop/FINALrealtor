"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getBrowserClient } from "@/lib/supabase"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { uploadInteriorFinishImage } from "@/lib/optimized-upload"
import { isValidImageFile } from "@/lib/image-utils"

interface InteriorFinishUploadProps {
  onImageChange: (imageUrl: string | null) => void
  initialImage?: string | null
}

export function InteriorFinishUpload({ onImageChange, initialImage = null }: InteriorFinishUploadProps) {
  const [file, setFile] = useState<{ file?: File; preview: string; uploading: boolean; url?: string } | null>(
    initialImage
      ? {
          preview: initialImage,
          uploading: false,
          url: initialImage,
        }
      : null,
  )
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = getBrowserClient()

  // Функция для загрузки файла
  const uploadFile = useCallback(
    async (file: File) => {
      try {
        // Validate file before upload
        if (!isValidImageFile(file)) {
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: "Поддерживаются только изображения: JPEG, PNG, WEBP, GIF",
          })
          return null
        }

        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: "Размер файла не должен превышать 10MB",
          })
          return null
        }

        console.log(`Начало загрузки интерьера: ${file.name}`)

        // Use the optimized upload function
        const url = await uploadInteriorFinishImage(file)

        if (!url) {
          console.error("Ошибка загрузки интерьера")
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: "Не удалось загрузить изображение интерьера",
          })
          return null
        }

        console.log(`Интерьер успешно загружен: ${url}`)
        return url
      } catch (err) {
        console.error("Непредвиденная ошибка при загрузке интерьера:", err)
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: "Произошла непредвиденная ошибка при загрузке изображения интерьера",
        })
        return null
      }
    },
    [toast],
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      // Берем только первый файл
      const newFile = acceptedFiles[0]
      if (!newFile) return

      // Создаем превью для файла
      const preview = URL.createObjectURL(newFile)

      // Добавляем файл в состояние
      setFile({
        file: newFile,
        preview,
        uploading: true,
      })

      // Загружаем файл
      const url = await uploadFile(newFile)

      // Обновляем состояние файла после загрузки
      if (url) {
        setFile((prev) =>
          prev
            ? {
                ...prev,
                uploading: false,
                url,
              }
            : null,
        )

        // Обновляем родительский компонент с URL
        onImageChange(url)
      } else {
        // Если загрузка не удалась, удаляем файл из состояния
        setFile(null)
        onImageChange(null)
      }
    },
    [uploadFile, onImageChange],
  )

  const removeFile = useCallback(async () => {
    if (file?.url) {
      try {
        const filePath = file.url.split("/").pop()
        if (filePath && supabase) {
          console.log(`Удаление изображения интерьера из хранилища: ${filePath}`)
          await supabase.storage.from("property-images").remove([filePath])
        }
      } catch (err) {
        console.error("Ошибка при удалении изображения интерьера из хранилища:", err)
      }
    }

    // Освобождаем URL объекта для предотвращения утечек памяти
    if (file?.preview && file.file) {
      URL.revokeObjectURL(file.preview)
    }

    setFile(null)
    onImageChange(null)
  }, [file, supabase, onImageChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10485760, // 10MB
    maxFiles: 1,
  })

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-blue-400"
          } dark:bg-dark-slate/50 theme-transition`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="rounded-full bg-primary/10 dark:bg-blue-500/20 p-3 theme-transition">
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
            </div>
            <div className="text-sm font-medium text-luxury-black dark:text-white theme-transition">Перетащите изображение интерьера сюда или нажмите для выбора</div>
            <div className="text-xs text-gray-500 dark:text-gray-300 theme-transition">Загрузите изображение внутренней отделки (макс. 10МБ)</div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden bg-gray-100 border aspect-[4/3]">
          <OptimizedImage 
            src={file.preview || "/placeholder.svg"} 
            alt="Интерьер" 
            fill 
            objectFit="contain"
            fallbackSrc="/placeholder.svg"
          />
          {file.uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin" />
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-6 h-6 rounded-full"
            onClick={removeFile}
            disabled={file.uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
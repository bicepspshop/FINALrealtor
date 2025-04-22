"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getBrowserClient } from "@/lib/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

interface ImageUploadProps {
  onImagesChange: (imageUrls: string[]) => void
  maxFiles?: number
  initialImages?: string[]
}

export function ImageUpload({ onImagesChange, maxFiles = 10, initialImages = [] }: ImageUploadProps) {
  const [files, setFiles] = useState<Array<{ file?: File; preview: string; uploading: boolean; url?: string }>>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = getBrowserClient()

  // Initialize with initial images
  useEffect(() => {
    if (initialImages.length > 0 && files.length === 0) {
      const initialFiles = initialImages.map((url) => ({
        preview: url,
        uploading: false,
        url,
      }))
      setFiles(initialFiles)
      onImagesChange(initialImages)
    }
  }, [initialImages, files.length, onImagesChange])

  // Функция для загрузки одного файла
  const uploadFile = useCallback(
    async (file: File, client: SupabaseClient): Promise<string | null> => {
      try {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

        console.log(`Начало загрузки файла: ${fileName}`)

        // Загружаем файл в Supabase Storage
        const { data, error } = await client.storage.from("property-images").upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (error) {
          console.error("Ошибка загрузки файла:", error)
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: `Не удалось загрузить файл: ${error.message}`,
          })
          return null
        }

        console.log(`Файл успешно загружен: ${fileName}`)

        // Получаем публичный URL
        const { data: urlData } = client.storage.from("property-images").getPublicUrl(fileName)
        console.log(`Получен публичный URL: ${urlData.publicUrl}`)

        return urlData.publicUrl
      } catch (err) {
        console.error("Непредвиденная ошибка при загрузке:", err)
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: "Произошла непредвиденная ошибка при загрузке файла",
        })
        return null
      }
    },
    [toast],
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      // Проверяем, не превышен ли лимит файлов
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`Вы можете загрузить не более ${maxFiles} изображений`)
        return
      }

      // Создаем превью для каждого файла
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: true,
      }))

      // Добавляем новые файлы в состояние
      setFiles((prev) => [...prev, ...newFiles])

      // Загружаем каждый файл по отдельности
      const uploadedUrls: string[] = []

      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i].file!
        const url = await uploadFile(file, supabase)

        if (url) {
          uploadedUrls.push(url)
        }

        // Обновляем состояние файла после загрузки
        setFiles((prev) => {
          const updatedFiles = [...prev]
          const fileIndex = prev.findIndex((f) => f.preview === newFiles[i].preview)

          if (fileIndex !== -1) {
            updatedFiles[fileIndex] = {
              ...updatedFiles[fileIndex],
              uploading: false,
              url: url || undefined,
            }
          }

          return updatedFiles
        })
      }

      // Обновляем родительский компонент со всеми URL
      setFiles((currentFiles) => {
        const allUrls = currentFiles.filter((f) => f.url).map((f) => f.url!)
        console.log("Все URL изображений:", allUrls)
        onImagesChange(allUrls)
        return currentFiles
      })
    },
    [files, maxFiles, onImagesChange, uploadFile, supabase],
  )

  const removeFile = useCallback(
    async (index: number) => {
      const fileToRemove = files[index]

      // Если файл был загружен и имеет URL, удаляем его из хранилища
      if (fileToRemove.url) {
        try {
          const filePath = fileToRemove.url.split("/").pop()
          if (filePath) {
            console.log(`Удаление файла из хранилища: ${filePath}`)
            await supabase.storage.from("property-images").remove([filePath])
          }
        } catch (err) {
          console.error("Ошибка при удалении файла из хранилища:", err)
          toast({
            variant: "destructive",
            title: "Ошибка удаления",
            description: "Не удалось удалить файл из хранилища",
          })
        }
      }

      // Удаляем файл из состояния
      setFiles((prev) => {
        const newFiles = [...prev]
        newFiles.splice(index, 1)

        // Обновляем родительский компонент с оставшимися URL
        const urls = newFiles.filter((f) => f.url).map((f) => f.url!)
        onImagesChange(urls)

        return newFiles
      })

      // Освобождаем URL объекта для предотвращения утечек памяти
      if (fileToRemove.file) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
    },
    [files, onImagesChange, supabase, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10485760, // 10MB
  })

  return (
    <div className="space-y-4">
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
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
              <line x1="16" x2="22" y1="5" y2="5" />
              <line x1="19" x2="19" y1="2" y2="8" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <div className="text-sm font-medium text-luxury-black dark:text-white theme-transition">Перетащите изображения сюда или нажмите для выбора</div>
          <div className="text-xs text-gray-500 dark:text-gray-300 theme-transition">Загрузите до {maxFiles} изображений (макс. 10МБ каждое)</div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border">
                <Image
                  src={file.preview || "/placeholder.svg"}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
                {file.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
                disabled={file.uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

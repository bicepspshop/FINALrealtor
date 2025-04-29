"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getBrowserClient } from "@/lib/supabase"
import { isValidImageFile } from "@/lib/image-utils"

interface SingleImageUploadProps {
  onImageChange: (imageUrl: string | null) => void
  initialImage?: string | null
  icon: React.ReactNode
  title: string
  subtitle: string
  alt: string
  uploadFunction: (file: File) => Promise<string | null>
  maxSize?: number
}

export function SingleImageUpload({
  onImageChange,
  initialImage = null,
  icon,
  title,
  subtitle,
  alt,
  uploadFunction,
  maxSize = 20 * 1024 * 1024, // 20MB by default
}: SingleImageUploadProps) {
  const [file, setFile] = useState<{ file?: File; preview: string; uploading: boolean; url?: string } | null>(
    initialImage
      ? {
          preview: initialImage,
          uploading: false,
          url: initialImage,
        }
      : null
  )
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = getBrowserClient()

  // Function to upload file
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

        // Check file size
        if (file.size > maxSize) {
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: `Размер файла не должен превышать ${maxSize / (1024 * 1024)}MB`,
          })
          return null
        }

        console.log(`Начало загрузки: ${file.name}`)

        // Use the provided upload function
        const url = await uploadFunction(file)

        if (!url) {
          console.error("Ошибка загрузки")
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: "Не удалось загрузить изображение",
          })
          return null
        }

        console.log(`Файл успешно загружен: ${url}`)
        return url
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
    [toast, maxSize, uploadFunction]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      // Take only the first file
      const newFile = acceptedFiles[0]
      if (!newFile) return

      // Create preview for the file
      const preview = URL.createObjectURL(newFile)

      // Add file to state
      setFile({
        file: newFile,
        preview,
        uploading: true,
      })

      // Upload the file
      const url = await uploadFile(newFile)

      // Update file state after upload
      if (url) {
        setFile((prev) =>
          prev
            ? {
                ...prev,
                uploading: false,
                url,
              }
            : null
        )

        // Update parent component with URL
        onImageChange(url)
      } else {
        // If upload failed, remove file from state
        setFile(null)
        onImageChange(null)
      }
    },
    [uploadFile, onImageChange]
  )

  const removeFile = useCallback(async () => {
    if (file?.url && supabase) {
      try {
        const filePath = file.url.split("/").pop()
        if (filePath) {
          console.log(`Удаление файла из хранилища: ${filePath}`)
          await supabase.storage.from("property-images").remove([filePath])
        }
      } catch (err) {
        console.error("Ошибка при удалении файла из хранилища:", err)
      }
    }

    // Release object URL to prevent memory leaks
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
    maxSize,
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
              {icon}
            </div>
            <div className="text-sm font-medium text-luxury-black dark:text-white theme-transition">{title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-300 theme-transition">{subtitle}</div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border">
            <Image
              src={file.preview || "/placeholder.svg"}
              alt={alt}
              width={300}
              height={300}
              className="w-full h-full object-cover"
              unoptimized={true}
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
"use client"

import { useState, useCallback, useRef, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  ChevronLeft, 
  Plus, 
  Upload, 
  Trash2, 
  Edit, 
  Check,
  X,
  ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { validateFileExtension } from "@/utils/storage-helpers"
import { 
  getAllFaqImages, 
  uploadFaqImage, 
  addFaqImageRecord,
  updateFaqImageRecord,
  deleteFaqImage,
  FaqImage,
  FAQ_IMAGES_BUCKET
} from "@/lib/faq-storage"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// Define available section options
const SECTION_OPTIONS = [
  { id: "create-collection", label: "Создание коллекции" },
  { id: "view-collection", label: "Просмотр коллекции" },
  { id: "add-property", label: "Добавление объекта" },
  { id: "edit-property", label: "Редактирование объекта" },
  { id: "share-collection", label: "Отправка клиенту" },
  { id: "track-clients", label: "Отслеживание активности" },
  { id: "profile-settings", label: "Настройки профиля" },
]

export default function AdminFaqImagesPage() {
  const router = useRouter()
  const [images, setImages] = useState<FaqImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [section, setSection] = useState<string>("")
  const [order, setOrder] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Fetch all images on page load
  const fetchImages = useCallback(async () => {
    setIsLoading(true)
    try {
      const allImages = await getAllFaqImages()
      setImages(allImages)
    } catch (error) {
      console.error("Error fetching FAQ images:", error)
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображения для справки",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Initial fetch
  useState(() => {
    fetchImages()
  })
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    
    if (files && files.length > 0) {
      const file = files[0]
      
      // Validate file extension and size
      if (!validateFileExtension(file.name, ['jpg', 'jpeg', 'png', 'webp'])) {
        toast({
          title: "Неподдерживаемый формат файла",
          description: "Пожалуйста, выберите изображение в формате JPG, PNG или WebP",
          variant: "destructive"
        })
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Файл слишком большой",
          description: "Максимальный размер файла - 5MB",
          variant: "destructive"
        })
        return
      }
      
      setSelectedFile(file)
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      
      // Auto-fill title from filename
      const fileName = file.name.split('.')[0].replace(/_/g, ' ')
      setTitle(fileName)
      
      return () => URL.revokeObjectURL(objectUrl)
    }
  }
  
  // Trigger file input click
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !title || !section) {
      toast({
        title: "Заполните все поля",
        description: "Название, секция и файл изображения обязательны",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 1. Upload the image file
      const imageUrl = await uploadFaqImage(selectedFile, section)
      
      if (!imageUrl) {
        throw new Error("Ошибка загрузки изображения")
      }
      
      // 2. Create the database record
      const imageRecord = await addFaqImageRecord(
        title,
        description || null,
        imageUrl,
        section,
        order > 0 ? order : undefined
      )
      
      if (!imageRecord) {
        throw new Error("Ошибка создания записи в базе данных")
      }
      
      // 3. Reset form and refresh list
      resetForm()
      await fetchImages()
      
      toast({
        title: "Изображение добавлено",
        description: "Новое изображение успешно добавлено в справку",
        variant: "default"
      })
    } catch (error) {
      console.error("Error saving FAQ image:", error)
      toast({
        title: "Ошибка сохранения",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Reset the form
  const resetForm = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setTitle("")
    setDescription("")
    setSection("")
    setOrder(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
  
  // Handle image deletion
  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить это изображение? Это действие невозможно отменить.")) {
      return
    }
    
    try {
      const success = await deleteFaqImage(id)
      
      if (!success) {
        throw new Error("Не удалось удалить изображение")
      }
      
      // Refresh the list
      await fetchImages()
      
      toast({
        title: "Изображение удалено",
        description: "Изображение успешно удалено из справки",
        variant: "default"
      })
    } catch (error) {
      console.error("Error deleting FAQ image:", error)
      toast({
        title: "Ошибка удаления",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive"
      })
    }
  }
  
  // Get section name by ID
  const getSectionName = (id: string) => {
    const section = SECTION_OPTIONS.find(option => option.id === id)
    return section ? section.label : id
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white dark:bg-dark-graphite border-b border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark py-3 sticky top-0 z-50 theme-transition">
        <div className="container-luxury flex justify-between items-center">
          <Link href="/admin" className="flex items-center">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-white dark:gold-accent theme-transition">
              РиелторПро <span className="text-primary text-lg">Администратор</span>
            </h1>
          </Link>
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link href="/admin">
              <ChevronLeft className="h-4 w-4" /> Вернуться в панель
            </Link>
          </Button>
        </div>
      </header>

      <main className="container-luxury py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Добавить изображение</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Изображение</label>
                    <div 
                      className={`border-2 border-dashed rounded-md p-4 ${
                        previewUrl ? 'border-primary/50' : 'border-border hover:border-primary/30'
                      } cursor-pointer transition-colors`}
                      onClick={handleSelectFile}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                      />
                      
                      {previewUrl ? (
                        <div className="space-y-2">
                          <div className="relative aspect-video w-full overflow-hidden rounded-md">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectFile()
                            }}
                          >
                            Изменить изображение
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium mb-1">Нажмите для загрузки изображения</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG или WebP, до 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Название</label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Введите название изображения"
                      required
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Описание</label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Введите описание изображения (необязательно)"
                      rows={3}
                    />
                  </div>
                  
                  {/* Section */}
                  <div className="space-y-2">
                    <label htmlFor="section" className="text-sm font-medium">Секция</label>
                    <Select
                      value={section}
                      onValueChange={(value) => setSection(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите секцию" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTION_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Display Order */}
                  <div className="space-y-2">
                    <label htmlFor="order" className="text-sm font-medium">Порядок отображения</label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      value={order.toString()}
                      onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                      placeholder="0 для автоматического определения"
                    />
                    <p className="text-xs text-muted-foreground">
                      0 = автоматически в конец списка
                    </p>
                  </div>
                  
                  {/* Submit button */}
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isSubmitting}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !selectedFile || !title || !section}
                    >
                      {isSubmitting ? "Сохранение..." : "Сохранить"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Image List */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Изображения для справки</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchImages}
                  disabled={isLoading}
                >
                  Обновить
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
                    ))}
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-60 mb-3" />
                    <h3 className="text-lg font-medium mb-1">Нет изображений</h3>
                    <p className="text-muted-foreground">
                      Добавьте изображения с помощью формы слева
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {images.map((image) => (
                      <div 
                        key={image.id} 
                        className="border rounded-md overflow-hidden flex flex-col sm:flex-row"
                      >
                        <div className="relative w-full sm:w-32 h-24">
                          <Image
                            src={image.image_url}
                            alt={image.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{image.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {getSectionName(image.section)} #{image.order || 0}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(image.id)} 
                                title="Удалить"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          {image.description && (
                            <p className="text-sm mt-2 line-clamp-2">
                              {image.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 
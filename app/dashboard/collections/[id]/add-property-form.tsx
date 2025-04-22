"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"
import { FloorPlanUpload } from "@/components/floor-plan-upload"
import { addProperty } from "./actions"
import { YandexMap } from "@/components/yandex-map"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { AddressSuggest } from "@/components/address-suggest"

const formSchema = z.object({
  propertyType: z.enum(["apartment", "house", "land"]),
  address: z.string().min(5, "Адрес должен содержать не менее 5 символов"),
  rooms: z.coerce.number().int().min(0).optional(),
  area: z.coerce.number().positive("Площадь должна быть положительным числом"),
  livingArea: z.coerce.number().positive("Жилая площадь должна быть положительным числом").optional(),
  price: z.coerce.number().positive("Цена должна быть положительным числом"),
  description: z.string().optional(),
  floor: z.coerce.number().int().min(0).optional(),
  totalFloors: z.coerce.number().int().min(0).optional(),
  balcony: z.boolean().optional(),
  yearBuilt: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional(),
  renovationType: z.enum(["без ремонта", "косметический", "евроремонт", "дизайнерский"]).optional(),
  bathroomCount: z.coerce.number().int().min(0).optional(),
  hasParking: z.boolean().optional(),
  propertyStatus: z.enum(["available", "sold", "reserved"]).optional(),
})

interface AddPropertyFormProps {
  collectionId: string
}

export function AddPropertyForm({ collectionId }: AddPropertyFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [floorPlanUrl, setFloorPlanUrl] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapCoordinates, setMapCoordinates] = useState<[number, number] | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "apartment",
      address: "",
      rooms: undefined,
      area: undefined,
      livingArea: undefined,
      price: undefined,
      description: "",
      floor: undefined,
      totalFloors: undefined,
      balcony: false,
      yearBuilt: undefined,
      renovationType: undefined,
      bathroomCount: undefined,
      hasParking: false,
      propertyStatus: "available",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLoading) return

    setIsLoading(true)
    console.log("Отправка формы с изображениями:", imageUrls)
    console.log("Отправка формы с планировкой:", floorPlanUrl)

    try {
      // Проверяем, что все изображения загружены
      if (imageUrls.some((url) => !url)) {
        toast({
          variant: "destructive",
          title: "Ошибка загрузки изображений",
          description: "Дождитесь завершения загрузки всех изображений или удалите неудачные",
        })
        setIsLoading(false)
        return
      }

      const result = await addProperty({
        collectionId,
        propertyType: values.propertyType,
        address: values.address,
        rooms: values.rooms || null,
        area: values.area!,
        livingArea: values.livingArea,
        price: values.price!,
        description: values.description || "",
        imageUrls,
        floorPlanUrl, // Добавляем URL планировки
        floor: values.floor,
        totalFloors: values.totalFloors,
        balcony: values.balcony,
        yearBuilt: values.yearBuilt,
        renovationType: values.renovationType,
        bathroomCount: values.bathroomCount,
        hasParking: values.hasParking,
        propertyStatus: values.propertyStatus,
      })

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось добавить объект",
          description: result.error,
        })
      } else {
        toast({
          title: "Объект добавлен",
          description: "Объект недвижимости был добавлен в коллекцию.",
        })
        form.reset()
        setImageUrls([])
        setFloorPlanUrl(null)

        // Перенаправляем на страницу коллекции после успешного добавления
        router.push(`/dashboard/collections/${collectionId}`)
      }
    } catch (error) {
      console.error("Ошибка при добавлении объекта:", error)
      toast({
        variant: "destructive",
        title: "Что-то пошло не так",
        description: "Пожалуйста, попробуйте позже.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImagesChange = (urls: string[]) => {
    console.log("Получены URL изображений:", urls)
    setImageUrls(urls)
  }

  const handleFloorPlanChange = (url: string | null) => {
    console.log("Получен URL планировки:", url)
    setFloorPlanUrl(url)
  }

  const handleAddressSelect = (address: string, coordinates?: [number, number]) => {
    // Устанавливаем выбранный адрес в форму
    form.setValue("address", address, { shouldValidate: true })

    // Если получены координаты, устанавливаем их для карты
    if (coordinates) {
      setMapCoordinates(coordinates)
    }
  }

  const propertyTypeOptions = {
    apartment: "Квартира",
    house: "Дом",
    land: "Земельный участок",
  }

  const renovationTypeOptions = {
    "без ремонта": "Без ремонта",
    косметический: "Косметический",
    евроремонт: "Евроремонт",
    дизайнерский: "Дизайнерский",
  }

  const propertyStatusOptions = {
    available: "Доступно",
    sold: "Продано",
    reserved: "Забронировано",
  }

  const handleMapError = (error: string) => {
    setMapError(error)
  }

  const addressValue = form.watch("address")
  const showMap = addressValue && addressValue.length > 5

  return (
    <div className="bg-white dark:bg-dark-graphite p-6 rounded-lg shadow-elegant dark:shadow-elegant-dark border border-gray-100 dark:border-dark-slate relative overflow-hidden theme-transition w-full">
      <div className="absolute inset-0 bg-[url('/images/background.png')] dark:bg-[url('/images/background-dark.png')] bg-cover bg-center opacity-[0.2] z-0 theme-transition"></div>
      <div className="relative z-10">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-medium text-luxury-black dark:text-white theme-transition">Добавить новый объект</h2>
        <div className="w-20 h-0.5 bg-luxury-gold dark:bg-blue-400 mt-2 theme-transition"></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Тип объекта</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200">
                        <SelectValue placeholder="Выберите тип объекта" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(propertyTypeOptions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Адрес</FormLabel>
                  <FormControl>
                    <AddressSuggest
                      value={field.value}
                      onChange={field.onChange}
                      onSelect={handleAddressSelect}
                      placeholder="ул. Ленина, 123, Москва"
                      className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && field.value.length >= 5 && (
                    <div className="mt-2 aspect-video rounded-md overflow-hidden">
                      {mapError ? (
                        <Alert
                          variant="warning"
                          className="w-full h-full min-h-[200px] flex items-center justify-center"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{mapError}</AlertDescription>
                        </Alert>
                      ) : (
                        <YandexMap
                          address={field.value}
                          className="w-full h-full"
                          initialCoordinates={mapCoordinates}
                        />
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Остальные поля формы остаются без изменений */}
            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Комнаты</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="3" className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Общая площадь (кв.м)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="85" className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="livingArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Жилая площадь (кв.м)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="65" className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Цена (₽)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="15000000" className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Этаж</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5" className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Всего этажей</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="9" className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearBuilt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Год постройки</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2010" className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathroomCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Количество санузлов</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="renovationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Тип ремонта</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200">
                        <SelectValue placeholder="Выберите тип ремонта" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(renovationTypeOptions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Статус объекта</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200">
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(propertyStatusOptions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="balcony"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-[#FFFFF0] dark:bg-[#E0F7FA]">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-black dark:text-black font-medium">Балкон</FormLabel>
                    <p className="text-sm text-black/70 dark:text-black/70">Наличие балкона или лоджии</p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasParking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-[#FFFFF0] dark:bg-[#E0F7FA]">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-black dark:text-black font-medium">Парковка</FormLabel>
                    <p className="text-sm text-black/70 dark:text-black/70">Наличие парковочного места</p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-luxury-black dark:text-white theme-transition">Описание</FormLabel>
                <FormControl>
                  <Textarea placeholder="Опишите объект недвижимости..." className="min-h-[100px] bg-[#FFFFF0] dark:bg-[#E0F7FA] dark:text-black border-gray-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="block mb-2 font-medium text-luxury-black dark:text-white theme-transition">Фотографии объекта</FormLabel>
            <ImageUpload onImagesChange={handleImagesChange} />
          </div>

          {/* Новое поле для загрузки планировки */}
          <div>
            <FormLabel className="block mb-2 font-medium text-luxury-black dark:text-white theme-transition">Планировка</FormLabel>
            <FloorPlanUpload onImageChange={handleFloorPlanChange} />
          </div>

          <div className="flex gap-4 mt-8">
            <Button 
            type="submit" 
            disabled={isLoading} 
            className="bg-luxury-gold dark:bg-blue-400 hover:bg-luxury-gold/90 dark:hover:bg-blue-500 text-luxury-black dark:text-white font-medium py-6 px-8 theme-transition"
            animation="scale"
            >
              {isLoading ? "Добавление..." : "Добавить объект"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-luxury-black/20 dark:border-blue-400/40 hover:bg-luxury-black/5 dark:hover:bg-blue-400/10 hover:border-luxury-black/30 dark:hover:border-blue-400/60 rounded-sm py-6 px-8 dark:text-white theme-transition"
              animation="scale"
              onClick={() => router.push(`/dashboard/collections/${collectionId}`)}
            >
              Отмена
            </Button>
          </div>
        </form>
      </Form>
      </div>
    </div>
  )
}

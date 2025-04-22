"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"
import { FloorPlanUpload } from "@/components/floor-plan-upload"
import { updateProperty, getPropertyById } from "./actions"
import { YandexMap } from "@/components/yandex-map"
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

interface EditPropertyFormProps {
  propertyId: string
  isOpen: boolean
  onClose: () => void
}

export function EditPropertyForm({ propertyId, isOpen, onClose }: EditPropertyFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [floorPlanUrl, setFloorPlanUrl] = useState<string | null>(null)
  const [isLoadingProperty, setIsLoadingProperty] = useState(true)
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

  // Загрузка данных объекта при открытии формы
  useEffect(() => {
    if (isOpen && propertyId) {
      const fetchProperty = async () => {
        setIsLoadingProperty(true)
        try {
          const result = await getPropertyById(propertyId)

          if (result.error || !result.property) {
            toast({
              variant: "destructive",
              title: "Ошибка",
              description: result.error || "Не удалось загрузить данные объекта",
            })
            onClose()
            return
          }

          const property = result.property

          // Установка значений формы
          form.reset({
            propertyType: property.property_type,
            address: property.address,
            rooms: property.rooms || undefined,
            area: property.area,
            livingArea: property.living_area || undefined,
            price: property.price,
            description: property.description || "",
            floor: property.floor || undefined,
            totalFloors: property.total_floors || undefined,
            balcony: property.balcony || false,
            yearBuilt: property.year_built || undefined,
            renovationType: property.renovation_type || undefined,
            bathroomCount: property.bathroom_count || undefined,
            hasParking: property.has_parking || false,
            propertyStatus: property.property_status || "available",
          })

          // Установка URL изображений
          const urls = property.property_images.map((img) => img.image_url)
          setImageUrls(urls)

          // Установка URL планировки
          setFloorPlanUrl(property.floor_plan_url)
        } catch (error) {
          console.error("Ошибка при загрузке объекта:", error)
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Не удалось загрузить данные объекта",
          })
          onClose()
        } finally {
          setIsLoadingProperty(false)
        }
      }

      fetchProperty()
    }
  }, [isOpen, propertyId, form, toast, onClose])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const result = await updateProperty(propertyId, {
        propertyType: values.propertyType,
        address: values.address,
        rooms: values.rooms || null,
        area: values.area!,
        livingArea: values.livingArea,
        price: values.price!,
        description: values.description || "",
        imageUrls,
        floorPlanUrl,
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
          title: "Не удалось обновить объект",
          description: result.error,
        })
      } else {
        toast({
          title: "Объект обновлен",
          description: "Объект недвижимости был успешно обновлен.",
        })
        onClose()
        router.refresh()
      }
    } catch (error) {
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
    setImageUrls(urls)
  }

  const handleFloorPlanChange = (url: string | null) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать объект</DialogTitle>
        </DialogHeader>

        {isLoadingProperty ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип объекта</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                      <FormLabel>Адрес</FormLabel>
                      <FormControl>
                        <AddressSuggest
                          value={field.value}
                          onChange={field.onChange}
                          onSelect={handleAddressSelect}
                          placeholder="ул. Ленина, 123, Москва"
                        />
                      </FormControl>
                      <FormMessage />
                      {field.value && field.value.length > 5 && (
                        <div className="mt-2 aspect-video rounded-md overflow-hidden">
                          <YandexMap
                            address={field.value}
                            className="w-full h-full"
                            initialCoordinates={mapCoordinates}
                          />
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
                      <FormLabel>Комнаты</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="3" {...field} />
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
                      <FormLabel>Общая площадь (кв.м)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="85" {...field} />
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
                      <FormLabel>Жилая площадь (кв.м)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="65" {...field} />
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
                      <FormLabel>Цена (₽)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="15000000" {...field} />
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
                      <FormLabel>Этаж</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5" {...field} />
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
                      <FormLabel>Всего этажей</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="9" {...field} />
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
                      <FormLabel>Год постройки</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2010" {...field} />
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
                      <FormLabel>Количество санузлов</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
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
                      <FormLabel>Тип ремонта</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
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
                      <FormLabel>Статус объекта</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Балкон</FormLabel>
                        <p className="text-sm text-muted-foreground">Наличие балкона или лоджии</p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasParking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Парковка</FormLabel>
                        <p className="text-sm text-muted-foreground">Наличие парковочного места</p>
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
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Опишите объект недвижимости..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="block mb-2">Фотографии объекта</FormLabel>
                <ImageUpload onImagesChange={handleImagesChange} initialImages={imageUrls} />
              </div>

              {/* Новое поле для загрузки планировки */}
              <div>
                <FormLabel className="block mb-2">Планировка</FormLabel>
                <FloorPlanUpload onImageChange={handleFloorPlanChange} initialImage={floorPlanUrl} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Отмена
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Обновление..." : "Обновить объект"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

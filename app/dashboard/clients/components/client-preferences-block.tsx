"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Save, X, Loader2, Home, Ruler, CalendarRange, Building, Star, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Form schema with validation
const formSchema = z.object({
  rooms_min: z.coerce.number().min(0, { message: "Значение не может быть отрицательным" }),
  rooms_max: z.coerce.number().min(0, { message: "Значение не может быть отрицательным" }),
  preferred_floor_min: z.coerce.number().min(0, { message: "Значение не может быть отрицательным" }),
  preferred_floor_max: z.coerce.number().min(0, { message: "Значение не может быть отрицательным" }),
  area_min: z.coerce.number().min(0, { message: "Значение не может быть отрицательным" }),
  area_max: z.coerce.number().min(0, { message: "Значение не может быть отрицательным" }),
  features: z.string().optional(),
}).refine(data => data.rooms_max >= data.rooms_min, {
  message: "Максимальное количество комнат должно быть больше или равно минимальному",
  path: ["rooms_max"],
}).refine(data => data.preferred_floor_max >= data.preferred_floor_min, {
  message: "Максимальный этаж должен быть больше или равен минимальному",
  path: ["preferred_floor_max"],
}).refine(data => data.area_max >= data.area_min, {
  message: "Максимальная площадь должна быть больше или равна минимальной",
  path: ["area_max"],
});

type FormData = z.infer<typeof formSchema>

interface ClientPreferencesProps {
  clientId: string
  preferences?: {
    id?: string
    rooms_min?: number | null
    rooms_max?: number | null
    preferred_floor_min?: number | null
    preferred_floor_max?: number | null
    area_min?: number | null
    area_max?: number | null
  } | null
  features?: Array<{ id: string, feature_name: string }> | null
}

export function ClientPreferencesBlock({ clientId, preferences, features }: ClientPreferencesProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  // Convert features array to comma-separated string
  const featuresString = features?.map(feat => feat.feature_name).join(', ') || ''

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rooms_min: preferences?.rooms_min || 0,
      rooms_max: preferences?.rooms_max || 0,
      preferred_floor_min: preferences?.preferred_floor_min || 0,
      preferred_floor_max: preferences?.preferred_floor_max || 0,
      area_min: preferences?.area_min || 0,
      area_max: preferences?.area_max || 0,
      features: featuresString
    },
  })

  // Handle cancel button click
  const handleCancel = () => {
    setIsEditing(false)
    // Reset form to default values
    form.reset({
      rooms_min: preferences?.rooms_min || 0,
      rooms_max: preferences?.rooms_max || 0,
      preferred_floor_min: preferences?.preferred_floor_min || 0,
      preferred_floor_max: preferences?.preferred_floor_max || 0,
      area_min: preferences?.area_min || 0,
      area_max: preferences?.area_max || 0,
      features: featuresString
    })
  }

  // Handle form submission
  async function onSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    try {
      // Prepare features as array of objects for separate insertion
      const featuresArray = formData.features
        ? formData.features.split(',').map(feat => feat.trim()).filter(Boolean)
        : []
      
      const response = await fetch(`/api/clients/${clientId}/preferences`, {
        method: preferences?.id ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rooms_min: formData.rooms_min,
          rooms_max: formData.rooms_max,
          preferred_floor_min: formData.preferred_floor_min,
          preferred_floor_max: formData.preferred_floor_max,
          area_min: formData.area_min,
          area_max: formData.area_max,
          features: featuresArray,
          preferences_id: preferences?.id
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при обновлении предпочтений клиента')
      }
      
      const result = await response.json()
      
      toast({
        title: preferences?.id ? "Предпочтения обновлены" : "Предпочтения созданы",
        description: "Информация о предпочтениях клиента успешно сохранена",
      })
      
      setIsEditing(false)
      
      // Update local data if needed
      if (result.preferences && result.features) {
        Object.assign(preferences || {}, result.preferences)
        // Replace the features with new ones
        if (features) {
          features.length = 0
          result.features.forEach((feat: any) => features.push(feat))
        }
      }
      
    } catch (error) {
      console.error("Error updating client preferences:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла неожиданная ошибка. Пожалуйста, попробуйте снова.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark transition-all duration-500 animate-fade-in-up theme-transition">
      <CardHeader className="bg-white dark:bg-dark-graphite theme-transition pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-luxury-black dark:text-white theme-transition">
            Предпочтения клиента
          </CardTitle>
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 text-luxury-black/70 dark:text-white/70 hover:text-luxury-gold dark:hover:text-luxury-royalBlue hover:bg-transparent theme-transition"
            >
              <Edit size={16} />
              <span className="sr-only">Редактировать</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="text-luxury-black/70 dark:text-white/70 hover:text-red-500 dark:hover:text-red-400 hover:bg-transparent theme-transition px-2 h-8"
            >
              <X size={16} className="mr-1" />
              <span>Отмена</span>
            </Button>
          )}
        </div>
        <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
          Требования клиента к характеристикам недвижимости
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-5">
        {!isEditing ? (
          preferences?.id ? (
            <div className="space-y-3 pt-1">
              {(preferences?.rooms_min !== undefined || preferences?.rooms_max !== undefined) && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 theme-transition">
                    <Home className="h-4 w-4 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
                  </div>
                  <div>
                    <div className="text-luxury-black/80 dark:text-white/80 theme-transition">
                      <span className="font-medium">Комнат:</span> от {preferences?.rooms_min || 0} до {preferences?.rooms_max || 0}
                    </div>
                  </div>
                </div>
              )}
              
              {(preferences?.area_min !== undefined || preferences?.area_max !== undefined) && (
                <div className="flex items-center gap-3 pl-1">
                  <Ruler size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span className="text-luxury-black/80 dark:text-white/80 theme-transition">
                    <span className="font-medium">Площадь:</span> от {preferences?.area_min || 0} до {preferences?.area_max || 0} м²
                  </span>
                </div>
              )}
              
              {(preferences?.preferred_floor_min !== undefined || preferences?.preferred_floor_max !== undefined) && (
                <div className="flex items-center gap-3 pl-1">
                  <Building size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span className="text-luxury-black/80 dark:text-white/80 theme-transition">
                    <span className="font-medium">Этаж:</span> от {preferences?.preferred_floor_min || 0} до {preferences?.preferred_floor_max || 0}
                  </span>
                </div>
              )}
              
              {features && features.length > 0 && (
                <div className="flex items-start gap-3 pl-1">
                  <Star size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition mt-1" />
                  <div className="text-luxury-black/80 dark:text-white/80 theme-transition">
                    <span className="font-medium">Особенности:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {features.map((feature) => (
                        <Badge
                          key={feature.id}
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-dark-slate dark:hover:bg-dark-slate/80 text-luxury-black/80 dark:text-white/80 theme-transition"
                        >
                          {feature.feature_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-luxury-black/60 dark:text-white/60 theme-transition mb-4">
                Нет информации о предпочтениях клиента
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-luxury-gold/40 dark:border-luxury-royalBlue/40 text-luxury-black dark:text-white hover:bg-luxury-gold/10 dark:hover:bg-luxury-royalBlue/10 theme-transition"
              >
                <Plus size={16} className="mr-2" />
                Добавить предпочтения
              </Button>
            </div>
          )
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rooms_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                        Мин. количество комнат
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="1" 
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rooms_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                        Макс. количество комнат
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="3" 
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="area_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                        Мин. площадь (м²)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="40" 
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="area_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                        Макс. площадь (м²)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="80" 
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferred_floor_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                        Мин. этаж
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="1" 
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preferred_floor_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                        Макс. этаж
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="10" 
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      Особенности и требования
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Введите особенности через запятую" 
                        className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    <p className="text-xs text-luxury-black/60 dark:text-white/60 mt-1 theme-transition">
                      Введите через запятую (например: Балкон, Паркинг, Новостройка)
                    </p>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  className="bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-sm flex items-center gap-2 theme-transition" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Сохранить
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
} 
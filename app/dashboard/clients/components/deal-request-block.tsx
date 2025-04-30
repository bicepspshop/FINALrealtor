"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Save, X, Loader2, Home, Banknote, CreditCard, MapPin, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Form schema with validation
const formSchema = z.object({
  real_estate_type: z.string().min(1, { message: "Выберите тип недвижимости" }),
  budget_min: z.coerce.number().min(0, { message: "Минимальный бюджет не может быть отрицательным" }),
  budget_max: z.coerce.number().min(0, { message: "Максимальный бюджет не может быть отрицательным" }),
  first_payment: z.coerce.number().min(0, { message: "Первый взнос не может быть отрицательным" }).optional(),
  payment_type: z.string().min(1, { message: "Выберите тип оплаты" }),
  preferred_locations: z.string().optional(),
}).refine(data => data.budget_max >= data.budget_min, {
  message: "Максимальный бюджет должен быть больше или равен минимальному",
  path: ["budget_max"],
});

type FormData = z.infer<typeof formSchema>

interface DealRequestProps {
  clientId: string
  dealRequest?: {
    id?: string
    real_estate_type?: string | null
    budget_min?: number | null
    budget_max?: number | null
    first_payment?: number | null
    payment_type?: string | null
  } | null
  locations?: Array<{ id: string, location_name: string }> | null
}

export function DealRequestBlock({ clientId, dealRequest, locations }: DealRequestProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  // Convert locations array to comma-separated string
  const locationsString = locations?.map(loc => loc.location_name).join(', ') || ''

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      real_estate_type: dealRequest?.real_estate_type || "",
      budget_min: dealRequest?.budget_min || 0,
      budget_max: dealRequest?.budget_max || 0,
      first_payment: dealRequest?.first_payment || 0,
      payment_type: dealRequest?.payment_type || "",
      preferred_locations: locationsString
    },
  })

  const estateTypeOptions = [
    { value: "Квартира", label: "Квартира" },
    { value: "Дом", label: "Дом" },
    { value: "Таунхаус", label: "Таунхаус" },
    { value: "Коммерческая", label: "Коммерческая недвижимость" },
    { value: "Земельный участок", label: "Земельный участок" },
  ]

  const paymentTypeOptions = [
    { value: "Собственные средства", label: "Собственные средства" },
    { value: "Ипотека", label: "Ипотека" },
    { value: "Субсидия", label: "Субсидия" },
    { value: "Материнский капитал", label: "Материнский капитал" },
    { value: "Рассрочка", label: "Рассрочка" },
  ]

  // Format currency for display
  const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined) return "Не указано"
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value)
  }

  // Handle form submission
  async function onSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    try {
      // Prepare locations as array of objects for separate insertion
      const locationsArray = formData.preferred_locations
        ? formData.preferred_locations.split(',').map(loc => loc.trim()).filter(Boolean)
        : []
      
      const response = await fetch(`/api/clients/${clientId}/deal-request`, {
        method: dealRequest?.id ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          real_estate_type: formData.real_estate_type,
          budget_min: formData.budget_min,
          budget_max: formData.budget_max,
          first_payment: formData.first_payment || null,
          payment_type: formData.payment_type,
          locations: locationsArray,
          deal_request_id: dealRequest?.id
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при обновлении запроса клиента')
      }
      
      const result = await response.json()
      
      toast({
        title: dealRequest?.id ? "Запрос обновлен" : "Запрос создан",
        description: "Информация о запросе клиента успешно сохранена",
      })
      
      setIsEditing(false)
      
      // Update local data if needed
      if (result.dealRequest && result.locations) {
        Object.assign(dealRequest || {}, result.dealRequest)
        // Replace the locations with new ones
        if (locations) {
          locations.length = 0
          result.locations.forEach((loc: any) => locations.push(loc))
        }
      }
      
      // Redirect or update UI as needed
      // window.location.reload() // Temporary solution - refresh to see changes
      
    } catch (error) {
      console.error("Error updating deal request:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла неожиданная ошибка. Пожалуйста, попробуйте снова.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel button click
  const handleCancel = () => {
    setIsEditing(false)
    // Reset form to default values
    form.reset({
      real_estate_type: dealRequest?.real_estate_type || "",
      budget_min: dealRequest?.budget_min || 0,
      budget_max: dealRequest?.budget_max || 0,
      first_payment: dealRequest?.first_payment || 0,
      payment_type: dealRequest?.payment_type || "",
      preferred_locations: locationsString
    })
  }

  return (
    <Card className="overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark transition-all duration-500 animate-fade-in-up theme-transition">
      <CardHeader className="bg-white dark:bg-dark-graphite theme-transition pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-luxury-black dark:text-white theme-transition">
            Запрос на недвижимость
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
          Требования клиента к недвижимости
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-5">
        {!isEditing ? (
          dealRequest?.id ? (
            <div className="space-y-3 pt-1">
              {dealRequest?.real_estate_type && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 theme-transition">
                    <Home className="h-4 w-4 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
                  </div>
                  <div>
                    <div className="text-luxury-black/80 dark:text-white/80 theme-transition">
                      <span className="font-medium">Тип недвижимости:</span> {dealRequest.real_estate_type}
                    </div>
                  </div>
                </div>
              )}
              
              {(dealRequest?.budget_min !== undefined || dealRequest?.budget_max !== undefined) && (
                <div className="flex items-center gap-3 pl-1">
                  <Banknote size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span className="text-luxury-black/80 dark:text-white/80 theme-transition">
                    <span className="font-medium">Бюджет:</span> {formatCurrency(dealRequest?.budget_min)} - {formatCurrency(dealRequest?.budget_max)}
                  </span>
                </div>
              )}
              
              {dealRequest?.first_payment !== undefined && dealRequest.first_payment !== null && dealRequest.first_payment > 0 && (
                <div className="flex items-center gap-3 pl-1">
                  <CreditCard size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span className="text-luxury-black/80 dark:text-white/80 theme-transition">
                    <span className="font-medium">Первый взнос:</span> {formatCurrency(dealRequest.first_payment)}
                  </span>
                </div>
              )}
              
              {dealRequest?.payment_type && (
                <div className="flex items-center gap-3 pl-1">
                  <CreditCard size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span className="text-luxury-black/80 dark:text-white/80 theme-transition">
                    <span className="font-medium">Способ оплаты:</span> {dealRequest.payment_type}
                  </span>
                </div>
              )}
              
              {locations && locations.length > 0 && (
                <div className="flex items-start gap-3 pl-1">
                  <MapPin size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition mt-1" />
                  <div className="text-luxury-black/80 dark:text-white/80 theme-transition">
                    <span className="font-medium">Предпочтительные районы:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {locations.map((location) => (
                        <Badge
                          key={location.id}
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-dark-slate dark:hover:bg-dark-slate/80 text-luxury-black/80 dark:text-white/80 theme-transition"
                        >
                          {location.location_name}
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
                Нет информации о запросе клиента
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-luxury-gold/40 dark:border-luxury-royalBlue/40 text-luxury-black dark:text-white hover:bg-luxury-gold/10 dark:hover:bg-luxury-royalBlue/10 theme-transition"
              >
                <Plus size={16} className="mr-2" />
                Добавить запрос
              </Button>
            </div>
          )
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="real_estate_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      Тип недвижимости <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition">
                          <SelectValue placeholder="Выберите тип недвижимости" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-dark-graphite dark:border-dark-slate theme-transition">
                        {estateTypeOptions.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="dark:text-white dark:focus:bg-dark-slate dark:data-[highlighted]:bg-dark-slate theme-transition"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 dark:text-error theme-transition" />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budget_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                        Минимальный бюджет <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="5 000 000" 
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
                  name="budget_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                        Максимальный бюджет <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="10 000 000" 
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
                name="first_payment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      Первый взнос
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="2 000 000" 
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
                name="payment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      Способ оплаты <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition">
                          <SelectValue placeholder="Выберите способ оплаты" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-dark-graphite dark:border-dark-slate theme-transition">
                        {paymentTypeOptions.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="dark:text-white dark:focus:bg-dark-slate dark:data-[highlighted]:bg-dark-slate theme-transition"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 dark:text-error theme-transition" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferred_locations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      Предпочтительные районы
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Введите районы через запятую" 
                        className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    <p className="text-xs text-luxury-black/60 dark:text-white/60 mt-1 theme-transition">
                      Введите районы через запятую (например: Центр, Западный, Северный)
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
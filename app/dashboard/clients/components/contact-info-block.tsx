"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Phone, Mail, Calendar, Home, User, Edit, Save, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Form schema with validation
const formSchema = z.object({
  full_name: z.string().min(2, {
    message: "Имя должно содержать минимум 2 символа",
  }),
  phone: z.string().optional(),
  email: z.string().email({
    message: "Пожалуйста, введите корректный email адрес",
  }).optional().or(z.literal('')),
  birthday: z.string().optional(),
  lead_source: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ContactInfoProps {
  clientId: string
  data: {
    full_name: string
    phone?: string | null
    email?: string | null
    birthday?: string | null
    lead_source?: string | null
  }
}

export function ContactInfoBlock({ clientId, data }: ContactInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: data.full_name || "",
      phone: data.phone || "",
      email: data.email || "",
      birthday: data.birthday || "",
      lead_source: data.lead_source || "",
    },
  })

  const leadSourceOptions = [
    { value: "Рекомендация", label: "Рекомендация" },
    { value: "Сайт", label: "Сайт" },
    { value: "Звонок", label: "Входящий звонок" },
    { value: "Социальные сети", label: "Социальные сети" },
    { value: "Объявление", label: "Объявление" },
    { value: "Другое", label: "Другое" },
  ]

  const handlePhoneClick = () => {
    if (data.phone && !isEditing) {
      window.open(`tel:${data.phone}`, '_blank')
    }
  }

  const handleEmailClick = () => {
    if (data.email && !isEditing) {
      window.open(`mailto:${data.email}`, '_blank')
    }
  }

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  }

  // Handle form submission
  async function onSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone || null,
          email: formData.email || null,
          birthday: formData.birthday || null,
          lead_source: formData.lead_source || null
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при обновлении клиента')
      }
      
      toast({
        title: "Информация обновлена",
        description: "Контактная информация клиента успешно обновлена",
      })
      
      setIsEditing(false)
      
      // Update local data
      Object.assign(data, formData)
      
    } catch (error) {
      console.error("Error updating client:", error)
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
            Контактная информация
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
              onClick={() => setIsEditing(false)}
              className="h-8 w-8 p-0 text-luxury-black/70 dark:text-white/70 hover:text-red-500 dark:hover:text-red-400 hover:bg-transparent theme-transition"
            >
              <X size={16} />
              <span className="sr-only">Отмена</span>
            </Button>
          )}
        </div>
        <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
          Основная информация о клиенте
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-5">
        {!isEditing ? (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 theme-transition">
                <User className="h-4 w-4 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
              </div>
              <div>
                <div className="text-luxury-black dark:text-white font-medium theme-transition">
                  {data.full_name}
                </div>
              </div>
            </div>
            
            {data.phone && (
              <div className="flex items-center gap-3 pl-1">
                <Phone size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                <span 
                  onClick={handlePhoneClick}
                  className="text-luxury-black/80 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors cursor-pointer theme-transition"
                >
                  {data.phone}
                </span>
              </div>
            )}
            
            {data.email && (
              <div className="flex items-center gap-3 pl-1">
                <Mail size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                <span 
                  onClick={handleEmailClick}
                  className="text-luxury-black/80 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors cursor-pointer theme-transition"
                >
                  {data.email}
                </span>
              </div>
            )}
            
            {data.birthday && (
              <div className="flex items-center gap-3 pl-1">
                <Calendar size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                <span className="text-luxury-black/80 dark:text-white/80 theme-transition">
                  {formatDate(data.birthday)}
                </span>
              </div>
            )}
            
            {data.lead_source && (
              <div className="flex items-center gap-3 pl-1">
                <Home size={16} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                <span className="text-luxury-black/80 dark:text-white/80 theme-transition">
                  Источник: {data.lead_source}
                </span>
              </div>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      ФИО клиента <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Иванов Иван Иванович" 
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      Телефон
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+7 (999) 123-45-67" 
                        className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-error theme-transition" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ivan@example.com" 
                        className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-error theme-transition" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      Дата рождения
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition"
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-error theme-transition" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lead_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                      Источник клиента
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 theme-transition">
                          <SelectValue placeholder="Выберите источник клиента" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-dark-graphite dark:border-dark-slate theme-transition">
                        {leadSourceOptions.map((option) => (
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
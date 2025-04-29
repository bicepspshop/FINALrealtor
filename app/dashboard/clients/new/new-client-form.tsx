"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Card } from "@/components/ui/card"
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

// Client form component
export function NewClientForm({ userId }: { userId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      birthday: "",
      lead_source: "",
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

  // Handle form submission
  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    
    try {
      // Call the API endpoint to create a client
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: data.full_name,
          phone: data.phone || null,
          email: data.email || null,
          birthday: data.birthday || null,
          lead_source: data.lead_source || null
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create client')
      }
      
      const client = await response.json()
      
      if (!client || !client.id) {
        throw new Error("Client was created but no ID was returned")
      }
      
      toast({
        title: "Клиент создан",
        description: "Новый клиент успешно добавлен",
      })
      
      // Navigate to the client page
      router.push(`/dashboard/clients/${client.id}`)
      
    } catch (error) {
      console.error("Error creating client:", error)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6 bg-white dark:bg-dark-graphite rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark animate-fade-in-up theme-transition">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    defaultValue={field.value}
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
          </div>
        </Card>
        
        <div className="flex justify-end gap-4 sticky bottom-4 bg-white/80 dark:bg-dark-charcoal/80 backdrop-blur-md p-4 rounded-sm shadow-md z-10 theme-transition">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/clients')}
            className="border-luxury-black/20 dark:border-luxury-royalBlue/30 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 dark:text-white rounded-sm theme-transition"
          >
            Отмена
          </Button>
          <Button 
            type="submit" 
            className="bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white rounded-sm theme-transition" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить клиента"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
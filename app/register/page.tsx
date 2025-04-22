"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "./actions"
import { ThemeToggle } from "@/components/ui/theme/theme-toggle"
import { ThemeImage } from "@/components/ui/theme/theme-image"

// Найдите текущую схему валидации формы
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов.",
  }),
  email: z.string().email({
    message: "Пожалуйста, введите корректный email адрес.",
  }),
  password: z.string().min(1, {
    message: "Пароль обязателен.",
  }),
})

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await registerUser(values)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Ошибка регистрации",
          description: result.error,
        })
      } else {
        toast({
          title: "Регистрация успешна",
          description: "Теперь вы можете войти в систему.",
        })
        router.push("/login")
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

  return (
    <div className="min-h-screen flex theme-transition">
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 dark:from-black/90 dark:to-black/70 z-10 theme-transition"></div>
          <ThemeImage 
            lightSrc="/images/house3.png"
            darkSrc="/images/flat1.png"
            alt="Недвижимость" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 p-12 h-full flex flex-col justify-center">
          <h2 className="text-4xl font-serif font-medium mb-6 text-white leading-tight text-shadow-md animate-fade-in-up">
            Присоединяйтесь к нам
          </h2>
          <div className="w-16 h-1 bg-luxury-gold dark:bg-luxury-royalBlue mb-6 animate-fade-in-up" style={{animationDelay: '100ms'}}></div>
          <p className="text-lg text-white/90 mb-8 max-w-md leading-relaxed animate-fade-in-up" style={{animationDelay: '200ms'}}>
            Создавайте коллекции объектов недвижимости и делитесь ими с клиентами быстро и эффективно.
          </p>

          <ul className="space-y-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
            <li className="flex items-center gap-3">
              <span className="text-luxury-gold dark:text-luxury-royalBlue flex-shrink-0 theme-transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-white">Бесплатная регистрация</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-luxury-gold dark:text-luxury-royalBlue flex-shrink-0 theme-transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-white">Удобное управление объектами</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-luxury-gold dark:text-luxury-royalBlue flex-shrink-0 theme-transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-white">Современный интерфейс</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-gradient-luxury dark:bg-gradient-silver flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 theme-transition">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-dark-graphite p-8 shadow-elegant dark:shadow-elegant-dark rounded-sm animate-fade-in-up theme-transition">
            <div className="text-center mb-8">
              <div className="flex justify-end mb-2">
                <ThemeToggle />
              </div>
              <Link href="/" className="inline-block mb-6">
                <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-white theme-transition">
                  РиелторПро
                </h1>
              </Link>
              <h2 className="text-3xl font-display font-medium mb-2 text-luxury-black dark:text-white theme-transition">Создание аккаунта</h2>
              <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mb-4 theme-transition"></div>
              <p className="text-sm text-luxury-black/70 dark:text-white/70 theme-transition">
                Быстрая регистрация для доступа к полному функционалу
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">Имя</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Иван Иванов" 
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white focus-visible:ring-luxury-gold/50 py-5 theme-transition"
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
                    <FormItem className="space-y-2">
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="ivan@example.com" 
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white focus-visible:ring-luxury-gold/50 py-5 theme-transition"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">Пароль</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="********" 
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white focus-visible:ring-luxury-gold/50 py-5 theme-transition"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-6 mt-6 theme-transition" 
                  disabled={isLoading}
                  animation="scale"
                >
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-slate text-center theme-transition">
              <p className="text-luxury-black/70 dark:text-white/70 text-sm theme-transition">
                Уже есть аккаунт?{" "}
                <Link href="/login" className="font-medium text-luxury-gold dark:text-luxury-royalBlue hover:text-luxury-gold/80 dark:hover:text-luxury-royalBlue/80 transition-colors theme-transition">
                  Войти
                </Link>
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-gray-400 dark:text-moonstone/70 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors theme-transition">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
